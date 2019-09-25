package client

import (
	"github.com/gorilla/websocket"
	"github.com/killer-queen-stats/kqstats/internal/pkg/util"
	"github.com/sirupsen/logrus"
)

// Orchestrator connects to the websocket and takes a list of the different channels to broadcast on
// Orchestrator steps: receive message -> parse message (transform to JSON) -> broadcast message
type Orchestrator struct {
	conn     *websocket.Conn
	StopChan chan interface{}
	Parser   *StatParser
	// TODO: Channel []*Plugin: These channels do something with the raw message after it's parsed
}

// Plugin is an interface that all additional channels will need to implement
type Plugin interface {
	Validate(map[string]interface{}) bool
}

// NewOrchestrator returns an error
func NewOrchestrator(info *util.ConnectionInfo) (*Orchestrator, error) {
	conn, err := util.Connect(info)

	if err != nil {
		return nil, err
	}
	orchestrator := &Orchestrator{
		conn:     conn,
		StopChan: make(chan interface{}, 1),
		Parser:   NewStatParser(),
	}
	return orchestrator, nil
}

// ReadMessage reads messages from the websocket
func (o *Orchestrator) ReadMessage() {
	for {
		select {
		case <-o.StopChan:
			logrus.Infof("Shutting down")
			return
		default:
			_, message, err := o.conn.ReadMessage()
			if err != nil {
				// Close the connection and break
				o.conn.Close()
				o.Stop()
			}
			// TODO: Move this to stdout plugin
			//logrus.Infof("%v", string(message))
			o.Parser.Parse(string(message))
		}
	}
}

// Stop will kill the orchestrator
func (o *Orchestrator) Stop() {
	o.StopChan <- true
}
