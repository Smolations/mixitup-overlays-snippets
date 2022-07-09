import Stdin from './Stdin.mjs';
import Stdout from './Stdout.mjs';


class Terminal {
  static assets = [
    'https://cdnjs.cloudflare.com/ajax/libs/two.js/0.7.0-beta.3/two.min.js',
    // './components/Terminal/Terminal.css',
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
  lineXPadding = '1ch';
  lineYPadding = `calc(0.15 * ${this.fontSize})`;
  offscreenShift = `calc(0.5 * ${this.fontSize})`;

  mask = 'repeating-linear-gradient(#000000 0px, #000000 3px, transparent 4px)';
  textGlowDefault = '0px 0px 8px #666666';
  textGlowHighlight = '0px 0px 8px rgba(var(--reentry-orange-rgb), 0.8)';
  glowWhite = `drop-shadow(${this.textGlowDefault})`;
  glowHighlight = `drop-shadow(${this.textGlowHighlight})`;


  get height() {
    return this.$el.css('height');
  }

  get heightCalc() {
    /* extra padding for first/last lines */
    return `calc(
      ((1 + (${this.rows})) * (2 * ${this.lineYPadding}))
      + (${this.rows} * ${this.fontSize})
    )`.replaceAll(/\s{2,}/g, ' ').trim();
  }

  get width() {
    return this.$el.css('width');
  }

  get widthCalc() {
    return `calc((2 * ${this.lineXPadding}) + (${this.columns} * 1ch))`;
  }

  #sessionLines = [];


  get rect() {
    return this.$terminalContainer[0].getBoundingClientRect();
  }


  constructor({
    columns = 10,
    rows = 2,
    prompt = true,
  } = {}) {
    const { vars } = this;

    this.columns = columns;
    this.rows = rows;

    this.$el = this.$getTerminalContainer();
    this.$terminal = this.$getTerminal();

    this.$el.append(this.$terminal);

    // terminals usually start up with an empty line
    if (prompt) {
      this.addPrompt();
    }

    this.startTerminalDrift();
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

        '-webkit-mask-image': this.mask,
        maskImage: this.mask,
        '-webkit-mask-size': '200%',
        maskSize: '200%',
        // animation: terminal-drift 12s infinite alternate cubic-bezier(0.1, -0.6, 0.2, 0),
      });

    return $terminal;
  }

  $getTerminalContainer() {
    return $('<div>')
      .addClass('Terminal--container')
      .css({
        boxSizing: 'border-box',
        position: 'relative',

        minHeight: this.heightCalc,
        '--terminal-height': this.heightCalc,
        height: this.heightCalc,
        maxHeight: this.heightCalc,

        minWidth: this.widthCalc,
        width: this.widthCalc,
        maxWidth: this.widthCalc,

        fontSize: this.fontSize,
        backgroundColor: this.bgColor,

        overflow: 'hidden',
      });
  }

  async startTerminalDrift() {
    this.driftStarted = true;
    console.log('[Terminal] start drifting');
    const now = Date.now();

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (parseInt(this.$el.css('height'), 10)) {
          console.log('[Terminal] wait time: %o', Date.now() - now);
          this.driftStarted = false;
          clearInterval(interval);
          resolve();
        }
      }, 100);
    })

    const terminalDrift = [
      {
        'mask-position': '0 0',
        '-webkit-mask-position': '0 0',
      },
      {
        'mask-position': `0 ${this.height}`,
        '-webkit-mask-position': `0 ${this.height}`,
      },
    ];
    const terminalDriftTiming = {
      duration: 12000,
      iterations: Infinity,
      easing: 'cubic-bezier(0.1, -0.6, 0.2, 0)',
      direction: 'alternate',
    };

    console.log('[Terminal] animate with height(%o)! %o', this.height, terminalDrift);
    const animation = this.$terminal[0].animate(terminalDrift, terminalDriftTiming);

    // setInterval(() => {
    //   console.log('animation.currentTime: %o', animation.currentTime)
    // }, 500);
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
}


export default Terminal;
