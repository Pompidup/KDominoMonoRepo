import { describe, it, expect, beforeEach } from "vitest";
import { Template } from "../src/entities/template.js";
import { Component } from "../src/entities/component.js";
import { setTerminalDimensions } from "../config/terminalDimensionsFactory.js";

class MockComponent extends Component {
  render(): string {
    return "Mock Component";
  }
}

describe("Template", () => {
  let template: Template;
  beforeEach(() => {
    setTerminalDimensions({ getWidth: () => 100, getHeight: () => 50 });
    template = new Template();
  });

  it("should initialize with correct terminal dimensions", () => {
    expect(template["terminalWidth"]).toBe(100);
    expect(template["terminalHeight"]).toBe(50);
  });

  it("should add components correctly", () => {
    const mockComponent = new MockComponent(
      "comp1",
      "Component 1",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 10, unit: "px" },
      { value: 5, unit: "px" },
      {}
    );

    template.addComponent(mockComponent);
    expect(template.components).toContain(mockComponent);
  });

  it("should calculate absolute position for components positioned absolutely", () => {
    const mockComponent = new MockComponent(
      "comp1",
      "Component 1",
      { x: { position: 10 }, y: { position: 20 } },
      { value: 50, unit: "%" },
      { value: 50, unit: "%" },
      {}
    );

    template.addComponent(mockComponent);
    template.updateLayout(100, 50);

    const { absolutePosition } = mockComponent;
    expect(absolutePosition?.width).toBe(50);
    expect(absolutePosition?.height).toBe(25);
    expect(absolutePosition?.x).toBe(11); // 10 + default margin
    expect(absolutePosition?.y).toBe(21); // 20 + default margin
  });

  it("should calculate positions relative to other components correctly", () => {
    const parentComponent = new MockComponent(
      "parent",
      "Parent Component",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 50, unit: "%" },
      { value: 50, unit: "%" },
      {}
    );

    const childComponent = new MockComponent(
      "child",
      "Child Component",
      { x: { position: "right", relativeTo: "parent" }, y: { position: 0 } },
      { value: 25, unit: "%" },
      { value: 25, unit: "%" },
      {}
    );

    template.addComponent(parentComponent);
    template.addComponent(childComponent);
    template.updateLayout(100, 50);

    const { absolutePosition } = childComponent;
    expect(absolutePosition?.x).toBe(51); // Right of parent means start from parent's width + default margin
    expect(absolutePosition?.y).toBe(1); // 1 + default margin
  });
});
