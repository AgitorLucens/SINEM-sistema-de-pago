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
            npm install match-sorter
```

These libraries provide consistent styling and accessible interactions.

---

## Project Structure

```text
src/
├── main.js          # Electron main process
├── preload.js       # IPC bridge
├── renderer.jsx     # React entry point
├── App.jsx          # Main React component
├── domain/
│   └── db/          # Database and IPC handlers
│   └── excel/
│   └── ipchandler/
└── ui/              # Pages, components, and UI assets
     └── assets
     └── components
     └── constant
     └── pages  
```

---

## Roadmap

- Basic reporting and summaries
- Export data to CSV/PDF
- Role-based access control
- Optional cloud sync

---

## License & Contact

- Add license details in a `LICENSE` file
- For questions, feature requests, or bug reports, open an issue or contact the maintainer