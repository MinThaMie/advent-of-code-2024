import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay18 extends Component {
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
    fetch('/inputs/day18/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text, 7, 12);
      });
    fetch('/inputs/day18/full.txt')
      .then((response) => response.text())
      .then((text) => {
        this.full = this.parseInput(text, 71, 1024);
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

  parseInput(input, size, amountFallen) {
    let memory = Array.from(Array(size), () => new Array(size).fill('.'));
    return [memory, size, input.split('\n'), amountFallen];
  }
  solve1(input) {
    if (input) {
      let [memory, max, coordinates, amountFallen] = input;
      coordinates.map((coor, i) => {
        if (i < amountFallen) {
          let [x, y] = coor.split(',');
          memory[y][x] = '#';
        }
      });
      const begin = '0,0';
      return this.dijkstra(memory, begin, `${max - 1},${max - 1}`);
    }
  }

  dijkstra(input, begin, end) {
    const distancesMap = new Map();
    const unvisited = new Set();
    const visited = new Set();
    const toVisit = new Set();
    input.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (input[y][x] == '.') {
          distancesMap.set(`${x},${y}`, Infinity);
          unvisited.add(`${x},${y}`);
        }
      });
    });
    distancesMap.set(begin, 0);
    let current = begin;
    while (!visited.has(end)) {
      const currentDistance = distancesMap.get(current);
      if (current == undefined) {
        return Infinity;
      }
      const neighbours = this.getNeighbours(current, input);
      neighbours
        .filter(([, coor]) => unvisited.has(coor))
        .forEach(([, coor]) => {
          const dist = distancesMap.get(coor);
          if (dist > currentDistance + 1) {
            toVisit.add(coor);
            distancesMap.set(coor, currentDistance + 1);
          }
        });
      visited.add(current);
      unvisited.delete(current);
      current = this.lowestKey(distancesMap, toVisit);
      toVisit.delete(current);
    }
    return distancesMap.get(end);
  }

  directions = [
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
  ];

  lowestKey(distance, unvisited) {
    let lowest = Infinity;
    let lowestK = undefined;
    unvisited.forEach((k) => {
      if (distance.get(k) < lowest) {
        lowest = distance.get(k);
        lowestK = k;
      }
    });
    return lowestK;
  }

  getNeighbours(coor, matrix) {
    const [x, y] = coor.split(',').map((v) => parseInt(v));
    const neighbours = [];
    for (let i = 0; i < this.directions.length; i++) {
      const neighbour =
        matrix[y + this.directions[i].dy]?.[x + this.directions[i].dx];
      if (neighbour) {
        if (neighbour !== '#') {
          neighbours.push([
            neighbour.charCodeAt(0),
            `${x + this.directions[i].dx},${y + this.directions[i].dy}`,
          ]);
        }
      }
    }
    return neighbours;
  }

  solve2(input) {
    if (input) {
      let [memory, max, coordinates, amountFallen] = input;
      let workingIndex = amountFallen;
      coordinates.map((coor, i) => {
        if (i <= workingIndex) {
          let [x, y] = coor.split(',');
          memory[y][x] = '#';
        }
      });
      const begin = '0,0';
      while (
        this.dijkstra(memory, begin, `${max - 1},${max - 1}`) !== Infinity
      ) {
        workingIndex++;
        let [x, y] = coordinates[workingIndex].split(',');
        memory[y][x] = '#';
      }
      return coordinates[workingIndex];
    }
  }
}
