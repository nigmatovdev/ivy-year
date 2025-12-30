# Ivyonaire

Production-grade web application for tracking student progress throughout the academic year.

## Monorepo Structure

This is a Turborepo monorepo using pnpm workspaces.

### `/apps`

- **`web`** - Public-facing Next.js application serving student progress pages (read-only). This is where parents and students can view shareable progress pages.

- **`admin`** - Private admin dashboard (Next.js + NextAuth) for managing students, tracking progress, and configuring the system. Requires authentication.

### `/packages`

- **`ui`** - Shared React UI component library used across both apps. Contains reusable components following the luxury, minimal design language.

- **`db`** - Prisma schema and database client. Centralized database configuration and type-safe database access for all apps.

- **`utils`** - Shared utility functions and calculation logic. Business logic for progress tracking, calculations, and data transformations.

- **`config`** - Shared configuration files including Tailwind CSS configs, TypeScript configs, and ESLint configs. Ensures consistency across the monorepo.

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build all apps
pnpm build

# Run linting
pnpm lint
```

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth (admin only)
- **Deployment**: Vercells