# Backend template

Reusable TypeScript, Express and PostgreSQL backend with Prisma. Business modules
and database models are intentionally empty.

## Structure

```text
prisma/
  schema.prisma       # Prisma generator and PostgreSQL datasource
  models/             # Add feature models here
  migrations/         # Migrations for the new project's models
src/
  app.ts              # Express middleware and route registration
  server.ts           # HTTP server and graceful shutdown
  config/             # Environment, Prisma and Cloudinary configuration
  errors/             # Shared application errors
  health/             # Infrastructure liveness and database readiness checks
  middlewares/        # Error handling, validation, uploads and 404 handling
  modules/            # Empty starting point for business features
  routes/             # Central API router
  utils/              # Responses, logging, pagination, sorting and uploads
  generated/prisma/   # Generated client; not committed
tests/                # Shared utility tests
```

## Start a new project

Run these commands from `backend/`:

```sh
npm ci
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your PostgreSQL database, then run:

```sh
npm run db:generate
npm run dev
```

The template has no application tables or sample migrations. Generating the
client does not create tables. Cloudinary credentials are only needed when
importing and using the image upload helpers.

## Add a feature

Create `src/modules/<feature>/` with route, controller, service and validation
files as needed. Register its router in `src/routes/index.ts`; routes are mounted
under `/api/v1`.

Add models to `prisma/models/<feature>.prisma`, then run against your development
database:

```sh
npm run db:migrate -- --name init
npm run db:generate
```

Use a descriptive migration name for subsequent changes. Commit the schema and
generated migration files. For deployment, apply committed migrations with
`npm run db:deploy`.

The former Customer, Hotel, Room and Booking sample models and initial migration
have been removed from the template. This does not change an existing database;
start new projects with their own database and migration history.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with reload |
| `npm test` | Shared utility tests, without a database connection |
| `npm run typecheck` | TypeScript validation after client generation |
| `npm run db:validate` | Validate Prisma schema |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate -- --name <name>` | Create and apply development migrations |
| `npm run db:deploy` | Apply committed migrations |
| `npm run build` | Generate client and compile TypeScript |
| `npm start` | Start compiled server |

## Health endpoints

- `GET /api/v1/health/live`: HTTP server liveness.
- `GET /api/v1/health/ready`: database readiness; returns `503` if unavailable.

Health checks are infrastructure, so they live outside the business modules.
