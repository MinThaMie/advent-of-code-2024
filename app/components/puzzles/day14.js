import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay14 extends Component {
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
    fetch('/inputs/day14/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day14/full.txt')
      .then((response) => response.text())
      .then((text) => {
        this.full = this.parseInput(text);
      });
  }

  get exampleAnswer1() {
    return this.solve1(this.example, 11, 7);
  }

  get fullAnswer1() {
    // return 1;
    return this.solve1(this.full, 101, 103);
  }

  get fullAnswer2() {
    return this.solve2(this.full, 101, 103);
  }

  // BEGIN-SNIPPET day14
  parseInput(file) {
    return file
      .split('\n')
      .map((line) => [...line.matchAll(/-?\d+/g).map(Number)]);
  }

  solve1(input, width, height) {
    if (input) {
      let robotsQ1 = 0;
      let robotsQ2 = 0;
      let robotsQ3 = 0;
      let robotsQ4 = 0;
      input.forEach((robot) => {
        let [x, y, vX, vY] = robot;
        let finalX = (x + width + ((vX * 100) % width)) % width;
        let finalY = (y + height + ((vY * 100) % height)) % height;
        if (finalX < Math.floor(width / 2) && finalY < Math.floor(height / 2)) {
          robotsQ1 += 1;
        }
        if (finalX > Math.floor(width / 2) && finalY < Math.floor(height / 2)) {
          robotsQ2 += 1;
        }
        if (finalX < Math.floor(width / 2) && finalY > Math.floor(height / 2)) {
          robotsQ3 += 1;
        }
        if (finalX > Math.floor(width / 2) && finalY > Math.floor(height / 2)) {
          robotsQ4 += 1;
        }
      });
      return robotsQ1 * robotsQ2 * robotsQ3 * robotsQ4;
    }
  }

  findRegion([currentX, currentY], input, visited) {
    const directions = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    const key = `${currentX},${currentY}`;

    const neighbours = directions
      .map(([dx, dy]) => [currentX + dx, currentY + dy])
      .filter(
        ([neighX, neighY]) =>
          input.filter(([x, y, ,]) => x == neighX && y == neighY).length > 0,
      );
    visited.add(key);
    const toVisit = neighbours.filter(([x, y]) => !visited.has(`${x},${y}`));
    if (!toVisit) {
      return visited;
    }
    for (let i = 0; i < toVisit.length; i++) {
      visited = this.findRegion(toVisit[i], input, visited);
    }
    return visited;
  }

  printTree(input, width, height) {
    let grid = [...Array(height)].map(() => Array(width).fill('.'));
    input.forEach(([x, y, ,]) => {
      grid[y][x] = '#';
    });
    grid.forEach((v) => console.log(...v));
  }
  solve2(input, width, height) {
    if (input) {
      let time = 0;
      let foundChristmasTree = false;
      while (!foundChristmasTree) {
        time++;
        input = input.map((robot) => {
          let [x, y, vX, vY] = robot;
          return [(x + width + vX) % width, (y + height + vY) % height, vX, vY];
        });
        let visited = new Set();
        for (let i = 0; i < input.length; i++) {
          let [x, y, ,] = input[i];
          if (!visited.has(`${x},${y}`)) {
            let neighbours = this.findRegion([x, y], input, new Set());
            visited = new Set([...visited, ...neighbours]);
            if (neighbours.size > 100) {
              foundChristmasTree = true;
              this.printTree(input, width, height);
              break;
            }
          }
        }
      }
      return time;
    }
  }
  // END-SNIPPET
}
