import TerminalLine from './TerminalLine.mjs';

// can't eliminate stylesheet since it makes use of pseudo selectors/elements
export default class Stdin extends TerminalLine {
  static assets = [
    ...TerminalLine.assets,
    './components/Terminal/Stdin.css',
  ];

  #keySounds = [];
  #input = '';


  constructor(...args) {
    super(...args);

    this.$el
      .addClass('Stdin')
      .css({
        filter: 'var(--glow-white) var(--glow-white) brightness(1.5)',
      });

    // preload keypress sounds
    for (let i = 0; i < 37; i++) {
      this.#keySounds.push(new Audio(`./components/Terminal/keypresses/key${i + 1}.wav`));
    }
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

  // if necessary, maybe create an addText() to incrementally
  // build up the string
  input(text) {
    this.#input = text;
    return this;
  }


  // may eventually need a way to delay and possibly replace existing output
  // @returns {Promise}
  renderText(...args) {
    return new Promise(async (resolve) => {
      const gen = this.typeGen(this.#input);

      for await (let str of gen) {
        const keyIndex = Math.floor(Math.random() * this.#keySounds.length);

        this.#keySounds[keyIndex].play();

        this.$el.html(str);
      }

      resolve();
    });
  }
}
