# Developer Instructions - IDCSG Website

## Overview
This document provides comprehensive guidelines for developing and maintaining the IDCSG website. These instructions are designed for senior Next.js developers to ensure consistency, maintainability, and optimal performance across the codebase.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Runtime**: React 19.1.0
- **Styling**: TailwindCSS v4 with Shadcn/UI
- **TypeScript**: Full TypeScript implementation
- **Form Management**: React Hook Form with Zod validation
- **Icons**: Lucide React & React Icons
- **Notifications**: Sonner

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
- **XSS Prevention**: Sanitize user-generated content before rendering
- **CSRF Protection**: Use Next.js built-in CSRF protection
- **Secure Headers**: Implement proper security headers in `next.config.ts`
- **Environment Variables**: Store sensitive data in environment variables, never in code
- **API Security**: Validate and sanitize all API inputs and outputs
- **Authentication**: Implement proper session management and authentication flows

### 3. Performance Optimization
- **Server-Side Rendering**: Prioritize SSR and Server Components for SEO
- **Image Optimization**: Use Next.js Image component with proper sizing and lazy loading
- **Code Splitting**: Implement dynamic imports for large components
- **Bundle Analysis**: Regularly analyze bundle size and optimize imports
- **Caching**: Utilize Next.js caching strategies appropriately
- **Web Vitals**: Monitor and optimize Core Web Vitals metrics
- **Database Queries**: Optimize database queries and implement proper indexing

## File Structure and Organization

### Component Organization

#### Shadcn/UI Components
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
  ```

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

## Import Statement Guidelines

Always organize imports in the following order:
```typescript
// 1. Built-in Node.js modules
import { readFile } from 'fs/promises';
import path from 'path';

// 2. Third-party libraries
import React from 'react';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 3. Alias paths (if configured)
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

// 4. Relative imports (absolute paths)
import { Button } from '../ui/button';
import { CustomCard } from './CustomCard';
import type { Doctor } from '../../types/global';
```

## Development Workflow

### Before Making Changes
1. **Analyze Existing Codebase**
   - Review current file structure and naming conventions
   - Understand existing patterns and architectural decisions
   - Check for similar implementations before creating new ones
   - Identify reusable components and utilities

2. **Code Review Checklist**
   - Ensure TypeScript types are properly defined
   - Verify component placement follows organizational guidelines
   - Check import order and remove unused imports
   - Validate responsive design implementation
   - Test accessibility features
   - Verify SEO optimization (meta tags, structured data)

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
- Document complex business logic
- Regularly update dependencies and security patches
- Follow the principle of least privilege for data access
- Implement proper error boundaries for production stability

Remember: Code is read more often than it's written. Write code that your future self and your team members will thank you for.
