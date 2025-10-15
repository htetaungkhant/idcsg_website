# IDCSG Website

A comprehensive dental clinic management website built with Next.js 15, featuring a robust admin dashboard, content management system, and modern web technologies.

## 🚀 Tech Stack

### Core Technologies
- **Framework**: Next.js 15.4.5 with App Router and Turbopack
- **Runtime**: React 19.1.0 with React DOM 19.1.0
- **Language**: TypeScript 5 with strict mode
- **Database**: PostgreSQL with Prisma ORM 6.16.2 + Prisma Accelerate
- **Authentication**: NextAuth.js v5.0.0-beta.29 with Prisma adapter
- **Styling**: TailwindCSS v4 with Shadcn/UI components
- **Form Management**: React Hook Form v7.62.0 + Zod v4.1.5 validation
- **File Upload**: Cloudinary v2.7.0 for image/video management
- **HTTP Client**: Axios v1.12.2

### Key Features
- 🔐 **Secure Authentication** - NextAuth.js with role-based access control
- 📝 **Content Management** - Comprehensive CMS for services, team members, and information pages
- 🖼️ **Media Management** - Cloudinary integration for optimized image/video handling
- 🎨 **Modern UI** - Responsive design with TailwindCSS and Radix UI primitives
- 🌙 **Dark Mode** - Theme switching with next-themes
- 📊 **Admin Dashboard** - Full-featured admin panel for content management
- 🔍 **SEO Optimized** - Proper metadata and structured data
- ⚡ **Performance** - Turbopack for fast development, Prisma Accelerate for database performance

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- Cloudinary account
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd idcsg_website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Admin Credentials (for initial setup/seeding)
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="your-secure-password"

# NextAuth.js Configuration
AUTH_TRUST_HOST=true
AUTH_SECRET="your-nextauth-secret-key"

# Database Configuration
# Prisma Accelerate connection (for production/enhanced performance)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-accelerate-api-key"

# Direct database connection (for migrations and Prisma Studio)
DIRECT_DATABASE_URL="postgres://user:password@host:5432/database?sslmode=require"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Set up the database**
```bash
# Run migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

## 🚀 Getting Started

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Database Management

```bash
# Run database migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Reset database (development only)
npm run db:reset

# Open Prisma Studio for database management
npm run db:studio
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

## 📁 Project Structure

```
idcsg_website/
├── app/                          # Next.js App Router
│   ├── (main-pages)/            # Public website pages
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── information/         # Information pages (about, patient info, etc.)
│   │   ├── pay/
│   │   ├── services/
│   │   ├── shop/
│   │   └── teams/
│   ├── admin/                   # Admin dashboard
│   │   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   │   └── (dashboard)/        # Dashboard pages (management interfaces)
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth.js configuration
│   │   ├── categories/
│   │   ├── contact/
│   │   ├── services/
│   │   ├── team-members/
│   │   └── ...
│   └── generated/              # Prisma client output
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn/UI components
│   ├── Header/
│   └── ...
├── hooks/                      # Custom React hooks
│   ├── use-cloudinary-upload.ts
│   └── use-mobile.ts
├── lib/                        # Utility libraries
│   ├── db/                     # Database configuration
│   │   ├── schema.prisma
│   │   ├── db.ts
│   │   └── seed.ts
│   ├── services/               # Business logic services
│   ├── auth.ts                 # NextAuth configuration
│   ├── cloudinary.ts           # Cloudinary integration
│   └── utils.ts
├── types/                      # TypeScript type definitions
├── public/                     # Static assets
└── middleware.ts               # Next.js middleware for auth
```

## 🎯 Key Features

### Content Management System

The project includes comprehensive content management for:

- **Services Management**: Multi-section service pages with images, videos, descriptions, and pricing
- **Team Management**: Manage doctors, specialists, and support staff with profiles
- **Technology Management**: Showcase dental technologies with flexible card layouts
- **Information Pages**: Manage various information sections (first visit, patient instructions, policies, etc.)
- **Homepage Settings**: Dynamic background management with images/videos and opacity control
- **Contact Forms**: Handle contact form submissions with international phone support

### Admin Dashboard Features

