# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (runs on port 80 with turbopack)
- **Build**: `pnpm build`
- **Production start**: `pnpm start`
- **Lint**: `pnpm lint`
- **Lint and fix**: `pnpm lint:fix`
- **Type check**: `pnpm check-types`
- **Format code**: `pnpm format`
- **Format check**: `pnpm format:check`

## Architecture Overview

This is a Next.js 15 application built with TypeScript, featuring:

### Core Structure

- **App Router**: Uses Next.js App Router with API routes in `src/app/api/`
- **Component Library**: Comprehensive UI components in `src/components/ui/` using Radix UI and Tailwind CSS
- **Internationalization**: Multi-language support with next-intl (English and Hindi currently active)
- **Middleware**: Custom middleware for subdomain handling and header rewriting

### Key Features

- **Background Removal Service**: Main API endpoint at `/api/models/bg-remover` that:
  - Accepts image uploads via FormData
  - Uploads original images to S3-compatible storage (Tigris)
  - Processes images using Replicate AI (background removal model)
  - Stores processed images back to S3
  - Returns presigned URLs for both original and processed images

### External Services Integration

- **Replicate AI**: For background removal processing using the '851-labs/background-remover' model
- **AWS S3/Tigris**: For image storage with presigned URL generation
- **Resend**: For email functionality (optional)

### Environment Configuration

Uses `@t3-oss/env-nextjs` for type-safe environment variables:

- AWS credentials and S3 configuration
- Replicate API key
- Email service configuration (optional)

### Subdomain Routing

- **console.domain.com**: Routes to `/` page
- **docs.domain.com**: Routes to `/` page
- Main domain serves the primary application

### State Management

- **React Query**: For server state management with `@tanstack/react-query`
- **Theme Provider**: Dark/light mode support with `next-themes`

### Development Tools

- **ESLint**: Configured with Next.js, Prettier, and custom rules for import sorting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit linting
- **Commitlint**: Conventional commit message format
- **TypeScript**: Full TypeScript support with strict configuration

## Key Files to Understand

- `src/env.ts`: Environment variable configuration and validation
- `src/app/api/models/bg-remover/route.ts`: Main background removal API endpoint
- `src/lib/replicate.ts`: Replicate AI client configuration
- `src/lib/s3-client.ts`: S3 client setup for Tigris storage
- `src/middleware.ts`: Request middleware for subdomain handling
- `src/i18n/config.ts`: Internationalization configuration
