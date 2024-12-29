import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay13 extends Component {
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
    fetch('/inputs/day13/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day13/full.txt')
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

  // BEGIN-SNIPPET day13
  parseInput(file) {
    return file
      .split('\n\n')
      .map((block) => [...block.matchAll(/\d+/g).map(Number)]);
  }

  solve1(input) {
    if (input) {
      let total = 0;
      input.forEach((machine) => {
        let [xA, yA, xB, yB, targetX, targetY] = machine;
        //x/(b 1 c 2 -b 2 c 1 ) = y/(c 1 a 2 -c 2 a 1 ) = 1/(a 1 b 2 -a 2 b 1 )
        let dif = xA * yB - xB * yA;
        let nA = (xB * (-1 * targetY) - yB * (-1 * targetX)) / dif;
        let nB = (-1 * targetX * yA - -1 * targetY * xA) / dif;
        if (nA % 1 === 0 && nB % 1 === 0) {
          total += nA * 3 + nB;
        }
      });
      return total;
    }
  }

  solve2(input) {
    if (input) {
      let total = 0;
      input.forEach((machine) => {
        let [xA, yA, xB, yB, targetX, targetY] = machine;
        targetX += 10000000000000;
        targetY += 10000000000000;
        //x/(b 1 c 2 -b 2 c 1 ) = y/(c 1 a 2 -c 2 a 1 ) = 1/(a 1 b 2 -a 2 b 1 )
        let dif = xA * yB - xB * yA;
        let nA = (xB * (-1 * targetY) - yB * (-1 * targetX)) / dif;
        let nB = (-1 * targetX * yA - -1 * targetY * xA) / dif;
        if (nA % 1 === 0 && nB % 1 === 0) {
          total += nA * 3 + nB;
        }
      });
      return total;
    }
  }
  // END-SNIPPET
}
