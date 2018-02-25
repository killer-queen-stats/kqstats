import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KillboardHome, KillboardFull, KillboardHorizontal } from './client/Killboard';
import registerServiceWorker from './client/registerServiceWorker';
import './client/index.css';

class Test extends React.Component {
  render() {
    return (
      <p>Hello, route!</p>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        exact={true}
        path="/killboard"
        component={KillboardHome}
      />
      <Route
        exact={true}
        path="/killboard/full"
        component={KillboardFull}
      />
      <Route
        exact={true}
        path="/killboard/horizontal/blue"
        render={(props) => (
          <KillboardHorizontal
            team="blue"
            mirror={false}
          />
        )}
      />
      <Route
        exact={true}
        path="/killboard/horizontal/gold"
        render={(props) => (
          <KillboardHorizontal
            team="gold"
            mirror={false}
          />
        )}
      />
      <Route
        exact={true}
        path="/killboard/horizontal/blue/mirror"
        render={(props) => (
          <KillboardHorizontal
            team="blue"
            mirror={true}
          />
        )}
      />
      <Route
        exact={true}
        path="/killboard/horizontal/gold/mirror"
        render={(props) => (
          <KillboardHorizontal
            team="gold"
            mirror={true}
          />
        )}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
