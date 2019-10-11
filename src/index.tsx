import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Character } from './lib/models/KQStream';
import Killboard from './client/killboard/Killboard';
import { Page404 } from './client/404';
import registerServiceWorker from './client/registerServiceWorker';
import sprites from './client/img/sprites';
import 'bootstrap/dist/css/bootstrap.css';
import './client/index.css';

interface CharacterColumnProps {
  character: Character;
}

const CharacterColumn = (props: CharacterColumnProps) => (
  <div className="col mb-3">
    <a href={`/killboard/player/${props.character}`}>
      <img src={sprites.character[props.character]} />
    </a>
  </div>
);

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Killer Queen Stats</h1>
        <div className="roster">
          <div className="row">
            <CharacterColumn character={Character.GoldStripes} />
            <CharacterColumn character={Character.GoldAbs} />
            <CharacterColumn character={Character.GoldQueen} />
            <CharacterColumn character={Character.GoldSkulls} />
            <CharacterColumn character={Character.GoldChecks} />
          </div>
          <div className="row">
            <CharacterColumn character={Character.BlueStripes} />
            <CharacterColumn character={Character.BlueAbs} />
            <CharacterColumn character={Character.BlueQueen} />
            <CharacterColumn character={Character.BlueSkulls} />
            <CharacterColumn character={Character.BlueChecks} />
          </div>
        </div>
        <ul>
          <li><a href="/killboard/full">Full</a></li>
          <li><a href="/killboard/horizontal/blue">Blue team</a></li>
          <li><a href="/killboard/horizontal/blue/mirror">Blue team (mirrored)</a></li>
          <li><a href="/killboard/vertical/blue/">Vert Blue team</a></li>
          <li><a href="/killboard/vertical/blue/mirror">Vert Blue team (mirrored)</a></li>
          <li><a href="/killboard/horizontal/gold">Gold team</a></li>
          <li><a href="/killboard/horizontal/gold/mirror">Gold team (mirrored)</a></li>
          <li><a href="/killboard/vertical/gold">Vert Gold team</a></li>
          <li><a href="/killboard/vertical/gold/mirror">Vert Gold team (mirrored)</a></li>
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        exact={true}
        path="/"
        component={Home}
      />
      <Route
        path="/killboard"
        component={Killboard}
      />
      <Route
        component={Page404}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
