import { Signal } from "@preact/signals";
import { ContainerNode, h, render } from "preact";

export const Button = (name: Signal<string> | undefined) => {
  return h("button", {}, name?.value ?? "No button name provided");
};

export const mountButton = (
  target: ContainerNode,
  name: Signal<string> | undefined
) => {
  render(Button(name), target);
};
