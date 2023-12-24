import { html, render } from "https://esm.sh/htm/preact/standalone";

export class Button {
  constructor(target, props) {
    render(html`<button>${props.label}</button>`, target);
  }
}
