import TerminalLine from './TerminalLine.mjs';


export default class Stdout extends TerminalLine {
  constructor() {
    super();
    // this.$el = $('<pre>');
    this.$el.addClass('Stdout');
  }

  // printf only works here for output

  toString() {}
}
