
export default class TerminalLine {
  static assets = [
    './components/Terminal/TerminalLine.css',
  ];

  constructor() {
    this.$el = $('<pre>');
    this.$el.addClass('TerminalLine');
  }

  render() {
    throw new Error('Subclasses should override this method and return a Promise!');
  }
}
