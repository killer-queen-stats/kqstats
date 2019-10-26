package client

import (
	"fmt"
	"strconv"
	"time"

	"github.com/killer-queen-stats/kqstats/internal/pkg/util"
	"github.com/sirupsen/logrus"
)

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
	Type       StatType               `json:"statType"`
	Timestamp  time.Time              `json:"timestamp"`
	Payload    map[string]interface{} `json:"payload"`
}

func NewStat(rawMessage string, ts time.Time, statType StatType, values ...string) (*Stat, error) {
	s := &Stat{
		RawMessage: rawMessage,
		Type:       statType,
		Timestamp:  ts,
	}

	err := s.CreatePayload(values...)
	if err != nil {
		return nil, err
	}

	return s, nil
}

// CreatePayload creates a stat payload per stat type
func (s *Stat) CreatePayload(values ...string) error {
	var payload map[string]interface{}
	var err error
	switch s.Type {
	case Alive:
		payload, err = s.createAliveValues(values...)
		break
	case PlayerNames:
		payload, err = s.createPlayerNamesValues(values...)
		break
	case PlayerKill:
		payload, err = s.createPlayerKillValues(values...)
		break
	case BlessMaiden:
		payload, err = s.createBlessMaidenValues(values...)
		break
	case ReserveMaiden:
		payload, err = s.createReserveMaidenValues(values...)
		break
	case UnreserveMaiden:
		payload, err = s.createUnreserveMaidenValues(values...)
		break
	case UseMaiden:
		payload, err = s.createUseMaidenValues(values...)
		break
	case Glance:
		payload, err = s.createGlanceValues(values...)
		break
	case CarryFood:
		payload, err = s.createCarryFoodValues(values...)
		break
	case GameStart:
		payload, err = s.createGameStartValues(values...)
		break
	case GameEnd:
		payload, err = s.createGameEndValues(values...)
		break
	case Victory:
		payload, err = s.createVictoryValues(values...)
		break
	case Spawn:
		payload, err = s.createSpawnValues(values...)
		break
	case GetOnSnail:
		payload, err = s.createGetOnSnailValues(values...)
		break
	case GetOffSnail:
		payload, err = s.createGetOffSnailValues(values...)
		break
	case SnailEat:
		payload, err = s.createSnailEatValues(values...)
		break
	case SnailEscape:
		payload, err = s.createSnailEscapeValues(values...)
		break
	case BerryDeposit:
		payload, err = s.createBerryDepositValues(values...)
		break
	case BerryKickIn:
		payload, err = s.createBerryKickInValues(values...)
		break
	default:
		err = fmt.Errorf("Not a valid messageType: %v", s.Type)
	}

	if err != nil {
		return err
	}

	s.Payload = payload
	return nil
}

// Value is a timestamp of style 3:04:05 PM
func (s *Stat) createAliveValues(values ...string) (map[string]interface{}, error) {
	tsString := values[0]
	ts, err := time.Parse("3:04:05 PM", tsString)
	if err != nil {
		return map[string]interface{}{}, err
	}

	payload := map[string]interface{}{
		"ts": ts,
	}

	return payload, nil
}

// Values is a list of player names (assume matching playerid)
func (s *Stat) createPlayerNamesValues(values ...string) (map[string]interface{}, error) {
	payload := map[string]interface{}{}
	for idx, name := range values {
		playerID := util.PlayerID(idx + 1)
		positionName, err := playerID.ToString()
		if err != nil {
			logrus.Warnf("PlayerID %v was invalid: %v", playerID, err)
			continue
		}
		payload[positionName] = name
	}
	return payload, nil
}

// Values is as follows:
// X coord
// Y Coord
// KillerID
// VictimID
func (s *Stat) createPlayerKillValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]
	killerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	victimID, err := strconv.Atoi(values[3])
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}

	killerName, err := util.PlayerID(killerID).ToString()
	if err != nil {
		return nil, err
	}

	victimName, err := util.PlayerID(victimID).ToString()
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"coordinates": coords,
		"killer":      killerName,
		"victim":      victimName,
	}

	return payload, nil
}

// Values are
// X coord
// Y coord
// side
func (s *Stat) createBlessMaidenValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]
	side := util.Side(values[2])

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"coordinates": coords,
		"side":        side.Normalize(),
	}

	return payload, nil
}

// Values are
// X coord
// Y coord
// PlayerID
func (s *Stat) createReserveMaidenValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]
	reserver, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}

	reserverName, err := util.PlayerID(reserver).ToString()
	if err != nil {
		return nil, err
	}

	payload := map[string]interface{}{
		"coordinates": coords,
		"player":      reserveName,
	}
	return payload, nil
}

// Values are
// X coord
// Y coord
// PlayerID
// Pretty much the same as reserve, but the code is duplicated just in case
func (s *Stat) createUnreserveMaidenValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]
	reserver, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}

	reserverName, err := util.PlayerID(reserver).ToString()
	if err != nil {
		return nil, err
	}

	payload := map[string]interface{}{
		"coordinates": coords,
		"player":      reserveName,
	}
	return payload, nil
}

