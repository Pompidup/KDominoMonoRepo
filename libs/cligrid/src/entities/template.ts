import { getTerminalDimensions } from "./../../config/terminalDimensionsFactory.js";
import type { TerminalDimensions } from "src/port/terminalDimensions.js";
import type { Component } from "./component.js";

class Template {
  components: Component[] = [];
  terminalWidth: number;
  terminalHeight: number;

  constructor(
    terminalDimensions: TerminalDimensions = getTerminalDimensions()
  ) {
    this.terminalWidth = terminalDimensions.getWidth();
    this.terminalHeight = terminalDimensions.getHeight();
  }

  addComponent(component: Component): void {
    this.components.push(component);
  }

  private calculateAbsolutePosition(component: Component) {
    let x = 0,
      y = 0,
      width = 0,
      height = 0;

    width =
      component.width.unit === "%"
        ? Math.ceil((component.width.value / 100) * this.terminalWidth)
        : component.width.value;
    height =
      component.height.unit === "%"
        ? Math.ceil((component.height.value / 100) * this.terminalHeight)
        : component.height.value;

    if (typeof component.position.x.position === "number") {
      x = component.position.x.position + component.margin;
    }
    if (typeof component.position.y.position === "number") {
      y = component.position.y.position + component.margin;
    }

    if (component.position.x.relativeTo) {
      const parent = this.components.find(
        (c) => c.id === component.position.x.relativeTo
      );
      if (parent) {
        const parentPosition = this.calculateAbsolutePosition(parent);
        if (component.position.x.position === "right") {
          x = Math.ceil(
            parentPosition.x -
              parent.margin +
              parentPosition.width +
              component.margin
          );
        } else if (component.position.x.position === "left") {
          x = Math.ceil(
            parentPosition.x - parent.margin - width + component.margin
          );
        }
      }
    }

    if (component.position.y.relativeTo) {
      const parent = this.components.find(
        (c) => c.id === component.position.y.relativeTo
      );
      if (parent) {
        const parentPosition = this.calculateAbsolutePosition(parent);
        if (component.position.y.position === "bottom") {
          y = Math.ceil(
            parentPosition.y -
              parent.margin +
              parentPosition.height +
              component.margin -
              parent.margin
          );
        } else if (component.position.y.position === "top") {
          y = Math.ceil(
            parentPosition.y - parent.margin - height + component.margin
          );
        }
      }
    }

    return { x, y, width, height };
  }

  updateLayout(terminalWidth: number, terminalHeight: number) {
    this.terminalWidth = terminalWidth;
    this.terminalHeight = terminalHeight;

    this.components.forEach((component) => {
      const { x, y, width, height } = this.calculateAbsolutePosition(component);
      component.absolutePosition = { x, y, width, height };
      component.markDirty();
    });
  }
}

export { Template };
