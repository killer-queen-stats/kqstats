package util

// MapType describes the map the game is being played on
type MapType string

// GateType describes the type of gate in use or tagged
type GateType string

// Enums for types of gates
const (
	Day   MapType = "map_day"
	Night MapType = "map_night"
	Dusk  MapType = "map_dusk"
	// Meat map maybe?
	Twilight MapType = "map_twilight"
	// Note these are unlisted
	Bonus      MapType = "map_bonus"
	SnailBonus MapType = "map_snailbonus"

	Warrior GateType = "maiden_wings"
	Speed   GateType = "maiden_speed"
	Unknown GateType = ""
)

// Normalize returns a human readable version of the map type
func (m MapType) Normalize() string {
	switch m {
	case Day:
		return "day"
	case Night:
		return "night"
	case Dusk:
		return "dusk"
	case Twilight:
		return "twilightMeat"
	case Bonus:
		return "warriorBonus"
	case SnailBonus:
		return "snailBonus"
	}
	return ""
}

// Normalize returns a human readable version of the gate type
func (g GateType) Normalize() string {
	if g == Warrior {
		return "warrior"
	} else if g == Speed {
		return "speed"
	}
	return ""
}
