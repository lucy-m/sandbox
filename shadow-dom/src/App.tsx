import React from 'react';
import './App.css';
import ReactShadowRoot from 'react-shadow-root';

function App() {
  return (
    <div className="App">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .my-button {
              color: mediumpurple;
            }
          `,
        }}
      />
      <button className="my-button">Button</button>

      <div>
        <ReactShadowRoot>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .my-button {
                color: lightcoral;
              }
            `,
            }}
          />
          <button className="my-button">Button</button>
        </ReactShadowRoot>
      </div>
    </div>
  );
}

export default App;
