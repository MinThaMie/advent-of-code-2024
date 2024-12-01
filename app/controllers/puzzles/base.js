import Controller from '@ember/controller';

export default class PuzzlesBaseController extends Controller {
  get example1() {
    console.log(this.model);
    return this.solve1(this.model.example);
  }
  get solution1() {
    return this.solve1(this.model.full);
  }
  get example2() {
    return this.solve2(this.model.example);
  }
  get solution2() {
    return this.solve2(this.model.full);
  }
}
