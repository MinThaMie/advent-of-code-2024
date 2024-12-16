import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay12 extends Component {
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
    fetch('/inputs/day12/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day12/full.txt')
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

  // BEGIN-SNIPPET day12
  parseInput(file) {
    return file.split('\n').map((str) => [...str]);
  }

  findRegion([currentX, currentY], input, perimeter, visited) {
    const directions = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    const key = `${currentX},${currentY}`;

    const neighbours = directions
      .map(([dx, dy]) => [currentX + dx, currentY + dy])
      .filter(([x, y]) => input[y]?.[x] == input[currentY][currentX]);
    if (!visited.has(key)) {
      perimeter.push(4 - neighbours.length);
    }
    visited.add(key);
    const toVisit = neighbours.filter(([x, y]) => !visited.has(`${x},${y}`));
    if (!toVisit) {
      return [perimeter, visited];
    }
    for (let i = 0; i < toVisit.length; i++) {
      [perimeter, visited] = this.findRegion(
        toVisit[i],
        input,
        perimeter,
        visited,
      );
    }
    return [perimeter, visited];
  }

  solve1(input) {
    if (input) {
      let total = 0;
      let visited = new Set();
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (!visited.has(`${x},${y}`)) {
            let perimeter = [];
            let ogSize = visited.size;
            [perimeter, visited] = this.findRegion(
              [x, y],
              input,
              perimeter,
              visited,
            );
            total +=
              (visited.size - ogSize) *
              perimeter.reduce((sum, val) => sum + val, 0);
          }
        }
      }
      return total;
    }
  }

  findDiscountedRegion(
    [currentX, currentY],
    input,
    perimeter,
    perDir,
    visited,
  ) {
    const directions = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    const key = `${currentX},${currentY}`;
    const neighbours = directions
      .map(([dx, dy]) => [currentX + dx, currentY + dy])
      .filter(([x, y]) => input[y]?.[x] == input[currentY][currentX]);
    visited.add(key);
    const toVisit = neighbours.filter(([x, y]) => !visited.has(`${x},${y}`));
    if (!toVisit) {
      return [perimeter, perDir, visited];
    }
    for (let i = 0; i < toVisit.length; i++) {
      if (perDir == 'x') {
        if (currentY !== toVisit[i][0]) {
          perimeter.push(1);
          perDir == 'y';
        }
      } else {
        if (currentX !== toVisit[i][0]) {
          perimeter.push(1);
          perDir == 'x';
        }
      }
      [perimeter, perDir, visited] = this.findDiscountedRegion(
        toVisit[i],
        input,
        perimeter,
        perDir,
        visited,
      );
    }
    return [perimeter, perDir, visited];
  }

  solve2(input) {
    if (input) {
      let total = 0;
      let visited = new Set();
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (!visited.has(`${x},${y}`)) {
            console.log(input[y][x]);
            let perimeter = [];
            let perDir = 'x';
            let ogSize = visited.size;
            [perimeter, perDir, visited] = this.findDiscountedRegion(
              [x, y],
              input,
              perimeter,
              perDir,
              visited,
            );
            console.log(perimeter);
            console.log(perimeter.reduce((sum, val) => sum + val, 0));
            total +=
              (visited.size - ogSize) *
              perimeter.reduce((sum, val) => sum + val, 0);
          }
        }
      }
      return total;
    }
  }
  // END-SNIPPET
}
