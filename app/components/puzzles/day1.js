import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay1 extends Component {
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
    fetch('/inputs/day1/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day1/full.txt')
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

  // BEGIN-SNIPPET day1
  parseInput(file) {
    const first = [];
    const second = [];
    file.split('\n').forEach((element) => {
      const [f, l] = element.split('   ');
      first.push(f);
      second.push(l);
    });
    return [first, second];
  }

  solve1(input) {
    console.log(input);
    if (input) {
      let [first, second] = input;
      first.sort();
      second.sort();
      let distance = 0;
      for (let i = 0; i < first.length; i++) {
        distance += Math.abs(first[i] - second[i]);
      }
      return distance;
    }
  }

  solve2(input) {
    if (input) {
      let [left, right] = input;
      let similarityScore = 0;
      left.forEach((id) => {
        similarityScore += parseInt(id) * right.filter((v) => v == id).length;
      });
      return similarityScore;
    }
  }
  // END-SNIPPET
}
