import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { SpringDrawer } from './pages/Spring';
import { Welcome } from './pages/Welcome';
import { routes } from './routes';

function App() {
  return (
    <div className="App">
      <h1>Lucy's Sandbox</h1>
      <BrowserRouter>
        <Route path={routes.spring} component={SpringDrawer} />
        <Route path="/" exact={true} component={Welcome} />
      </BrowserRouter>
    </div>
  );
}

export default App;
