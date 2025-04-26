# Phase 2: Database Design

This phase focuses on creating the data model in Airtable to support all the functionality required for Schedulo Pro.

## Estimated Time: 2-3 days

## Steps:

### 2.1 Create Airtable Base

- [ ] Create a new Airtable base named "Schedulo Pro"
- [ ] Set up appropriate permissions and sharing settings
- [ ] Configure base settings (timezone, formatting, etc.)
- [ ] Create necessary workspaces for organizing tables

### 2.2 Design Core Data Tables

#### 2.2.1 Users Table
- [ ] Create Users table with fields:
  - UserID (Primary Key)
  - Email
  - Name
  - Company
  - Role
  - Timezone
  - SignupDate
  - LastLoginDate
  - UserStatus (Active/Inactive)
  - UserRole (Admin/Editor/Viewer)
  - ProfilePictureURL

#### 2.2.2 Social Accounts Table
- [ ] Create Social Accounts table with fields:
  - AccountID (Primary Key)
  - UserID (Foreign Key to Users)
  - Platform (Instagram/TikTok/Twitter/Facebook)
  - AccountName
  - AccountType (Business/Personal)
  - AccessToken
  - RefreshToken
  - TokenExpiryDate
  - ConnectionStatus
  - ConnectionDate
  - LastRefreshDate
  - AccountMetadata (JSON)

#### 2.2.3 Media Library Table
- [ ] Create Media Library table with fields:
  - MediaID (Primary Key)
  - UserID (Foreign Key to Users)
  - MediaType (Image/Video)
  - FileName
  - FileSize
  - Duration (for videos)
  - CloudinaryURL
  - ThumbnailURL
  - UploadDate
  - Tags
  - Description
  - Status (Ready/Processing/Error)

#### 2.2.4 Posts Table
- [ ] Create Posts table with fields:
  - PostID (Primary Key)
  - UserID (Foreign Key to Users)
  - MediaID (Foreign Key to Media Library)
  - Caption
  - Hashtags
  - ScheduledTime
  - TimeZone
  - Platforms (Multi-select: Instagram/TikTok/Twitter/Facebook)
  - Status (Scheduled/Posted/Failed)
  - PostedTime
  - ErrorMessage
  - RetryCount
  - PostURLs (JSON with URLs for each platform)
  - EngagementMetrics (JSON)

### 2.3 Design Supporting Data Tables

#### 2.3.1 Analytics Table
- [ ] Create Analytics table with fields:
  - AnalyticsID (Primary Key)
  - PostID (Foreign Key to Posts)
  - AccountID (Foreign Key to Social Accounts)
  - Date
  - Likes
  - Comments
  - Shares
  - Reach
  - Impressions
  - Engagement
  - FollowerGrowth
  - Platform

#### 2.3.2 Default Settings Table
- [ ] Create Default Settings table with fields:
  - SettingID (Primary Key)
  - UserID (Foreign Key to Users)
  - Platform
  - DefaultPostingTimes (JSON array of times)
  - DefaultHashtags
  - DefaultCaption
  - AutoRetry (Boolean)
  - MaxRetries

#### 2.3.3 System Logs Table
- [ ] Create System Logs table with fields:
  - LogID (Primary Key)
  - Timestamp
  - UserID (Foreign Key to Users)
  - LogLevel (Error/Warning/Info/Success)
  - LogMessage
  - RelatedEntityType (Post/Account/Media)
  - RelatedEntityID
  - AdditionalData (JSON)

### 2.4 Create Table Relationships

- [ ] Set up relationships between Users and Social Accounts (one-to-many)
- [ ] Set up relationships between Users and Media Library (one-to-many)
- [ ] Set up relationships between Media Library and Posts (one-to-many)
- [ ] Set up relationships between Social Accounts and Posts (many-to-many)
- [ ] Set up relationships between Posts and Analytics (one-to-many)
- [ ] Set up relationships between Users and Default Settings (one-to-many)

### 2.5 Create Views

- [ ] Create Calendar View for Posts
- [ ] Create Grid View for Media Library
- [ ] Create Kanban View for Post Status
- [ ] Create Gallery View for Media Preview
- [ ] Create filtered views for each social platform

### 2.6 Set Up Airtable Automations

- [ ] Create automation for token expiry notifications
- [ ] Create automation for post status updates
- [ ] Create automation for daily analytics aggregation
- [ ] Create automation for error logging and notifications

## Dependencies:
- Phase 1: Setup & Configuration

## Deliverables:
- Complete Airtable base with all tables, fields, and relationships
- Configured views for different data visualization needs
- Basic automations for data management
- Documentation of the data model
