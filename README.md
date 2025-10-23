# Platform Monorepo

A comprehensive pnpm-based monorepo featuring NestJS backend, Next.js 14 frontend, and shared design tokens and utilities.

## 🏗️ Project Structure

```
platform-monorepo/
├── apps/
│   ├── backend/          # NestJS API service
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── config/       # Configuration module
│   │   │   │   └── logger/       # Logging module (Pino)
│   │   │   ├── modules/
│   │   │   │   └── health/       # Health check endpoints
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   └── frontend/         # Next.js 14 web application
│       ├── src/
│       │   ├── app/              # App router pages
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/       # React components
│       │   └── theme/            # Chakra UI theme
│       ├── tests/                # Playwright E2E tests
│       ├── public/
│       ├── Dockerfile
│       ├── jest.config.js
│       ├── playwright.config.ts
│       └── package.json
│
├── packages/
│   ├── shared/           # Shared utilities and design tokens
│   │   ├── src/
│   │   │   ├── theme/
│   │   │   │   └── tokens/       # Colors, spacing, typography
│   │   │   └── utils/            # Utility functions
│   │   └── package.json
│   │
│   └── types/            # Shared TypeScript types
│       ├── src/
│       │   ├── api.types.ts
│       │   └── index.ts
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD pipeline
│
├── .husky/               # Git hooks (pre-commit, commit-msg, pre-push)
├── docker-compose.yml    # Local development environment
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json

```

## 🚀 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 10
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5 (strict mode)
- **Logging**: Pino with nestjs-pino
- **Configuration**: @nestjs/config + Joi validation
- **Security**: Helmet, CORS, Rate limiting (@nestjs/throttler)
- **Testing**: Jest with ts-jest
- **Database**: PostgreSQL (via Docker)
- **Cache**: Redis (via Docker)
- **Storage**: MinIO (S3-compatible, via Docker)

### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **UI Library**: Chakra UI 2
- **Styling**: Emotion (CSS-in-JS)
- **Testing**: Jest + React Testing Library + Playwright
- **Fonts**: Inter (Google Fonts)

### Shared Packages
- **Design Tokens**: Colors, spacing, typography
- **Utilities**: Format functions (currency, date, number)
- **Types**: Shared TypeScript interfaces

### Infrastructure
- **Monorepo**: pnpm workspaces
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Git Hooks**: Husky + lint-staged + commitlint
- **Code Quality**: ESLint, Prettier, TypeScript

## 📦 Prerequisites

- **Node.js**: >= 18.17.0
- **pnpm**: >= 8.9.0
- **Docker**: >= 20.10 (for local development)
- **Docker Compose**: >= 2.0

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd platform-monorepo
   ```

2. Install pnpm globally (if not already installed):
   ```bash
   npm install -g pnpm@8.9.0
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up Git hooks:
   ```bash
   pnpm prepare
   ```

5. Copy environment variables:
   ```bash
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

## 🔧 Development

### Local Development (without Docker)

1. **Start services** (PostgreSQL, Redis, MinIO):
   ```bash
   docker-compose up postgres redis minio -d
   ```

2. **Start backend**:
   ```bash
   pnpm dev:backend
   # or
   cd apps/backend && pnpm start:dev
   ```

3. **Start frontend** (in a new terminal):
   ```bash
   pnpm dev:frontend
   # or
   cd apps/frontend && pnpm dev
   ```

### Local Development (with Docker)

Run all services (backend, frontend, database, cache, storage):
```bash
docker-compose up
```

Access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

## 📝 Available Scripts

### Root-level Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm dev` | Start backend and frontend in parallel |
| `pnpm dev:backend` | Start backend only |
| `pnpm dev:frontend` | Start frontend only |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Lint and auto-fix all packages |
| `pnpm test` | Run tests in all packages |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting with Prettier |

### Backend Scripts

```bash
cd apps/backend

pnpm build         # Build for production
pnpm start         # Start production server
pnpm start:dev     # Start development server with watch mode
pnpm start:debug   # Start development server with debugger
pnpm lint          # Lint TypeScript files
pnpm lint:fix      # Lint and auto-fix
pnpm test          # Run unit tests
pnpm test:watch    # Run tests in watch mode
pnpm test:cov      # Run tests with coverage
pnpm typecheck     # Type-check without emitting
```

