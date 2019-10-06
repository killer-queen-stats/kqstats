package util

import (
	"fmt"

	"github.com/shopspring/decimal"
)

// Coords is a struct of coordinates
// Decimal is used to preserve precision
type Coords struct {
	X decimal.Decimal `json:"x"`
	Y decimal.Decimal `json:"y"`
}

// NewCoords returns a struct of coordinates
func NewCoords(xStr string, yStr string) (*Coords, error) {
	x, err := decimal.NewFromString(xStr)
	if err != nil {
		return nil, fmt.Errorf("X: %v not a proper coordinate: %v", xStr, err)
	}
	y, err := decimal.NewFromString(yStr)
	if err != nil {
		return nil, fmt.Errorf("Y: %v not a proper coordinate: %v", yStr, err)
	}

	coords := &Coords{
		X: x,
		Y: y,
	}
	return coords, nil
}
