package client

import (
	"github.com/gorilla/websocket"
	"github.com/killer-queen-stats/kqstats/internal/pkg/util"
)

// Orchestrator connects to the websocket and takes a list of the different channels to broadcast on
// Orchestrator steps: receive message -> parse message (transform to JSON) -> broadcast message
type Orchestrator struct {
	conn *websocket.Conn
	// TODO: Channel []*Plugin
	// TODO: Parser *MessageParser
}

// NewOrchestrator returns an error
func NewOrchestrator(info *util.ConnectionInfo) (*Orchestrator, error) {
	conn, err := util.Connect(info)

	if err != nil {
		return nil, err
	}
	orchestrator := &Orchestrator{
		conn: conn,
	}
	return orchestrator, nil
}
