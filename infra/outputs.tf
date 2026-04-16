output "s3_bucket_name" {
  value = aws_s3_bucket.main.bucket
}

output "ecr_server_url" {
  value = aws_ecr_repository.server.repository_url
}

output "ecr_client_url" {
  value = aws_ecr_repository.client.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
