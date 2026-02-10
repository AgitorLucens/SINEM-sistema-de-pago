
# Go-Excel Module

## Overview

This module uses Go to generate advanced Excel reports with pivot tables, leveraging the Excelize library. Due to limitations in JavaScript-based libraries, Go was selected to handle the data processing requirements that the client specified, specifically the report that includes a pivot table with filters. The Go executable is compiled and invoked from the Electron application through IPC (Inter-Process Communication) handlers.

## Prerequisites

Go must be installed on your system. Download and install it from the [official Go installation page](https://go.dev/doc/install).

## Setup

### Initialize the Project

Run the following command to initialize the Go module and install dependencies inside the `go-excel` directory:

```bash
make init
```

This command creates the `go.mod` file and downloads all required dependencies.

### Build the Executable

Build the project using:

```bash
make build
```

After building, move the generated executable to the `/assets` folder in the main Electron project to enable Excel export functionality.

