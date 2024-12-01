import EmberRouter from '@ember/routing/router';
import config from 'advent-of-code-2024/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('puzzles', function () {
    this.route('1');
  });
});
