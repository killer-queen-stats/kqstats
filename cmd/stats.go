package main

import (
	"flag"
	"log"

	"github.com/killer-queen-stats/kqstats/internal/app/client"
	"github.com/killer-queen-stats/kqstats/internal/pkg/util"
)

func main() {
	addr := flag.String("addr", "", "local ip of the cab")
	port := flag.String("port", "12749", "port of the stats websocket")

	info := &util.ConnectionInfo{
		Addr: *addr,
		Port: *port,
	}

	orchestrator, err := client.NewOrchestrator(info)
	if err != nil {
		log.Fatalf("Error with orchestration creation: %v", err)
	}
	go orchestrator.ReadMessage()

	// Better way than waiting on a channel
	<-orchestrator.StopChan
}
