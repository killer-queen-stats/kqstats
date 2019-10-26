package client

import (
	"errors"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/johncgriffin/overflow"
	"github.com/sirupsen/logrus"
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
	logrus.Infof("%v", message)

	match := p.validate(message)
	if !match {
		return nil, errors.New("Not a stat")
	}

	// Check if timestamp is first
	tsRegex := regexp.MustCompile(`^[0-9]+,`)
	idxs := tsRegex.FindStringIndex(message)

	var tsString string
	var ts time.Time
	var keysAndValue string

	if idxs != nil { // Found TS first
		splitMessage := strings.SplitN(message, ",", 2)
		tsString = splitMessage[0]
		ts = p.convertTimestampString(tsString)
		keysAndValue = splitMessage[1]
	} else {
		ts = time.Now()
		keysAndValue = message
	}

	key := StatType(p.getMessageKey(keysAndValue))
	values := p.getMessageValues(keysAndValue)

	stat, err := NewStat(message, ts, key, values...)

	if err != nil {
		return nil, err
	}
	logrus.Infof("Stat: %v", stat)

	return stat, nil
}

func (p *StatParser) validate(message string) bool {
	// Valid messages match something that looks like TS, ![k[messageType], v[message,values]]!
	messageRegex := regexp.MustCompile(`([0-9]+,)?!\[k\[[a-zA-Z: ]+\],v\[[^\]]+\]\]!`)
	return messageRegex.MatchString(message)
}

func (p *StatParser) convertTimestampString(tsString string) time.Time {
	i, err := strconv.ParseInt(tsString, 10, 64)
	if err != nil {
		return time.Now()
	}

	epoch := time.Date(1970, time.January, 1, 0, 0, 0, 0, time.UTC)
	_, ok := overflow.Mul64(i, int64(time.Second))
	var ts time.Time
	if !ok {
		ts = epoch.Add(time.Duration(i) * time.Millisecond)
	} else {
		ts = epoch.Add(time.Duration(i) * time.Second)
	}
	if ts.After(time.Now()) {
		ts = time.Now()
	}
	return ts
}

func (p *StatParser) getMessageKey(keyAndValue string) string {
	alphaRegex := regexp.MustCompile(`[^a-zA-Z]+`)
	keyRegex := regexp.MustCompile(`k\[(?P<key>[a-zA-Z: ]+)\]`)
	messageKeys := keyRegex.FindStringSubmatch(keyAndValue)
	if len(messageKeys) <= 1 {
		return ""
	}
	key := messageKeys[1]
	processedKey := alphaRegex.ReplaceAllString(key, "")
	return processedKey
}

func (p *StatParser) getMessageValues(keyAndValue string) []string {
	keyRegex := regexp.MustCompile(`v\[(?P<value>[^\]]+)\]`)
	messageValues := keyRegex.FindStringSubmatch(keyAndValue)
	if len(messageValues) <= 1 {
		return []string{}
	}
	values := strings.ToLower(messageValues[1])
	valuesList := strings.Split(values, ",")
	return valuesList
}
