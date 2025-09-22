# Developer Instructions - IDCSG Website

## Overview
This document provides comprehensive guidelines for developing and maintaining the IDCSG website. These instructions are designed for senior Next.js developers to ensure consistency, maintainability, and optimal performance across the codebase.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.4.5 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Database**: Prisma ORM with PostgreSQL (production) and Prisma Accelerate
- **Authentication**: NextAuth.js v5 (beta.29) with Prisma adapter
- **Styling**: TailwindCSS v4 with Shadcn/UI and tw-animate-css
- **TypeScript**: Full TypeScript implementation with strict mode (TypeScript 5)
- **Form Management**: React Hook Form v7.62.0 with Zod validation v4.1.5
- **Icons**: Lucide React v0.536.0 & React Icons v5.5.0
- **Notifications**: Sonner v2.0.7
- **HTTP Client**: Axios v1.12.2 for API requests
- **File Upload**: Multer v2.0.2 with Cloudinary v2.7.0 integration
- **Security**: bcryptjs v3.0.2 for password hashing
- **Theming**: Next-themes v0.4.6 for dark/light mode
- **Phone Input**: React International Phone v4.6.0 for international phone numbers
- **Utilities**: Class Variance Authority v0.7.1, clsx v2.1.1, tailwind-merge v3.3.1, uuid v13.0.0

## Code Quality Standards

### 1. Clean and Maintainable Code
- Write self-documenting code with meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for components)
- Comment complex business logic and non-obvious implementations
- Remove unused imports, variables, and dead code
- Use TypeScript's strict mode features for better type safety

### 2. Security Best Practices
- **Input Validation**: Always validate user inputs using Zod schemas
- **Password Security**: Use bcryptjs for secure password hashing and comparison
- **File Upload Security**: Validate file types, sizes, and sanitize filenames before Cloudinary upload
- **XSS Prevention**: Sanitize user-generated content before rendering
- **CSRF Protection**: Use Next.js built-in CSRF protection
- **Secure Headers**: Implement proper security headers in `next.config.ts`
- **Environment Variables**: Store sensitive data (DATABASE_URL, NEXTAUTH_SECRET, Cloudinary credentials) in environment variables
- **API Security**: Validate and sanitize all API inputs and outputs
- **Authentication**: Implement proper session management and authentication flows with NextAuth.js v5
- **Role-Based Access**: Implement proper authorization checks for admin routes and API endpoints

### 3. Performance Optimization
- **Server-Side Rendering**: Prioritize SSR and Server Components for SEO
- **Image Optimization**: Use Next.js Image component with proper sizing and lazy loading
- **Code Splitting**: Implement dynamic imports for large components
- **Bundle Analysis**: Regularly analyze bundle size and optimize imports
- **Caching**: Utilize Next.js caching strategies appropriately
- **Web Vitals**: Monitor and optimize Core Web Vitals metrics
- **Database Queries**: Optimize database queries and implement proper indexing

### 4. SOLID Principles Adherence
All developers must follow SOLID principles to ensure maintainable, scalable, and robust code architecture:

- **Single Responsibility Principle (SRP)**: Each class, function, and component should have only one reason to change. Components should focus on a single concern or functionality.
  ```typescript
  // Good: Focused component with single responsibility
  export function UserProfile({ user }: { user: User }) {
    return (
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    );
  }
  
  // Separate component for user actions
  export function UserActions({ userId }: { userId: string }) {
    return (
      <div className="user-actions">
        <Button onClick={() => editUser(userId)}>Edit</Button>
        <Button onClick={() => deleteUser(userId)}>Delete</Button>
      </div>
    );
  }
  ```

- **Open/Closed Principle (OCP)**: Code should be open for extension but closed for modification. Use composition, interfaces, and higher-order components for extensibility.
  ```typescript
  // Good: Extensible button component
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
  }
  
  export function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
    return (
      <button 
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size])} 
        {...props}
      >
        {children}
      </button>
    );
  }
  ```

- **Liskov Substitution Principle (LSP)**: Derived classes or implementations should be substitutable for their base classes without altering correctness.
  ```typescript
  // Good: Proper interface implementation
  interface PaymentProcessor {
    processPayment(amount: number): Promise<PaymentResult>;
  }
  
  class StripeProcessor implements PaymentProcessor {
    async processPayment(amount: number): Promise<PaymentResult> {
      // Stripe-specific implementation
      return { success: true, transactionId: 'stripe_123' };
    }
  }
  
  class PayPalProcessor implements PaymentProcessor {
    async processPayment(amount: number): Promise<PaymentResult> {
      // PayPal-specific implementation
      return { success: true, transactionId: 'paypal_456' };
    }
  }
  ```

