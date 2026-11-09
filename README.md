# SINEM — Sistema de Pago

Desktop application for managing student payments and expenses.

---

## Project
**SINEM (Sistema de Pago)**

## Short Description
SINEM is a cross-platform desktop application designed to simplify the management of student payments and institutional expenses. Built with **Electron** and **React (Vite)**, it combines a modern, responsive user interface with a secure local database accessed through IPC. The project is optimized for offline-first usage, making it suitable for educational institutions with limited or intermittent internet access.

The application is packaged for distribution on desktop environments and focuses on reliability, usability, and maintainability.

---

## Table of Contents
- Project Overview
- Goals and Scope
- Features
- Non-Functional Characteristics
- Tech Stack
- Architecture Overview
- Quick Start
- Development Workflow
- Database
- Build & Packaging
- UI Libraries & Extras
- Project Structure
- Roadmap
- License & Contact

---

## Project Overview

**Purpose**  
To provide a simple, efficient, and reliable way to track student payments and expenses in small to medium-sized educational institutions.

**Target Audience**  
- Administrative staff
- Finance and accounting personnel
- School administrators

**Problems Addressed**  
- Manual or spreadsheet-based payment tracking
- Lack of centralized local records
- Difficulty auditing payments and expenses

---

## Goals and Scope

### In Scope
- Local management of students, payments, and expenses
- Desktop-first experience with offline capability
- Simple reporting through searchable tables

### Out of Scope (for now)
- Cloud synchronization
- Multi-tenant user management
- Online payment gateways

---

## Features

### Student Management
- Create, edit, and delete student records
- List and search students
- Maintain basic identification and enrollment data

### Payment Management
- Register student payments
- Filter and search payments by date, student, or concept
- Display payments in structured tables

### Expense Tracking
- Register institutional expenses
- Categorize expenses
- View expenses in a dedicated table for auditing

### Desktop & System Features
- Local SQLite database
- IPC-based communication between Electron main and renderer processes
- Secure access to database operations
- Packaged desktop application for Windows (and extensible to macOS/Linux)

---

## Non-Functional Characteristics

- **Performance**: Optimized for local database operations
- **Usability**: Clean UI with accessible components
- **Maintainability**: Modular structure and clear separation of concerns
- **Security**: No direct DB access from the renderer process

---

## Tech Stack

### Frontend
- React
- Vite

### Desktop Shell
- Electron

### Database & IPC
- SQLite (via `better-sqlite3`)
- IPC communication through Electron preload scripts

### Tooling & Packaging
- Electron Forge
- electron-builder
- Node.js

---

## Architecture Overview

The application follows Electron best practices:

- **Main Process**: Handles application lifecycle and database access
- **Preload Script**: Exposes a controlled API via IPC
- **Renderer Process**: React-based UI consuming IPC APIs

This design ensures that sensitive operations remain isolated from the UI layer.

---

## Quick Start

### Prerequisites
- Node.js 20.19
- npm 10.8.2
- Electron 39.2.5
- Electron Forge 7.10.2

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Create the Project (Optional)

If you need a fresh Electron + Vite template:

```bash
npx create-electron-app --template=vite
```

### Add React Support

```bash
npm install react react-dom
npm install @vitejs/plugin-react
```

### Run in Development Mode

```bash
npm start
```

---

## Tests

The project uses **Vitest** as the test runner, with **@testing-library/react** for UI component tests.

### Run all tests

```bash
npx vitest run
```

### Run in watch mode

```bash
npx vitest
```

### Run a specific test file

```bash
npx vitest run src/domain/db/AppDB.test.js
```

### Run tests matching a name

```bash
npx vitest run -t "getAllPayments"
```

### Run with coverage report

```bash
npx vitest run --coverage
```

### Test Structure

Tests are split into two environments:

| Environment | Location | Tests |
|---|---|---|
| **Node.js** | `src/domain/**/*.test.js` | Backend logic: database CRUD, Excel generation, IPC handlers, validation |
| **jsdom** | `src/ui/**/*.test.{js,jsx}` | React components, hooks, pages |

Each frontend test file requires a `// @vitest-environment jsdom` comment at the top.

### Troubleshooting: `better-sqlite3` ABI mismatch (`NODE_MODULE_VERSION`)

`better-sqlite3` is a **native module**: its binary (`better_sqlite3.node`) is compiled for one specific runtime ABI at a time. Electron ships its own Node.js build whose ABI differs from your system Node.js, so the module can only be built for **either** Electron **or** system Node — not both simultaneously.

