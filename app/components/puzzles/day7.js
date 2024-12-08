import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay7 extends Component {
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
    fetch('/inputs/day7/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day7/full.txt')
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

  // BEGIN-SNIPPET day7
  parseInput(file) {
    return file
      .split('\n')
      .map((line) => [...line.match(/\d+/g)].map((x) => Number(x)));
  }

  isValid1(answer, parts) {
    let a, b, rest;
    [a, b, ...rest] = parts;
    if (parts.length > 2) {
      return (
        this.isValid1(answer, [a + b, ...rest]) ||
        this.isValid1(answer, [a * b, ...rest])
      );
    } else {
      return answer == a + b || answer == a * b;
    }
  }

  solve1(input) {
    if (input) {
      let total = 0;
      input.forEach((line) => {
        let answer, parts;
        [answer, ...parts] = line;
        if (this.isValid1(answer, parts)) {
          total += answer;
        }
      });
      return total;
    }
  }

  isValid2(answer, parts) {
    let a, b, rest;
    [a, b, ...rest] = parts;
    if (parts.length > 2) {
      return (
        this.isValid2(answer, [a + b, ...rest]) ||
        this.isValid2(answer, [a * b, ...rest]) ||
        this.isValid2(answer, [Number(`${a}${b}`), ...rest])
      );
    } else {
      return answer == a + b || answer == a * b || answer == Number(`${a}${b}`);
    }
  }

  solve2(input) {
    if (input) {
      let total = 0;
      input.forEach((line) => {
        let answer, parts;
        [answer, ...parts] = line;
        if (this.isValid2(answer, parts)) {
          total += answer;
        }
      });
      return total;
    }
  }
  // END-SNIPPET
}
