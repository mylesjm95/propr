# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Propr application.

## Workflows

### 1. Daily Property Listings Email (`daily-email-listings.yml`)

**Purpose**: Automatically sends daily property update emails to users with saved searches.

**Schedule**: Runs every day at 9:00 AM UTC

**Manual Trigger**: Can be triggered manually from the GitHub Actions tab

**What it does**:
- Fetches property updates from AMPRE API
- Sends personalized emails to users with saved searches
- Logs the results and any errors

### 2. Test Daily Email (`test-daily-email.yml`)

**Purpose**: Test the daily email functionality for a specific user.

**Trigger**: Manual only (workflow_dispatch)

**Inputs**:
- `test_user_id`: The ID of the user to send a test email to

**What it does**:
- Sends a test email to the specified user
- Useful for debugging and testing email functionality

## Required Secrets

The following secrets must be configured in your GitHub repository settings:

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `AMPRE_API_KEY`: Your AMPRE API key
- `AMPRE_API_URL`: Your AMPRE API URL
- `RESEND_API_KEY`: Your Resend API key for sending emails
- `FROM_EMAIL`: The email address to send from
- `TO_EMAIL`: The email address to send to (for testing)
- `DATABASE_URL`: Your database connection string

## How to Set Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the corresponding value

## Monitoring

- Check the "Actions" tab in your GitHub repository to see workflow runs
- Failed runs will show error logs
- Logs are automatically uploaded as artifacts for failed runs

## Troubleshooting

### Common Issues

1. **Missing Secrets**: Ensure all required secrets are configured
2. **Database Connection**: Verify DATABASE_URL is correct
3. **API Keys**: Check that AMPRE_API_KEY and RESEND_API_KEY are valid
4. **Node.js Version**: The workflow uses Node.js 18, ensure your code is compatible

### Testing

Use the test workflow to verify email functionality before the daily run:
1. Go to Actions tab
2. Select "Test Daily Email (Manual)"
3. Click "Run workflow"
4. Enter a test user ID
5. Check the logs for any errors