- **Role-based Access Control**: Secure admin routes with NextAuth.js
- **Content CRUD Operations**: Create, read, update, and delete for all content types
- **Media Management**: Upload and manage images/videos through Cloudinary
- **Dynamic Forms**: Complex forms with dynamic field arrays and file uploads
- **Real-time Preview**: Preview content changes before publishing

### Security Features

- **Authentication**: NextAuth.js v5 with credentials and OAuth providers
- **Authorization**: Role-based access control (USER, ADMIN)
- **Password Hashing**: bcryptjs for secure password storage
- **File Upload Security**: Type and size validation for uploads
- **Input Validation**: Zod schema validation at API boundaries
- **CSRF Protection**: Next.js built-in CSRF protection

### Performance Optimizations

- **Server Components**: Default to Server Components for better SEO and performance
- **Image Optimization**: Next.js Image component + Cloudinary transformations
- **Code Splitting**: Dynamic imports for large components
- **Database Performance**: Prisma Accelerate for enhanced query performance
- **Caching**: Next.js caching strategies for optimal performance

## 🗄️ Database Schema

The database includes the following main entities:

- **User**: Authentication and user management
- **Service**: Service offerings with 5 customizable sections
- **Category**: Service categorization
- **Member**: Team member profiles
- **DentalTechnology**: Technology showcase with flexible layouts
- **HomepageSettings**: Dynamic homepage background management
- **ContactMessage**: Contact form submissions
- **Information Systems**: Terms of Service, Privacy Policy, Office Policy, Safe, Precise, Personal, FirstVisit, PatientInstructions

For detailed schema information, see `lib/db/schema.prisma`.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_EMAIL` | Default admin email for initial setup and seeding | ✅ |
| `ADMIN_PASSWORD` | Default admin password for initial setup and seeding | ✅ |
| `AUTH_TRUST_HOST` | Trust the host header for authentication (set to `true` for production) | ✅ |
| `AUTH_SECRET` | Secret key for NextAuth.js session encryption | ✅ |
| `DATABASE_URL` | Prisma Accelerate connection string for enhanced database performance | ✅ |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL connection string for migrations and Prisma Studio | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for media uploads | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |

### Notes on Environment Variables:

- **Database URLs**: The project uses two database URLs:
  - `DATABASE_URL`: Prisma Accelerate connection for application runtime (faster queries with caching)
  - `DIRECT_DATABASE_URL`: Direct PostgreSQL connection for migrations and Prisma Studio

- **Admin Credentials**: Used during database seeding to create the initial admin user. Make sure to change these in production!

- **Auth Configuration**: 
  - Generate a secure `AUTH_SECRET` using: `openssl rand -base64 32`
  - Set `AUTH_TRUST_HOST=true` when deploying behind a proxy or on Vercel

## 🧪 Development Guidelines

### Code Quality Standards

- Write self-documenting code with meaningful names
- Follow TypeScript strict mode conventions
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Keep functions small and focused on single responsibility
- Comment complex business logic
- Remove unused imports and dead code

### SOLID Principles

The project follows SOLID principles:

- **Single Responsibility**: Each component/function has one reason to change
- **Open/Closed**: Code is open for extension, closed for modification
- **Liskov Substitution**: Derived implementations are substitutable
- **Interface Segregation**: Specific, focused interfaces over monolithic ones
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

### Component Organization

- **UI Components**: Place in `/components/ui/` (Shadcn/UI components)
- **Common Components**: Place in `/components/` folder
- **Page-specific Components**: Create `(components)` folder within page directory

### Import Order

```typescript
// 1. Built-in Node.js modules
import path from 'path';

// 2. Third-party libraries
import React from 'react';
import { z } from 'zod';

// 3. Alias paths (@/*)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// 4. Relative imports
import './styles.css';
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure all production environment variables are properly configured:
- Set `NEXTAUTH_URL` to your production domain
- Use secure `NEXTAUTH_SECRET`
- Configure production database URL
- Set up Cloudinary for production

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

For other deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

For detailed development instructions, please refer to `DEVELOPER_INSTRUCTIONS.md`.

---

**Note**: This is a production application for a dental clinic. Please ensure proper security measures and data protection practices when deploying.
