import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay23 extends Component {
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
    fetch('/inputs/day23/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day23/full.txt')
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

  // BEGIN-SNIPPET day23
  makeAdjecencyList(input) {
    let adjacencyList = {};
    input.forEach(([source, destination]) => {
      if (!adjacencyList[source]) {
        adjacencyList[source] = [];
      }
      if (!adjacencyList[destination]) {
        adjacencyList[destination] = [];
      }
      adjacencyList[source].push(destination);
      adjacencyList[destination].push(source);
    });
    return adjacencyList;
  }

  parseInput(file) {
    return file.split('\n').map((n) => n.split('-'));
  }

  solve1(input) {
    if (input) {
      let adjacencyList = this.makeAdjecencyList(input);
      let triples = [];
      for (const [key, values] of Object.entries(adjacencyList)) {
        values.forEach((v1) => {
          let potentialThirds = adjacencyList[v1];
          potentialThirds.forEach((v2) => {
            if (values.includes(v2)) {
              let array = [key, v1, v2].sort().join(',');
              if (
                !triples.includes(array) &&
                (key[0] == 't' || v1[0] == 't' || v2[0] == 't')
              ) {
                triples.push(array);
              }
            }
          });
        });
      }
      return triples.length;
    }
  }

  bronKerbosch(clique, toVisit, excluded, graph) {
    let cliques = new Set();
    if (toVisit.size === 0 && excluded.size === 0) {
      cliques.add(new Set(clique));
    }
    for (let v of toVisit) {
      let newClique = new Set(clique);
      newClique.add(v);
      let newToVisit = new Set([...toVisit].filter((x) => graph.get(v).has(x)));
      let newExcluded = new Set(
        [...excluded].filter((x) => graph.get(v).has(x)),
      );
      cliques = new Set([
        ...cliques,
        ...this.bronKerbosch(newClique, newToVisit, newExcluded, graph),
      ]);
      toVisit.delete(v);
      newExcluded.add(v);
    }
    return cliques;
  }

  solve2(input) {
    if (input) {
      let graph = new Map();
      for (let edge of input) {
        let [u, v] = edge;
        graph.set(u, (graph.get(u) || new Set()).add(v));
        graph.set(v, (graph.get(v) || new Set()).add(u));
      }

      let vertices = new Set(graph.keys());

      let allCliques = this.bronKerbosch(new Set(), vertices, new Set(), graph);
      let largestSet = new Set();
      allCliques.forEach((clique) => {
        if (clique.size > largestSet.size) {
          largestSet = clique;
        }
      });
      return [...largestSet].sort().join(',');
    }
  }
  // END-SNIPPET
}
