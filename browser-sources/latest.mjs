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

  function getRandomTime(max, delay = 300) {
    return Math.floor(Math.random() * (max - delay)) + delay;
  }

  function getRandomRotation(max) {
    const sign = (Math.random() < 0.5) ? -1 : 1;
    const radians =  (Math.random() * max) * Math.PI;
    return (sign * radians);
  }

  const twoLeft = sparks({
    top: -5,
    left: terminal.rect.left,
    rotation: getRandomRotation(0.1),
    speed: 60,
  });
  const $canvasLeft = $(twoLeft.renderer.domElement);

  const twoRight = sparks({
    top: -5,
    left: terminal.rect.left + terminal.rect.width,
    rotation: getRandomRotation(0.1),
    speed: 60,
  });
  const $canvasRight = $(twoRight.renderer.domElement);

  const times = [];
  const rotations = [];

  $('body').css('background-color', 'black'); // just to see the effects

  const $glareLeft = $('<div>')
    .css({
      position: 'absolute',
      top: 0 - 40,
      left: terminal.rect.left - 40,
      width: '80px',
      height: '80px',
      opacity: 0,
      borderRadius: '40px',
      background: 'radial-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))',
    })
    .appendTo($('body'));

  const $glareRight = $glareLeft.clone()
    .css({
      left: terminal.rect.left + terminal.rect.width - 40,
    })
    .appendTo($('body'));

  $canvasLeft.css('opacity', 0);
  $canvasRight.css('opacity', 0);

  for (let i = 0; i < 6; i++) {
    const time = getRandomTime(3000);
    const rotation = getRandomRotation(0.1);
    // console.log(rotation)

    // will copy/reverse these and choose with i for the other side
    times.push(time);
    rotations.push(rotation);
  }

  console.log('rotations: %o', rotations)
  for (let i = 0; i < 6; i++) {
    const leftRotation = rotations[i];
    const rightRotation = rotations[5-i];
    setTimeout(() => {
      twoLeft.scene.rotation = leftRotation;console.log('left rotation[%o]: %o',i, leftRotation)
      $canvasLeft.css('opacity', 1);
      $glareLeft.css('opacity', 1);

      setTimeout(() => {
        $canvasLeft.css('opacity', 0);
        $glareLeft.css('opacity', 0);
      }, 100);
    }, times[i]);

    setTimeout(() => {
      twoRight.scene.rotation = rightRotation; console.log('right rotation[%o]: %o',5-i, rightRotation)
      $canvasRight.css('opacity', 1);
      $glareRight.css('opacity', 1);

      setTimeout(() => {
        $canvasRight.css('opacity', 0);
        $glareRight.css('opacity', 0);
      }, 100);
    }, times[5 - i]);
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
