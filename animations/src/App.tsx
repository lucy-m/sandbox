import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { EmojiDemo } from './pages/emoji/EmojiDemo';
import { SpringDemo } from './pages/SpringDemo';
import { Welcome } from './pages/Welcome';
import { routes } from './routes';

function App() {
  return (
    <div className="App">
      <h1>Lucy's Sandbox</h1>
      <BrowserRouter>
        <Route path={routes.spring} component={SpringDemo} />
        <Route path={routes.emoji} component={EmojiDemo} />
        <Route path="/" exact={true} component={Welcome} />
      </BrowserRouter>
    </div>
  );
}

export default App;
