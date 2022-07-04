import Terminal from './terminal.mjs';


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
$(document).ready(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const terminal = new Terminal({ columns: 20 });

  const follower = queryParams.get('follower');
  const subscriber = queryParams.get('subscriber');

  const processFn = () => (
    new Promise((resolve) => {
      const $lastLine = terminal.$terminal.children().filter('.terminal-output').last();
      const numCols = terminal.var('columns');
      const numChars = $lastLine.text().length;
      const maxRenders = 2;
      let renderCount = 1;
      let leftCount = numCols;

      $lastLine
        .css('left', `${numCols}ch`)
        .addClass('terminal-marquee');

      const interval = setInterval(() => {
        $lastLine.css('left', `${--leftCount}ch`);

        if (leftCount < -numChars) {
          if (renderCount++ < maxRenders) {
            leftCount = numCols;
            $lastLine.css('left', `${numCols}ch`)
          } else {
            clearInterval(interval);
            resolve();
          }
        }
      }, 200);

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

  terminal.close();
});
