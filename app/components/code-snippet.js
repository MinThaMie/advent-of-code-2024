import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CodeSnippetComponent extends Component {
  @tracked show = false;

  @action
  toggle() {
    this.show = !this.show;
  }
}
