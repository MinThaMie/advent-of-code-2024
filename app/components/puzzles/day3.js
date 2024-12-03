import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay3 extends Component {
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
    fetch('/inputs/day3/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day3/full.txt')
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

  // BEGIN-SNIPPET day3
  parseInput(file) {
    return file;
  }

  solve1(input) {
    if (input) {
      input = [...input.matchAll(/mul\((\d*),(\d*)\)/g)];
      let total = 0;
      input.forEach(([, a, b]) => {
        total += a * b;
      });
      return total;
    }
  }

  solve2(input) {
    if (input) {
      input = [...input.matchAll(/mul\((\d*),(\d*)\)|do\(\)|don't\(\)/g)];
      let total = 0;
      let enabled = true;
      input.forEach(([command, a, b]) => {
        if (command == `don't()`) {
          enabled = false;
        } else if (command == `do()`) {
          enabled = true;
        } else {
          if (enabled) {
            total += a * b;
          }
        }
      });
      return total;
    }
  }
  // END-SNIPPET
}
