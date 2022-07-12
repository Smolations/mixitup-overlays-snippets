import Component from '../../lib/mixins/component.mjs';

export default class TerminalLine extends Component() {
  static assets = [
    // './components/Terminal/TerminalLine.css',
  ];

  static verticalPadding = 'calc(0.15 * 1em)';
  static horizontalPadding = '1ch';

  constructor() {
    super();

    this.$el = $('<pre>');
    this.$el
      .addClass('TerminalLine')
      .css({
        margin: 0,
        padding: `${TerminalLine.verticalPadding} ${TerminalLine.horizontalPadding}`,
      });
  }

  // terminal lines don't expect children so ignoring any renders
  render(terminal) {
    terminal.$terminal.append(this.$el);
    this.parent = terminal;
  }
}