- **Interface Segregation Principle (ISP)**: Clients should not depend on interfaces they don't use. Create specific, focused interfaces rather than large, monolithic ones.
  ```typescript
  // Good: Segregated interfaces
  interface Readable {
    read(): string;
  }
  
  interface Writable {
    write(data: string): void;
  }
  
  interface Deletable {
    delete(id: string): void;
  }
  
  // Components implement only what they need
  class FileReader implements Readable {
    read(): string {
      return 'file content';
    }
  }
  
  class FileManager implements Readable, Writable, Deletable {
    read(): string { return 'content'; }
    write(data: string): void { /* implementation */ }
    delete(id: string): void { /* implementation */ }
  }
  ```

- **Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules. Both should depend on abstractions. Use dependency injection and inversion of control patterns.
  ```typescript
  // Good: Dependency injection with abstractions
  interface EmailService {
    sendEmail(to: string, subject: string, body: string): Promise<void>;
  }
  
  interface UserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
  }
  
  class UserService {
    constructor(
      private emailService: EmailService,
      private userRepository: UserRepository
    ) {}
    
    async notifyUser(userId: string, message: string): Promise<void> {
      const user = await this.userRepository.findById(userId);
      if (user) {
        await this.emailService.sendEmail(user.email, 'Notification', message);
      }
    }
  }
  ```

## File Structure and Organization

### Current Project Structure
```
DEVELOPER_INSTRUCTIONS.md
README.md
package.json
next.config.ts
tsconfig.json
components.json
middleware.ts
eslint.config.mjs
postcss.config.mjs
.env
.gitignore

app/                                    # Next.js 15 App Router
├── favicon.ico
├── globals.css
├── layout.tsx                          # Root layout
├── page.tsx                           # Home page
├── generated/                         # Prisma client output
│   └── prisma/                        # Generated Prisma client
├── (main-pages)/                      # Route group for main website pages
│   ├── layout.tsx                     # Main pages layout
│   ├── information/                   # Information pages
│   │   ├── about/
│   │   │   ├── personal/
│   │   │   ├── precise/
│   │   │   └── safe/
│   │   ├── financing-insurance/
│   │   │   └── page.tsx
│   │   ├── patient-info/
│   │   │   ├── first-visit/
│   │   │   ├── office-policies/
│   │   │   ├── patient-forms/
│   │   │   ├── patient-instructions/
│   │   │   ├── privacy-policy/
│   │   │   └── terms-of-service/
│   │   ├── technology/
│   │   │   ├── cone-beam-imaging/
│   │   │   ├── dental-technology/
│   │   │   └── laser-dentistry/
│   │   └── warranty/
│   ├── blog/
│   │   └── page.tsx
│   ├── contact/
│   │   ├── page.tsx
│   │   └── (components)/
│   │       └── ContactForm.tsx
│   ├── pay/
│   │   ├── page.tsx
│   │   └── (components)/
│   │       └── PaymentForm.tsx
│   ├── services/
│   │   └── [serviceName]/
│   │       ├── page.tsx
│   │       └── serviceDetails/
│   ├── shop/
│   │   └── page.tsx
│   └── teams/
│       ├── page.tsx
│       └── (components)/
│           └── TeamList.tsx
├── admin/                             # Admin dashboard
│   ├── (auth)/                       # Authentication pages
│   │   ├── layout.tsx                # Auth layout
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   └── (dashboard)/                  # Admin dashboard
│       ├── layout.tsx
│       ├── (components)/             # Shared dashboard components
│       ├── category-management/      # Category management pages
│       ├── home-page-management/
│       │   └── page.tsx
│       ├── information/              # Information management
│       ├── service-management/       # Service management pages
│       ├── team-management/          # Team management pages
│       └── technology-management/    # Technology management pages
└── api/                              # API routes
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts
    ├── homepage-settings/
    │   ├── route.ts
    │   └── media/                    # Media upload endpoints
    └── team-members/
        └── route.ts

components/                           # Reusable UI components
├── ui/                              # Shadcn/UI components
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── github.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
├── CardCollection.tsx               # Custom common components
├── CustomButtons.tsx
├── CustomCard.tsx
├── Footer.tsx
├── GithubSignIn.tsx
├── SignOut.tsx
└── Header/                         # Multi-file component
    ├── index.tsx
    └── NavLinks.tsx

hooks/                              # Custom React hooks
└── use-mobile.ts

lib/                               # Utility libraries and configurations
├── actions.ts                     # Server actions
├── api-client.ts                  # HTTP client configuration
├── auth.ts                        # NextAuth configuration
├── cloudinary.ts                  # Cloudinary integration
├── execute-action.ts              # Action execution utilities
├── password.ts                    # Password utilities
├── schema.ts                      # Validation schemas
├── utils.ts                       # Common utilities
├── db/                           # Database related files
│   ├── db.ts                     # Database connection
│   ├── schema.prisma             # Prisma schema (PostgreSQL)
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
│       └── migration_lock.toml
└── services/                     # Business logic services
    ├── example.ts
    ├── homepage-settings-service.ts
    └── member-service.ts

types/                            # TypeScript type definitions
└── global.ts                     # Global type definitions

public/                          # Static assets
├── *.png, *.svg, *.jpg         # Images and icons
├── dummy-data/                 # Sample data
│   ├── doctor.png
│   ├── main_bg.mp4
│   └── service_details_page.png
└── Social media icons (facebook.svg, instagram.svg, etc.)
```

