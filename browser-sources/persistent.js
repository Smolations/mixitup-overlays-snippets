import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  assets: [
    ...Terminal.assets,
    './persistent.css',
  ],
});


// ?subject=newSubscriber&username=poob
async function processNewSubscriber(terminal, params) {
  const username = params.get('username');
  const formatStr = `
    %h, your credits have been accepted. enjoy your new esmojis and this
    complimentary message.
  `;

  await terminal.open();
  await terminal.command(
    'latest_subscriber --welcome',
    terminal.printf(formatStr, username),
  );

  terminal.close(5000);
}


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
page.ready(async () => {
  // const terminal = new Terminal();
});
