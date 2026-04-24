# ShopSmart - Architecture & Design

## Overview

ShopSmart is a full-stack e-commerce application built with React, Express, and SQLite with
Prisma, deployed through Dockerized workloads and AWS infrastructure managed by Terraform.

## Architecture

```text
User -> [client: nginx + React] -> [server: Node + Express + Prisma] -> [SQLite / RDS]
                                      ^
                           GitHub Actions pipeline
```

### Components

- Client: React 18 + Vite, served by nginx in production and communicating with the backend over
  REST.
- Server: Node 20 + Express + Prisma ORM, exposing API routes under `/api`.
- Database: SQLite for development with a schema that can evolve toward a managed relational
  database in production.
- Infrastructure: Terraform provisions S3, ECR, ECS Fargate, IAM, and CloudWatch logs.
- CI/CD: GitHub Actions handles linting, tests, Terraform, Docker image publishing, and ECS
  rollout steps.

## Workflow

1. Developers run `scripts/setup.sh` to install dependencies and apply migrations.
2. Frontend and backend changes are validated with linting and automated tests.
3. Docker images package the client and server for consistent local and CI execution.
4. Terraform manages infrastructure changes independently from application delivery.
5. GitHub Actions coordinates test, build, push, and deployment automation.

## Design Decisions

- **Multi-stage Docker Builds**: Used to minimize the final container size and ensure only essential runtime dependencies are present in the final image, promoting faster deployment and better security.
- **Non-root Containers**: Both client and server containers are configured to run as non-root users (`appuser`) to adhere to security best practices and minimize potential attack vectors.
- **SQLite Database**: Chosen for rapid prototyping and simplified development environment setup without requiring a dedicated local database server. Can be easily migrated to PostgreSQL/MySQL via Prisma.
- **Nginx Unprivileged**: The client application is served using the `nginx-unprivileged` image, which listens on port 8080 by default, allowing the container to run entirely without root permissions.
- **Infrastructure as Code (Terraform)**: All AWS resources (ECS, ECR, S3, IAM) are managed declaratively, ensuring consistent and reproducible environments.

## Challenges

- **Running Nginx as Non-root**: Standard Nginx images require root access to bind to port 80 and access specific directories. This was resolved by using the `nginxinc/nginx-unprivileged` image and reconfiguring the container and Terraform to use port 8080.
- **Cross-Origin Resource Sharing (CORS)**: Ensuring seamless communication between the React frontend and Express backend during development and production while enforcing secure origin policies.
- **Automated Deployments via EC2 and ECS**: Aligning GitHub Actions with both an ECS Fargate production deployment (via Terraform) and a fallback EC2 manual deploy script without conflicting environment configurations.
- **Idempotency**: Ensuring all setup scripts and deployment commands (`pm2`) operate idempotently, preventing failures or duplicate processes on subsequent executions.
