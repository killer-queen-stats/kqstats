package util

// Side is a string representation of the KQ cab
type Side string

// Side Enums
const (
	Neutral Side = ""
	Blue    Side = "blue"
	Gold    Side = "red" // Yah it's dumb
	Gold2   Side = "gold"
)

// Normalize returns an actual string
func (s Side) Normalize() string {
	if s == Blue {
		return "blue"
	} else if s == Gold {
		return "gold"
	} else if s == Gold2 {
		return "gold"
	}
	return "neutral"
}
