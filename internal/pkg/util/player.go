package util

import "errors"

// PlayerID is represented by an int in stats but we want to give actual names
type PlayerID int

// Enums for PlayerIDs
const (
	GoldQueen   PlayerID = 1
	BlueQueen   PlayerID = 2
	GoldStripes PlayerID = 3
	BlueStripes PlayerID = 4
	GoldAbs     PlayerID = 5
	BlueAbs     PlayerID = 6
	GoldSkulls  PlayerID = 7
	BlueSkulls  PlayerID = 8
	GoldChecks  PlayerID = 9
	BlueChecks  PlayerID = 10
)

var playerIDToStringMap = map[PlayerID]string{
	GoldQueen:   "goldQueen",
	BlueQueen:   "blueQueen",
	GoldStripes: "goldStripes",
	BlueStripes: "blueStripes",
	GoldAbs:     "goldAbs",
	BlueAbs:     "blueAbs",
	GoldSkulls:  "goldSkulls",
	BlueSkulls:  "blueSkulls",
	GoldChecks:  "goldChecks",
	BlueChecks:  "blueChecks",
}

// IsValid makes sure that the player id is between 1 and 10
func (id PlayerID) IsValid() bool {
	return id >= GoldQueen && id <= BlueChecks
}

// ToString returns a string name for id
func (id PlayerID) ToString() (string, error) {
	if !id.IsValid() {
		return "", errors.New("Not a valid playerId")
	}
	return playerIDToStringMap[id], nil
}
