import Component from '../../lib/mixins/component.mjs';

export default class TerminalLine extends Component() {
  static assets = [
    // './components/Terminal/TerminalLine.css',
  ];

  static verticalPadding = 'calc(0.15 * 1em)';
  static horizontalPadding = '1ch';

  textGlowDefault = '0px 0px 8px #666666';
  textGlowHighlight = '0px 0px 8px rgba(var(--reentry-orange-rgb), 0.8)';

  // class vars or css vars..figure it out..
  // glowWhite = `drop-shadow(${this.textGlowDefault})`;
  // glowHighlight = `drop-shadow(${this.textGlowHighlight})`;


  constructor() {
    super();

    this.$el = $('<pre>');
    this.$el
      .addClass('TerminalLine')
      .css({
        margin: 0,
        padding: `${TerminalLine.verticalPadding} ${TerminalLine.horizontalPadding}`,

        '--text-glow-default': this.textGlowDefault,
        '--text-glow-highlight': this.textGlowHighlight,
        '--glow-white': 'drop-shadow(var(--text-glow-default))',
        '--glow-highlight': 'drop-shadow(var(--text-glow-highlight))',
      });
  }

  // terminal lines don't expect children so ignoring any renders
  render(terminal) {
    terminal.$terminal.append(this.$el);
    this.parent = terminal;
  }
}
