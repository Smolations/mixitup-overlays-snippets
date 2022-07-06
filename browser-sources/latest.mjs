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

  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');

  function getRandomTime(max, delay = 300) {
    return Math.floor(Math.random() * (max - delay)) + delay;
  }

  function getRandomRotation(max) {
    const sign = (Math.random() < 0.5) ? -1 : 1;
    const radians =  (Math.random() * max) * Math.PI;
    return (sign * radians);
  }

  // this fixes the terminal sizing problem... somehow...browser paint-related?
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mySparks = new Sparks({
    top: -5,
    left: terminal.rect.left + 100,
    speed: 60,
    scale: 0.6,
  });

  const sparksLeft = new Sparks({
    top: -5,
    left: terminal.rect.left,
    speed: 60,
  });

  const sparksRight = new Sparks({
    top: -5,
    left: terminal.rect.left + terminal.rect.width,
    speed: 60,
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

  window.terminal = terminal;
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
