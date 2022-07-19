import Page from './components/Page.mjs';
import Sparks from './components/Sparks.mjs';
import Terminal from './components/Terminal/Terminal.mjs';

import StdoutMarquee from './lib/terminal-plugins/stdout-marquee.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [
    ...Terminal.assets,
    './latest.css',
  ],
});


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
page.ready(async (grid) => {
  const cell = grid.cell(0, 2);
  const terminal = new Terminal({ rows: 3, columns: 20 });
  const panel = cell.addPanel('latest', {
    content: terminal,
    center: true,
    frameOnly: true,
  });

  const queryParams = new URLSearchParams(window.location.search);
  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');

  // maybe join marquee runs together (no fully empty space except on start/finish)

  // if knowing that this will show up using an MIU overlay endpoint,
  // then a wait delay seems appropriate to avoid showing too soon on
  // the "stream starting" overlay. should still be able to accept it
  // as a query param, however (probs should make it global so other
  // panel widgets can use it).
  await panel.show();

  await terminal.session((command) => {
    command((stdin, stdout) => {
      stdin('marquee --latest');
      stdout(StdoutMarquee({
        numRenders: 2,
        stdoutArgs: ['follower: %h subscriber: %h', follower, subscriber],
      }));
    });
  });

  await panel.hide();
});
