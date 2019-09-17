package app

import (
	"errors"
	"net"
	"net/url"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

// WSPort is the port that KQ stats connects on
var WSPort = "12749"

// Connect returns a websocket Connection
func Connect() (*websocket.Conn, error) {
	ip, err := getConnectionIP()
	if err != nil {
		return nil, err
	}

	host := net.JoinHostPort(string(ip), WSPort)

	websocketURL := url.URL{
		Scheme: "ws",
		Host:   host,
	}
	logrus.Infof("Connecting on %v", host)

	c, _, err := websocket.DefaultDialer.Dial(websocketURL.String(), nil)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func getConnectionIP() (net.IP, error) {
	ips, err := listLocalIps()
	if err != nil {
		return net.IP{}, err
	}
	ips, err = filterIpsByOpenPort(ips, WSPort)
	if err != nil {
		return net.IP{}, err
	} else if len(ips) == 0 {
		return net.IP{}, errors.New("No IPs found")
	}

	return ips[0], nil
}

func filterIpsByOpenPort(ips []net.IP, port string) ([]net.IP, error) {
	connectionTimeout := time.Second * 5
	finalIPList := []net.IP{}
	for _, ip := range ips {
		conn, err := net.DialTimeout("tcp", net.JoinHostPort(string(ip), port), connectionTimeout)
		if err != nil {
			logrus.Warnf("Wrong ip address.")
			continue
		}
		if conn != nil {
			defer conn.Close()
			logrus.Debugf("Found an ip with port %s open: %v", port, ip)
			finalIPList = append(finalIPList, ip)
		}
	}
	return finalIPList, nil
}

func listLocalIps() ([]net.IP, error) {
	ifaces, err := net.Interfaces()
	ips := []net.IP{}
	if err != nil {
		return nil, err
	}
	for _, iface := range ifaces {
		addrs, err := iface.Addrs()
		if err != nil {
			logrus.Warnf("Error listing network interfaces %v", err)
			continue
		}

		for _, addr := range addrs {
			switch t := addr.(type) {
			case *net.IPNet:
				ips = append(ips, t.IP)
				break
			case *net.IPAddr:
				ips = append(ips, t.IP)
				break

			}
		}
	}
	return ips, nil
}
