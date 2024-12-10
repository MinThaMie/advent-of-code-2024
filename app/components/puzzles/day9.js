import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay9 extends Component {
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
    fetch('/inputs/day9/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day9/full.txt')
      .then((response) => response.text())
      .then((text) => {
        this.full = this.parseInput(text);
      });
  }

  get exampleAnswer1() {
    return this.solve1(this.example);
  }

  get fullAnswer1() {
    // return 1;
    return this.solve1(this.full);
  }

  get exampleAnswer2() {
    return this.solve2(this.example);
  }

  get fullAnswer2() {
    // return 2;
    return this.solve2(this.full);
  }

  // BEGIN-SNIPPET day9
  parseInput(file) {
    return [...file].map(Number);
  }

  solve1(input) {
    if (input) {
      let total = 0;
      let realArray = [];
      let idNumber = 0;
      for (let index = 0; index < input.length; index++) {
        if (index % 2 !== 0) {
          realArray.push(...new Array(input[index]));
        } else {
          realArray.push(...new Array(input[index]).fill(idNumber++));
        }
      }
      let toManipulate = [...realArray];
      for (let index = 0; index < realArray.length; index++) {
        const element = realArray[index];
        if (element == undefined) {
          let last = toManipulate.pop();
          while (last == undefined) {
            last = toManipulate.pop();
          }
          toManipulate[index] = last;
        }
      }
      toManipulate = toManipulate.filter((x) => x !== undefined);
      for (let index = 0; index < toManipulate.length; index++) {
        total += index * toManipulate[index];
      }
      return total;
    }
  }

  solve2(input) {
    if (input) {
      let total = 0;
      let realArray = [];
      let toManipulate = [...input];
      let idNumber = 0;
      for (let index = 0; index < input.length; index++) {
        if (index % 2 !== 0) {
          realArray.push(...new Array(input[index]));
        } else {
          realArray.push(...new Array(input[index]).fill(idNumber++));
        }
      }
      for (let index = input.length - 1; index >= 0; index -= 2) {
        let sizeOfSpaceNeeded = input[index];
        let spaceIndex = toManipulate.findIndex(
          (x, i) => x >= sizeOfSpaceNeeded && i % 2 !== 0,
        );
        if (spaceIndex > 0 && spaceIndex < index) {
          let amount = index / 2;
          realArray = realArray.map((x) => (x === amount ? undefined : x));
          let insertAt = toManipulate
            .slice(0, spaceIndex)
            .reduce((sum, val) => sum + val, 0);
          realArray.splice(
            insertAt,
            sizeOfSpaceNeeded,
            ...new Array(sizeOfSpaceNeeded).fill(amount),
          );
          toManipulate[spaceIndex] -= sizeOfSpaceNeeded;
          toManipulate[spaceIndex - 1] += sizeOfSpaceNeeded;
        }
      }
      for (let index = 0; index < realArray.length; index++) {
        if (realArray[index] !== undefined) {
          total += index * realArray[index];
        }
      }
      return total;
    }
  }
  // END-SNIPPET
}
