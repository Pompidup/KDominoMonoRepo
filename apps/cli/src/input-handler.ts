import * as readline from 'readline';

export interface InputHandler {
  askQuestion(question: string): Promise<string>;
  askMultipleChoice(question: string, choices: string[]): Promise<number>;
  askCoordinates(question: string): Promise<{ x: number; y: number; rotation: number }>;
  close(): void;
}

export function createInputHandler(): InputHandler {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return {
    askQuestion(question: string): Promise<string> {
      return new Promise((resolve) => {
        rl.question(`${question} `, (answer) => {
          resolve(answer.trim());
        });
      });
    },

    askMultipleChoice(question: string, choices: string[]): Promise<number> {
      return new Promise((resolve) => {
        console.log(question);
        choices.forEach((choice, index) => {
          console.log(`${index + 1}. ${choice}`);
        });
        
        rl.question('Enter your choice (number): ', (answer) => {
          const choice = parseInt(answer.trim(), 10);
          if (isNaN(choice) || choice < 1 || choice > choices.length) {
            console.log('Invalid choice. Please try again.');
            this.askMultipleChoice(question, choices).then(resolve);
          } else {
            resolve(choice - 1); // Convert to 0-based index
          }
        });
      });
    },

    askCoordinates(question: string): Promise<{ x: number; y: number; rotation: number }> {
      return new Promise((resolve) => {
        console.log(question);
        console.log('Format: x,y,rotation (e.g., 0,0,0)');
        console.log('Rotation: 0 = 0°, 1 = 90°, 2 = 180°, 3 = 270°');
        
        rl.question('Enter coordinates and rotation: ', (answer) => {
          const parts = answer.trim().split(',');
          if (parts.length !== 3) {
            console.log('Invalid format. Please use x,y,rotation format.');
            this.askCoordinates(question).then(resolve);
            return;
          }
          
          const x = parseInt(parts[0], 10);
          const y = parseInt(parts[1], 10);
          const rotation = parseInt(parts[2], 10);
          
          if (isNaN(x) || isNaN(y) || isNaN(rotation) || 
              rotation < 0 || rotation > 3) {
            console.log('Invalid values. Please try again.');
            this.askCoordinates(question).then(resolve);
            return;
          }
          
          resolve({ x, y, rotation });
        });
      });
    },

    close(): void {
      rl.close();
    }
  };
}