### Component Organization
- **Location**: `/components/ui/` folder
- **Purpose**: Reusable, low-level UI components from Shadcn/UI
- **Examples**: `button.tsx`, `input.tsx`, `form.tsx`, `select.tsx`
- **Naming**: Use lowercase with hyphens for multi-word components

#### Custom Common Components
- **Single File Components**: Place directly in `/components/` folder
- **Multi-File Components**: Create a folder with the component name containing sub-components
- **Examples**: 
  ```
  /components/CustomCard.tsx          (single file)
  /components/Header/                 (folder)
    ├── index.tsx
    └── NavLinks.tsx
  ```

#### Page-Specific Components
- **Location**: Create `(components)` folder within the page directory
- **Purpose**: Components used exclusively by a specific page
- **Examples**:
  ```
  /app/contact/(components)/ContactForm.tsx
  /app/pay/(components)/PaymentForm.tsx
  /app/teams/(components)/TeamList.tsx
  /app/admin/(dashboard)/(components)/     # Shared admin components
  ```

### Admin Dashboard Organization
- **Authentication Pages**: Located in `/app/admin/(auth)/` with shared layout
- **Dashboard Pages**: Located in `/app/admin/(dashboard)/` with admin layout
- **Management Modules**: Organized by feature (team-management, service-management, etc.)
- **Shared Components**: Common dashboard components in `(components)` folder
- **Access Control**: Implement proper authentication and role-based access

### Types Organization
- **Location**: `/types/` folder
- **File Structure**: Organize by domain or feature
- **Global Types**: Use `global.ts` for application-wide interfaces
- **Naming Convention**: Use PascalCase for interfaces and types
- **Example**:
  ```typescript
  // types/global.ts
  export interface Doctor {
    id: string;
    name: string;
    degree: string;
    about: string;
    image: ImageData;
  }
  
  export interface ImageData {
    id: string;
    image: string;
    thumbnail: string;
  }
  ```

### Hooks Organization
- **Location**: `/hooks/` folder for custom React hooks
- **Naming Convention**: Use `use-` prefix for hook files (kebab-case)
- **Purpose**: Reusable logic that uses React hooks
- **Example**: `/hooks/use-mobile.ts` for mobile detection logic

## Import Statement Guidelines

Always organize imports in the following order (note the `@/*` path alias is configured):
```typescript
// 1. Built-in Node.js modules
import { readFile } from 'fs/promises';
import path from 'path';

// 2. Third-party libraries
import React from 'react';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';
import bcryptjs from 'bcryptjs';

// 3. Alias paths (@/* configured for root directory)
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db/db';
import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import type { Doctor, ImageData } from '@/types/global';

// 4. Relative imports (when necessary)
import './styles.css';
import { LocalComponent } from './LocalComponent';
```

## Database Management

### Prisma Configuration
- **Schema Location**: `lib/db/schema.prisma`
- **Database**: PostgreSQL with Prisma Accelerate extension for enhanced performance
- **Client Output**: Generated in `app/generated/prisma` directory
- **Seed File**: `lib/db/seed.ts` for database seeding

### Database Scripts
```bash
# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Reset and re-migrate database
npm run db:reset

# Open Prisma Studio for database management
npm run db:studio
```

### Database Best Practices
- Always create migrations for schema changes using `npm run db:migrate`
- Use descriptive migration names that explain the changes
- Test migrations on development data before deploying
- Keep the Prisma schema well-documented with comments
- Use proper relationships and constraints in the schema
- Follow Prisma naming conventions (camelCase for field names)
- Utilize PostgreSQL-specific features for optimal performance
- Use Prisma Accelerate for enhanced query performance and caching
- Seed the database with `npm run db:seed` for consistent test data
- Configure proper environment variables for DATABASE_URL

