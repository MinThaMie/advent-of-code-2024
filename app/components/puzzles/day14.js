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

  get exampleAnswer2() {
    return this.solve2(this.example);
  }

  get fullAnswer2() {
    return 1;
    return this.solve2(this.full);
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

  solve2(input) {
    if (input) {
      let total = 0;
      return total;
    }
  }
  // END-SNIPPET
}
