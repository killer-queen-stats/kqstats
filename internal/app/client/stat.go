package client

import "time"

// StatType is a string enum that we'll use to create the different
type StatType string

// Declare all stat types below
const (
	Alive           StatType = "alive"
	PlayerNames     StatType = "playernames"
	PlayerKill      StatType = "playerKill"
	BlessMaiden     StatType = "blessMaiden"
	ReserveMaiden   StatType = "reserveMaiden"
	UnreserveMaiden StatType = "unreserveMaiden"
	UseMaiden       StatType = "useMaiden"
	Glance          StatType = "glance"
	CarryFood       StatType = "carryFood"
	GameStart       StatType = "gamestart"
	GameEnd         StatType = "gameend"
	Victory         StatType = "victory"
	Spawn           StatType = "spawn"
	GetOnSnail      StatType = "getOnSnail"
	GetOffSnail     StatType = "getOffSnail"
	SnailEat        StatType = "snailEat"
	SnailEscape     StatType = "snailEscape"
	BerryDeposit    StatType = "berryDeposit"
	BerryKickIn     StatType = "berryKickIn"
)

// Stat is a construct that envelopes everything that's spat out by the parser
type Stat struct {
	RawMessage string                 `json:"rawMessage"`
	StatType   StatType               `json:"statType"`
	Timestamp  time.Time              `json:"timestamp"`
	Payload    map[string]interface{} `json:"payload"`
}
