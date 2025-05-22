import {
  GameWithNextStep,
  GameWithNextAction,
  GameState,
  isGameWithNextAction,
  isGameWithNextStep, createGameEngine, Rotation, GameWithResults
} from "@pompidup/kingdomino-engine";

export interface GameManager {
  initialize(): GameState;
  addPlayers(playerNames: string[]): GameWithNextStep;
  startGame(): GameWithNextAction;
  chooseDomino(lordId: string, dominoNumber: number): GameState;
  placeDomino(lordId: string, x: number, y: number, rotation: number): GameState;
  discardDomino(lordId: string): GameState;
  getResults(): GameWithResults;
  getCurrentState(): GameState;
  isGameWithNextAction(): boolean;
  isGameWithNextStep(): boolean;
  getNextAction(): { nextLord: string; nextAction: string } | null;
  getNextStep(): string | null;
}

export function createGameManager(): GameManager {
  const engine = createGameEngine({
    logging: true,
  });
  
  let gameState: GameState = engine.createGame({ mode: "Classic" });
  
  return {
    initialize(): GameWithNextStep {
      gameState = engine.createGame({ mode: "Classic" });
      return gameState as GameWithNextStep;
    },
    
    addPlayers(playerNames: string[]): GameWithNextStep {
      gameState = engine.addPlayers({ 
        game: gameState as GameWithNextStep, 
        players: playerNames 
      });
      return gameState as GameWithNextStep;
    },
    
    startGame(): GameWithNextAction {
      gameState = engine.startGame({ 
        game: gameState as GameWithNextStep 
      });
      return gameState as GameWithNextAction;
    },
    
    chooseDomino(lordId: string, dominoNumber: number): GameState {
      gameState = engine.chooseDomino({
        game: gameState,
        lordId,
        dominoPick: dominoNumber
      });
      return gameState;
    },
    
    placeDomino(lordId: string, x: number, y: number, rotation: number): GameState {
      try {
        gameState = engine.placeDomino({
          game: gameState,
          lordId,
          position: { x, y },
          rotation: rotation as Rotation
        });
      } catch (error) {
        console.error("Error placing domino:", error);
        // In case of error, we don't update the game state
      }
      return gameState;
    },
    
    discardDomino(lordId: string): GameState {
      gameState = engine.discardDomino({
        game: gameState,
        lordId
      });
      return gameState;
    },
    
    getResults(): GameWithResults {
      return engine.getResults({
        game: gameState
      });
    },
    
    getCurrentState(): GameState {
      return gameState;
    },
    
    isGameWithNextAction(): boolean {
      return isGameWithNextAction(gameState);
    },
    
    isGameWithNextStep(): boolean {
      return isGameWithNextStep(gameState);
    },
    
    getNextAction(): { nextLord: string; nextAction: string } | null {
      if (isGameWithNextAction(gameState)) {
        return {
          nextLord: gameState.nextAction.nextLord,
          nextAction: gameState.nextAction.nextAction
        };
      }
      return null;
    },
    
    getNextStep(): string | null {
      if (isGameWithNextStep(gameState)) {
        return gameState.nextAction.step;
      }
      return null;
    }
  };
}