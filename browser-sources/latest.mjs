import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';

import StdoutMarquee from './lib/terminal-plugins/stdout-marquee.mjs';


const page = new Page({
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
page.ready(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const terminal = new Terminal({ rows: 2, columns: 20 });

  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');

  // maybe join marquee runs together (no fully empty space except on start/finish)
  // ALSO, fix width jitter bug..  =/

  window.terminal = terminal;

  await terminal.open();

  await terminal.command(
    terminal.stdin('marquee --latest'),
    terminal.stdout(StdoutMarquee({
      numRenders: 3,
      stdoutArgs: ['follower: %h subscriber: %h', follower, subscriber],
    })),
  );

  terminal.close();
});
