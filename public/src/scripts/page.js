import mustache from 'mustache';

export default class Page {
  constructor(html, title, state) {
    if (html) {
      document.body.innerHTML = mustache.render(html, state);
      if (title) document.title = title;
    }
    this.state = {};
  }

  setState(state) {
    this.state = state;
  }
}