package util

// VictoryType is a string representation of the victory condition
type VictoryType string

// VictoryTypes
const (
	Neutral  VictoryType = ""
	Econ     VictoryType = "economic"
	Military VictoryType = "military"
	Snail    VictoryType = "snail"
)

func (v VictoryType) Normalize() string {
	if v == Econ {
		return "economic"
	} else if v == Military {
		return "military"
	} else if v == Snail {
		return "snail"
	}
	return "unknown"
}
