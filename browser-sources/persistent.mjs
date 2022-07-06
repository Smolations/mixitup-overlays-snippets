import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  assets: [
    ...Terminal.assets,
    './persistent.css',
  ],
});


function renderMonogram() {
  const monogramTerminal = new Terminal({ prompt: false });

  monogramTerminal.$terminalContainer.addClass('monogram-container');
  monogramTerminal.$terminal.append(
    $('<img>')
      .addClass('monogram')
      .attr('src', './img/monogram_orange.png'),
  );
}


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
page.ready(async () => {
  renderMonogram();
});
