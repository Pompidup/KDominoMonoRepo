import { describe, it, expect, beforeEach } from "vitest";
import { Component } from "../src/entities/component.js";

type TestProps = { exampleProp: string };

class TestComponent extends Component<TestProps> {
  render(): string {
    return `Rendering: ${this.props.exampleProp}`;
  }
}

describe("Component", () => {
  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent(
      "testId",
      "testName",
      { x: { position: 0 }, y: { position: 0 } },
      { value: 100, unit: "px" },
      { value: 100, unit: "px" },
      0,
      { exampleProp: "initial" }
    );
  });

  it("should mark dirty and reflect needsRender status correctly", () => {
    expect(component.needsRender()).toBe(true);
    component.markClean();
    expect(component.needsRender()).toBe(false);
    component.markDirty();
    expect(component.needsRender()).toBe(true);
  });

  it("should update props and mark component as dirty when props change", () => {
    component.markClean();
    component.setProps({ exampleProp: "updated" });
    expect(component.props.exampleProp).toBe("updated");
    expect(component.needsRender()).toBe(true);
  });

  it("should not mark component as dirty if props are unchanged", () => {
    component.setProps({ exampleProp: "initial" });
    expect(component.needsRender()).toBe(true);
    component.markClean();
    component.setProps({ exampleProp: "initial" });
    expect(component.needsRender()).toBe(false);
  });

  it("should calculate actual dimensions based on pixel units", () => {
    const dimensions = component.getActualDimensions(200, 200);
    expect(dimensions).toEqual({ width: 100, height: 100 });
  });

  it("should calculate actual dimensions based on percentage units", () => {
    component.width.unit = "%";
    component.height.unit = "%";
    component.width.value = 50;
    component.height.value = 50;
    const dimensions = component.getActualDimensions(200, 200);
    expect(dimensions).toEqual({ width: 100, height: 100 });
  });

  it("should use absolutePosition if it exists", () => {
    component.absolutePosition = {
      x: 10,
      y: 10,
      width: 150,
      height: 150,
    };
    const dimensions = component.getActualDimensions(200, 200);
    expect(dimensions).toEqual({ width: 150, height: 150 });
  });
});
