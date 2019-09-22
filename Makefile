build:
	go build -o stats cmd/stats.go

build-test-server:
	go build -o testServer cmd/testServer.go

build-all: build build-test-server
