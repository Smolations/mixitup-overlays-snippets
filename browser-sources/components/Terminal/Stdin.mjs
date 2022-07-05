import TerminalLine from './TerminalLine.mjs';


export default class Stdin extends TerminalLine {
  keySounds = [];


  constructor() {
    super();
    // this.$el = $('<pre>');
    this.$el.addClass('Stdin');

    // preload keypress sounds
    for (let i = 0; i < 37; i++) {
      this.keySounds.push(new Audio(`./keypresses/key${i + 1}.wav`));
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

  // getNewLine() {
  //   return $('<pre>').addClass(this.classes.line);
  // }

  // inserts the line element and returns it
  // addInputLine() {
  //   const $newLine = this.getNewLine().addClass(this.classes.inputLine);
  //   return this.$terminal.append($newLine);
  // }

  // expects there to be a trailing input line
  async addInput(text) {
    const gen = this.typeGen(text);
    // const $line = $(`.${this.classes.inputLine}:last-of-type`);

    for await (let str of gen) {
      const keyIndex = Math.floor(Math.random() * this.keySounds.length);
      this.keySounds[keyIndex].play();
      $line.html(this.normalText(str));
    }
  }

  toString() { }
}
