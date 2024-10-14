import EventEmitter from "node:events";

type Size = {
  value: number;
  unit: "px" | "%";
};

type Position = {
  x: {
    position: number | "left" | "right";
    relativeTo?: string;
  };
  y: {
    position: number | "top" | "bottom";
    relativeTo?: string;
  };
};

type Props = Record<string, any>;

abstract class Component<P extends Props = {}> extends EventEmitter {
  id: string;
  name: string;
  position: Position;
  width: Size;
  height: Size;
  margin: number;
  absolutePosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  props: P;
  private isDirty: boolean = true;

  constructor(
    id: string,
    name: string,
    position: Position,
    width: Size,
    height: Size,
    margin: number,
    props: P
  ) {
    super();
    this.id = id;
    this.name = name;
    this.position = position;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.props = props;
  }

  abstract render(): string;

  setProps(newProps: Partial<P>) {
    const hasChanges = JSON.stringify(newProps) !== JSON.stringify(this.props);
    if (hasChanges) {
      this.props = { ...this.props, ...newProps };
      this.markDirty();
      this.emit("propsChanged", this);
    }
  }

  needsRender(): boolean {
    return this.isDirty;
  }

  markClean() {
    this.isDirty = false;
  }

  markDirty() {
    this.isDirty = true;
  }

  getActualDimensions(terminalWidth: number, terminalHeight: number) {
    if (this.absolutePosition) {
      return {
        width: this.absolutePosition.width,
        height: this.absolutePosition.height,
      };
    }

    return {
      width:
        this.width.unit === "%"
          ? Math.ceil((this.width.value / 100) * terminalWidth)
          : this.width.value,
      height:
        this.height.unit === "%"
          ? Math.ceil((this.height.value / 100) * terminalHeight)
          : this.height.value,
    };
  }
}

export type { Size, Position, Props };
export { Component };
