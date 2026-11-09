# Phase 0 — Test Baseline

Recorded: 2026-08-25

## Post-refactor baseline (SOLID + maintainability refactor, 2026-10-20)

The numbers below are the current regression bar — this table supersedes
the original one for "must not drop" checks.

| Metric | Value |
|---|---|
| Test files | **64 / 64 passed** |
| Tests | **772 / 772 passed**, 0 skipped |
| Statements | **60.64 %** (1701/2805) |
| Branches | **36.18 %** (486/1343) |
| Functions | **54.20 %** (470/867) |
| Lines | **60.46 %** (1571/2598) |
| ESLint | **0 errors, 0 warnings** (`npm run lint`, unused vars = error) |

Domain notes:
- `domain/db` is split per repository; its tests live in
  `repositories/*.repository.test.js` + `createDb.test.js` (electron-free,
  injected dbPath).
- `npm start` currently fails at Electron Forge's "Checking package
  manager version" step under Node 25 / npm 11 (environmental — forge
  exits before loading any app code). Until fixed, main+preload can be
  compile-verified with a lib-mode `vite build` (CJS, electron external)
  and channel parity checked between the two bundles.

## Original baseline (2026-08-25)

## Environment

| Tool | Version |
|---|---|
| Node.js | v25.2.1 |
| npm | 11.6.2 |
| Vitest | 4.1.7 (v8 coverage) |

## Results (`npm run test:coverage`)

| Metric | Value |
|---|---|
| Test files | **55 / 55 passed** |
| Tests | **751 / 751 passed**, 0 skipped |
| Duration | ~37 s |

## Coverage (regression bar — must not drop)

| Metric | Baseline |
|---|---|
| Statements | **51.51 %** (1648/3199) |
| Branches | 29.75 % (474/1593) |
| Functions | 46.59 % (438/940) |
| Lines | **52.13 %** (1574/3019) |

## Key per-file numbers relevant to upcoming phases

- `domain/db/db.js` — 90.54 % stmts (strong safety net for Phase 1)
- `domain/excel/excel.js` — 72.58 % stmts
- `domain/excel/reports.js` — 100 % stmts
- `domain/excel/payments.js` — **8.69 %** stmts (weakest domain file)
- All four mega-tables (`PaymentsTable`, `StudentsTable`, `ExpensesTable`, `TeachersTable`) — **0 % direct coverage**; covered only indirectly through page tests. Phase 3 refactor must preserve page-test DOM expectations.
- Page tests sit at 23–86 % per page.

## Environment caveat

`better-sqlite3` is a native module compiled against one ABI at a time:

- **Running tests** requires it built for system Node. If DB suites fail with
  `NODE_MODULE_VERSION` mismatch → `npm rebuild better-sqlite3`.
- **Running the app** (`npm start`) makes Electron Forge re-rebuild it for
  Electron automatically, so both workflows coexist.
