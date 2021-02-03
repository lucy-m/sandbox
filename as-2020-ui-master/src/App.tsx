import React from 'react';
import './App.scss';
import {
  Route,
  Switch,
  RouteComponentProps,
  HashRouter
} from 'react-router-dom';
import NewGame from './NewGame/NewGame';
import PlayGame from './PlayGame/ConnectedPlayGame';
import { NotFound } from './NotFound';
import { GameInitialConfig } from './model/game-initial-config';
import Axios from 'axios';
import { BASE_URL } from './constants';
import { Leaderboard } from './PlayGame/Leaderboard/Leaderboard';

const onGameStarted = (
  config: GameInitialConfig,
  router: RouteComponentProps
): void => {
  console.log('Starting game with', config);
  Axios.post<string>(BASE_URL + 'game/new', config)
    .then(response => {
      router.history.push('/play/' + response.data);
    })
    .catch(err => console.error('Unable to make new game', err));
};

const onLeaderboard = (router: RouteComponentProps): void => {
  router.history.push('/leaderboard');
};

export const App: React.FC = () => {
  const router = (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={router => (
            <NewGame
              onGameStarted={config => onGameStarted(config, router)}
              onLeaderboard={() => onLeaderboard(router)}
            ></NewGame>
          )}
        />
        <Route path="/play/:id" component={PlayGame} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  );

  return <div>{router}</div>;
};

export default App;
