import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputtoggleComponent extends Component {
  @tracked input = true;
  @tracked focused = false;
  @action
  toggle() {
    this.input = !this.input;
    this.args.toggle?.(this.input);
  }

  @action
  handleFocusIn() {
    this.focused = true;
  }

  @action
  handleFocusOut() {
    this.focused = false;
  }
}
