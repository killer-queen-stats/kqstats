import * as React from 'react';
import { Character } from '../../lib/KQStream';
import KillboardBase from './KillboardBase';

const goldBackground = require('../img/gold_team.png');
const blueBackground = require('../img/blue_team.png');
const goldBackgroundMirror = require('../img/gold_team_mirror.png');
const blueBackgroundMirror = require('../img/blue_team_mirror.png');

interface KillboardHorizontalProps {
  team: 'blue' | 'gold';
  mirror: boolean;
}

interface KillboardHorizontalAlias {
  background: any;
  position: {
    [1]: Character;
    [2]: Character;
    [3]: Character;
    [4]: Character;
    [5]: Character;
  };
}

class KillboardHorizontal extends KillboardBase {
  props: KillboardHorizontalProps;

  private alias: KillboardHorizontalAlias;

  constructor(props: KillboardHorizontalProps) {
    super(props);
    if (props.team === 'blue') {
      if (!props.mirror) {
        this.alias = {
          background: blueBackground,
          position: {
            [1]: Character.BlueChecks,
            [2]: Character.BlueSkulls,
            [3]: Character.BlueQueen,
            [4]: Character.BlueAbs,
            [5]: Character.BlueStripes
          }
        };
      } else {
        this.alias = {
          background: blueBackgroundMirror,
          position: {
            [1]: Character.BlueStripes,
            [2]: Character.BlueAbs,
            [3]: Character.BlueQueen,
            [4]: Character.BlueSkulls,
            [5]: Character.BlueChecks
          }
        };
      }
    } else {
      if (!props.mirror) {
        this.alias = {
          background: goldBackground,
          position: {
            [1]: Character.GoldChecks,
            [2]: Character.GoldSkulls,
            [3]: Character.GoldQueen,
            [4]: Character.GoldAbs,
            [5]: Character.GoldStripes
          }
        };
      } else {
        this.alias = {
          background: goldBackgroundMirror,
          position: {
            [1]: Character.GoldStripes,
            [2]: Character.GoldAbs,
            [3]: Character.GoldQueen,
            [4]: Character.GoldSkulls,
            [5]: Character.GoldChecks
          }
        };
      }
    }
  }

  render() {
    return (
      <div className="killboard horizontal">
        <img src={this.alias.background} />
        <div className="value" style={{left: '14px'}}>
          {this.state[this.alias.position[1]].kills}
        </div>
        <div className="value" style={{left: '134px'}}>
          {this.state[this.alias.position[1]].deaths}
        </div>
        <div className="value" style={{left: '270px'}}>
          {this.state[this.alias.position[2]].kills}
        </div>
        <div className="value" style={{left: '390px'}}>
          {this.state[this.alias.position[2]].deaths}
        </div>
        <div className="value" style={{left: '525px'}}>
          {this.state[this.alias.position[3]].kills}
        </div>
        <div className="value" style={{left: '645px'}}>
          {this.state[this.alias.position[3]].deaths}
        </div>
        <div className="value" style={{left: '782px'}}>
          {this.state[this.alias.position[4]].kills}
        </div>
        <div className="value" style={{left: '902px'}}>
          {this.state[this.alias.position[4]].deaths}
        </div>
        <div className="value" style={{left: '1038px'}}>
          {this.state[this.alias.position[5]].kills}
        </div>
        <div className="value" style={{left: '1158px'}}>
          {this.state[this.alias.position[5]].deaths}
        </div>
        <div className="crowns" style={{left: '59px'}}>
          {KillboardBase.getCrowns(this.state[this.alias.position[1]].queen_kills)}
        </div>
        <div className="crowns" style={{left: '315px'}}>
          {KillboardBase.getCrowns(this.state[this.alias.position[2]].queen_kills)}
        </div>
        <div className="crowns" style={{left: '571px'}}>
          {KillboardBase.getCrowns(this.state[this.alias.position[3]].queen_kills)}
        </div>
        <div className="crowns" style={{left: '827px'}}>
          {KillboardBase.getCrowns(this.state[this.alias.position[4]].queen_kills)}
        </div>
        <div className="crowns" style={{left: '1084px'}}>
          {KillboardBase.getCrowns(this.state[this.alias.position[5]].queen_kills)}
        </div>
      </div>
    );
  }

  componentWillMount() {
    super.componentWillMount();
    document.body.style.backgroundColor = 'transparent';
  }
}

export default KillboardHorizontal;