# Deployment Configuration for Schedulo Pro Audit Website

This file contains the configuration for deploying the Schedulo Pro Audit website to Vercel.

## Vercel Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "github": {
    "silent": true
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

## Environment Variables

The following environment variables should be set in the Vercel project:

- `NEXT_PUBLIC_SITE_URL`: The URL of the deployed website (e.g., https://schedulo-pro-audit.vercel.app)

## Deployment Steps

1. Push the code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the project with the settings above
4. Deploy the project

## Post-Deployment Checks

After deployment, verify the following:

1. All pages load correctly
2. Interactive elements work as expected
3. Responsive design works on different devices
4. SEO elements are correctly implemented
5. Performance metrics are good (use Lighthouse to check)

## Monitoring

Set up monitoring for the deployed website:

1. Configure Vercel Analytics
2. Set up status alerts for any downtime
3. Monitor performance metrics over time
