package client

import (
	"errors"
	"regexp"
	"strings"
)

// StatParser is a struct that will turn stat messages into JSON blobs
type StatParser struct{}

// NewStatParser returns a pointer to a StatParser
func NewStatParser() *StatParser {
	statParser := &StatParser{}
	return statParser
}

// Parse takes a string and returns a message
func (p *StatParser) Parse(message string) (*Stat, error) {
	if !p.validate(message) {
		return nil, errors.New("Not a stat")
	}

	// If we run into an error here, it wasn't valid anyway
	splitMessage := strings.SplitN(message, ",", 2)
	messageType := splitMessage[0]
	keysAndValue := splitMessage[1]

	stat := Stat{
		RawMessage: message,
		StatType:   messageType,
	}
	return &stat, nil
}

func (p *StatParser) validate(message string) bool {
	// Valid messages match something that looks like TS, ![k[messageType], v[message,values]]!
	messageRegex := regexp.MustCompile(`[0-9]{10,13},!\[k\[[a-zA-Z]+\],v\[[^\]]+\]\]!`)
	return messageRegex.MatchString(message)
}
