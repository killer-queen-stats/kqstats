import * as React from 'react';
import { Character } from '../../lib/KQStream';
import sprites from '../img/sprites';
import KillboardBase from './KillboardBase';

interface StatProps {
  name: string;
  value: number;
}

const Stat = (props: StatProps) => (
  <div className="col-6 mt-4">
    <div className="stat">
      <span className="name">{props.name}</span>
      <span className="value">{props.value}</span>
    </div>
  </div>
);

interface KillboardPlayerProps {
  character: Character;
}

class KillboardPlayer extends KillboardBase {
  props: KillboardPlayerProps;

  render() {
    const character = this.state[this.props.character];
    return (
      <div className="killboard player container">
        <div className="row">
          <div className="col-sm-4 col-6 offset-sm-0 offset-3 my-auto">
            <img src={sprites.character[this.props.character]} />
          </div>
          <div className="w-100 d-sm-none" />
          <div className="col">
            <div className="row">
              <Stat name="Kills" value={character.kills} />
              <Stat name="Deaths" value={character.deaths} />
              <Stat name="Queen Kills" value={character.queen_kills} />
              <Stat name="Warrior Kills" value={character.warrior_kills} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KillboardPlayer;