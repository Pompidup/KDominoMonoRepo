import * as readline from "node:readline";
import type { TerminalDimensions } from "../port/terminalDimensions.js";
import type { Template } from "./template.js";
import type { Component } from "./component.js";
import { getTerminalDimensions } from "./../../config/terminalDimensionsFactory.js";

class Renderer {
  private terminalWidth: number;
  private terminalHeight: number;
  private template: Template;

  constructor(
    template: Template,
    terminalDimensions: TerminalDimensions = getTerminalDimensions()
  ) {
    this.terminalWidth = terminalDimensions.getWidth();
    this.terminalHeight = terminalDimensions.getHeight();
    this.template = template;

    process.stdout.on("resize", () => {
      const { columns, rows } = process.stdout;
      this.terminalWidth = columns;
      this.terminalHeight = rows;
      this.render();
    });

    this.addListeners();
  }

  render(): void {
    console.clear();
    this.template.updateLayout(this.terminalWidth, this.terminalHeight);

    for (const component of this.template.components) {
      if (component.needsRender()) {
        this.drawComponent(component);
        component.markClean();
      }
    }
  }

  private addListeners() {
    for (const component of this.template.components) {
      component.on("propsChanged", (updatedComponent: Component) => {
        this.partialRender(updatedComponent);
      });
    }
  }

  partialRender(component: Component): void {
    const { x, y } = component.absolutePosition!;

    this.clearPortionOfLine(x, x + component.width.value, y);
    this.drawComponent(component);

    component.markClean();
  }

  private drawComponent(component: Component): void {
    const { x, y } = component.absolutePosition!;
    const content = component.render();
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      this.writeLine(x, y + i, line!);
    }
  }

  private clearPortionOfLine(startX: number, endX: number, y: number) {
    readline.cursorTo(process.stdout, startX, y);
    const lengthToClear = endX - startX;
    const clearString = " ".repeat(lengthToClear);
    process.stdout.write(clearString);
  }

  private writeLine(x: number, y: number, content: string) {
    readline.cursorTo(process.stdout, x, y);
    process.stdout.write(content);
  }
}

export { Renderer };
