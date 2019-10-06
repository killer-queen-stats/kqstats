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

func CreateAliveValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreatePlayerNamesValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreatePlayerKillValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateBlessMaidenValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateReserveMaidenValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateUnreserveMaidenValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateUseMaidenValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateGlanceValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateCarryFoodValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateGameStartValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateGameEndValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateVictoryValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateSpawnValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateGetOnSnailValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateGetOffSnailValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateSnailEatValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateSnailEscapeValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateBerryDepositValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
func CreateBerryKickInValues(values ...string) (map[string]interface{}, error) {
	return nil, nil
}
