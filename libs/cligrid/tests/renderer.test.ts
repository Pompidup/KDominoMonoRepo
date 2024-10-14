import { describe, it, expect, beforeEach, vi } from "vitest";
import { Renderer } from "../src/entities/renderer.js";
import { Template } from "../src/entities/template.js";
import { Component } from "../src/entities/component.js";
import { setTerminalDimensions } from "../config/terminalDimensionsFactory.js";

class MockComponent extends Component {
  render(): string {
    return "Mock Component";
  }
}

describe("Renderer", () => {
  let renderer: Renderer;
  let template: Template;
  const customDimensions = { getWidth: () => 100, getHeight: () => 50 };
  beforeEach(() => {
    setTerminalDimensions({ getWidth: () => 100, getHeight: () => 50 });
    template = new Template();
    renderer = new Renderer(template);
  });

  it("should initialize terminal dimensions correctly", () => {
    expect(renderer["terminalWidth"]).toBe(100);
    expect(renderer["terminalHeight"]).toBe(50);
  });

  it("should call render method on resize event", () => {
    const renderSpy = vi.spyOn(renderer, "render");
    process.stdout.emit("resize");
    expect(renderSpy).toHaveBeenCalled();
  });

  it("should render components when needsRender is true", () => {
    const mockComponent = new MockComponent(
      "id",
      "name",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 10, unit: "px" },
      { value: 5, unit: "px" },
      {}
    );
    const drawComponentSpy = vi.spyOn(renderer as any, "drawComponent");

    template.addComponent(mockComponent);
    renderer.render();

    expect(drawComponentSpy).toHaveBeenCalledWith(mockComponent);
  });

  it("should not render components if they do not need render", () => {
    const mockComponent = new MockComponent(
      "id",
      "name",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 10, unit: "px" },
      { value: 5, unit: "px" },
      {}
    );

    const template = new Template();
    template.addComponent(mockComponent);
    const renderer = new Renderer(template);
    renderer.render();

    const drawComponentSpy = vi.spyOn(renderer as any, "drawComponent");

    expect(drawComponentSpy).not.toHaveBeenCalled();
  });

  it("should listen for component prop changes and partially render", async () => {
    const mockComponent = new MockComponent(
      "id",
      "name",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 10, unit: "px" },
      { value: 5, unit: "px" },
      {}
    );

    const template = new Template();
    template.addComponent(mockComponent);
    const renderer = new Renderer(template);

    const partialRenderSpy = vi.spyOn(renderer, "partialRender");
    renderer.render();

    mockComponent.setProps({ newProp: "value" });
    expect(partialRenderSpy).toHaveBeenCalledWith(mockComponent);
  });
});
