
class Terminal {
  lineClass = 'terminal-line';
  inputLineClass = 'terminal-input';
  outputLineClass = 'terminal-output';
  highlightClass = 'terminal-highlight';
  normalTextClass = 'terminal-normal';

  slideDuration = 1500;

  constructor() {
    this.$terminal = $('.terminal');
    this.$terminalContainer = $('.terminal-container');

    // terminals always start up with an empty line
    this.addInputLine();
  }

  getNewLine() {
    return $('<pre></pre>').addClass(this.lineClass);
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

    const $code = $('<code></code>');
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
    // simulate hesitation before typing command
    await new Promise((resolve) => setTimeout(resolve, 450));
    await this.addInput(stdin);

    stdout.forEach((lineStr) => {
      console.log($.parseHTML(lineStr));
      this.addOutput(lineStr);
    });

    this.addInputLine();
  }

  open(callback) {
    this.$terminalContainer.slideDown(this.slideDuration, callback);
  }

  close() {
    this.$terminalContainer.slideUp(this.slideDuration);
  }
}


async function processDrive(terminal, params) {
  const sanitizedName = params.get('name').toLowerCase().replaceAll(' ', '_');
  const username = params.get('username');
  const bytesBase = Number(params.get('base'));
  const bytesBonus = Number(params.get('bonus'));
  const targetPrize = params.get('target');

  const folderName = `/media/${sanitizedName}`;
  const bytesFiles = [`${bytesBase}.${targetPrize}`];

  bytesBonus && bytesFiles.push(`${bytesBonus}.${targetPrize}`);

  await terminal.command(`mkdir ${folderName}`);
  await terminal.command(`mount /dev/sdb1 ${folderName}`);
  await terminal.command(`cd ${folderName} && ls -la`, `${username}.tar.gz`);
  await terminal.command(`tar -xvf ${username}.tar.gz`, bytesFiles);
}

async function processNewFollower(terminal, params) {
  const username = params.get('username');

  // should newlines be used to control display
  await terminal.command(
    'latest_follower --welcome',
    terminal.printf('welcome %h, you have followed. now go clean the lavoratory.', username),
  );
}


async function processNewSubscriber(terminal, params) {
  const username = params.get('username');
  const formatStr = `
    %h, your credits have been accepted. enjoy your new esmojis and this
    complimentary message.
  `;

  terminal.open(async () => {
    await terminal.command(
      'latest_subscriber --welcome',
      terminal.printf(formatStr, username),
    );

    setTimeout(() => terminal.close(), 5000);
  });
}


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
$(document).ready(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const terminal = new Terminal();
  const params = [terminal, queryParams];

  switch (queryParams.get('subject')) {
    case 'drive':
      processDrive(...params);
      break;

    case 'newFollower':
      processNewFollower(...params);
      break;

    case 'newSubscriber':
      processNewSubscriber(...params);
      break;
  }
});
