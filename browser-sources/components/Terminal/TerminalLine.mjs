
export default class TerminalLine {
  static assets = [
    './components/Terminal/TerminalLine.css',
  ];

  constructor(terminal) {
    this.$el = $('<pre>');
    this.$el.addClass('TerminalLine');

    this.terminal = terminal;
  }

  render() {
    throw new Error('Subclasses should override this method and return a Promise!');
  }
}
