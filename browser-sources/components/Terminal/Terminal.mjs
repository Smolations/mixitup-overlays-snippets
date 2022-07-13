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
  }

  get width() {
    return this.$el.css('width');
  }

  get widthCalc() {
    return `calc((2 * ${this.lineXPadding}) + (${this.columns} * 1ch))`;
  }

  get $childrenContainer() {
    return this.$terminal;
  }


  #commandBuffer = [];
  #inOutBuffer = [];


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

    // terminals usually start up with an empty line. using
    // .addChild instead of .addPrompt since the lifecycle
    // render() will handle adding the element to the dom.
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


  // takes last input or creates and new one and adds to in/out buffer
  // @returns {Stdin}
  stdin(inputText) {
    let lastLine = this.children.at(-1);

    if (!(lastLine instanceof Stdin)) {
      lastLine = this.addPrompt();
    }

    // want to later inspect class type so maybe hold onto
    // input text?
    this.#inOutBuffer.push(lastLine.input(inputText));

    return lastLine;
  }

  // creates new Stdout and adds to in/out buffer
  // @returns {Stdout}
  stdout(...args) {
    const stdout = new Stdout();
    this.#inOutBuffer.push(stdout.output(...args));
    return stdout;
  }

  /**
   * Provides a callback to register any number of commands. that
   * command() callback takes its own callback, providing both
   * stdin/stdout functions to register inputs/outputs. Since
   * buffers are used, there's no need for async/await.
   *
   * e.g. terminal.session((command) => {
   *   command((stdin, stdout) => {
   *     stdin('some input');
   *     stdout('some %h output', 'decorated');
   *   });
   * });
   *
   * @param {Function} callback  Provides a `command` accepting its own callback
   *                             that accepts stdin/stdout functions.
   * @returns {Promise}
   */
  session(callback) {
    return new Promise((resolve) => {
      // calling command((stdin, stdout) => {...})
      callback(
        // (cmdCallback) => this.command(cmdCallback),
        (cmdCallback) => this.#commandBuffer.push(cmdCallback),
      );

      // run through buffer
      this.processCommandBuffer().then(resolve);
    });
  }

  // process all currently registered stdin/stdout
  // @returns {Promise}
  processInOutBuffer() {
    const bufferLength = this.#inOutBuffer.length;
    let promise = Promise.resolve();

    for (let i = 0; i < bufferLength; i++) {
      const line = this.#inOutBuffer.shift();
      this.addTerminalLine(line);
      promise = promise.then(() => line.exec());
    }

    return promise;
  }

  // process all currently registered command callbacks
  // @returns {Promise}
  processCommandBuffer() {
    const bufferLength = this.#commandBuffer.length;
    let promise = Promise.resolve();

    for (let i = 0; i < bufferLength; i++) {
      const command = this.#commandBuffer.shift();

      promise = promise.then(() => {
        command(
          (...args) => this.stdin(...args),
          (...args) => this.stdout(...args),
        );

        return this.processInOutBuffer().then(() => this.addPrompt());
      });
    }

    return promise;
  }

  /**
   * Adds to children and appends to DOM a new TerminalLine
   * instance as long as it doesn't already exist.
   *
   * @param {TerminalLine} line
   */
  addTerminalLine(line) {
    if (!this.children.includes(line)) {
      // console.log('[Terminal addTerminalLine] adding: %o', line)
      this.addChild(line);
      this.append(line);
    }
  }

  // creates a fresh Stdin and adds it to the terminal.
  // @returns {Stdin}
  addPrompt() {
    const stdin = new Stdin();

    this.addTerminalLine(stdin);

    return stdin;
  }

  // needed?
  var(varName) {
    if (!this.vars[varName]) {
      console.error('varName %o not recognized!', varName);
      return;
    }
    return this.$root.css(this.vars[varName]);
  }
}


export default Terminal;
