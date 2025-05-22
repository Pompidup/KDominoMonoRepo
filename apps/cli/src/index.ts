import { Renderer, Template, Component } from "@pompidup/cligrid";
import { createGameManager } from "./game-manager";
import { createInputHandler } from "./input-handler";

// Create components for the game UI
class TitleComponent extends Component {
  render() {
    const { width } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );
    return "=".repeat(width - this.margin * 2) + "\n" +
           " ".repeat((width - 20) / 2) + "KINGDOMINO GAME\n" +
           "=".repeat(width - this.margin * 2);
  }
}

class GameInfoComponent extends Component<{
  gameState: any;
  message: string;
}> {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );

    if (!this.props.gameState) {
      return "Game not started yet";
    }

    const turn = this.props.gameState.turn || 0;
    const message = this.props.message || "";

    return `Turn: ${turn}\n${message}`;
  }
}

class PlayerComponent extends Component<{
  player: any;
  isActive: boolean;
}> {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );

    if (!this.props.player) {
      return "No player data";
    }

    const playerName = this.props.player.name || "Unknown";
    const isActive = this.props.isActive ? "* ACTIVE *" : "";

    return `Player: ${playerName} ${isActive}`;
  }
}

class KingdomComponent extends Component<{
  kingdom: any;
}> {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );

    if (!this.props.kingdom) {
      return "No kingdom data";
    }

    // Simple representation of the kingdom
    // In a real implementation, this would render the actual kingdom grid
    return "Kingdom Display (placeholder)";
  }
}

class DominoesComponent extends Component<{
  dominoes: any[];
}> {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );

    if (!this.props.dominoes || this.props.dominoes.length === 0) {
      return "No dominoes available";
    }

    // Simple representation of available dominoes
    // In a real implementation, this would render the actual dominoes
    return "Available Dominoes (placeholder)";
  }
}

class InputComponent extends Component<{
  prompt: string;
  onInput: (input: string) => void;
}> {
  render() {
    return this.props.prompt || "Enter command: ";
  }

  // In a real implementation, this would handle user input
}

