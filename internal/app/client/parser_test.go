package client

import "testing"

func TestValidate(t *testing.T) {
	p := &StatParser{}
	message := "![k[alive],v[12:39:04 PM]]!"
	valid := p.validate(message)

	if valid == false {
		t.Errorf("validate alive failed, expected true got %v", p)
	} else {
		t.Logf("validate alive passed")
	}

	message = "![k[getOnSnail: ],v[960,11,9]]!"
	valid = p.validate(message)
	if valid == false {
		t.Errorf("validate getOnSnail failed, expected true got %v", p)
	} else {
		t.Logf("validate getOnSnail passed")
	}

	message = "![k[nonsense: ],v[foo,1023,true,blahblahblah]]!"
	valid = p.validate(message)
	if valid == false {
		t.Errorf("validate nonsense failed, expected true got %v", p)
	} else {
		t.Logf("validate nonsense passed")
	}

	message = "1540058877411,![k[playerKill],v[1165,995,7,4,Soldier]]!"
	valid = p.validate(message)
	if valid == false {
		t.Errorf("validate playerKill with TS failed, expected true got %v", p)
	} else {
		t.Logf("validate playerKill with TS passed")
	}
}
