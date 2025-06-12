# Daily Listings Cron Job

This directory contains the API route for the daily listings cron job that runs at 8:30 AM every day.

## How it works

1. The cron job is configured in the `vercel.json` file at the root of the project
2. Vercel sends a GET request to `/api/cron/daily-listings` at 8:30 AM daily
3. The endpoint checks for new listings from the previous day (midnight to midnight)
4. It sends emails to users with saved searches that have matching listings
5. Comprehensive stats are collected and returned for monitoring

## Environment Variables

- `CRON_SECRET`: A secret key to authenticate the cron job requests
- `TREB_TOKEN`: API key for the TREB API
- `RESEND_API_KEY`: API key for the email service
- `SUPABASE_URL`: URL for the Supabase instance
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for Supabase

## Authentication

The cron job endpoint is protected with a secret key. Vercel automatically adds the authorization header with the CRON_SECRET when making the request.

## Testing Locally

To test this endpoint locally, you can make a GET request to `/api/cron/daily-listings` with the authorization header:

```
Authorization: Bearer YOUR_CRON_SECRET
```

For development environments, the authorization check is skipped.

## Schedule

The cron job is scheduled to run every day at 8:30 AM using the cron expression `30 8 * * *`.
