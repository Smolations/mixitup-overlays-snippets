import Terminal from './terminal.mjs';


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
$(document).ready(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const terminal = new Terminal({ width: '20ch' });

  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');

  const processFn = () => (
    new Promise((resolve) => {
      const $lastLine = terminal.$terminal.children().filter('.terminal-output').last();
      $lastLine.addClass('terminal-marquee');
      let leftCount = 0;

//       const interval = setInterval(() => {
//         $lastLine.css('left', `-${++leftCount}ch`);
//
//       }, 500);

    })
  );

  window.terminal = terminal;

  await terminal.open();
  await terminal.command(
    'print --latest',
    terminal.printf('follower: %h      subscriber: %h', follower, subscriber),
    {
      process: processFn
    },
  );

  // terminal.close(5000);
});
