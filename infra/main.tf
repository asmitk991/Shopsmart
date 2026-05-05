terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.aws_region
}

# Auto-fetch Account ID like the professor's template
data "aws_caller_identity" "current" {}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-assets-${random_id.suffix.hex}"

  tags = {
    Project = var.project_name
  }
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket                  = aws_s3_bucket.main.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_ecr_repository" "server" {
  name                 = "${var.project_name}-server-${random_id.suffix.hex}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true # Professor's recommendation

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "client" {
  name                 = "${var.project_name}-client-${random_id.suffix.hex}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true # Professor's recommendation

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster-${random_id.suffix.hex}"
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-${random_id.suffix.hex}"
  retention_in_days = 7
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

data "aws_internet_gateway" "default" {
  filter {
    name   = "attachment.vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_ecs_task_definition" "server" {
  family                   = "${var.project_name}-server"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  task_role_arn            = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  container_definitions = jsonencode([{
    name  = "server"
    image = "${aws_ecr_repository.server.repository_url}:latest"
    portMappings = [{ containerPort = 5001, protocol = "tcp" }]
    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "PORT", value = "5001" },
      { name = "DATABASE_URL", value = "file:/app/data/prod.db" },
      { name = "JWT_SECRET", value = var.jwt_secret }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.ecs.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "server"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:5001/api/health || exit 1"]
      interval    = 30
      timeout     = 10
      retries     = 3
      startPeriod = 90
    }
  }])
}

resource "aws_ecs_task_definition" "client" {
  family                   = "${var.project_name}-client"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  task_role_arn            = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  container_definitions = jsonencode([{
    name  = "client"
    image = "${aws_ecr_repository.client.repository_url}:latest"
    portMappings = [{ containerPort = 8080, protocol = "tcp" }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.ecs.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "client"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"]
      interval    = 30
      timeout     = 10
      retries     = 3
      startPeriod = 60
    }
  }])
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg-${random_id.suffix.hex}"
  description = "Allow inbound traffic to ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "server" {
  name            = "${var.project_name}-server-${random_id.suffix.hex}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 60
  force_new_deployment = true

  depends_on = [aws_cloudwatch_log_group.ecs]

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

resource "aws_ecs_service" "client" {
  name            = "${var.project_name}-client-${random_id.suffix.hex}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.client.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 60
  force_new_deployment = true

  depends_on = [aws_cloudwatch_log_group.ecs]

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}
