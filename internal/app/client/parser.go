package client

import (
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/johncgriffin/overflow"
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

	// Check if timestamp is first
	tsRegex := regexp.MustCompile(`[0-9]+,`)
	idxs := tsRegex.FindStringIndex(message)

	var tsString string
	var ts time.Time
	var keysAndValue string

	if idxs != nil { // Found TS first
		splitMessage := strings.SplitN(message, ",", 2)
		tsString = splitMessage[0]
		ts, err = p.convertTimestampString(tsString)
		keysAndValue = splitMessage[1]
	} else {
		ts = time.Now()
		keysAndValue = message
	}

	stat := Stat{
		RawMessage: message,
		Timestamp:  ts,
	}
	return &stat, nil
}

func (p *StatParser) validate(message string) bool {
	// Valid messages match something that looks like TS, ![k[messageType], v[message,values]]!
	messageRegex := regexp.MustCompile(`([0-9]+,)?!\[k\[[a-zA-Z]+\],v\[[^\]]+\]\]!`)
	return messageRegex.MatchString(message)
}

func (p *StatParser) convertTimestampString(tsString string) time.Time {
	i, err := strConv.ParseInt(tsString, 10, 64)
	if err != nil {
		return time.Now()
	}

	epoch := time.Date(1970, time.January, 1, 0, 0, 0, 0, time.UTC)
	_, ok := overflow.Mul64(i, int64(time.Second))
	var ts time.Time
	if !ok {
		ts = epoch.Add(i * time.Millisecond)
	} else {
		ts = epoch.Add(i * time.Second)
	}
	if ts.After(time.Now()) {
		ts = time.Now()
	}
	return ts
}