### File Upload and Media Management
- **Cloudinary Integration**: Use Cloudinary for image and video uploads
- **Configuration**: Set up Cloudinary credentials in environment variables
- **File Processing**: Use Multer for handling multipart form data
- **Image Optimization**: Leverage Cloudinary's transformation capabilities
- **Security**: Validate file types and sizes before upload

## Development Workflow

### Development Commands
```bash
# Start development server with Turbopack (faster compilation)
npm run dev

# Build for production (includes Prisma client generation)
npm run build

# Start production server
npm run start

# Lint the codebase
npm run lint

# Install dependencies and generate Prisma client
npm install

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database with initial data
npm run db:reset      # Reset and re-migrate database
npm run db:studio     # Open Prisma Studio
```

### Before Making Changes
1. **Analyze Existing Codebase**
   - Review current file structure and naming conventions
   - Understand existing patterns and architectural decisions
   - Check for similar implementations before creating new ones
   - Identify reusable components and utilities

2. **Code Review Checklist**
   - Ensure TypeScript types are properly defined
   - Verify component placement follows organizational guidelines
   - Check import order and use `@/*` path aliases consistently
   - Validate responsive design implementation
   - Test accessibility features
   - Verify SEO optimization (meta tags, structured data)
   - Check database queries are optimized and use Prisma properly
   - Validate authentication flows work with NextAuth.js v5
   - Ensure proper error handling and loading states

### Component Development

#### Server Components (Default)
- Use Server Components by default for better SEO and performance
- Move to Client Components only when necessary (user interactions, hooks, browser APIs)
- Mark Client Components with `'use client'` directive

```typescript
// Server Component (default)
export default async function ProductList() {
  const products = await getProducts();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client Component (when needed)
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... rest of component
}
```

#### Responsive Design Requirements
- **Mobile-First Approach**: Design for mobile first, then enhance for larger screens
- **Pixel Perfect**: Ensure designs match specifications exactly across all breakpoints
- **TailwindCSS Breakpoints**:
  - `sm:` - 640px and up
  - `md:` - 768px and up
  - `lg:` - 1024px and up
  - `xl:` - 1280px and up
  - `2xl:` - 1536px and up

```typescript
// Example responsive component
export default function HeroSection() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
          Welcome to IDCSG
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Content */}
        </div>
      </div>
    </section>
  );
}
```

## Form Handling Best Practices

### React Hook Form + Zod Integration
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

## SEO Optimization

### Metadata Implementation
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | IDCSG',
  description: 'Descriptive meta description for SEO',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'Page Title',
    description: 'Description for social sharing',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Description for Twitter',
  },
};
```

## Testing and Quality Assurance

### Pre-Deployment Checklist
- [ ] TypeScript compilation passes without errors
- [ ] ESLint rules are followed
- [ ] All forms validate properly
- [ ] Responsive design works on all breakpoints
- [ ] Images are optimized and load correctly
- [ ] SEO metadata is properly configured
- [ ] Performance metrics meet standards
- [ ] Accessibility requirements are met
- [ ] Security vulnerabilities are addressed

### Performance Monitoring
- Use Next.js built-in analytics
- Monitor Core Web Vitals
- Analyze bundle size regularly
- Test loading times across different network conditions

## Common Patterns and Utilities

### Utility Functions
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

### Error Handling
```typescript
// Consistent error handling pattern
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  console.error('Error description:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

## Final Notes

- Always prioritize user experience and accessibility
- Keep the codebase DRY (Don't Repeat Yourself)
- Document complex business logic and database operations
- Regularly update dependencies and security patches
- Follow the principle of least privilege for data access
- Implement proper error boundaries for production stability
- Use Turbopack for development for faster compilation
- Leverage NextAuth.js v5 (beta.29) features for secure authentication
- Use Prisma migrations for all database schema changes
- Test thoroughly with both light and dark themes (next-themes)
- Optimize images and media uploads with Cloudinary transformations
- Use PostgreSQL-specific features for better performance
- Implement proper file upload validation and security measures
- Utilize Prisma Accelerate for enhanced query performance
- Seed the database consistently for development and testing
- Follow role-based access control for admin dashboard features
- Monitor bundle size and Core Web Vitals regularly

Remember: Code is read more often than it's written. Write code that your future self and your team members will thank you for.
