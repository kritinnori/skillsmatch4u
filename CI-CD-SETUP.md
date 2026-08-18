# CI/CD Setup Guide

This project uses **GitHub Actions** to automatically deploy to AWS when you push to `main`.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│  GitHub Repo    │────▶│  GitHub Actions  │
│  (push to main) │     │  (CI/CD)         │
└─────────────────┘     └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
           ┌───────────────┐         ┌───────────────┐
           │   Frontend    │         │     API       │
           │  S3+CloudFront│         │    Lambda     │
           └───────────────┘         └───────────────┘
```

## Prerequisites

### 1. AWS Resources (create these first)

#### Frontend (S3 + CloudFront)
1. Create an S3 bucket for static hosting:
   ```bash
   aws s3 mb s3://skillsmatch4u-frontend --region us-east-1
   ```

2. Enable static website hosting:
   ```bash
   aws s3 website s3://skillsmatch4u-frontend --index-document index.html --error-document index.html
   ```

3. Create CloudFront distribution pointing to the S3 bucket

#### Backend (Lambda + API Gateway)
1. Create Lambda function:
   ```bash
   aws lambda create-function \
     --function-name skillsmatch4u-api \
     --runtime nodejs20.x \
     --handler lambda.handler \
     --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
     --timeout 30 \
     --memory-size 512
   ```

2. Create API Gateway and connect to Lambda

### 2. GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `S3_BUCKET_NAME` | e.g., `skillsmatch4u-frontend` |
| `CLOUDFRONT_DISTRIBUTION_ID` | e.g., `E1234ABCD5678` |
| `LAMBDA_FUNCTION_NAME` | e.g., `skillsmatch4u-api` |
| `VITE_API_URL` | e.g., `https://api.skillsmatch4u.com` |
| `VITE_COGNITO_USER_POOL_ID` | e.g., `us-east-1_wnRXaBYoC` |
| `VITE_COGNITO_CLIENT_ID` | Your Cognito app client ID |
| `DYNAMODB_QUESTIONS_TABLE` | `skillsmatch4u-questions` |
| `DYNAMODB_USER_PROGRESS_TABLE` | `skillsmatch4u-user-progress` |
| `COGNITO_USER_POOL_ID` | `us-east-1_wnRXaBYoC` |
| `OPENAI_API_KEY` | Your OpenAI API key |

### 3. IAM Permissions

Create an IAM user for GitHub Actions with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::skillsmatch4u-frontend",
        "arn:aws:s3:::skillsmatch4u-frontend/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration"
      ],
      "Resource": "arn:aws:lambda:us-east-1:*:function:skillsmatch4u-api"
    }
  ]
}
```

## Usage

### Automatic Deployment
Push to `main` branch → Automatically deploys both frontend and API

### Manual Deployment
Go to GitHub → Actions → "Deploy to AWS" → Run workflow

## Troubleshooting

### Build fails
- Check Node.js version matches (20.x)
- Ensure all environment variables are set in secrets

### S3 deploy fails
- Verify bucket name and permissions
- Check AWS credentials are valid

### Lambda deploy fails
- Ensure Lambda function exists
- Check IAM permissions for `lambda:UpdateFunctionCode`
- Verify zip file isn't too large (max 50MB direct, 250MB with S3)

### CloudFront not updating
- Invalidation can take 5-10 minutes
- Check distribution ID is correct
