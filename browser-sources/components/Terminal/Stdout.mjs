import TerminalLine from './TerminalLine.mjs';


export default class Stdout extends TerminalLine {
  static assets = [
    ...TerminalLine.assets,
    'https://cdn.jsdelivr.net/npm/sprintf-js@1.1.2/dist/sprintf.min.js',
    './components/Terminal/Stdout.css',
  ];

  // an array of printf args
  #output;


  constructor() {
    super();

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

  output(...args) {
    this.#output = args;
    return this;
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
    const $newLine = this.getNewLine().addClass(this.classes.outputLine).append($code);

    $code.append(
      $.parseHTML(cleanOutput).map((el) => {
        if (el.nodeName === '#text') {
          return $(this.#normalText(el.textContent));
        } else {
          return el;
        }
      })
    );

    this.$terminal.append($newLine);
  }

  // printf only works here for output
  render() {
    return new Promise((resolve, reject) => {
      const $code = $('<code>');
      const highlighted = this.printf(...this.#output);
      console.log('highlighted: %o', highlighted)

      $code.append(
        $.parseHTML(highlighted).map((el) => {
          if (el.nodeName === '#text') {
            return $(this.#normalText(el.textContent));
          } else {
            return el;
          }
        })
      );

      this.$el.append($code);

      resolve();
    });
  }
}
