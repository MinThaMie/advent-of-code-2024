/* eslint-disable no-unused-vars */

import PuzzlesBaseController from './base';

export default class Puzzles1Controller extends PuzzlesBaseController {
  // BEGIN-SNIPPET day1-solution1
  solve1(input) {
    let [first, second] = input;
    first.sort();
    second.sort();
    let distance = 0;
    for (let i = 0; i < first.length; i++) {
      distance += Math.abs(first[i] - second[i]);
    }
    return distance;
  }
  // END-SNIPPET

  // BEGIN-SNIPPET day1-solution2
  solve2(input) {
    let [left, right] = input;
    let similarityScore = 0;
    left.forEach((id) => {
      similarityScore += parseInt(id) * right.filter((v) => v == id).length;
    });
    return similarityScore;
  }
  // END-SNIPPET
}
