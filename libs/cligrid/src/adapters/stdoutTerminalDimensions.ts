import type { TerminalDimensions } from "../port/terminalDimensions.js";

class StdoutTerminalDimensions implements TerminalDimensions {
  getWidth() {
    return process.stdout.columns;
  }

  getHeight() {
    return process.stdout.rows;
  }
}

export { StdoutTerminalDimensions };
