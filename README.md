# Reusable Backend Template

নতুন backend project শুরু করার সময় একই configuration ও utility বারবার লিখতে না হয়—সেই উদ্দেশ্যে এই template। Clone করে PostgreSQL connection সেট করবে, তারপর নিজের business features যোগ করবে।

**Stack:** TypeScript · Express 5 · Prisma 7 · PostgreSQL · Multer · Cloudinary

Business module ও database model ইচ্ছাকৃতভাবে খালি। Health checks এবং common backend utilities প্রস্তুত আছে।

📖 **[সম্পূর্ণ ব্যবহার নির্দেশিকা — setup, commands, reusable helpers ও feature examples](docs/backend-guide.bn.md)**

## দ্রুত শুরু

আগে PostgreSQL চালু করে নিজের development database তৈরি করো। বিস্তারিত ধাপ guide-এ আছে। Repository clone করার পরে `backend/` থেকে:

```sh
npm ci
```

প্রথমবার `.env.example` কপি করে `.env` তৈরি করো; আগে থেকেই `.env` থাকলে overwrite করবে না:

```sh
cp .env.example .env
```

`.env`-এ নিজের database URL বসাও:

```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"
```

তারপর:

```sh
npm run db:generate
npm run dev
```

Connection যাচাই:

```sh
curl -i http://localhost:5000/api/v1/health/ready
```

`200` ও `database: "up"` মানে database query সফল। Empty template চালাতে application table দরকার নেই; model যোগ করার পরে migration চালাবে।

## Folder structure

```text
backend/
├── docs/                   # বিস্তারিত ব্যবহার নির্দেশিকা
├── prisma/
│   ├── schema.prisma       # Generator ও PostgreSQL datasource
│   ├── models/             # নিজের database models যোগ করবে
│   └── migrations/         # নতুন project-এর migration history
├── src/
│   ├── config/             # Environment, Prisma, Cloudinary
│   ├── errors/             # AppError
│   ├── health/             # Liveness ও database readiness
│   ├── middlewares/        # Validation, upload, errors, 404
│   ├── modules/            # নিজের business features; এখন খালি
│   ├── routes/             # Feature routers নিবন্ধন
│   ├── utils/              # Reusable helpers
│   ├── generated/prisma/   # db:generate তৈরি করে; Git-এ নেই
│   ├── app.ts              # Express application
│   └── server.ts           # Server lifecycle ও shutdown
├── tests/                  # Shared utility tests
├── .env.example            # Environment template
├── prisma7.config.ts       # Prisma CLI configuration
└── package.json            # Dependencies ও commands
```

## কী কী reuse করা যাবে

| অংশ | কাজ |
| --- | --- |
| Environment validation | Database URL, port, environment ও Cloudinary settings যাচাই |
| Prisma connection | Shared PostgreSQL client |
| `sendResponse` | Consistent JSON response |
| `AppError`, error middleware | HTTP errors ও পরিচিত Prisma/Multer errors handle |
| `catchAsync` | Async controller error middleware-এ পাঠায় |
| `validateRequest` | নিজের validator route-এ ব্যবহার |
| Pagination, sorting, filters | List endpoint-এর query parsing ও validation |
| Upload middleware | Multipart image গ্রহণ, size/count limits |
| Image helpers | Cloudinary upload, delete ও failed batch cleanup |
| Logger | JSON logs |
| Health checks | Server ও database availability |
| Graceful shutdown | HTTP server বন্ধ ও database disconnect |

প্রতিটির usage example ও সীমাবদ্ধতা [বিস্তারিত guide-এ](docs/backend-guide.bn.md) দেওয়া আছে।

## Commands

সব command `backend/` থেকে চালাবে।

| Command | কাজ |
| --- | --- |
| `npm ci` | Lockfile অনুযায়ী dependencies install |
| `npm run db:validate` | Prisma schema/config validate; live connection test নয় |
| `npm run db:generate` | Schema থেকে TypeScript Prisma client তৈরি; table তৈরি করে না |
| `npm run db:migrate -- --name <name>` | Development migration তৈরি ও database-এ apply |
| `npm run db:deploy` | Committed pending migrations deployment database-এ apply |
| `npm run dev` | Development server ও reload |
| `npm run typecheck` | TypeScript check; আগে client generate থাকতে হবে |
| `npm test` | Shared query-filter tests; database connection লাগে না |
| `npm run build` | Client generate ও TypeScript compile করে `dist/` তৈরি |
| `npm start` | Compiled server চালায়; আগে build করতে হবে |

## Available endpoints

| Endpoint | কাজ |
| --- | --- |
| `GET /` | Server message |
| `GET /api/v1/health/live` | HTTP server response দিতে পারছে কিনা |
| `GET /api/v1/health/ready` | Database query; সফল হলে `200`, unavailable হলে `503` |

## নতুন feature ও deployment

নিজের feature রাখবে `src/modules/<feature>/`-এ, model রাখবে `prisma/models/`-এ এবং router যুক্ত করবে `src/routes/index.ts`-এ। [পূর্ণ উদাহরণ দেখো](docs/backend-guide.bn.md#নতুন-feature-যোগ-করা)।

Authentication, authorization, CORS configuration, rate limiting, security headers এবং business features এখনো অন্তর্ভুক্ত নেই। Upload helpers আছে, upload endpoint তৈরি করা হয়নি। Project অনুযায়ী এসব যোগ করবে।

পুরোনো Customer/Hotel/Room/Booking sample models ও sample migration সরানো হয়েছে। এতে আগে ব্যবহৃত database-এর tables মুছে যায়নি; নতুন project-এর জন্য আলাদা database ব্যবহার করো।
