import { GameStats, GameStatsType, KQStat } from '../../lib/GameStats';
import * as socket_io_client from 'socket.io-client';
import * as React from 'react';
import sprites from '../img/sprites';

abstract class KillboardBase extends React.Component {
  state: GameStatsType = GameStats.defaultGameStats;

  private io: SocketIOClient.Socket;

  static getCrowns(n: number) {
    const crown = <img className="crown" src={sprites.crown}/>;
    const html: JSX.Element[] = [];
    for (let i = 0; i < n; i++) {
      html.push(crown);
    }
    return html;
  } 

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

  componentWillMount() {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = null;
    document.body.style.color = null;
  }
}

export default KillboardBase;