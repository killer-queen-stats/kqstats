import { Route, RouteComponentProps, Switch } from 'react-router';
import * as React from 'react';
import { Page404 } from '../404';
import KillboardFull from './KillboardFull';
import KillboardHorizontal from './KillboardHorizontal';
import KillboardVertical from './KillboardVertical';
import KillboardPlayer from './KillboardPlayer';
import './Killboard.css';

class Killboard extends React.Component<RouteComponentProps<{}>> {
  render() {
    return (
      <Switch>
        <Route
          exact={true}
          path={`${this.props.match.path}/full`}
          component={KillboardFull}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/blue`}
          render={(props) => (
            <KillboardHorizontal
              team="blue"
              mirror={false}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/gold`}
          render={(props) => (
            <KillboardHorizontal
              team="gold"
              mirror={false}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/blue/mirror`}
          render={(props) => (
            <KillboardHorizontal
              team="blue"
              mirror={true}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/gold/mirror`}
          render={(props) => (
            <KillboardHorizontal
              team="gold"
              mirror={true}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/blue`}
          render={(props) => (
            <KillboardVertical
              team="blue"
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/gold`}
          render={(props) => (
            <KillboardVertical
              team="gold"
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/blue/mirror`}
          render={(props) => (
            <KillboardVertical
              team="blue"
              mirror={true}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/gold/mirror`}
          render={(props) => (
            <KillboardVertical
              team="gold"
              mirror={true}
            />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/player/:character`}
          render={(props) => (
            <KillboardPlayer character={props.match.params.character} />
          )}
        />
        <Route
          component={Page404}
        />
      </Switch>
    );
  }
}

export default Killboard;
