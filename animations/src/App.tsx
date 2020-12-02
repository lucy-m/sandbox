import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { EmojiDemo } from './pages/emoji/EmojiDemo';
import { SpringDemo } from './pages/spring';
import { SpringBoneDemo } from './pages/spring-bone/SpringBoneDemo';
import { Welcome } from './pages/Welcome';
import { routes } from './routes';

function App() {
  return (
    <div className="App">
      <h1>
        <a href="/">Lucy's Sandbox</a>
      </h1>
      <BrowserRouter>
        <Route path={routes.spring} component={SpringDemo} />
        <Route path={routes.emoji} component={EmojiDemo} />
        <Route path={routes.springBone} component={SpringBoneDemo} />
        <Route path="/" exact={true} component={Welcome} />
      </BrowserRouter>
    </div>
  );
}

export default App;
