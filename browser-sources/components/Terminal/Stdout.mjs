import TerminalLine from './TerminalLine.mjs';


export default class Stdout extends TerminalLine {
  static assets = [
    ...TerminalLine.assets,
    'https://cdn.jsdelivr.net/npm/sprintf-js@1.1.2/dist/sprintf.min.js',
    // './components/Terminal/Stdout.css',
  ];

  // an array of printf args
  #output;


  constructor(...args) {
    super(...args);

    this.$el
      .addClass('Stdout')
      .css({
        lineHeight: '1.1',
      });
  }

  #highlightText(text) {
    const $highlight = $('<span>')
      .addClass('Stdout--highlight')
      .css({
        color: 'var(--reentry-orange)',
        filter: 'var(--glow-highlight) var(--glow-highlight) brightness(1.5)',
      })
      .text(text);

    return $('<div>').append($highlight).html();
  }

  #normalText(text) {
    const $normal = $('<span>')
      .addClass('Stdout--normal')
      .css({
        filter: 'var(--glow-white) var(--glow-white) brightness(1.5)',
      })
      .text(text);

    return $('<div>').append($normal).html();
  }

  /**
   * tokens:
   *  %h - highlight this text
   */
  printf(line, ...args) {
    return args.reduce((str, arg) => (
      str.replace(/%h/, this.#highlightText(arg))
    ), line);
  }

  // set desired output for later
  // @returns {Stdout}
  output(...args) {
    this.#output = args;
    return this;
  }

  // printf only works here for output
  render(parentComponent) {
    super.render(parentComponent);
    const lastOutputArg = this.#output.at(-1); // or check for only function?


    if (typeof(lastOutputArg) === 'function') {
      return new Promise((resolve) => {
        lastOutputArg(this, resolve);
      });
    } else {
      return new Promise((resolve) => {
        const $code = this.$getTerminalLine(...this.#output);

        this.$el.append($code);
        resolve();
      });
    }
  }

  // @returns {jQuery}
  $getTerminalLine(...args) {
    const $code = $('<code>');
    $code.append(this.prepareText(...args));

    return $code;
  }

  // @returns {String} the html string
  prepareText(...args) {
    const highlighted = this.printf(...args);
    const wrappedArray = $.parseHTML(highlighted)
      .map((el) => {
        if (el.nodeName === '#text') {
          return $(this.#normalText(el.textContent));
        } else {
          return el;
        }
      });

    return $('<div>').append(wrappedArray).html();
  }
}
