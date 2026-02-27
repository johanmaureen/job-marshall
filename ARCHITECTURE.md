# Job Marshal - Project Architecture

## Overview

Job Marshal is a full-stack Next.js application for connecting companies and job seekers. The system uses modern web technologies with a focus on security, payments, and background job processing.

## Architecture Diagram

```mermaid
graph TB
    subgraph Client["🎨 Frontend - Next.js Client"]
        Login["Login Page"]
        Onboarding["Onboarding<br/>- UserTypeForm<br/>- CompanyForm<br/>- JobSeekerForm"]
        MainLayout["Main Layout"]
        PostJob["Post Job Page"]
        JobFilters["Job Listings<br/>+ Filters"]
        Payment["Payment Pages<br/>- Success<br/>- Cancel"]
        UserDropdown["User Dropdown<br/>Dark Mode"]
    end

    subgraph Forms["📋 Forms & Components"]
        CreateJobForm["CreateJobForm"]
        LoginForm["LoginForm"]
        RichEditor["Rich Text Editor<br/>TipTap"]
        BenefitsSelector["Benefits Selector"]
        SalarySelector["Salary Range"]
        DurationSelector["Listing Duration"]
        JobFiltersComp["Job Filters"]
    end

    subgraph UI["🎭 UI Components"]
        UILib["Radix UI + Custom<br/>Button, Input, Select<br/>Card, Badge, etc."]
    end

    subgraph Backend["🔧 API Routes - Next.js"]
        AuthAPI["[...nextauth]<br/>Authentication"]
        StripeWebhook["Stripe Webhook<br/>Payment Events"]
        UploadThingAPI["UploadThing<br/>File Uploads"]
        InngestAPI["Inngest Events<br/>Background Jobs"]
        ArcjetAPI["Arcjet Security<br/>Rate Limiting"]
    end

    subgraph Services["🛠️ Core Services"]
        AuthService["NextAuth<br/>- GitHub/Google OAuth<br/>- Session Management"]
        StripeService["Stripe<br/>- Payments<br/>- Subscriptions"]
        UploadService["UploadThing<br/>- Image Upload<br/>- Storage"]
        InngestService["Inngest<br/>- Job Processing<br/>- Notifications"]
        ArcjetService["Arcjet<br/>- DDoS Protection<br/>- Rate Limiting"]
    end

    subgraph Database["💾 Data Layer"]
        PostgreSQL["PostgreSQL<br/>Prisma Client"]
        Models["Data Models<br/>- User<br/>- Company<br/>- JobSeeker<br/>- JobPost<br/>- Account<br/>- Session"]
    end

    subgraph External["☁️ External Services"]
        GitHub["GitHub OAuth"]
        Google["Google OAuth"]
        StripeAPI["Stripe API"]
        Cloudinary["Image CDN<br/>Cloudinary/UploadThing"]
    end

    subgraph Utils["🔨 Utilities"]
        Zod["Zod<br/>Validation"]
        HookForm["React Hook Form<br/>Form Management"]
        Theming["Next Themes<br/>Dark Mode"]
        Formatting["Format Currency<br/>Format Dates"]
    end

    Client -->|Uses| Forms
    Forms -->|Uses| UI
    Forms -->|Uses| Utils

    Client -->|Calls| Backend

    Backend -->|Auth| AuthAPI
    Backend -->|Payments| StripeWebhook
    Backend -->|Files| UploadThingAPI
    Backend -->|Events| InngestAPI
    Backend -->|Security| ArcjetAPI

    AuthAPI -->|Integrates| AuthService
    StripeWebhook -->|Integrates| StripeService
    UploadThingAPI -->|Integrates| UploadService
    InngestAPI -->|Integrates| InngestService
    ArcjetAPI -->|Integrates| ArcjetService

    AuthService -->|OAuth| GitHub
    AuthService -->|OAuth| Google
    StripeService -->|API| StripeAPI
    UploadService -->|CDN| Cloudinary

    Backend -->|Query/Mutate| Database
    Database -->|Connects| PostgreSQL
    PostgreSQL -->|Stores| Models

    style Client fill:#e1f5ff
    style Forms fill:#f3e5f5
    style Backend fill:#fff3e0
    style Services fill:#e8f5e9
    style Database fill:#fce4ec
    style External fill:#f1f8e9
    style Utils fill:#e0f2f1
```

## Key Components

### Frontend (Client)

- **Pages**: Login, Onboarding, Main Layout, Post Job, Job Listings, Payment Success/Cancel
- **Features**: Dark mode toggle, user dropdown, responsive design

### Forms & Components

- Form components for job creation, login, and onboarding
- Rich text editor (TipTap) for job descriptions
- Specialized selectors for benefits, salary ranges, and job duration
- Job filtering components

### UI Library

- Built on Radix UI with custom Tailwind CSS styling
- Consistent component library across the app

### Backend API Routes

- **Authentication**: NextAuth for OAuth and session management
- **Payments**: Stripe webhook integration
- **File Uploads**: UploadThing integration
- **Background Jobs**: Inngest for async processing
- **Security**: Arcjet for rate limiting and DDoS protection

### External Services

- **OAuth**: GitHub and Google authentication
- **Payments**: Stripe
- **Storage**: Cloudinary and UploadThing CDN
- **Background Processing**: Inngest

### Database

- **PostgreSQL**: Primary database
- **Prisma ORM**: Database access layer
- **Models**: User, Company, JobSeeker, JobPost, Account, Session

### Data Models

```
User (Central Model)
├── Company (1:1 relation)
├── JobSeeker (1:1 relation)
├── Account[] (OAuth credentials)
└── Session[] (Active sessions)

Company
├── User (1:1 relation)
└── JobPost[] (Job listings)

JobPost
├── Company (N:1 relation)
└── Status: DRAFT | ACTIVE | EXPIRED
```

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Frontend**: React 19.2.3, TypeScript
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS, Radix UI
- **Rich Text**: TipTap
- **Database**: PostgreSQL with Prisma 7.4.0
- **Authentication**: NextAuth 5.0.0-beta
- **Payments**: Stripe
- **File Uploads**: UploadThing
- **Background Jobs**: Inngest
- **Security**: Arcjet
- **Toast Notifications**: Sonner
- **Icons**: Lucide React

## User Flows

### Company (Employer)

1. Login/Signup with OAuth
2. Complete company onboarding
3. Post a job listing
4. Set listing duration and pricing
5. Receive applications

### Job Seeker

1. Login/Signup with OAuth
2. Complete job seeker profile
3. Browse job listings with filters
4. Apply to jobs

## Authentication Flow

- OAuth providers: GitHub and Google
- Session stored in database via NextAuth + Prisma adapter
- Stripe customer ID linked to user for payments

## Payment Flow

- Job posting requires payment (based on listing duration)
- Stripe handles payment processing
- Webhooks update job status and application count
