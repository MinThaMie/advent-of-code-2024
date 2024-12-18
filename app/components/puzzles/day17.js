import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
export default class PuzzlesDay17 extends Component {
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
    fetch('/inputs/day17/intro.txt')
      .then((response) => response.text())
      .then((text) => {
        this.example = this.parseInput(text);
      });
    fetch('/inputs/day17/full.txt')
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
    return 2;
    return this.solve2(this.full);
  }

  // BEGIN-SNIPPET day17
  parseInput(file) {
    let [registers, program] = file.split('\n\n');
    registers = [...registers.matchAll(/\d+/g).map(Number)];
    program = [...program.matchAll(/\d+/g).map(Number)];
    return [registers, program];
  }

  solve1(input) {
    if (input) {
      let [[registerA, registerB, registerC], program] = input;
      let instructionPointer = 0;
      let output = [];
      while (instructionPointer < program.length) {
        let opCode = program[instructionPointer];
        let operand = program[instructionPointer + 1];
        let comboOperand = [
          () => 0,
          () => 1,
          () => 2,
          () => 3,
          () => registerA,
          () => registerB,
          () => registerC,
        ];
        switch (opCode) {
          case 0:
            registerA = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          case 1:
            registerB = registerB ^ operand;
            instructionPointer += 2;
            break;
          case 2:
            registerB = comboOperand[operand]() % 8;
            instructionPointer += 2;
            break;
          case 3:
            if (registerA == 0) {
              instructionPointer += 2;
            } else {
              instructionPointer = operand;
            }
            break;
          case 4:
            registerB = registerB ^ registerC;
            instructionPointer += 2;
            break;
          case 5:
            output.push(comboOperand[operand]() % 8);
            instructionPointer += 2;
            break;
          case 6:
            registerB = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          case 7:
            registerC = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          default:
            console.log('Wrong opCode');
            break;
        }
      }
      return output.join(',');
    }
  }

  solve2(input) {
    if (input) {
      let [[registerA, registerB, registerC], program] = input;
      let instructionPointer = 0;
      let output = [];
      while (instructionPointer < program.length) {
        let opCode = program[instructionPointer];
        let operand = program[instructionPointer + 1];
        let comboOperand = [
          () => 0,
          () => 1,
          () => 2,
          () => 3,
          () => registerA,
          () => registerB,
          () => registerC,
        ];
        switch (opCode) {
          case 0:
            registerA = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          case 1:
            registerB = registerB ^ operand;
            instructionPointer += 2;
            break;
          case 2:
            registerB = comboOperand[operand]() % 8;
            instructionPointer += 2;
            break;
          case 3:
            if (registerA == 0) {
              instructionPointer += 2;
            } else {
              instructionPointer = operand;
            }
            break;
          case 4:
            registerB = registerB ^ registerC;
            instructionPointer += 2;
            break;
          case 5:
            output.push(comboOperand[operand]() % 8);
            instructionPointer += 2;
            break;
          case 6:
            registerB = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          case 7:
            registerC = Math.floor(
              registerA / Math.pow(2, comboOperand[operand]()),
            );
            instructionPointer += 2;
            break;
          default:
            console.log('Wrong opCode');
            break;
        }
      }
    }
  }
  // END-SNIPPET
}
