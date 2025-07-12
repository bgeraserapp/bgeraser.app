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

This is a Next.js 15 application built with TypeScript, featuring a comprehensive AI-powered background removal service with authentication, billing, and multi-language support.

### API Architecture (Hono Framework)

The application uses **Hono** as a lightweight web framework for all API routes via catch-all routing:

- **Main Handler**: `src/app/api/[[...route]]/route.ts` - Centralized API router with global auth middleware
- **Route Organization**: Individual routes in `src/app/api/[[...route]]/routes/`
  - `/api/models/bg-remover` - Background removal processing
  - `/api/download-zip` - Bulk image download
  - `/api/payment` - Paddle payment integration
  - `/api/transactions` - Billing history
  - `/api/webhook` - Payment webhooks
  - `/api/health` - Health check
  - Better-auth authentication routes

### Authentication System (Better-Auth)

- **Configuration**: `src/lib/auth.ts` with MongoDB adapter
- **Multi-provider support**: Email/password, Google, GitHub, Microsoft OAuth
- **Custom user fields**: `credits` (number), `paddleCustomerId` (string)
- **Account linking**: Enabled with trusted providers
- **Session management**: Integrated into Hono middleware for all API routes

### Database & Storage Architecture

- **MongoDB**: User data, sessions, transactions via MongoDB client in `src/db/`
- **S3-Compatible Storage (Tigris)**: Image storage with presigned URLs in `src/lib/s3-client.ts`
- **File Processing**: Support for PNG, JPEG, GIF, WebP up to 10MB

### Core Features

- **Background Removal Service**: Complete workflow using Replicate AI ('851-labs/background-remover')
  - Single and batch processing (max 10 images)
  - FormData and JSON payload support
  - Original and processed image storage with presigned URLs
- **Credit System**: User-based credits for API usage with Paddle billing
- **Bulk Downloads**: ZIP generation for multiple processed images
- **Internationalization**: English and Hindi support via next-intl

### Frontend Architecture

- **Component System**: Radix UI + Tailwind CSS with shadcn/ui (New York style)
- **State Management**: React Query for server state, nuqs for URL state, next-themes for theming
- **Provider Architecture**: `src/providers/root-provider.tsx` with conditional auth based on subdomain
- **Form Handling**: React Hook Form + Zod validation with drag-and-drop file uploads

### External Service Integration

- **Replicate AI**: Background removal processing
- **Tigris/S3**: Image storage with presigned URLs
- **MongoDB**: User and session data persistence
- **Paddle**: Payment processing and subscription billing
- **Resend**: Email functionality (optional)

### Environment Configuration

Uses `@t3-oss/env-nextjs` for type-safe environment variables with runtime validation:

- Database connections (MongoDB)
- Storage credentials (S3/Tigris)
- API keys (Replicate, Paddle)
- Authentication providers (OAuth credentials)

### Subdomain Routing

- **console.domain.com**: Dashboard/console interface
- **docs.domain.com**: Documentation
- **Middleware**: `src/middleware.ts` handles subdomain routing and header rewriting

### Development Tools

- **ESLint**: Flat config with Next.js, TypeScript, Prettier, import sorting
- **Prettier**: Code formatting with configuration file
- **Husky**: Pre-commit hooks for linting
- **Commitlint**: Conventional commit message enforcement
- **TypeScript**: Strict configuration with comprehensive type safety

## Key Files to Understand

- `src/app/api/[[...route]]/route.ts`: Hono API router with auth middleware
- `src/lib/auth.ts`: Better-auth configuration with multi-provider setup
- `src/env.ts`: Type-safe environment variable configuration
- `src/db/`: MongoDB models and connection setup
- `src/lib/s3-client.ts`: S3/Tigris storage client
- `src/lib/replicate.ts`: Replicate AI client configuration
- `src/middleware.ts`: Subdomain routing and header rewriting
- `src/providers/root-provider.tsx`: Root provider with conditional auth
- `src/i18n/config.ts`: Internationalization setup
