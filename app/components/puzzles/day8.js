import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay8 extends Component {
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
    fetch('/inputs/day8/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day8/full.txt')
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

  // BEGIN-SNIPPET day8
  parseInput(file) {
    return file.split('\n').map((line) => line.split(''));
  }

  getPairs(array) {
    let i,
      j,
      result = [];
    for (i = 0; i < array.length; i++) {
      for (j = i + 1; j < array.length; j++) {
        result.push([array[i], array[j]]);
      }
    }
    return result;
  }

  solve1(input) {
    if (input) {
      let beacons = new Map();
      let maxY = input.length;
      let maxX = input[0].length;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] !== '.') {
            beacons.set(input[y][x], [
              ...(beacons.get(input[y][x]) || []),
              [x, y],
            ]);
          }
        }
      }
      let set = new Set();
      beacons.forEach((beaconSeries) => {
        const beaconPairs = this.getPairs(beaconSeries);
        beaconPairs.forEach(([[x1, y1], [x2, y2]]) => {
          let diffX = x1 - x2;
          let diffY = y1 - y2;
          let newbx1, newbx2, newby1, newby2;
          newbx2 = x2 - diffX;
          newbx1 = x1 + diffX;
          newby2 = y2 - diffY;
          newby1 = y1 + diffY;
          if (newbx1 >= 0 && newbx1 < maxX && newby1 >= 0 && newby1 < maxY) {
            set.add(`${newbx1},${newby1}`);
          }
          if (newbx2 >= 0 && newbx2 < maxX && newby2 >= 0 && newby2 < maxY ) {
            set.add(`${newbx2},${newby2}`);
          }
        });
      });
      return set.size;
    }
  }

  solve2(input) {
    if (input) {
      let beacons = new Map();
      let maxY = input.length;
      let maxX = input[0].length;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          if (input[y][x] !== '.') {
            beacons.set(input[y][x], [
              ...(beacons.get(input[y][x]) || []),
              [x, y],
            ]);
          }
        }
      }
      let set = new Set();
      beacons.forEach((beaconSeries) => {
        const beaconPairs = this.getPairs(beaconSeries);
        beaconPairs.forEach(([[x1, y1], [x2, y2]]) => {
          set.add(`${x1},${y1}`);
          set.add(`${x2},${y2}`);
          let diffX = x1 - x2;
          let diffY = y1 - y2;
          let newbx1, newbx2, newby1, newby2;
          newbx2 = x2 - diffX;
          newbx1 = x1 + diffX;
          newby2 = y2 - diffY;
          newby1 = y1 + diffY;
          while (newbx1 >= 0 && newbx1 < maxX && newby1 >= 0 && newby1 < maxY) {
            set.add(`${newbx1},${newby1}`);
            newbx1 += diffX;
            newby1 += diffY;
          }
          while (newbx2 >= 0 && newbx2 < maxX && newby2 >= 0 && newby2 < maxY) {
            set.add(`${newbx2},${newby2}`);
            newbx2 -= diffX;
            newby2 -= diffY;
          }
        });
      });
      return set.size;
    }
  }
  // END-SNIPPET
}
