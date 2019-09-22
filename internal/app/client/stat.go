package client

import "time"

// StatType is a string enum that we'll use to create the different
type StatType string

// Declare all stat types below
const (
	Alive StatType = "alive"
)

// Stat is a construct that envelopes everything that's spat out by the parser
type Stat struct {
	RawMessage string                 `json:rawMessage`
	StatType   StatType               `json:statType`
	Timestamp  time.Time              `json:timestamp`
	Payload    map[string]interface{} `json:payload`
}
