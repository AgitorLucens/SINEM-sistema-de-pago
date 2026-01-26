APP_NAME=excel-generator
CMD_DIR=main.go
DIST_DIR=release-builds
GO_MOD_FILE:=go.mod
MODULE_NAME:=main.go

GOOS=windows
GOARCH=amd64

LDFLAGS=-s -w

.PHONY: all build clean run init

all: build

init: go.mod
	@echo "Go module ready"

go.mod:
	@echo "Initializing Go module..."
	@go mod init $(MODULE_NAME)
	@go get github.com/xuri/excelize/v2
	@go mod tidy

build:
	@echo Building $(APP_NAME)...
	@mkdir -p $(DIST_DIR)
	GOOS=$(GOOS) GOARCH=$(GOARCH) \
	go build -ldflags "$(LDFLAGS)" \
	-o $(DIST_DIR)/$(APP_NAME).exe \
	./$(CMD_DIR)

run:
	go run ./$(CMD_DIR)

