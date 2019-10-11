import * as React from 'react';
import { Character } from '../../lib/models/KQStream';
import KillboardBase from './KillboardBase';

interface KillboardVerticalProps {
    team: 'blue' | 'gold';
    mirror?: undefined | boolean;
}

interface KillboardVerticalAlias {
  mirror: boolean;
  team: 'blue' | 'gold';
  spriteName: {
    [1]: string;
    [2]: string;
    [3]: string;
    [4]: string;
    [5]: string;
  };
  position: {
    [1]: Character;
    [2]: Character;
    [3]: Character;
    [4]: Character;
    [5]: Character;
  };
}

class KillboardVertical extends KillboardBase {
  props: KillboardVerticalProps;

  private alias: KillboardVerticalAlias;

  constructor(props: KillboardVerticalProps) {
    super(props);
    if (props.team === 'blue') {
        this.alias = {
            mirror: !!props.mirror,
            team: props.team,
            spriteName: {
                [1]: `/img/sprites_v2/${props.team}_Queen.png`,
                [2]: `/img/sprites_v2/${props.team}_Skulls.png`,
                [3]: `/img/sprites_v2/${props.team}_Abs.png`,
                [4]: `/img/sprites_v2/${props.team}_Stripes.png`,
                [5]: `/img/sprites_v2/${props.team}_Chex.png`,
            },
            position: {
                [1]: Character.BlueQueen,
                [2]: Character.BlueSkulls,
                [3]: Character.BlueAbs,
                [4]: Character.BlueStripes,
                [5]: Character.BlueChecks,
            },
        };
    } else {
        this.alias = {
            mirror: !!props.mirror,
            team: props.team,
            spriteName: {
                [1]: `/img/sprites_v2/${props.team}_Queen.png`,
                [2]: `/img/sprites_v2/${props.team}_Skulls.png`,
                [3]: `/img/sprites_v2/${props.team}_Abs.png`,
                [4]: `/img/sprites_v2/${props.team}_Stripes.png`,
                [5]: `/img/sprites_v2/${props.team}_Chex.png`,
            },
            position: {
                [1]: Character.GoldQueen,
                [2]: Character.GoldSkulls,
                [3]: Character.GoldAbs,
                [4]: Character.GoldStripes,
                [5]: Character.GoldChecks,
            }
        };
    }
  }

    render() {
        if (!this.alias.mirror) {
            return this.renderNormal();
        } else {
            return this.renderMirror();
        }
    }

    renderNormal() {
        return (
          <div className="killboard vertical">
            <div className="player-container" >
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[1]}/>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[1]].queen_kills)}
                </div>
                <div className="score-container">
                  <span>{this.state[this.alias.position[1]].kills}-
                  {this.state[this.alias.position[1]].deaths}</span>
                </div>
            </div>
            <div className="player-container" >
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[2]}/>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[2]].queen_kills)}
                </div>
                <div className="score-container">
                    <span>{this.state[this.alias.position[2]].kills}-
                    {this.state[this.alias.position[2]].deaths}</span>
                </div>
            </div>
            <div className="player-container" >
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[3]}/>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[3]].queen_kills)}
                </div>
                <div className="score-container">
                    <span>{this.state[this.alias.position[3]].kills}-
                    {this.state[this.alias.position[3]].deaths}</span>
                </div>
            </div>
            <div className="player-container" >
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[4]}/>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[4]].queen_kills)}
                </div>
                <div className="score-container">
                    <span>{this.state[this.alias.position[4]].kills}-
                    {this.state[this.alias.position[4]].deaths}</span>
                </div>
            </div>
            <div className="player-container" >
              <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[5]}/>
              </div>
              <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[5]].queen_kills)}
              </div>
              <div className="score-container">

                  <span>{this.state[this.alias.position[5]].kills}-
                  {this.state[this.alias.position[5]].deaths}</span>
              </div>
            </div>
          </div>
        );
    }
    renderMirror() {
        return (
          <div className="killboard vertical">
            <div className="player-container" >
                <div className="score-container">
                  <span>{this.state[this.alias.position[1]].kills}-
                  {this.state[this.alias.position[1]].deaths}</span>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[1]].queen_kills)}
                </div>
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[1]}/>
                </div>
            </div>
            <div className="player-container" >
                <div className="score-container">
                    <span>{this.state[this.alias.position[2]].kills}-
                    {this.state[this.alias.position[2]].deaths}</span>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[2]].queen_kills)}
                </div>
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[2]}/>
                </div>
            </div>
            <div className="player-container" >
                <div className="score-container">
                    <span>{this.state[this.alias.position[3]].kills}-
                    {this.state[this.alias.position[3]].deaths}</span>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[3]].queen_kills)}
                </div>
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[3]}/>
                </div>
            </div>
            <div className="player-container" >
                <div className="score-container">
                    <span>{this.state[this.alias.position[4]].kills}-
                    {this.state[this.alias.position[4]].deaths}</span>
                </div>
                <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[4]].queen_kills)}
                </div>
                <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[4]}/>
                </div>
            </div>
            <div className="player-container" >
              <div className="score-container">
                  <span>{this.state[this.alias.position[5]].kills}-
                  {this.state[this.alias.position[5]].deaths}</span>
              </div>
              <div className="crown-container">
                    {this.getCrowns(this.state[this.alias.position[5]].queen_kills)}
              </div>
              <div className="avatar-container">
                    <img className="avatar" src={this.alias.spriteName[5]}/>
              </div>
            </div>
          </div>
        );
    }

  getCrowns(n: number) {
    const crownPath = `/img/sprites_v2/queen-kill.png`;
    const crown = <img className="crown" src={crownPath}/>;
    const html: JSX.Element[] = [];
    for (let i = 0; i < n; i++) {
      html.push(crown);
    }
    return html;
  }

  componentWillMount() {
    super.componentWillMount();
    document.body.style.backgroundColor = 'transparent';
  }
}

export default KillboardVertical;
