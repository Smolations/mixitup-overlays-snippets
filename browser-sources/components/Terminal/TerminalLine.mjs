export default class TerminalLine {
  constructor() {
    this.$el = $('<pre>');
    this.$el.addClass('TerminalLine');
  }

  exec() {
    // something...
  }

  toString() { }
}
