import Stdin from './Stdin.mjs';
import Stdout from './Stdout.mjs';


class Terminal {
  static assets = [
    'https://cdnjs.cloudflare.com/ajax/libs/two.js/0.7.0-beta.3/two.min.js',
    './components/Terminal/Terminal.css',
    ...Stdin.assets,
    ...Stdout.assets,
  ];

  classes = {
    // core classes
    container: 'Terminal--container',
    terminal: 'Terminal',
    // animation classes
    closed: 'Terminal--closed',
    closing: 'Terminal--closing',
    open: 'Terminal--opened',
    opening: 'Terminal--opening',
  };

  vars = {
    rows: '--terminal-rows',
    columns: '--terminal-columns',
    height: '--terminal-height',
    width: '--terminal-width',
  };

  #sessionLines = [];


  get rect() {
    return this.$terminalContainer[0].getBoundingClientRect();
  }


  constructor({
    columns = 10,
    rows = 2,
    location = [2, 1],  // ?  (top middle in 3x3; y-axis inverted)
    prompt = true,
  } = {}) {
    const { classes, vars } = this;

    const $root = $(':root'); // must keep defined in stylesheet
    const $body = $('body');
    const $terminalContainer = $('<div>');
    const $terminal = $('<section>');

    $terminalContainer.addClass(classes.container).addClass(classes.closed);
    $terminal.addClass(classes.terminal);

    // apply options
    $root.css(vars.rows, rows);
    $root.css(vars.columns, columns);

    // add terminal to page
    $terminalContainer.append($terminal);
    $body.prepend($terminalContainer);

    // hold onto references for other methods
    this.$root = $root;
    this.$terminalContainer = $terminalContainer;
    this.$terminal = $terminal;

    // terminals usually start up with an empty line
    if (prompt) {
      this.addPrompt();
    }
  }

  // @returns {Stdin}
  stdin(inputText) {
    let lastLine = this.#sessionLines.at(-1);

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
    let promise = stdin.render();

    stdouts.forEach((stdout) => {
      promise = promise.then(() => {
        this.addTerminalLine(stdout);
        return stdout.render();
      });
    });

    return promise.then(() => this.addPrompt());
  }

  // clear() {
  //   this.#sessionLines = [];
  // }

  addTerminalLine(line) {
    this.#sessionLines.push(line);
    this.$terminal.append(line.$el);
  }

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


  open(delay = 0) {
    return new Promise((resolve) => {
      this.$terminalContainer.one('animationend', () => {
        this.$terminalContainer.removeClass(this.classes.opening).addClass(this.classes.open);
        resolve();
      });

      setTimeout(() => {
        this.$terminalContainer
          .removeClass(this.classes.closed)
          .addClass(this.classes.opening);
      }, delay);
    });
  }

  close(delay = 0) {
    return new Promise((resolve) => {
      this.$terminalContainer.one('animationend', () => {
        this.$terminalContainer.removeClass(this.classes.closing).addClass(this.classes.closed);
        resolve();
      });

      setTimeout(() => {
        this.$terminalContainer
          .removeClass(this.classes.open)
          .addClass(this.classes.closing);
      }, delay);
    });
  }
}


export default Terminal;

// export {
//   Stdin,
//   Stdout,
// };
