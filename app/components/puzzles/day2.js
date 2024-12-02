import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay2 extends Component {
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
    fetch('/inputs/day2/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day2/full.txt')
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

  // BEGIN-SNIPPET day2
  parseInput(file) {
    return file.split('\n').map((line) => line.split(' ').map(Number));
  }

  isSafe(array) {
    let safe = false;
    let ascending = array[0] < array[1];
    for (let i = 0; i < array.length - 1; i++) {
      safe = false;
      let first = array[i];
      let second = array[i + 1];
      if ((ascending && first > second) || (!ascending && first < second)) {
        break;
      }
      let difference = Math.abs(first - second);
      if (difference > 3 || difference < 1) {
        break;
      }
      safe = true;
    }
    return safe;
  }

  solve1(input) {
    if (input) {
      let totalSafe = 0;
      input.forEach((array) => {
        if (this.isSafe(array)) totalSafe++;
      });
      return totalSafe;
    }
  }

  combinations(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
      this.combinations(arr.slice(i + 1), k - 1, [...prefix, v]),
    );
  }

  solve2(input) {
    if (input) {
      let totalSafe = 0;
      input.forEach((array) => {
        let combis = this.combinations(array, array.length - 1).filter(
          this.isSafe,
        );
        if (combis.length > 0) totalSafe++;
      });
      return totalSafe;
    }
  }
  // END-SNIPPET
}
