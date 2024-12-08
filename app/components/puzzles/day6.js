import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay6 extends Component {
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
    fetch('/inputs/day6/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day6/full.txt')
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
    return this.solve2(this.full);
  }

  // BEGIN-SNIPPET day6
  parseInput(file) {
    return file.split('\n').map((line) => line.split(''));
  }

  solve1(input) {
    if (input) {
      let visited = new Set();
      let guard;
      let maxY = input.length;
      let maxX = input[0].length;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] == '^') {
            guard = [x, y];
          }
        }
      }
      const directions = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      let direction = 0;
      let [currentX, currentY] = guard;
      visited.add(`${currentX},${currentY}`);
      let [nextX, nextY] = [
        currentX + directions[direction][0],
        currentY + directions[direction][1],
      ];
      while (nextX >= 0 && nextX < maxX && nextY >= 0 && nextY < maxY) {
        if (input[nextY][nextX] !== '#') {
          visited.add(`${nextX},${nextY}`);
          [currentX, currentY] = [nextX, nextY];
          [nextX, nextY] = [
            currentX + directions[direction][0],
            currentY + directions[direction][1],
          ];
        } else {
          direction = (direction + 1) % 4;
          [nextX, nextY] = [
            currentX + directions[direction][0],
            currentY + directions[direction][1],
          ];
          if (input[nextY][nextX] !== '#') {
            visited.add(`${nextX},${nextY}`);
          }
        }
      }
      return visited.size;
    }
  }

  solve2(input) {
    if (input) {
      let possibleObstacles = new Set();
      let amountOfLoops = 0;
      let guard;
      let maxY = input.length;
      let maxX = input[0].length;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] == '^') {
            guard = [x, y];
          }
        }
      }
      const directions = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      let direction = 0;
      let [currentX, currentY] = guard;
      let [nextX, nextY] = [
        currentX + directions[direction][0],
        currentY + directions[direction][1],
      ];
      while (nextX >= 0 && nextX < maxX && nextY >= 0 && nextY < maxY) {
        if (input[nextY][nextX] !== '#') {
          possibleObstacles.add(`${nextX},${nextY}`);
          [currentX, currentY] = [nextX, nextY];
          [nextX, nextY] = [
            currentX + directions[direction][0],
            currentY + directions[direction][1],
          ];
        } else {
          direction = (direction + 1) % 4;
          [nextX, nextY] = [
            currentX + directions[direction][0],
            currentY + directions[direction][1],
          ];
          if (input[nextY][nextX] !== '#') {
            possibleObstacles.add(`${nextX},${nextY}`);
          }
        }
      }
      possibleObstacles = [...possibleObstacles].filter(
        (obs) => obs !== `${guard[0]},${guard[1]}`,
      );
      while (possibleObstacles.length > 0) {
        let obstacle = possibleObstacles.shift();
        direction = 0;
        [currentX, currentY] = guard;
        [nextX, nextY] = [
          currentX + directions[direction][0],
          currentY + directions[direction][1],
        ];
        let inPossibleLoop = false;
        let loop = [];
        while (nextX >= 0 && nextX < maxX && nextY >= 0 && nextY < maxY) {
          if (input[nextY][nextX] !== '#' && `${nextX},${nextY}` !== obstacle) {
            [currentX, currentY] = [nextX, nextY];
            [nextX, nextY] = [
              currentX + directions[direction][0],
              currentY + directions[direction][1],
            ];
          } else {
            if (`${nextX},${nextY}` == obstacle) {
              inPossibleLoop = true;
            }
            direction = (direction + 1) % 4;
            [nextX, nextY] = [
              currentX + directions[direction][0],
              currentY + directions[direction][1],
            ];
            if (loop.includes(`${nextX},${nextY},${direction}`)) {
              amountOfLoops++;
              break;
            }
            if (
              inPossibleLoop &&
              !loop.includes(`${nextX},${nextY},${direction}`)
            ) {
              loop.push(`${nextX},${nextY},${direction}`);
            }
          }
        }
      }
      return amountOfLoops;
    }
  }
  // END-SNIPPET
}
