import Terminal from './terminal.mjs';


// ?subject=drive&username=chode&name=PNY 1kb drive&base=37&bonus=13&target=bytes
async function processDrive(terminal, params) {
  const sanitizedName = params.get('name').toLowerCase().replaceAll(' ', '_');
  const username = params.get('username');
  const bytesBase = Number(params.get('base'));
  const bytesBonus = Number(params.get('bonus'));
  const targetPrize = params.get('target');

  const folderName = `/media/${sanitizedName}`;
  const bytesFiles = [`${bytesBase}.${targetPrize}`];

  bytesBonus && bytesFiles.push(`${bytesBonus}.${targetPrize}`);

  await terminal.open();
  await terminal.command(`mkdir ${folderName}`);
  await terminal.command(`mount /dev/sdb1 ${folderName}`);
  await terminal.command(
    `cd ${folderName} && ls -la`,
    terminal.printf('%h.tar.gz', username),
  );
  await terminal.command(
    `tar -xvf ${username}.tar.gz`,
    ...bytesFiles.map((out) => terminal.printf('%h', out)),
  );

  terminal.close(5000);
}

// ?subject=newFollower&username=poob
async function processNewFollower(terminal, params) {
  const username = params.get('username');

  await terminal.open();
  await terminal.command(
    'latest_follower --welcome',
    terminal.printf('welcome %h, you have followed. now go clean the lavoratory.', username),
  );

  terminal.close(5000);
}

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

// ?subject=raid&username=SneakyFoxtrot&raidCount=7
async function processRaid(terminal, params) {
  const username = params.get('username');
  const raidCount = params.get('raidCount');

  await terminal.open();
  await terminal.command(
    'raid --welcome',
    terminal.printf('oh damn! %h just raided with %h viewers! shit, are my genitals showing?', username, raidCount),
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

    case 'raid':
      processRaid(...params);
      break;
  }
});
