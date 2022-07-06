import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
import sparks from './components/Terminal/sparks.mjs';

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

  const two = sparks({
    top: 0,
    left: $('body').width() - (438 + 20),
    rotation: (0.05 * Math.PI),
    speed: 60,
  });
  const $canvas = $(two.renderer.domElement);
  const times = [];

  $canvas.css('opacity', 0);

  for (let i = 0; i < 6; i++) {
    const delay = 300;
    const time = Math.floor(Math.random() * (3000 - delay)) + delay;

    setTimeout(() => {
      $canvas.css('opacity', 1);
      setTimeout(() => {
        $canvas.css('opacity', 0);
      }, 100);
    }, time);
  }


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
