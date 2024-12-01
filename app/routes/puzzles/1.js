import Route from '@ember/routing/route';

export default class Puzzles1Route extends Route {
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

  async model() {
    return {
      example: await fetch('/inputs/day1/intro.txt')
        .then((response) => response.text())
        .then((text) => {
          return this.parseInput(text);
        }),
      full: await fetch('/inputs/day1/full.txt')
        .then((response) => response.text())
        .then((text) => {
          return this.parseInput(text);
        }),
    };
  }
}
