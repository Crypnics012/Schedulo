# Domain Setup & Deployment Guide for Schedulo Pro

This guide provides detailed, non-technical instructions for setting up your domain and deploying Schedulo Pro to production.

## Domain Setup

### Selecting a Domain Name

1. **Choose your domain name**:
   - Recommended options: schedulopro.com, schedulo.pro, scheduloapp.com
   - Check availability using [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com)
   - Select a .com domain if possible for better recognition

2. **Purchase your domain**:
   - Create an account with the domain registrar
   - Add the domain to your cart
   - Consider privacy protection to hide your personal information
   - Purchase for at least 1-2 years (longer registrations can help with SEO)

### Configuring DNS Records

1. **Access DNS settings**:
   - Log in to your domain registrar
   - Find "DNS Settings," "DNS Management," or "Advanced DNS"

2. **Add DNS records for Vercel**:
   - You'll need to add these records to connect your domain to Vercel:
   
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 76.76.21.21 | 1 hour |
   | CNAME | www | cname.vercel-dns.com | 1 hour |
   
   - Wait 1-24 hours for DNS changes to propagate globally

### Connecting Domain to Vercel

1. **Add domain in Vercel**:
   - Log in to your [Vercel dashboard](https://vercel.com/dashboard)
   - Select your Schedulo Pro project
   - Go to "Settings" → "Domains"
   - Click "Add" and enter your domain name
   - Select "Add" to confirm

2. **Verify domain ownership**:
   - Vercel will check if the DNS records are configured correctly
   - If verification fails, Vercel will provide instructions for adding verification records
   - Follow these instructions on your domain registrar

3. **Configure HTTPS**:
   - Vercel automatically provisions SSL certificates
   - Wait for the "Valid Configuration" status
   - Your site is now secure with HTTPS

## Deployment Setup

### Setting Up GitHub Repository

1. **Create a production repository**:
   - Log in to [GitHub](https://github.com)
   - Create a new repository named "schedulo-pro-production"
   - Make it private for security
   - Initialize with a README

2. **Upload project files**:
   - Upload all Schedulo Pro files to this repository
   - You can do this by dragging and dropping files or using GitHub Desktop

3. **Set up branch protection**:
   - Go to repository "Settings" → "Branches"
   - Click "Add rule" for the "main" branch
   - Enable "Require pull request reviews before merging"
   - Save changes

### Connecting to Vercel

1. **Create Vercel project**:
   - Log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Schedulo Pro Production" repository

2. **Configure project settings**:
   - Framework preset: Select "Bubble.io" (or "Other" if Bubble isn't listed)
   - Root Directory: Leave as default
   - Build Command: Leave blank (Bubble.io apps don't require building)
   - Output Directory: Leave blank
   - Install Command: Leave blank

3. **Set up environment variables**:
   - Go to "Settings" → "Environment Variables"
   - Add all required variables (see Environment Variables section below)
   - Make sure to mark sensitive variables as "Encrypted"

4. **Deploy project**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Verify the deployment by visiting the provided URL

### Setting Up Preview Deployments

1. **Enable preview deployments**:
   - In Vercel, go to your project settings
   - Select "Git" tab
   - Enable "Preview Deployments"
   - This creates test deployments for each pull request

2. **Configure preview settings**:
   - Set "Production Branch" to "main"
   - Enable "Comment on Pull Requests"
   - Enable "Auto-Deploy" for faster previews

### Configuring Deployment Notifications

1. **Set up email notifications**:
   - In Vercel, go to "Settings" → "Notifications"
   - Add your email address
   - Select events to be notified about (deployments, errors)

2. **Set up Slack notifications** (optional):
   - Create a Slack webhook in your Slack workspace
   - In Vercel, go to "Settings" → "Integrations"
   - Select "Slack"
   - Enter your webhook URL
   - Configure notification preferences

## Environment Variables Setup

### Required Environment Variables

These variables need to be set in Vercel's environment variables section:

1. **Database Connections**:
   - `AIRTABLE_API_KEY`: Your Airtable API key
   - `AIRTABLE_BASE_ID`: Your production Airtable base ID

2. **Social Media APIs**:
   - `INSTAGRAM_CLIENT_ID`: Instagram API client ID
   - `INSTAGRAM_CLIENT_SECRET`: Instagram API client secret
   - `TWITTER_API_KEY`: Twitter API key
   - `TWITTER_API_SECRET`: Twitter API secret
   - `FACEBOOK_APP_ID`: Facebook app ID
   - `FACEBOOK_APP_SECRET`: Facebook app secret
   - `TIKTOK_CLIENT_KEY`: TikTok client key
   - `TIKTOK_CLIENT_SECRET`: TikTok client secret

3. **Authentication**:
   - `AUTH0_DOMAIN`: Your Auth0 domain
   - `AUTH0_CLIENT_ID`: Auth0 client ID
   - `AUTH0_CLIENT_SECRET`: Auth0 client secret

4. **Payment Processing**:
   - `STRIPE_PUBLIC_KEY`: Stripe publishable key
   - `STRIPE_SECRET_KEY`: Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

5. **Media Storage**:
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret

6. **Automation**:
   - `MAKE_API_KEY`: Make.com API key
   - `MAKE_TEAM_ID`: Make.com team ID

### Setting Environment Variables in Vercel

1. **Access environment variables**:
   - Go to your project in Vercel
   - Navigate to "Settings" → "Environment Variables"

2. **Add each variable**:
   - Click "Add New"
   - Enter the variable name (e.g., `AIRTABLE_API_KEY`)
   - Enter the variable value
   - Select environments (Production, Preview, Development)
   - For sensitive values, mark as "Encrypted"
   - Click "Add"

3. **Verify variables**:
   - After adding all variables, review the list
   - Ensure all required variables are present
   - Redeploy your application to apply changes

## Deployment Verification

### Pre-Deployment Checklist

Before final deployment, verify:

1. **Domain is properly configured**
2. **All environment variables are set**
3. **GitHub repository is properly set up**
4. **Branch protection is enabled**

### Deployment Process

1. **Trigger deployment**:
   - In Vercel, go to your project
   - Click "Deployments" tab
   - Click "Deploy" button

2. **Monitor deployment**:
   - Watch the deployment logs for any errors
   - Deployment typically takes 1-3 minutes

### Post-Deployment Verification

After deployment completes:

1. **Visit your domain**:
   - Open your domain in a browser
   - Verify the site loads correctly

2. **Test key functionality**:
   - Create a test account
   - Connect a test social media account
   - Schedule a test post
   - Verify the post appears in the calendar

3. **Check for errors**:
   - Open browser developer tools (F12)
   - Look for any console errors
   - Check network requests for failures

## Troubleshooting Common Issues

### Domain Connection Issues

If your domain doesn't connect properly:

1. **Verify DNS records**:
   - Check that all DNS records match Vercel's requirements
   - DNS changes can take up to 48 hours to propagate

2. **Check domain status in Vercel**:
   - Look for error messages in the Domains section
   - Follow any specific instructions provided

### Deployment Failures

If deployment fails:

1. **Check deployment logs**:
   - In Vercel, go to the failed deployment
   - Review logs for specific error messages

2. **Verify environment variables**:
   - Ensure all required variables are set correctly
   - Check for typos or missing values

3. **Check repository access**:
   - Verify Vercel has access to your GitHub repository
   - Check GitHub for any authentication issues

### Application Errors

If the application has errors after deployment:

1. **Check browser console**:
   - Open developer tools (F12)
   - Look for error messages in the console

2. **Verify API connections**:
   - Test each social media connection
   - Verify Airtable connection
   - Check Stripe integration

3. **Review logs in Vercel**:
   - Go to "Logs" in your Vercel project
   - Filter for error messages

## Next Steps After Deployment

1. **Set up monitoring** (see Monitoring & Analytics Guide)
2. **Configure SEO settings** (see SEO Optimization Guide)
3. **Implement testing procedures** (see Testing & QA Guide)
4. **Set up regular backups** (see Backup & Recovery Guide)

By following this guide, you'll have successfully set up your domain and deployed Schedulo Pro to production, making it accessible to users worldwide.