If you try to run the tests while the module was last compiled for Electron (e.g. right after running the app or packaging it), both database test suites fail to load with an error like:

```
Error: The module '...\node_modules\better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 140. This version of Node.js requires
NODE_MODULE_VERSION 141. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

Symptoms:
- `src/domain/db/AppDB.test.js` and `src/domain/db/db.test.js` fail (or show all their tests as *skipped*)
- Every other suite keeps passing

#### Fix: rebuild for system Node before testing

```bash
npm rebuild better-sqlite3
npx vitest run src/domain/db/AppDB.test.js src/domain/db/db.test.js   # confirm they load again
```
Then
```bash
npm install better-sqlite3
```

#### Running the app afterwards

Nothing manual is needed: `npm start` (Electron Forge) automatically re-rebuilds native dependencies against Electron's ABI, so the two workflows coexist. Just remember to run `npm rebuild better-sqlite3` again **before** executing tests if you ran the app in between.

| Workflow | Required module build |
|---|---|
| `npx vitest` / `npm test` | Built for **system Node** → `npm rebuild better-sqlite3` |
| `npm start` / `npm run package` | Built for **Electron** → `npm run rebuild` |

If the app prints `NODE_MODULE_VERSION` errors on startup and you haven't rebuilt recently, run:

```bash
npm run rebuild
```

It rebuilds `better-sqlite3` (and any other native deps) against the exact Electron ABI shipped in `package.json`. This normally happens automatically through Forge, but the explicit command is the safe fallback. After rebuilding, run tests with `npm rebuild better-sqlite3` again.

### Current Coverage

- **Statements**: 59%
- **Lines**: 59%
- **Test files**: 55
- **Total tests**: 756

Key areas covered: database CRUD (AppDB class), foreign-key enforcement and orphan repair, IPC handler registration, Excel export/report generation, validation logic, React hooks, generic UI components, and page-level rendering.

---

## Development Workflow

- Run the application in development mode
- Make UI changes in the renderer process
- Update IPC handlers and database logic in the main process
- Restart Electron when modifying preload or main scripts

---

## Database

SINEM uses a **local SQLite database** for persistence.

### Install SQLite Driver

```bash
npm install better-sqlite3
```

### Database Location
- Stored locally on the user’s machine
- Accessed only through IPC handlers in `src/domain/db`

The database stores student, payment, and expense data and is accessed through IPC handlers defined in `src/domain/db`, ensuring that the renderer process never touches the database directly. On disk it lives at `C:\Users\{username}\AppData\Roaming\sinem\sinem.sqlite` on Windows, and `~/Library/Application Support/SINEM/database.sqlite` on macOS.

**Foreign keys**: the schema declares `ON DELETE CASCADE` / `ON DELETE SET NULL` rules (e.g. deleting a student deletes their payment history). These are enforced via `PRAGMA foreign_keys = ON`, enabled at startup after a one-time orphan-row repair pass (`AppDB.repairOrphanedRows`) that cleans up rows created while enforcement was off in older versions.

### Schema Migrations

The SQLite file intentionally survives uninstall/reinstall so institutional data is never lost. That means schema changes cannot rely on `CREATE TABLE IF NOT EXISTS` alone — an existing database would keep its old shape forever. SINEM solves this with a versioned migration system in `src/domain/db/db.js`:

- The database records its schema version via `PRAGMA user_version`.
- On every startup, `AppDB.runMigrations()` compares that version against the `MIGRATIONS` registry and applies any missing migrations **in order, each inside a transaction together with its version stamp**. A failed migration aborts startup loudly instead of corrupting data.
- Databases created before this system existed (tables present, `user_version = 0`) are detected automatically ("legacy mode") and stamped at version 1 without re-running the initial DDL.
- Data is preserved across upgrades: migrations should evolve the schema (`ALTER TABLE`, new indexes, backfills), never drop user tables.

#### Do migrations lose existing data?

No — **migrations change structure (columns/tables/indexes), not rows**. All existing data survives a schema change; only specific operations touch row content:

| Change type | What happens to existing rows |
|---|---|
| Add a column | Nothing lost — old rows just have NULL/default in the new column |
| Rename table or column | Nothing lost |
| Change a column's type/constraints | Needs the rebuild pattern (`INSERT INTO new SELECT * FROM old`) — data carries over because you copy it explicitly |
| Drop a column | That column's values are gone; the rest of the row stays |
| Drop a table | That table's data is gone — only do this deliberately |

Real example — adding a discount field for students:

```js
{
    version: 2,
    name: 'student_discount',
    up: (db) => db.exec(`ALTER TABLE students ADD COLUMN discount REAL NOT NULL DEFAULT 0;`),
}
```

Every existing student keeps their name, phone and payment history; they all simply start with `discount = 0`.

Two built-in safety layers:

1. **Transactional**: each migration runs atomically together with its version stamp. If it fails halfway, SQLite rolls back completely — no half-migrated state, no partial data loss.
2. **Nothing auto-deletes on schema change**: the only automatic row cleanup in the app is `repairOrphanedRows()` (payments of deleted students), which is the chosen CASCADE behavior — unrelated to migrations.

The one rule that protects this guarantee: **never edit an already-shipped migration**. Editing v1 after users have it would make their version stamp lie about the actual shape of their database.

#### How to add a schema change

Append one entry to the `MIGRATIONS` array with the next version number:

```js
const MIGRATIONS = [
    {
        version: 1,
        name: 'initial_schema',
        up: (db) => buildInitialSchema(db),
    },
    {
        version: 2,
        name: 'add_invoice_notes',
        up: (db) => {
            db.exec(`ALTER TABLE payments ADD COLUMN notes TEXT;`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_payments_date ON payments (date);`);
        },
    },
];
```

Rules of thumb:
- Never edit an already-shipped migration; always add a new version.
- Keep each migration small and self-contained; it must leave the DB valid if run alone on top of the previous version.
- SQLite's `ALTER TABLE` is limited (no drop/rename column on old files without table rebuild) — for those cases create the new table, copy data (`INSERT INTO ... SELECT`), drop the old one, rename.
- Add a test in `AppDB.test.js` covering the upgrade path (the existing "Migrations" suite shows fresh-boot, legacy-stamp, reopen-idempotency and from-scratch rebuild patterns).

---

## Excel

ExcelJS was used for basic excel files.

```bash
npm install exceljs
```
Sadly, this library lack support for pivot tables as well. So, for advanced Excel operations such as pivot tables, a Go module is used. See the [Go-Excel Module](src/domain/excel/go-excel/README.md) documentation.

## Build & Packaging

### Install electron-builder

```bash
npm install --save-dev electron-builder
```

### Build the Application

```bash
npm run build
```

### Package the Application

```bash
npm run package
# or
npm run make
```

### Configuration Files
- `electron-builder.json`
- `forge.config.js`

These files control installer formats, icons, and platform-specific settings.

---

## UI Libraries & Extras

The UI is built using modern, accessible component libraries:

```bash
npm install @radix-ui/react-select \
            @radix-ui/colors \
            @radix-ui/react-icons \
            @radix-ui/react-popover \
            @radix-ui/react-dropdown-menu \
            @ariakit/react \
            react-day-picker \
            match-sorter
```

These libraries provide accessible interactions only. **Styling is intentionally plain CSS** (one stylesheet per component, plus shared design tokens via `@radix-ui/colors`) — no CSS framework or utility library such as Tailwind is used, to keep the packaged executable as small and simple as possible. This is a project requirement.

---

## Project Structure

```text
src/
├── main.js          # Electron main process
├── preload.js       # IPC bridge
├── renderer.jsx     # React entry point
├── App.jsx          # Main React component
├── domain/
│   ├── db/          # Database class (AppDB), validation
│   ├── excel/       # ExcelJS exports + Go pivot-table module
│   └── ipchandler/  # IPC channel registration
├── test/            # Shared test setup and mocks
└── ui/
    ├── assets/
    ├── components/
    │   └── generic/ # Reusable primitives: table cells, pagination,
    │                 # modal, messages, selects, date picker...
    ├── constant/    # DBFunctions IPC wrappers, page enum, shared constants
    ├── hooks/       # useForm, useTableControls, useResizableTable,
    │                # usePaymentsData, usePaymentFilters, ...
    └── pages/
```

---

## Technical Debt

- SQLite's `ALTER TABLE` limits make some future migrations verbose (table-rebuild pattern) — acceptable, documented in the migrations section
- Error handling for database operations is centralized but could be more granular per operation
- UI coverage relies on page-level tests; the four feature tables have no direct unit tests of their own

---

## License & Contact

- Add license details in a `LICENSE` file
- For questions, feature requests, or bug reports, open an issue or contact the maintainer