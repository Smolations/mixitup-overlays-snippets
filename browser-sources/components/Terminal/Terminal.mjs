import Component from '../../lib/mixins/component.mjs';

import Stdin from './Stdin.mjs';
import Stdout from './Stdout.mjs';


class Terminal extends Component() {
  static assets = [
    'https://cdnjs.cloudflare.com/ajax/libs/two.js/0.7.0-beta.3/two.min.js',
    './components/Terminal/Terminal.css',
    ...Stdin.assets,
    ...Stdout.assets,
  ];

  vars = {
    rows: '--terminal-rows',
    columns: '--terminal-columns',
    height: '--terminal-height',
    width: '--terminal-width',
  };

  rows;
  columns;

  color = '#ffffff';
  bgColor = 'rgba(0, 0, 0, 0.75)';
  highlightColor = 'var(--reentry-orange)';

  fontSize = '32px'; /* 32px is 100cols at 1080p */
  lineXPadding = Stdin.horizontalPadding;
  lineYPadding = Stdin.verticalPadding;
  offscreenShift = `calc(0.5 * ${this.fontSize})`;

  textGlowDefault = '0px 0px 8px #666666';
  textGlowHighlight = '0px 0px 8px rgba(var(--reentry-orange-rgb), 0.8)';
  glowWhite = `drop-shadow(${this.textGlowDefault})`;
  glowHighlight = `drop-shadow(${this.textGlowHighlight})`;


  get height() {
    return this.$el.css('height');
  }

  get heightCalc() {
    /* extra padding for first/last lines */
    const terminalLineHeight = `(${this.fontSize} + (2 * ${this.lineYPadding}))`;
    const containerPadding = `(2 * ${this.lineYPadding})`;

    return `calc(
      ${containerPadding} + (${this.rows} * ${terminalLineHeight})
    )`.replaceAll(/\s{2,}/g, ' ').trim();
    // return `calc(
    //   ((1 + (${this.rows})) * (2 * ${this.lineYPadding}))
    //   + (${this.rows} * ${this.fontSize})
    // )`.replaceAll(/\s{2,}/g, ' ').trim();
  }

  get width() {
    return this.$el.css('width');
  }

  get widthCalc() {
    return `calc((2 * ${this.lineXPadding}) + (${this.columns} * 1ch))`;
  }

  #buffer = [];


  get rect() {
    return this.$terminalContainer[0].getBoundingClientRect();
  }


  constructor({
    columns = 10,
    rows = 2,
    prompt = true,
  } = {}) {
    super();

    const { vars } = this;

    this.columns = columns;
    this.rows = rows;

    this.$el = this.$getTerminalContainer();
    this.$terminal = this.$getTerminal();

    this.$el.append(this.$terminal);

    // terminals usually start up with an empty line
    if (prompt) {
      this.addChild(new Stdin(this));
    }
  }


  $getTerminal() {
    const $terminal = $('<section>')
      .addClass('Terminal')
      .css({
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: 0,
        minHeight: '100%',
        width: '100%',
        padding: `${this.lineYPadding} 0`,

        backgroundColor: this.bgColor,
        color: this.color,
        fontWeight: 'bold',
        fontSize: this.fontSize,
      });

    return $terminal;
  }

  $getTerminalContainer() {
    const heightCalc = this.heightCalc;
    const widthCalc = this.widthCalc;

    return $('<div>')
      .addClass('Terminal--container')
      .css({
        boxSizing: 'border-box',
        position: 'relative',

        minHeight: heightCalc,
        '--terminal-height': heightCalc,
        height: heightCalc,
        maxHeight: heightCalc,

        minWidth: widthCalc,
        width: widthCalc,
        maxWidth: widthCalc,

        fontSize: this.fontSize,
        backgroundColor: this.bgColor,

        overflow: 'hidden',
      });
  }

  // @returns {Stdin}
  stdin(inputText) {
    let lastLine = this.children.at(-1);

    if (!(lastLine instanceof Stdin)) {
      lastLine = this.addPrompt();
    }

    // want to later inspect class type so maybe hold onto
    // input text?
    return lastLine.input(inputText);
  }

  // passthrough for now..
  // @returns {Stdout}
  stdout(...args) {
    const stdout = new Stdout(this);
    return stdout.output(...args);
  }

  // need separate TerminalCommand class?
  // @returns {Promise}
  command(stdin, ...stdouts) {
    let promise = stdin.renderText();

    stdouts.forEach((stdout) => {
      promise = promise.then(() => {
        this.addTerminalLine(stdout);
        return stdout.render(this);
      });
    });

    return promise.then(() => this.addPrompt());
  }

  command(callback) {
    return new Promise((resolve) => {
      // store to buffer?
      callback(this.stdin, this.stdout);

      // run through buffer
    });
    let promise = stdin.renderText();

    stdouts.forEach((stdout) => {
      promise = promise.then(() => {
        this.addTerminalLine(stdout);
        return stdout.render(this);
      });
    });

    return promise.then(() => this.addPrompt());
  }


  addTerminalLine(line) {
    this.children.push(line);
    this.$terminal.append(line.$el);
  }

  // @returns {Stdin}
  addPrompt() {
    const stdin = new Stdin(this);

    this.addTerminalLine(stdin);

    return stdin;
  }

  var(varName) {
    if (!this.vars[varName]) {
      console.error('varName %o not recognized!', varName);
      return;
    }
    return this.$root.css(this.vars[varName]);
  }

  // render(...args) {
  //   super.render(...args);
  //   // debugger;
  // }
}


export default Terminal;
