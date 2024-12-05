import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay4 extends Component {
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
    fetch('/inputs/day4/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day4/full.txt')
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

  // BEGIN-SNIPPET day4
  parseInput(file) {
    return file.split('\n').map((line) => line.split(''));
  }

  checkHorizontal(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y][x + 1]}${input[y][x + 2]}${input[y][x + 3]}`
    );
  }

  checkHorizontalBackwards(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y][x - 1]}${input[y][x - 2]}${input[y][x - 3]}`
    );
  }
  checkVerticalUp(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y - 1]?.[x]}${input[y - 2]?.[x]}${input[y - 3]?.[x]}`
    );
  }

  checkVerticalDown(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y + 1]?.[x]}${input[y + 2]?.[x]}${input[y + 3]?.[x]}`
    );
  }

  checkDiagonalLR(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y + 1]?.[x + 1]}${input[y + 2]?.[x + 2]}${input[y + 3]?.[x + 3]}`
    );
  }

  checkDiagonalLRBackwards(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y - 1]?.[x - 1]}${input[y - 2]?.[x - 2]}${input[y - 3]?.[x - 3]}`
    );
  }

  checkDiagonalRL(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y + 1]?.[x - 1]}${input[y + 2]?.[x - 2]}${input[y + 3]?.[x - 3]}`
    );
  }

  checkDiagonalRLBackwards(input, x, y) {
    return (
      'XMAS' ==
      `${input[y][x]}${input[y - 1]?.[x + 1]}${input[y - 2]?.[x + 2]}${input[y - 3]?.[x + 3]}`
    );
  }

  solve1(input) {
    if (input) {
      let totalXMASs = 0;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          let char = input[y][x];
          if (char == 'X') {
            totalXMASs +=
              this.checkHorizontal(input, x, y) +
              this.checkHorizontalBackwards(input, x, y) +
              this.checkVerticalUp(input, x, y) +
              this.checkVerticalDown(input, x, y) +
              this.checkDiagonalLR(input, x, y) +
              this.checkDiagonalLRBackwards(input, x, y) +
              this.checkDiagonalRL(input, x, y) +
              this.checkDiagonalRLBackwards(input, x, y);
          }
        }
      }
      return totalXMASs;
    }
  }

  solve2(input) {
    if (input) {
      let totalXMASs = 0;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          let char = input[y][x];
          if (char == 'A') {
            totalXMASs +=
              ((input[y - 1]?.[x - 1] == 'M' && input[y + 1]?.[x + 1] == 'S') ||
                (input[y - 1]?.[x - 1] == 'S' &&
                  input[y + 1]?.[x + 1] == 'M')) &&
              ((input[y - 1]?.[x + 1] == 'M' && input[y + 1]?.[x - 1] == 'S') ||
                (input[y - 1]?.[x + 1] == 'S' && input[y + 1]?.[x - 1] == 'M'));
          }
        }
      }
      return totalXMASs;
    }
  }
  // END-SNIPPET
}
