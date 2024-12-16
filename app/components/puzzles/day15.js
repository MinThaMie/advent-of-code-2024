import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay15 extends Component {
  @tracked example;
  @tracked full;
  @tracked showSolution = false;

  @action toggleShowSolution() {
    this.showSolution = !this.showSolution;
  }

  rules({ newItems }) {
    if (newItems[0]) {
      return toLeft;
    } else {
      return toRight;
    }
  }

  constructor() {
    super(...arguments);
    fetch('/inputs/day15/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day15/full.txt')
      .then((response) => response.text())
      .then((text) => {
        this.full = this.parseInput(text);
      });
  }

  get exampleAnswer1() {
    return this.solve1(this.example);
  }

  get fullAnswer1() {
    return this.solve1(this.full);
  }

  get exampleAnswer2() {
    return this.solve2(this.example);
  }

  get fullAnswer2() {
    return 1;
    return this.solve2(this.full);
  }

  // BEGIN-SNIPPET day15
  parseInput(file) {
    let [field, instructions] = file.split('\n\n');
    field = field.split('\n').map((line) => line.split(''));
    instructions = instructions.split('').filter((instr) => instr !== '\n');
    return [field, instructions];
  }

  solve1(input) {
    if (input) {
      let [field, instructions] = input;
      field = structuredClone(field);
      let currentX, currentY;
      let total = 0;
      for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
          if (field[y][x] == '@') {
            [currentX, currentY] = [x, y];
            field[y][x] = '.';
            break;
          }
        }
      }
      instructions.forEach((instruction) => {
        let newY, newX;
        switch (instruction) {
          case '^':
            newY = currentY - 1;
            if (field[newY][currentX] == '.') {
              currentY = newY;
            } else if (field[newY][currentX] == 'O') {
              let firstBoxY = newY;
              while (field[newY - 1][currentX] == 'O') {
                newY--;
              }
              if (field[newY - 1][currentX] == '.') {
                field[newY - 1][currentX] = 'O';
                field[firstBoxY][currentX] = '.';
                currentY = firstBoxY;
              }
            }
            break;
          case 'v':
            newY = currentY + 1;
            if (field[newY][currentX] == '.') {
              currentY = newY;
            } else if (field[newY][currentX] == 'O') {
              let firstBoxY = newY;
              while (field[newY + 1][currentX] == 'O') {
                newY++;
              }
              if (field[newY + 1][currentX] == '.') {
                field[newY + 1][currentX] = 'O';
                field[firstBoxY][currentX] = '.';
                currentY = firstBoxY;
              }
            }
            break;
          case '<':
            newX = currentX - 1;
            if (field[currentY][newX] == '.') {
              currentX = newX;
            } else if (field[currentY][newX] == 'O') {
              let firstBoxX = newX;
              while (field[currentY][newX - 1] == 'O') {
                newX--;
              }
              if (field[currentY][newX - 1] == '.') {
                field[currentY][newX - 1] = 'O';
                field[currentY][firstBoxX] = '.';
                currentX = firstBoxX;
              }
            }
            break;
          case '>':
            newX = currentX + 1;
            if (field[currentY][newX] == '.') {
              currentX = newX;
            } else if (field[currentY][newX] == 'O') {
              let firstBoxX = newX;
              while (field[currentY][newX + 1] == 'O') {
                newX++;
              }
              if (field[currentY][newX + 1] == '.') {
                field[currentY][newX + 1] = 'O';
                field[currentY][firstBoxX] = '.';
                currentX = firstBoxX;
              }
            }
            break;
          default:
            console.log(`Sorry, we are out of ${expr}.`);
        }
      });
      for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
          if (field[y][x] == 'O') {
            total += 100 * y + x;
          }
        }
      }
      return total;
    }
  }

  findSpots(x, y, dir, input) {
    console.log(x, y, input[y][x], input[y + dir][x]);
    let xDir = input[y][x] == ']' ? -1 : 1;
    let opposite = input[y][x] == ']' ? '[' : ']';
    if (input[y + dir][x] == input[y][x]) {
      console.log("same");
      return [...this.findSpots(x, y + dir, dir, input)];
    } else if (input[y][x] == '.' && input[y][x + xDir] == '.') {
      console.log('both free');
      return [y];
    } else if (input[y][x] == '#') {
      console.log("wall");
      return [-1];
    } else if (opposite == input[y + dir][x]) {
      console.log("opposite");
      return [
        ...this.findSpots(x, y + dir, dir, input),
        ...this.findSpots(x + xDir, y + dir, dir, input),
      ];
    } else {
      return 'banaan';
    }
  }

  solve2(input) {
    if (input) {
      let [field, instructions] = input;
      let wideField = [];
      for (let y = 0; y < field.length; y++) {
        wideField.push([]);
        for (let x = 0; x < field[y].length; x++) {
          if (field[y][x] == '@') {
            wideField[y].push(...'@.');
          }
          if (field[y][x] == '#') {
            wideField[y].push(...'##');
          }
          if (field[y][x] == 'O') {
            wideField[y].push(...'[]');
          }
          if (field[y][x] == '.') {
            wideField[y].push(...'..');
          }
        }
      }
      let currentX, currentY;
      let total = 0;
      for (let y = 0; y < wideField.length; y++) {
        for (let x = 0; x < wideField[y].length; x++) {
          if (wideField[y][x] == '@') {
            [currentX, currentY] = [x, y];
            wideField[y][x] = '.';
            break;
          }
        }
      }
      instructions.forEach((instruction) => {
        let newY, newX;
        console.log(currentX, currentY, instruction);
        wideField.forEach(v => console.log(...v));
        switch (instruction) {
          case '^':
            newY = currentY - 1;
            if (wideField[newY][currentX] == '.') {
              currentY = newY;
            } else if (
              wideField[newY][currentX] == '[' ||
              wideField[newY][currentX] == ']'
            ) {
              let firstBoxY = newY;
              console.log(this.findSpots(currentX, newY, -1, wideField));
              // while (wideField[newY - 1][currentX] == 'O') {
              //   newY--;
              // }
              // if (wideField[newY - 1][currentX] == '.') {
              //   wideField[newY - 1][currentX] = 'O';
              //   wideField[firstBoxY][currentX] = '.';
              //   currentY = firstBoxY;
              // }
            }
            break;
          case 'v':
            newY = currentY + 1;
            if (wideField[newY][currentX] == '.') {
              currentY = newY;
            } else if (
              wideField[newY][currentX] == '[' ||
              wideField[newY][currentX] == ']'
            ) {
              let firstBoxY = newY;
              while (wideField[newY + 1][currentX] == 'O') {
                newY++;
              }
              if (wideField[newY + 1][currentX] == '.') {
                wideField[newY + 1][currentX] = 'O';
                wideField[firstBoxY][currentX] = '.';
                currentY = firstBoxY;
              }
            }
            break;
          case '<':
            newX = currentX - 1;
            if (wideField[currentY][newX] == '.') {
              currentX = newX;
            } else if (wideField[currentY][newX] == ']') {
              let firstBoxX = newX;
              while (wideField[currentY][newX - 2] == ']') {
                newX -= 2;
              }
              if (wideField[currentY][newX - 2] == '.') {
                let newRow = [...wideField[currentY]];
                newRow.splice(newX - 2, 1);
                newRow.splice(firstBoxX, 0, '.');
                wideField[currentY] = newRow;
                wideField.forEach(v => console.log(...v));
                currentX = firstBoxX;
              }
            }
            break;
          case '>':
            newX = currentX + 1;
            if (wideField[currentY][newX] == '.') {
              currentX = newX;
            } else if (wideField[currentY][newX] == '[') {
              let firstBoxX = newX;
              while (wideField[currentY][newX + 2] == '[') {
                newX += 2;
              }
              if (wideField[currentY][newX + 2] == '.') {
                let newRow = [...wideField[currentY]];
                newRow.splice(newX + 2, 1);
                newRow.splice(firstBoxX, 0, '.');
                wideField[currentY] = newRow;
                currentX = firstBoxX;
              }
            }
            break;
          default:
            console.log(`Sorry, we are out of ${expr}.`);
        }
      });
      for (let y = 0; y < wideField.length; y++) {
        for (let x = 0; x < wideField[y].length; x++) {
          if (wideField[y][x] == 'O') {
            total += 100 * y + x;
          }
        }
      }
      return total;
    }
  }
  // END-SNIPPET
}