### Frontend Scripts

```bash
cd apps/frontend

pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Lint files
pnpm lint:fix      # Lint and auto-fix
pnpm test          # Run Jest unit tests
pnpm test:watch    # Run tests in watch mode
pnpm test:e2e      # Run Playwright E2E tests
pnpm test:e2e:ui   # Run E2E tests with UI
pnpm typecheck     # Type-check without emitting
```

## 🔒 Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | `development` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `RATE_LIMIT_TTL` | Rate limit window (seconds) | `60` |
| `RATE_LIMIT_LIMIT` | Max requests per window | `60` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | Optional |
| `MINIO_ENDPOINT` | MinIO endpoint | `http://minio:9000` |
| `MINIO_ACCESS_KEY` | MinIO access key | Required |
| `MINIO_SECRET_KEY` | MinIO secret key | Required |
| `MINIO_BUCKET` | MinIO bucket name | `assets` |
| `LOG_LEVEL` | Log level (trace/debug/info/warn/error/fatal) | `info` |

### Frontend (`apps/frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
pnpm test

# Run backend tests only
pnpm --filter @platform/backend test

# Run frontend tests only
pnpm --filter @platform/frontend test

# Run tests with coverage
pnpm --filter @platform/backend test:cov
```

### E2E Tests (Playwright)
```bash
# Install Playwright browsers (first time)
cd apps/frontend
pnpm exec playwright install

# Run E2E tests
pnpm --filter @platform/frontend test:e2e

# Run E2E tests with UI
pnpm --filter @platform/frontend test:e2e:ui
```

## 🐳 Docker

### Build Images

```bash
# Build backend
docker build -f apps/backend/Dockerfile -t platform-backend .

# Build frontend
docker build -f apps/frontend/Dockerfile -t platform-frontend .
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🚢 CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`:

1. **Lint**: ESLint checks
2. **Type Check**: TypeScript compilation
3. **Format Check**: Prettier validation
4. **Unit Tests**: Jest tests with PostgreSQL/Redis services
5. **Build**: Production build of all packages

## 🔐 Code Quality & Git Hooks

### Pre-commit Hook
- Runs `lint-staged` to lint and format staged files
- Configured in `.husky/pre-commit`

### Commit Message Hook
- Validates commit messages using commitlint
- Follows [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `type(scope?): subject`
- Examples:
  - `feat(backend): add user authentication`
  - `fix(frontend): correct button alignment`
  - `docs: update README`

### Pre-push Hook
- Runs all unit tests
- Runs TypeScript type checking
- Configured in `.husky/pre-push`

## 📁 Module Boundaries

### Backend Module Structure

```typescript
apps/backend/src/
├── common/              # Shared utilities, guards, decorators
│   ├── config/          # Configuration setup
│   └── logger/          # Logging setup
├── modules/             # Feature modules
│   └── health/          # Health check module
└── main.ts              # Application entry point
```

### Frontend App Structure

```typescript
apps/frontend/src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable React components
└── theme/               # Chakra UI theme configuration
```

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes and commit following conventional commits
3. Ensure tests pass: `pnpm test`
4. Ensure linting passes: `pnpm lint`
5. Ensure type checking passes: `pnpm typecheck`
6. Push and create a pull request

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [pnpm Documentation](https://pnpm.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 License

MIT License - see LICENSE file for details

## 🛟 Troubleshooting

### pnpm install fails
- Ensure you're using pnpm >= 8.9.0: `pnpm --version`
- Try clearing cache: `pnpm store prune`

### Docker containers fail to start
- Check if ports 3000, 3001, 5432, 6379, 9000, 9001 are available
- Ensure Docker daemon is running: `docker info`
- Check logs: `docker-compose logs <service-name>`

### TypeScript errors in IDE
- Restart TypeScript server in your IDE
- Ensure all packages are built: `pnpm build`
- Check `tsconfig.json` paths are correct

### Git hooks not running
- Reinstall hooks: `pnpm prepare`
- Make hooks executable: `chmod +x .husky/*`
