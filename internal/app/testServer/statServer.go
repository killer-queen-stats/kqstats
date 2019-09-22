package server

import (
	"bufio"
	"errors"
	"log"
	"os"
	"time"

	"github.com/sirupsen/logrus"
)

// StatServer is a test server that opens a stat file
// and streams the messages across a websocket
// Will loop the messages
type StatServer struct {
	FileName  string
	statQueue []string
	counter   int
	StatChan  chan string
	stopChan  chan interface{}
}

// NewStatServer creates a new statserver and loads all the
// recorded stats into the statsqueue
func NewStatServer(fileName string) *StatServer {
	statServer := &StatServer{
		FileName:  fileName,
		statQueue: []string{},
		counter:   0,
		StatChan:  make(chan string, 100),
		stopChan:  make(chan interface{}, 1),
	}

	err := statServer.loadMessages()
	if err != nil {
		log.Fatalf("Could not load messages: %v", err)
	}
	return statServer
}

// Serve begins to stuff the Stat Channel with
// Messages from the files
func (s *StatServer) Serve() <-chan string {
	go s.serve()
	return s.StatChan
}

// Stop stops the statserver
func (s *StatServer) Stop() {
	s.stopChan <- true
}

func (s *StatServer) serve() {
	for {
		select {
		case <-s.stopChan:
			logrus.Infof("Stopping Stat Server")
			break
		default:
			stat, err := s.getNextMessage()
			if err != nil {
				logrus.Errorf("Stat Server ran into an error %v", err)
				break
			}
			s.StatChan <- stat
			time.Sleep(1 * time.Second)
		}

	}
}

func (s *StatServer) loadMessages() error {
	f, err := os.Open(s.FileName)
	if err != nil {
		return err
	}

	defer f.Close()
	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		s.statQueue = append(s.statQueue, scanner.Text())
	}
	return nil
}

func (s *StatServer) getNextMessage() (string, error) {
	if len(s.statQueue) == 0 {
		return "", errors.New("Stat Queue is empty")
	}

	message := s.statQueue[s.counter]
	// Could be safter by resetting to 0 explicitly but this looks cleaner
	s.counter = (s.counter + 1) % len(s.statQueue)
	return message, nil
}