// Create the main application
async function main() {
  console.clear();

  // Create game manager and input handler
  const gameManager = createGameManager();
  const inputHandler = createInputHandler();

  // Initialize a new game
  let gameState = gameManager.initialize();

  // Set up the UI template
  const template = new Template();

  // Add components to the template
  const titleComponent = new TitleComponent(
    "title",
    "TitleComponent",
    { x: { position: 0 }, y: { position: 0 } },
    { value: 100, unit: "%" },
    { value: 10, unit: "%" },
    {}
  );

  const gameInfoComponent = new GameInfoComponent(
    "gameInfo",
    "GameInfoComponent",
    { x: { position: 0 }, y: { position: "bottom", relativeTo: "title" } },
    { value: 100, unit: "%" },
    { value: 10, unit: "%" },
    { gameState, message: "Welcome to Kingdomino!" }
  );

  const dominoesComponent = new DominoesComponent(
    "dominoes",
    "DominoesComponent",
    { x: { position: 0 }, y: { position: "bottom", relativeTo: "gameInfo" } },
    { value: 100, unit: "%" },
    { value: 20, unit: "%" },
    { dominoes: [] }
  );

  const kingdomComponent = new KingdomComponent(
    "kingdom",
    "KingdomComponent",
    { x: { position: 0 }, y: { position: "bottom", relativeTo: "dominoes" } },
    { value: 100, unit: "%" },
    { value: 40, unit: "%" },
    { kingdom: null }
  );

  const inputComponent = new InputComponent(
    "input",
    "InputComponent",
    { x: { position: 0 }, y: { position: "bottom", relativeTo: "kingdom" } },
    { value: 100, unit: "%" },
    { value: 10, unit: "%" },
    { 
      prompt: "Enter player names (comma-separated): ",
      onInput: () => {} // Will be implemented later
    }
  );

  template.addComponent(titleComponent);
  template.addComponent(gameInfoComponent);
  template.addComponent(dominoesComponent);
  template.addComponent(kingdomComponent);
  template.addComponent(inputComponent);

  // Create the renderer
  const renderer = new Renderer(template);

  // Initial render
  renderer.render();

  try {
    // Game setup phase
    console.log("\n\n");
    const playerNamesInput = await inputHandler.askQuestion("Enter player names (comma-separated):");
    const playerNames = playerNamesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);

    if (playerNames.length < 2 || playerNames.length > 4) {
      console.log("You need 2-4 players to play Kingdomino.");
      inputHandler.close();
      return;
    }

    // Add players to the game
    gameState = gameManager.addPlayers(playerNames);

    // Update game info component
    gameInfoComponent.setProps({ 
      gameState: gameManager.getCurrentState(), 
      message: "Players added. Starting game..." 
    });
    renderer.render();

    // Start the game
    gameState = gameManager.startGame();

    // Main game loop
    while (gameManager.isGameWithNextAction()) {
      const nextAction = gameManager.getNextAction();
      if (!nextAction) break;

      const { nextLord, nextAction: action } = nextAction;

      // Find the current player
      const currentState = gameManager.getCurrentState();
      const currentLord = currentState.lords.find(lord => lord.id === nextLord);
      const currentPlayer = currentState.players.find(player => player.id === currentLord?.playerId);
      const playerName = currentPlayer?.name

      // Update game info
      gameInfoComponent.setProps({ 
        gameState: currentState, 
        message: `${playerName}'s turn - ${action}` 
      });

      // Update dominoes component if there are current dominoes
      if (currentState.currentDominoes && currentState.currentDominoes.length > 0) {
        dominoesComponent.setProps({ dominoes: currentState.currentDominoes });
      }

      // Update kingdom component if the current player has a kingdom
      if (currentPlayer && currentPlayer.kingdom) {
        kingdomComponent.setProps({ kingdom: currentPlayer.kingdom });
      }

      renderer.render();

      // Handle the action based on what's required
      if (action === "pickDomino") {
        // Show available dominoes
        console.log("\nAvailable dominoes:");
        const dominoChoices = currentState.currentDominoes.map(d => 
          `Domino #${d.domino.number}: ${d.domino.left.type} (${d.domino.left.crowns}) - ${d.domino.right.type} (${d.domino.right.crowns})`
        );

        const dominoIndex = await inputHandler.askMultipleChoice("Choose a domino:", dominoChoices);
        const dominoNumber = currentState.currentDominoes[dominoIndex].domino.number;

        // Choose the domino
        gameState = gameManager.chooseDomino(nextLord, dominoNumber);
      } else if (action === "placeDomino") {
        console.log("\nPlacing domino:");

        // Ask for coordinates and rotation
        const { x, y, rotation } = await inputHandler.askCoordinates("Where do you want to place the domino?");

        try {
          // Try to place the domino
          gameState = gameManager.placeDomino(nextLord, x, y, rotation);
        } catch (error) {
          console.log("Invalid placement. Discarding domino.");
          gameState = gameManager.discardDomino(nextLord);
        }
      }
    }

    // Game is over, show results
    if (gameManager.isGameWithNextStep() && gameManager.getNextStep() === "result") {
      const gameResult = gameManager.getResults();

      // Update game info with final results
      gameInfoComponent.setProps({ 
        gameState: gameManager.getCurrentState(), 
        message: "Game Over! Final Results:" 
      });

      renderer.render();

      // Display the results
      console.log("\n\nFinal Scores:");
      const results = gameResult.result;
      if (results) {
        results.forEach((result, index) => {
          console.log(`${index + 1}. ${result.playerName}: ${result.details.points} points`);
        });
      }
    }
  } finally {
    // Clean up
    inputHandler.close();
  }
}

// Run the application
main().catch(console.error);
