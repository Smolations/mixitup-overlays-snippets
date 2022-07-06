import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


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
    terminal.stdout((stdout, resolve) => {
      const $output = stdout.$getOutputEl('follower: %h subscriber: %h', follower, subscriber);
      const numCols = terminal.var('columns');
      const numChars = $output.text().length;
      const maxRenders = 2;
      let renderCount = 1;
      let leftCount = numCols;

      stdout.$el.append($output);

      stdout.$el
        .css('left', `${numCols}ch`)
        .addClass('terminal-marquee');

      const interval = setInterval(() => {
        stdout.$el.css('left', `${--leftCount}ch`);

        if (leftCount < -numChars - 1) {
          if (renderCount++ < maxRenders) {
            leftCount = numCols;
            stdout.$el.css('left', `${numCols}ch`);
          } else {
            clearInterval(interval);
            resolve();
          }
        }
      }, 200);
    }),
  );

  terminal.close();
});
