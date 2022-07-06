import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  assets: [
    ...Terminal.assets,
    './terminal-bare.css',
  ],
});


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

  await terminal.command(terminal.stdin(`mkdir ${folderName}`));
  await terminal.command(terminal.stdin(`mount /dev/sdb1 ${folderName}`));
  await terminal.command(
    terminal.stdin(`cd ${folderName} && ls -la`),
    terminal.stdout('%h.tar.gz', username),
  );
  await terminal.command(
    terminal.stdin(`tar -xvf ${username}.tar.gz`),
    ...bytesFiles.map((out) => terminal.stdout('%h', out)),
  );

  terminal.close(5000);
}

// ?subject=newFollower&username=poob
async function processNewFollower(terminal, params) {
  const username = params.get('username');

  await terminal.open();

  await terminal.command(
    terminal.stdin('latest_follower --welcome'),
    terminal.stdout('welcome %h, you have followed. now go clean the lavoratory.', username),
  );

  terminal.close(5000);
}

// ?subject=newSubscriber&username=poob
async function processNewSubscriber(terminal, params) {
  const username = params.get('username');
  const formatStr = `
    %h, your credits have been accepted. enjoy your new esmojis and this
    complimentary message.
  `.replaceAll(/\s+/g, ' ').trim();

  await terminal.open();

  await terminal.command(
    terminal.stdin('latest_subscriber --welcome'),
    terminal.stdout(formatStr, username),
  );

  terminal.close(5000);
}

// ?subject=raid&username=SneakyFoxtrot&raidCount=7
async function processRaid(terminal, params) {
  const username = params.get('username');
  const raidCount = params.get('raidCount');

  await terminal.open();

  await terminal.command(
    terminal.stdin('raid --welcome'),
    terminal.stdout(
      'oh damn! %h just raided with %h viewers! shit, are my genitals showing?',
      username,
      raidCount,
    ),
  );

  terminal.close(5000);
}


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
page.ready(async () => {
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


// x(cols), y(rows), opts
// const grid = new Grid(3, 3);
// const someCell = grid[1][1];  // top left; [3][3] bottom right

// any of the 4 corners; others only have a single, default option;
// someCell.x(...); // x(horizontal) axis entry of panel
// someCell.y(...); // y(vertical) axis entry of panel

// enter/exit from boom or full terminal?

// width of 1080p is 100 columns at 32px font-size
// someCell.rows(4); // default 2
// someCell.columns(30); // default