// Values are
// X coord
// Y coord
// Gate type: speed or warrior
// PlayerID
func (s *Stat) createUseMaidenValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	gate := GateType(values[2]).Normalize()

	user, err := strconv.Atoi(values[3])
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	userName, err := util.PlayerID(user).ToString()
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"coordinates": coords,
		"gateType":    gate,
		"player":      userName,
	}
	return payload, nil
}

// Values are
// PlayerID 1
// PlayerID 2
func (s *Stat) createGlanceValues(values ...string) (map[string]interface{}, error) {
	player1ID, err := strconv.Atoi(values[0])
	if err != nil {
		return nil, err
	}
	player2ID, err := strconv.Atoivalues[1]
	if err != nil {
		return nil, err
	}
	player1Name, err := util.PlayerID(player1ID).ToString()
	if err != nil {
		return nil, err
	}
	player2Name, err := util.PlayerID(player2ID).ToString()
	if err != nil {
		return nil, err
	}

	payload := map[string]interface{}{
		"player1": player1Name,
		"player2": player2Name,
	}

	return payload, nil
}

// Values are
// PlayerID
func (s *Stat) createCarryFoodValues(values ...string) (map[string]interface{}, error) {
	playerID, err := strconv.Atoi(values[0])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player": playerName,
	}
	return payload, nil
}

// Values are
// MapName
// Cab orientation
// Some float?
// some boolean (probably tourney mode?)
func (s *Stat) createGameStartValues(values ...string) (map[string]interface{}, error) {
	mapType := MapType(values[0]).Normalize()
	if blueOnRight, err := strconv.ParseBool(values[1]); err != nil {
		return nil, err
	}
	// Skip the other two values
	payload := map[string]interface{}{
		"map":         mapType,
		"blueOnRight": blueOnRight,
	}

	return payload, nil
}

// Values are
// MapName
// Random bool
// Duration in seconds
// Some other random boolean
func (s *Stat) createGameEndValues(values ...string) (map[string]interface{}, error) {
	mapType := MapType(values[0]).Normalize()
	durationString := fmt.Sprintf("%ss", values[2])

	duration, err := time.ParseDuration(durationString)
	if err != nil {
		duration = time.Duration()
	}

	payload := map[string]interface{}{
		"map":          mapType,
		"gameDuration": duration,
	}
	return payload, nil
}

// Values are
// Side
// Victory Type
func (s *Stat) createVictoryValues(values ...string) (map[string]interface{}, error) {
	side := util.Side(values[0]).Normalize()
	victoryType := util.VictoryType(values[1]).Normalize()

	payload := map[string]interface{}{
		"side":        side,
		"victoryType": victoryType,
	}
	return payload, nil
}

// Values are
// playerID
// isAi
func (s *Stat) createSpawnValues(values ...string) (map[string]interface{}, error) {
	playerID, err := strconv.Atoi(values[0])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}
	isAi, err := strconv.ParseBool(values[1])
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player": playerName,
		"isAi":   isAi,
	}
	return payload, nil
}

// Values are
// x
// y
// playerID
func (s *Stat) createGetOnSnailValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	playerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player":      playerName,
		"coordinates": coords,
	}
	return payload, nil
}

// Values are
// x
// y
// playerID
func (s *Stat) createGetOffSnailValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	playerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player":      playerName,
		"coordinates": coords,
	}
	return payload, nil
}

// Values are
// x
// y
// eaterId
// mealId
func (s *Stat) createSnailEatValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	eaterID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	eaterName, err := util.PlayerID(eaterID).ToString()
	if err != nil {
		return nil, err
	}
	mealID, err := strconv.Atoi(values[3])
	if err != nil {
		return nil, err
	}
	mealName, err := util.PlayerID(mealID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}

	payload := map[string]interface{}{
		"coordinates": coords,
		"eater":       eaterName,
		"meal":        mealName,
	}
	return paylaod, nil
}

// Values are
// x
// y
// playerID
func (s *Stat) createSnailEscapeValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	playerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player":      playerName,
		"coordinates": coords,
	}
	return payload, nil

}

// Values are
// x
// y
// playerID
func (s *Stat) createBerryDepositValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	playerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player":      playerName,
		"coordinates": coords,
	}
	return payload, nil
}

// Values are
// x
// y
// playerID
func (s *Stat) createBerryKickInValues(values ...string) (map[string]interface{}, error) {
	x := values[0]
	y := values[1]

	playerID, err := strconv.Atoi(values[2])
	if err != nil {
		return nil, err
	}
	playerName, err := util.PlayerID(playerID).ToString()
	if err != nil {
		return nil, err
	}

	coords, err := util.NewCoords(x, y)
	if err != nil {
		return nil, err
	}
	payload := map[string]interface{}{
		"player":      playerName,
		"coordinates": coords,
	}
	return payload, nil
}
