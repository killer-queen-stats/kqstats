import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Killboard } from './client/Killboard';
import { Page404 } from './client/404';
import registerServiceWorker from './client/registerServiceWorker';
import './client/index.css';

class Home extends React.Component {
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
