import * as socket_io_client from 'socket.io-client';
import { Character } from '../lib/KQStream';
import { GameStats, GameStatsType, KQStat } from '../lib/GameStats';
import * as React from 'react';
import './Killboard.css';

const goldQueen = require('./sprites/gold_queen.png');
const goldStripes = require('./sprites/gold_stripes.png');
const goldAbs = require('./sprites/gold_abs.png');
const goldSkulls = require('./sprites/gold_skulls.png');
const goldChecks = require('./sprites/gold_checks.png');
const blueQueen = require('./sprites/blue_queen.png');
const blueStripes = require('./sprites/blue_stripes.png');
const blueAbs = require('./sprites/blue_abs.png');
const blueSkulls = require('./sprites/blue_skulls.png');
const blueChecks = require('./sprites/blue_checks.png');

const goldBackground = require('./sprites/gold_team.png');
const blueBackground = require('./sprites/blue_team.png');
const goldBackgroundMirror = require('./sprites/gold_team_mirror.png');
const blueBackgroundMirror = require('./sprites/blue_team_mirror.png');

abstract class Killboard extends React.Component {
  state: GameStatsType = GameStats.defaultGameStats;

  private io: SocketIOClient.Socket;
  
  constructor(props: {}) {
    super(props);
    this.io = socket_io_client('http://localhost:8000', {
      autoConnect: false
    });
    this.io.on('stat', (data: KQStat) => {
      this.setState((prevState) => {
        let characterStats = prevState[data.character];
        if (characterStats === undefined) {
          characterStats = {};
        }
        characterStats[data.statistic] = data.value;
        return {
          [data.character]: characterStats
        };
      });
    });
    this.io.open();
  }
}

export class KillboardHome extends React.Component {
  render() {
    return (
      <div>
        <h1>Killboard</h1>
        <p>Links to killboards:</p>
        <ul>
          <li><a href="/killboard/full">Full</a></li>
          <li><a href="/killboard/horizontal/blue">Blue team</a></li>
          <li><a href="/killboard/horizontal/blue/mirror">Blue team (mirrored)</a></li>
          <li><a href="/killboard/horizontal/gold">Gold team</a></li>
          <li><a href="/killboard/horizontal/gold/mirror">Gold team (mirrored)</a></li>
        </ul>
      </div>
    );
  }
}

export class KillboardFull extends Killboard {
  render() {
    return (
      <div className="App">
        <table>
          <tr>
            <th />
            <th>Kills</th>
            <th>Deaths</th>
          </tr>
          <tr>
            <td>
              <img src={goldQueen} />
            </td>
            <td>{this.state[Character.GoldQueen].kills}</td>
            <td>{this.state[Character.GoldQueen].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={goldStripes} />
            </td>
            <td>{this.state[Character.GoldStripes].kills}</td>
            <td>{this.state[Character.GoldStripes].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={goldAbs} />
            </td>
            <td>{this.state[Character.GoldAbs].kills}</td>
            <td>{this.state[Character.GoldAbs].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={goldSkulls} />
            </td>
            <td>{this.state[Character.GoldSkulls].kills}</td>
            <td>{this.state[Character.GoldSkulls].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={goldChecks} />
            </td>
            <td>{this.state[Character.GoldChecks].kills}</td>
            <td>{this.state[Character.GoldChecks].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={blueQueen} />
            </td>
            <td>{this.state[Character.BlueQueen].kills}</td>
            <td>{this.state[Character.BlueQueen].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={blueStripes} />
            </td>
            <td>{this.state[Character.BlueStripes].kills}</td>
            <td>{this.state[Character.BlueStripes].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={blueAbs} />
            </td>
            <td>{this.state[Character.BlueAbs].kills}</td>
            <td>{this.state[Character.BlueAbs].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={blueSkulls} />
            </td>
            <td>{this.state[Character.BlueSkulls].kills}</td>
            <td>{this.state[Character.BlueSkulls].deaths}</td>
          </tr>
          <tr>
            <td>
              <img src={blueChecks} />
            </td>
            <td>{this.state[Character.BlueChecks].kills}</td>
            <td>{this.state[Character.BlueChecks].deaths}</td>
          </tr>
        </table>
      </div>
    );
  }
}

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

export class KillboardHorizontal extends Killboard {
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
      </div>
    );
  }
}
