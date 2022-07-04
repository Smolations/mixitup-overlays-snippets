
export default class Terminal {
  lineClass = 'terminal-line';
  inputLineClass = 'terminal-input';
  outputLineClass = 'terminal-output';
  highlightClass = 'terminal-highlight';
  normalTextClass = 'terminal-normal';

  closedClass = 'terminal-closed';
  closingClass = 'terminal-closing';
  openClass = 'terminal-opened';
  openingClass = 'terminal-opening';

  classes = {
    // core classes
    container: 'terminal-container',
    terminal: 'terminal',
    line: 'terminal-line',
    inputLine: 'terminal-input',
    outputLine: 'terminal-output',
    highlight: 'terminal-highlight',
    normalText: 'terminal-normal',
    // animation classes
    closed: 'terminal-closed',
    closing: 'terminal-closing',
    open: 'terminal-opened',
    opening: 'terminal-opening',
  };

  vars = {
    rows: '--terminal-rows',
    columns: '--terminal-columns',
    height: '--terminal-height',
    width: '--terminal-width',
  };


  constructor({
    columns,
    rows,
  } = {}) {
    const $root = $(':root'); // must keep defined in stylesheet
    const $body = $('body');
    const $terminalContainer = $('<div>');
    const $terminal = $('<section>');

    const { classes, vars } = this;
    $terminalContainer.addClass(classes.container).addClass(classes.closed);
    $terminal.addClass(classes.terminal);

    // apply options
    rows && $root.css(vars.rows, rows);
    columns && $root.css(vars.columns, columns);

    // add terminal to page
    $terminalContainer.append($terminal);
    $body.prepend($terminalContainer);

    // hold onto references for other methods
    this.$root = $root;
    this.$terminalContainer = $terminalContainer;
    this.$terminal = $terminal;

    // terminals always start up with an empty line
    this.addInputLine();
  }

  var(varName) {
    if (!this.vars[varName]) {
      console.error('varName %o not recognized!', varName);
      return;
    }
    return this.$root.css(this.vars[varName]);
  }

  getNewLine() {
    return $('<pre>').addClass(this.lineClass);
  }

  // inserts the line element and returns it
  addInputLine() {
    const $newLine = this.getNewLine().addClass(this.inputLineClass);
    return this.$terminal.append($newLine);
  }

  // expects there to be a trailing input line
  async addInput(text) {
    const gen = this.typeGen(text);
    const $line = $(`.${this.inputLineClass}:last-of-type`);

    for await (let str of gen) {
      $line.html(this.normalText(str));
    }
  }

  // creates all required markup for a single call to stdout (one liner)
  addOutput(output) {
    const isOutputNil = (output === undefined || output === null);
    const stringText = String(output);

    if (isOutputNil || !stringText) {
      return;
    }

    const cleanOutput = output.trim().replaceAll(/\s+/g, ' ');

    const $code = $('<code>');
    const $newLine = this.getNewLine().addClass(this.outputLineClass).append($code);

    $code.append(
      $.parseHTML(cleanOutput).map((el) => {
        if (el.nodeName === '#text') {
          return $(this.normalText(el.textContent));
        } else {
          return el;
        }
      })
    );

    this.$terminal.append($newLine);
  }

  highlight(text) {
    return `<span class="${this.highlightClass}">${text}</span>`;
  }

  normalText(text) {
    return `<span class="${this.normalTextClass}">${text}</span>`;
  }

  /**
   * tokens:
   *  %h - highlight this text
   */
  printf(line, ...args) {
    return args.reduce((str, arg) => (
      str.replace(/%h/, this.highlight(arg))
    ), line);
  }

  async *typeGen(text) {
    for (let cursor = 0; cursor < text.length; cursor++) {
      const typedText = text.slice(0, cursor + 1);

      await new Promise((resolve) => {
        const delay = /\s$/.test(typedText)
          ? 100 * Math.random() + 100
          : 100 * Math.random() + 50;

        setTimeout(resolve, delay);
      });

      yield text.slice(0, cursor + 1);
    }
  }

  // should a line length be enforced?
  async command(stdin, ...stdout) {
    let opts = {};

    if (typeof(stdout.at(-1)) === 'object') {
      opts = stdout.pop();
    }

    // simulate hesitation before typing command
    await new Promise((resolve) => setTimeout(resolve, 450));
    await this.addInput(stdin);

    stdout.forEach((lineStr) => {
      this.addOutput(lineStr);
    });

    if (typeof(opts.process) === 'function') {
      await opts.process();
      this.addInputLine();
    } else {
      this.addInputLine();
    }
  }

  open(delay = 0) {
    return new Promise((resolve) => {
      this.$terminalContainer.one('animationend', () => {
        this.$terminalContainer.removeClass(this.openingClass).addClass(this.openClass);
        resolve();
      });

      setTimeout(() => {
        this.$terminalContainer
          .removeClass(this.closedClass)
          .addClass(this.openingClass);
      }, delay);
    });
  }

  close(delay = 0) {
    return new Promise((resolve) => {
      this.$terminalContainer.one('animationend', () => {
        this.$terminalContainer.removeClass(this.closingClass).addClass(this.closedClass);
        resolve();
      });

      setTimeout(() => {
        this.$terminalContainer
          .removeClass(this.openClass)
          .addClass(this.closingClass);
      }, delay);
    });

  }
}
