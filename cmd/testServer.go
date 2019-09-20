package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
	server "github.com/killer-queen-stats/kqstats/internal/app/testServer"
	"github.com/sirupsen/logrus"
)

var wsport = "12749"
var upgrader = websocket.Upgrader{}

// MessageHandler handles upgrading the connection
func MessageHandler(rw http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(rw, r, nil)
	if err != nil {
		logrus.Errorf("Could not upgrade the connection %v", err)
		return
	}
	defer c.Close()
	statServer := server.NewStatServer( /*TODO: IMPORT LOGS*/ )
	statChan := statServer.Serve()

	for {
		m := <-statChan
		logrus.Infof("%v", m)
		err := c.WriteMessage(websocket.TextMessage, []byte(m))
		if err != nil {
			logrus.Infof("Lost connection %v. Terminating connection", err)
			statServer.Stop()
			break
		}
	}
}

// StatusHandler returns an ok message
func StatusHandler(rw http.ResponseWriter, r *http.Request) {
	rw.Write([]byte("Ok"))
}

func main() {
	http.HandleFunc("/", MessageHandler)
	http.HandleFunc("/status", StatusHandler)

	host := net.JoinHostPort("localhost", wsport)
	log.Fatal(http.ListenAndServe(host, nil))
}
