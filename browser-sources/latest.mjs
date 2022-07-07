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

  const {
    left: terminalLeft,
    width: terminalWidth,
  } = terminal.rect;

  const mySparks = new Sparks({
    id: 'mySparks',
    top: -5,
    left: [terminalLeft + 100, terminalLeft + 300],
    speed: 80,
    duration: 4000, // opening animation is 3s
    scaleFactor: [0.2, 0.4],
    sparkDuration: [300, 600],
    frequency: 3,
    rotationVariation: Math.PI * (1/8),
  });

  const sparksLeft = new Sparks({
    id: 'sparksLeft',
    top: -5,
    left: terminalLeft,
    speed: 60,
    duration: 4000, // opening animation is 3s
    scaleFactor: [0.5, 0.7],
    sparkDuration: [100, 800],
    frequency: 4,
    rotationVariation: Math.PI * (1/8),
  });

  const sparksRight = new Sparks({
    id: 'sparksRight',
    top: -5,
    left: terminalLeft + terminalWidth,
    speed: 30,
    duration: 4000, // opening animation is 3s
    scaleFactor: [0.5, 0.7],
    sparkDuration: [100, 750],
    frequency: 2,
    rotationVariation: Math.PI * (1/8),
  });


  // test/debug stuffs
  // $('body').css('background-color', 'black');
  // let $test = $('<div>').css({
  //   outline: '1px solid yellow',
  //   position: 'relative',
  //   width: '50px',
  //   height: '50px',
  //   left: '738px'
  // }).appendTo('body');


  // maybe join marquee runs together (no fully empty space except on start/finish)


  console.log('terminal.rect.left (pre-open): %o', terminal.rect.left)
  // console.log('terminal.rect.width (pre-open): %o', terminal.rect.width)
  // console.log('test.rect.left (pre-open): %o', $test[0].getBoundingClientRect().left)

  mySparks.play();
  sparksLeft.play();
  sparksRight.play();
  await terminal.open();

  // console.log('terminal.rect.left (post-open): %o', terminal.rect.left)

  await terminal.command(
    terminal.stdin('marquee --latest'),
    terminal.stdout(StdoutMarquee({
      numRenders: 2,
      stdoutArgs: ['follower: %h subscriber: %h', follower, subscriber],
    })),
  );

  terminal.close();
});
