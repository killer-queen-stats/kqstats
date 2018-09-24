import * as React from 'react';
import { Character } from '../../lib/models/KQStream';
import sprites from '../img/sprites';
import KillboardBase from './KillboardBase';

const KillboardRow = (props: any) => {
  return (
    <tr>
      <td>
        <div className="crowns">
          {KillboardBase.getCrowns(props.stat.queen_kills)}
        </div>
        <img className="character" src={props.image} />
      </td>
      <td>
        {props.stat.kills}
      </td>
      <td>
        {props.stat.warrior_kills}
      </td>
      <td>
        {props.stat.deaths}
      </td>
    </tr>
  );
};

class KillboardFull extends KillboardBase {
  render() {
    return (
      <div className="App">
        <table>
          <tbody>
          <tr>
            <th />
            <th>Kills</th>
            <th>Warrior Kills*</th>
            <th>Deaths</th>
          </tr>
          <KillboardRow stat={this.state[Character.GoldQueen]} image={sprites.gold.queen} />
          <KillboardRow stat={this.state[Character.GoldStripes]} image={sprites.gold.stripes} />
          <KillboardRow stat={this.state[Character.GoldAbs]} image={sprites.gold.abs} />
          <KillboardRow stat={this.state[Character.GoldSkulls]} image={sprites.gold.skulls} />
          <KillboardRow stat={this.state[Character.GoldChecks]} image={sprites.gold.checks} />
          <KillboardRow stat={this.state[Character.BlueQueen]} image={sprites.blue.queen} />
          <KillboardRow stat={this.state[Character.BlueStripes]} image={sprites.blue.stripes} />
          <KillboardRow stat={this.state[Character.BlueAbs]} image={sprites.blue.abs} />
          <KillboardRow stat={this.state[Character.BlueSkulls]} image={sprites.blue.skulls} />
          <KillboardRow stat={this.state[Character.BlueChecks]} image={sprites.blue.checks} />
          </tbody>
        </table>
        <h6>* May be missing some warrior kills</h6>
      </div>
    );
  }
}

export default KillboardFull;