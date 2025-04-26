# Backend & Database Setup Guide for Schedulo Pro

This guide provides step-by-step instructions for setting up the backend and database components of Schedulo Pro using no-code tools.

## Airtable Database Setup

### Creating Your Production Database

1. **Sign up or log in to Airtable**:
   - Go to [Airtable](https://airtable.com)
   - Create an account or log in to your existing account

2. **Create a new workspace**:
   - Click "Add a workspace"
   - Name it "Schedulo Pro Production"
   - Select "Start from scratch"

3. **Create a new base**:
   - Click "Add a base"
   - Select "Start from scratch"
   - Name it "Schedulo Pro DB"

### Setting Up Essential Tables

1. **Users Table**:
   - Create a table named "Users"
   - Add these fields:
     - UserID (Single line text, primary field)
     - Email (Email)
     - Name (Single line text)
     - SignupDate (Date)
     - Subscription Plan (Single select: Free, Basic, Pro, Enterprise)
     - Status (Single select: Active, Inactive, Trial)
     - TimeZone (Single line text)

2. **Social Accounts Table**:
   - Create a table named "SocialAccounts"
   - Add these fields:
     - AccountID (Single line text, primary field)
     - UserID (Link to Users table)
     - Platform (Single select: Instagram, Facebook, Twitter, TikTok)
     - AccountName (Single line text)
     - AccessToken (Single line text)
     - RefreshToken (Single line text)
     - TokenExpiry (Date)
     - Status (Single select: Connected, Disconnected, Error)

3. **Media Library Table**:
   - Create a table named "MediaLibrary"
   - Add these fields:
     - MediaID (Single line text, primary field)
     - UserID (Link to Users table)
     - MediaType (Single select: Image, Video, Carousel)
     - CloudinaryURL (URL)
     - UploadDate (Date)
     - Caption (Long text)
     - Hashtags (Long text)
     - Status (Single select: Ready, Processing, Error)

4. **Scheduled Posts Table**:
   - Create a table named "ScheduledPosts"
   - Add these fields:
     - PostID (Single line text, primary field)
     - UserID (Link to Users table)
     - SocialAccountID (Link to SocialAccounts table)
     - MediaID (Link to MediaLibrary table)
     - ScheduledTime (Date & Time)
     - Caption (Long text)
     - Hashtags (Long text)
     - Status (Single select: Scheduled, Posted, Failed, Deleted)
     - ErrorMessage (Long text)
     - PostURL (URL)

5. **Analytics Table**:
   - Create a table named "PostAnalytics"
   - Add these fields:
     - AnalyticsID (Single line text, primary field)
     - PostID (Link to ScheduledPosts table)
     - Likes (Number)
     - Comments (Number)
     - Shares (Number)
     - Impressions (Number)
     - Reach (Number)
     - Engagement (Number)
     - LastUpdated (Date & Time)

### Setting Up Table Relationships

1. **Link Users to Social Accounts**:
   - In the SocialAccounts table, make sure the UserID field is set as a "Link to another record" field
   - Select the Users table and the UserID field

2. **Link Users to Media Library**:
   - In the MediaLibrary table, make sure the UserID field is set as a "Link to another record" field
   - Select the Users table and the UserID field

3. **Link Posts to Users, Accounts, and Media**:
   - In the ScheduledPosts table, make sure all link fields are set up correctly
   - UserID should link to Users table
   - SocialAccountID should link to SocialAccounts table
   - MediaID should link to MediaLibrary table

4. **Link Analytics to Posts**:
   - In the PostAnalytics table, make sure the PostID field links to the ScheduledPosts table

### Setting Up Views

1. **Create User Management Views**:
   - In the Users table, create views for:
     - All Users
     - Active Users
     - Trial Users
     - Enterprise Customers

2. **Create Post Management Views**:
   - In the ScheduledPosts table, create views for:
     - Upcoming Posts (filter: Status = Scheduled, ScheduledTime > now)
     - Failed Posts (filter: Status = Failed)
     - Posted (filter: Status = Posted)
     - By Platform (group by SocialAccountID→Platform)

3. **Create Analytics Views**:
   - In the PostAnalytics table, create views for:
     - Best Performing Posts (sort by Engagement, descending)
     - Platform Performance (group by PostID→SocialAccountID→Platform)

### Setting Up Access Controls

1. **Create API Key**:
   - Go to your Airtable account settings
   - Select "API" from the menu
   - Generate a new API key
   - Save this key securely (you'll need it for environment variables)

2. **Set Base Permissions**:
   - Go to your base settings (click the "..." next to the base name)
   - Select "Share"
   - Set appropriate permissions for team members
   - For production, limit access to essential team members only

## Make.com (Integromat) Automation Setup

### Setting Up Your Make.com Account

1. **Sign up or log in to Make.com**:
   - Go to [Make.com](https://www.make.com)
   - Create an account or log in to your existing account

2. **Create a new team**:
   - Click "Teams" in the sidebar
   - Create a new team named "Schedulo Pro Production"
   - Invite team members if necessary

### Creating Essential Scenarios

1. **Social Media Authentication Scenario**:
   - Create a new scenario
   - Name it "Social Media Authentication"
   - Start with an HTTP webhook trigger
   - Add OAuth2 modules for each platform (Instagram, Facebook, Twitter, TikTok)
   - Add Airtable modules to store tokens in the SocialAccounts table
   - Set up token refresh logic
   - Activate the scenario

2. **Post Scheduling Scenario**:
   - Create a new scenario
   - Name it "Post Scheduler"
   - Start with a scheduled trigger (run every 5 minutes)
   - Add Airtable module to get scheduled posts due for publishing
   - Add router modules for each platform
   - Add platform-specific posting modules
   - Add error handling and retry logic
   - Add Airtable modules to update post status
   - Activate the scenario

3. **Media Processing Scenario**:
   - Create a new scenario
   - Name it "Media Processor"
   - Start with an HTTP webhook trigger
   - Add Cloudinary modules for media optimization
   - Add platform-specific media validation
   - Add Airtable modules to update media status
   - Activate the scenario

4. **Analytics Collection Scenario**:
   - Create a new scenario
   - Name it "Analytics Collector"
   - Start with a scheduled trigger (run daily)
   - Add modules for each platform's analytics API
   - Add Airtable modules to store analytics data
   - Add error handling for API limits
   - Activate the scenario

### Setting Up Error Handling

1. **Create Error Notification Scenario**:
   - Create a new scenario
   - Name it "Error Notifier"
   - Start with a webhook trigger from other scenarios
   - Add email notification modules
   - Add Slack notification modules (if applicable)
   - Add Airtable modules to log errors
   - Activate the scenario

2. **Configure Retry Policies**:
   - For each scenario, go to scenario settings
   - Set appropriate retry attempts (3-5 recommended)
   - Set exponential backoff (start with 5 minutes, then double)
   - Set error thresholds for automatic deactivation

### Setting Up Execution Limits

1. **Configure Operation Limits**:
   - Go to team settings
   - Set appropriate operation limits based on your plan
   - Allocate more operations to critical scenarios

2. **Set Up Usage Alerts**:
   - Go to team settings
   - Set up email alerts for operation usage (e.g., at 80% of limit)
   - Configure automatic scenario pausing if needed

## Cloudinary Media CDN Setup

### Creating Your Cloudinary Account

1. **Sign up or log in to Cloudinary**:
   - Go to [Cloudinary](https://cloudinary.com)
   - Create an account or log in to your existing account

2. **Create a new product environment**:
   - Go to Settings → Product environments
   - Create a new environment named "schedulo-pro-production"

### Setting Up Media Storage

1. **Create Media Folders**:
   - Create a folder structure:
     - /users (for user-specific content)
     - /templates (for system templates)
     - /system (for system images)

2. **Configure Upload Presets**:
   - Go to Settings → Upload
   - Create a new upload preset named "schedulo-user-media"
   - Enable auto-tagging for content categorization
   - Set delivery type to "Upload"
   - Enable eager transformations for common sizes

### Setting Up Media Transformations

1. **Create Instagram Transformations**:
   - Create transformations for:
     - Square posts (1:1 ratio)
     - Portrait posts (4:5 ratio)
     - Stories (9:16 ratio)

2. **Create Twitter Transformations**:
   - Create transformations for:
     - Timeline images (16:9 ratio)
     - Square images (1:1 ratio)

3. **Create Facebook Transformations**:
   - Create transformations for:
     - Timeline images (1.91:1 ratio)
     - Square posts (1:1 ratio)

4. **Create TikTok Transformations**:
   - Create transformations for:
     - TikTok videos (9:16 ratio)

### Setting Up Access Controls

1. **Generate API Credentials**:
   - Go to Settings → Security
   - Note your Cloud name, API Key, and API Secret
   - These will be used in environment variables

2. **Set Up CORS Settings**:
   - Go to Settings → Security
   - Add your domain to allowed CORS origins
   - Add your Vercel preview domains if needed

## Connecting the Components

### Connecting Bubble.io to Airtable

1. **Install Airtable Plugin**:
   - In your Bubble.io editor, go to "Plugins"
   - Search for and install the "Airtable" plugin
   - Configure the plugin with your API key and base ID

2. **Set Up Data Connections**:
   - Create API workflows for each table
   - Set up CRUD operations (Create, Read, Update, Delete)
   - Test connections with sample data

### Connecting Bubble.io to Make.com

1. **Set Up Webhook Endpoints**:
   - In Make.com, create webhook triggers for key events
   - Copy the webhook URLs

2. **Configure Bubble.io Webhooks**:
   - In Bubble.io, create API workflows that send data to Make.com webhooks
   - Test the connections with sample events

### Connecting Bubble.io to Cloudinary

1. **Install Cloudinary Plugin**:
   - In your Bubble.io editor, go to "Plugins"
   - Search for and install the "Cloudinary" plugin
   - Configure the plugin with your cloud name, API key, and API secret

2. **Set Up Media Workflows**:
   - Create upload workflows
   - Create transformation workflows
   - Test with sample media files

## Testing Your Backend Setup

### Testing Database Connections

1. **Test Airtable Connections**:
   - Create a test record in each table
   - Verify relationships work correctly
   - Test views and filters

2. **Test Make.com Scenarios**:
   - Manually trigger each scenario
   - Verify data flows correctly
   - Check error handling

3. **Test Cloudinary Integration**:
   - Upload test media files
   - Apply transformations
   - Verify URLs work correctly

### End-to-End Testing

1. **Create Test User Flow**:
   - Create a test user
   - Connect a test social account
   - Upload test media
   - Schedule a test post
   - Verify the post is published correctly

2. **Test Error Scenarios**:
   - Simulate token expiration
   - Simulate API rate limits
   - Verify error handling works correctly

## Backup and Recovery

### Setting Up Automated Backups

1. **Configure Airtable Backups**:
   - Create a Make.com scenario for daily Airtable exports
   - Store exports in secure cloud storage

2. **Configure Cloudinary Backups**:
   - Enable Cloudinary backup features
   - Set up regular backup schedule

### Creating Recovery Procedures

1. **Document Recovery Steps**:
   - Create step-by-step recovery procedures
   - Test recovery procedures regularly

2. **Set Up Monitoring**:
   - Configure alerts for backup failures
   - Regularly verify backup integrity

## Security Considerations

### Securing API Keys

1. **Store Keys Securely**:
   - Use Vercel environment variables
   - Never expose keys in client-side code

2. **Implement Key Rotation**:
   - Set up a schedule for rotating API keys
   - Document the rotation process

### Securing User Data

1. **Implement Data Encryption**:
   - Ensure sensitive data is encrypted in Airtable
   - Use secure fields for tokens and credentials

2. **Set Up Access Controls**:
   - Limit access to production data
   - Implement role-based permissions

## Scaling Considerations

### Preparing for Growth

1. **Monitor Usage Limits**:
   - Track Airtable record usage
   - Monitor Make.com operations
   - Watch Cloudinary bandwidth and storage

2. **Plan for Upgrades**:
   - Document upgrade paths for each service
   - Set usage thresholds for triggering upgrades

### Optimizing Performance

1. **Implement Caching**:
   - Use Cloudinary's caching features
   - Implement caching in Bubble.io

2. **Optimize Automation Scenarios**:
   - Review and optimize Make.com scenarios
   - Consolidate operations where possible

By following this guide, you'll have a fully functional backend and database setup for Schedulo Pro, ready to handle user data, media storage, and social media scheduling automation.
