import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay11 extends Component {
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
    fetch('/inputs/day11/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day11/full.txt')
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

  // BEGIN-SNIPPET day11
  parseInput(file) {
    return file.split(' ');
  }

  solvedNumbers = new Map();

  blinkAtStone(element, blinkNum, max) {
    if (this.solvedNumbers.has(`${element},${blinkNum},${max}`)) {
      return this.solvedNumbers.get(`${element},${blinkNum},${max}`);
    }
    if (blinkNum == max) {
      return 1;
    }
    let amount = 0;
    if (element == '0') {
      amount += this.blinkAtStone('1', blinkNum + 1, max);
    } else if (element.length % 2 == 0) {
      let splitIndex = element.length / 2;
      amount +=
        this.blinkAtStone(
          String(Number(element.substring(0, splitIndex))),
          blinkNum + 1,
          max,
        ) +
        this.blinkAtStone(
          String(Number(element.substring(splitIndex))),
          blinkNum + 1,
          max,
        );
    } else {
      amount += this.blinkAtStone(String(element * 2024), blinkNum + 1, max);
    }
    this.solvedNumbers.set(`${element},${blinkNum},${max}`, amount);
    return amount;
  }

  solve1(input) {
    if (input) {
      let total = 0;
      input.forEach((element) => {
        total += this.blinkAtStone(element, 0, 25);
      });
      return total;
    }
  }

  solve2(input) {
    if (input) {
      let total = 0;
      input.forEach((element) => {
        total += this.blinkAtStone(element, 0, 75);
      });
      return total;
    }
  }
  // END-SNIPPET
}
