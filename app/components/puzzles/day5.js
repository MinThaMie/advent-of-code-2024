import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class PuzzlesDay5 extends Component {
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
    fetch('/inputs/day5/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day5/full.txt')
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

  // BEGIN-SNIPPET day5
  parseInput(file) {
    let [unparsedRules, unparsedInput] = file.split('\n\n');
    let rules = new Map();
    unparsedRules.split('\n').forEach((rule) => {
      let [first, second] = rule.split('|');
      rules.set(first, [...(rules.get(first) || []), second]);
    });
    let input = unparsedInput.split('\n').map((line) => line.split(','));
    return [rules, input];
  }

  checkLine(line, rules) {
    for (let i = 0; i < line.length; i++) {
      const pagenumber = line[i];
      let shouldBefore = rules.get(pagenumber) || [];
      for (const element of shouldBefore) {
        const elementIndex = line.indexOf(element);
        if (elementIndex !== -1 && elementIndex < i) {
          return false;
        }
      }
    }
    return true;
  }

  solve1([rules, input]) {
    if (input) {
      let total = 0;
      input.forEach((line) => {
        if (this.checkLine(line, rules)) {
          total += Number(line[Math.floor(line.length / 2)]);
        }
      });
      return total;
    }
  }

  solve2([rules, input]) {
    if (input) {
      let total = 0;
      input.forEach((line) => {
        while (!this.checkLine(line, rules)) {
          let fixedLine = [...line];
          for (let i = 0; i < line.length; i++) {
            const pagenumber = line[i];
            let shouldBefore = rules.get(pagenumber);
            if (shouldBefore) {
              for (let index = 0; index < shouldBefore.length; index++) {
                const element = shouldBefore[index];
                if (fixedLine.includes(element)) {
                  let ruleIndex = fixedLine.findIndex((x) => x === element);
                  if (ruleIndex < i) {
                    let temp = fixedLine[i];
                    fixedLine[i] = fixedLine[ruleIndex];
                    fixedLine[ruleIndex] = temp;
                  }
                }
              }
            }
            line = [...fixedLine];
          }
          if (this.checkLine(line, rules)) {
            total += Number(line[Math.floor(line.length / 2)]);
          }
        }
      });
      return total;
    }
  }
  // END-SNIPPET
}
