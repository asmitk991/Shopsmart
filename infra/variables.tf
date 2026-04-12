variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "shopsmart"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
