import TerminalLine from './TerminalLine.mjs';


export default class Stdout extends TerminalLine {
  static assets = [
    ...TerminalLine.assets,
    'https://cdn.jsdelivr.net/npm/sprintf-js@1.1.2/dist/sprintf.min.js',
    './components/Terminal/Stdout.css',
  ];

  // an array of printf args
  #output;


  constructor(...args) {
    super(...args);

    this.$el.addClass('Stdout');
  }

  #highlightText(text) {
    const highlightClass = 'Stdout--highlight';
    return `<span class="${highlightClass}">${text}</span>`;
  }

  #normalText(text) {
    const normalClass = 'Stdout--normal';
    return `<span class="${normalClass}">${text}</span>`;
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
  render() {
    const lastOutputArg = this.#output.at(-1); // or check for only function?


    if (typeof(lastOutputArg) === 'function') {
      return new Promise((resolve, reject) => {
        lastOutputArg(this, resolve);
      });
    } else {
      return new Promise((resolve, reject) => {
        const $code = this.$getOutputEl(...this.#output);

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
