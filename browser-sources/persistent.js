import Terminal from './terminal';


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
$(document).ready(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const terminal = new Terminal();
  const params = [terminal, queryParams];

  switch (queryParams.get('subject')) {
    case 'drive':
      processDrive(...params);
      break;

    case 'newFollower':
      processNewFollower(...params);
      break;

    case 'newSubscriber':
      processNewSubscriber(...params);
      break;
  }
});
