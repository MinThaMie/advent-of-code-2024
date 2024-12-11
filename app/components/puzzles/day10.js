import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay10 extends Component {
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
    fetch('/inputs/day10/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day10/full.txt')
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

  // BEGIN-SNIPPET day10
  parseInput(file) {
    return file.split('\n').map((str) => [...str].map(Number));
  }

  countPaths(currentValue, [currentX, currentY], input) {
    const directions = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    if (currentValue === 9) {
      return 1;
    }

    const neighbours = directions
      .map(([dx, dy]) => [currentX + dx, currentY + dy])
      .filter(([x, y]) => input[y]?.[x] == currentValue + 1);
    let countValidPaths = 0;
    for (let i = 0; i < neighbours.length; i++) {
      countValidPaths += this.countPaths(
        currentValue + 1,
        neighbours[i],
        input,
      );
    }
    return countValidPaths;
  }

  findPeaks(currentValue, [currentX, currentY], input, peaks) {
    const directions = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    if (currentValue === 9) {
      peaks.add(`${currentX},${currentY}`);
      return peaks;
    }

    const neighbours = directions
      .map(([dx, dy]) => [currentX + dx, currentY + dy])
      .filter(([x, y]) => input[y]?.[x] == currentValue + 1);
    for (let i = 0; i < neighbours.length; i++) {
      peaks = this.findPeaks(currentValue + 1, neighbours[i], input, peaks);
    }
    return peaks;
  }

  solve1(input) {
    if (input) {
      let total = 0;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] == 0) {
            total += this.findPeaks(0, [x, y], input, new Set()).size;
          }
        }
      }
      return total;
    }
  }

  solve2(input) {
    if (input) {
      let total = 0;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] == 0) {
            total += this.countPaths(0, [x, y], input);
          }
        }
      }
      return total;
    }
  }
  // END-SNIPPET
}
