import type { TerminalDimensions } from "../src/port/terminalDimensions.js";
import { StdoutTerminalDimensions } from "../src/adapters/stdoutTerminalDimensions.js";

let currentTerminalDimensions: TerminalDimensions | null = null;

export const getTerminalDimensions = (): TerminalDimensions => {
  if (!currentTerminalDimensions) {
    currentTerminalDimensions = new StdoutTerminalDimensions();
  }
  return currentTerminalDimensions;
};

export const setTerminalDimensions = (
  terminalDimensions: TerminalDimensions
): void => {
  currentTerminalDimensions = terminalDimensions;
};
