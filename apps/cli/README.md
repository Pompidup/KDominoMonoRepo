# Kingdomino CLI Client

A command-line interface client for playing the Kingdomino game, built using the [@pompidup/cligrid](../../libs/cligrid) library and the [@pompidup/kingdomino-engine](https://www.npmjs.com/package/@pompidup/kingdomino-engine) game engine.

## Features

- Play Kingdomino in your terminal
- Support for 2-4 players
- Interactive UI with responsive layout
- Turn-based gameplay
- Domino selection and placement
- Score calculation

## Installation

Since this is part of a monorepo, you'll need to clone the entire repository and install dependencies:

```bash
git clone https://github.com/Pompidup/KDominoMonoRepo.git
cd KDominoMonoRepo
pnpm install
```

## Development

To run the client in development mode:

```bash
# From the root of the monorepo
pnpm dev --filter=@pompidup/kingdomino-cli

# Or from the cli directory
cd apps/cli
pnpm dev
```

## Building

To build the client:

```bash
# From the root of the monorepo
pnpm build --filter=@pompidup/kingdomino-cli

# Or from the cli directory
cd apps/cli
pnpm build
```

## Running

To run the client after building:

```bash
# From the root of the monorepo
pnpm start --filter=@pompidup/kingdomino-cli

# Or from the cli directory
cd apps/cli
pnpm start
```

## How to Play

1. Start the game
2. Enter player names when prompted (comma-separated)
3. Follow the on-screen instructions for each turn
4. When it's your turn to pick a domino, select from the available options
5. When it's your turn to place a domino, enter the coordinates and rotation
6. The game will automatically calculate scores at the end

## Game Rules

Kingdomino is a tile-placement game where players build kingdoms by connecting domino-like tiles with different terrains. The goal is to create the most valuable kingdom by the end of the game.

Basic rules:
- Each player starts with a castle tile in the center of their kingdom
- Players take turns selecting and placing dominoes
- Dominoes must be placed according to the matching rules (same terrain types must connect)
- The game ends when all dominoes have been placed
- Scores are calculated based on the size of connected terrain areas and the number of crowns in those areas

For detailed rules, refer to the [official Kingdomino rules](https://www.ultraboardgames.com/kingdomino/game-rules.php).

## License

MIT