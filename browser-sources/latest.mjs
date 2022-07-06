import Page from './components/Page.mjs';
import Sparks from './components/Sparks.mjs';
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
  window.terminal = terminal;

  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');


  // this fixes the terminal sizing problem... somehow...browser paint-related?
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mySparks = new Sparks({
    top: -5,
    left: [terminal.rect.left + 100, terminal.rect.left + 300],
    speed: 80,
    scaleFactor: [0.2, 0.4],
    sparkDuration: [100, 1000],
    frequency: 4,
  });

  const sparksLeft = new Sparks({
    top: -5,
    left: terminal.rect.left,
    speed: 60,
    scaleFactor: [0.6, 0.8],
    sparkDuration: [100, 1000],
    frequency: 4,
  });

  const sparksRight = new Sparks({
    top: -5,
    left: terminal.rect.left + terminal.rect.width,
    speed: 30,
    scaleFactor: [0.6, 0.8],
    sparkDuration: [100, 1000],
    frequency: 4,
  });


  // test/debug stuffs
  $('body').css('background-color', 'black');
  // let $test = $('<div>').css({
  //   outline: '1px solid yellow',
  //   position: 'relative',
  //   width: '50px',
  //   height: '50px',
  //   left: '738px'
  // }).appendTo('body');


  // maybe join marquee runs together (no fully empty space except on start/finish)


  console.log('terminal.rect.left (pre-open): %o', terminal.rect.left)
  console.log('terminal.rect.width (pre-open): %o', terminal.rect.width)
  // console.log('test.rect.left (pre-open): %o', $test[0].getBoundingClientRect().left)

  mySparks.play();
  sparksLeft.play();
  sparksRight.play();
  await terminal.open();

  console.log('terminal.rect.left (post-open): %o', terminal.rect.left)

  await terminal.command(
    terminal.stdin('marquee --latest'),
    terminal.stdout(StdoutMarquee({
      numRenders: 3,
      stdoutArgs: ['follower: %h subscriber: %h', follower, subscriber],
    })),
  );

  terminal.close();
});
