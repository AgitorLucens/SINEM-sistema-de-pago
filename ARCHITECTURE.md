# SINEM — Architecture

Desktop app (Electron + React) for managing payments of a music school.
This document is the map for maintainers. If code and this file disagree,
fix the code or fix this file — never let them drift.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│ RENDERER (React, src/ui)                                    │
│   pages/components  →  hooks  →  DBFunctions.jsx (wrappers)  │
│   The ONLY bridge: window.api.*  (exposed by src/preload.js)│
├─────────────────────────────────────────────────────────────┤
│ PRELOAD (src/preload.js)                                    │
│   Namespaced window.api; channel strings come from           │
│   src/ipc/channels.js — never written inline                 │
├─────────────────────────────────────────────────────────────┤
│ MAIN PROCESS (src/main.js = composition root)               │
│   createDb()  →  setUpHandlers(db, excel)                   │
│                                                              │
│   IPC layer (src/domain/ipchandler/)                        │
│     handle.js: uniform error boundary                        │
│     *Handlers.js: one registrar per page, channel constants  │
│                                                              │
│   Persistence (src/domain/db/)                               │
│     index.js: createDb() — repo bundle, the ONLY entry      │
│     connection.js: open/pragmas (electron-free)              │
│     schema.js: DDL, migrations, startup repair (electron-free)│
│     defaultDbPath.js: the ONLY electron import in this layer │
│     repositories/: one module per aggregate                 │
│                                                              │
│   Excel (src/domain/excel/)                                 │
│     excel.js: AppExcel facade                                │
│     sheets.js: shared sheet builders (used by all exports)  │
│     externalGenerator.js: the ONLY child_process usage       │
└─────────────────────────────────────────────────────────────┘
```

## Invariants (break these and the architecture decays)

1. **The renderer never touches SQL or electron.** It calls
   `DBFunctions.jsx` wrappers, which call `window.api.*`.
2. **Channel names exist only in `src/ipc/channels.js`.** Preload and the
   registrars both import them; hand-synced strings are how silent
   IPC bugs are born.
3. **`domain/` imports electron in exactly two files:**
   `src/domain/db/defaultDbPath.js` and the excel modules' dialog usage
   (`utils.js`, `externalGenerator.js`). Everything else is
   framework-free and unit-testable without electron mocks.
4. **Domain code signals failure by throwing.** The `handle()` boundary
   (`src/domain/ipchandler/handle.js`) logs and rethrows; the renderer's
   wrappers catch rejected promises and fall back. Writes return
   `{ success, ... }`, reads return data.
5. **Better-sqlite3 handles are created only by `createDb()`** (via
   `connection.js`). Repositories receive the handle; they never open one.
6. **Dynamic UPDATEs go through `validate.js` whitelists** — the SET
   clause is built from request data, so the whitelist IS the security
   boundary.

## Adding a feature (the 4-step recipe)

Example: a new read operation "get active students per division".

1. **Repository** — add the method to the matching file in
   `src/domain/db/repositories/` (factory returns it; SQL lives here).
2. **Registrar** — add one `handle(ipcMain, CHANNELS.x.y, ...)` line in
   the page's `src/domain/ipchandler/xHandlers.js`.
3. **Channel** — add the entry to `src/ipc/channels.js` under the right
   namespace (value format `'<namespace>:<action>'`).
4. **Renderer** — add a wrapper in `src/ui/constant/DBFunctions.jsx`
   (try/catch + fallback) and consume it from your page/hook.

A new DB **table or column** additionally needs a migration: append one
versioned entry to `MIGRATIONS` in `src/domain/db/schema.js`. Existing
databases apply it on next launch inside a transaction that stamps
`PRAGMA user_version`. Never edit an already-released migration.

## Where tests live

- `src/domain/db/repositories/*.repository.test.js` — one file per
  repository. Each creates its own database via
  `createDb({ dbPath: <temp dir> })`. No electron mocking needed.
- `src/domain/db/createDb.test.js` — connection pragmas, FK enforcement,
  startup repair, migration chain.
- `src/ui/**/*.test.jsx` — page/component tests stub `window.api`
  inline with the namespaced shape (see `Payments.test.jsx` for the
  pattern).
- `src/test/mocks/dbMock.js` — creates a throwaway database using the
  REAL schema (`schema.js`), for tests that need actual SQL.

## Conventions worth keeping

- IPC: `handle()` wrapper for every channel — never raw `ipcMain.handle`.
- Repositories are plain object factories (closures over `db`) — no
  classes, no `this`, trivially destructurable.
- Excel: anything writing a workbook goes through `sheets.js` builders
  and `saveWorkbook` (`utils.js`); only `externalGenerator.js` may spawn
  the Go binary.
- Naming: channel constants mirror `window.api` method names; UI wrappers
  mirror repository method names.

## Environment caveat (better-sqlite3 ABI)

`better-sqlite3` is a native module compiled against one ABI at a time:

- **Running tests** requires it built for system Node. If DB suites fail
  with `NODE_MODULE_VERSION` mismatch → `npm rebuild better-sqlite3`.
- **Running the app** (`npm start`) makes Electron Forge re-rebuild it
  for Electron automatically, so both workflows coexist.

See `TEST-BASELINE.md` for the regression bar (tests + coverage).

## Linting

`npm run lint` (ESLint flat config in `eslint.config.js`). Scope rules
are per runtime: main process, preload, renderer (browser + JSX), tests.
A new module must arrive lint-clean; the warning backlog is tracked, not
allowed to grow.
