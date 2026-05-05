variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "shopsmart"
}

variable "subnet_id" {
  description = "Subnet ID from AWS Academy"
  type        = string
}

variable "security_group_id" {
  description = "Security Group ID from AWS Academy"
  type        = string
}

variable "jwt_secret" {
  description = "JWT Secret for authentication"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
