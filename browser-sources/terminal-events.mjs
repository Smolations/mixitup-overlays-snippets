import Page from './components/Page.mjs';
import Sparks from './components/Sparks.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  assets: [
    ...Terminal.assets,
    './terminal-events.css',
  ],
});




// ?subject=drive&username=chode&name=PNY 1kb drive&base=37&bonus=13&target=bytes
async function processDrive(params, playSparks) {
  const terminal = new Terminal({ rows: 6, columns: 40 });
  const sanitizedName = params.get('name').toLowerCase().replaceAll(' ', '_');
  const username = params.get('username');
  const bytesBase = Number(params.get('base'));
  const bytesBonus = Number(params.get('bonus'));
  const targetPrize = params.get('target');

  const folderName = `/media/${sanitizedName}`;
  const bytesFiles = [`${bytesBase}.${targetPrize}`];

  bytesBonus && bytesFiles.push(`${bytesBonus}.${targetPrize}`);

  playSparks(terminal);
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
async function processNewFollower(params, playSparks) {
  const terminal = new Terminal({ rows: 5, columns: 40 });
  const username = params.get('username');

  playSparks(terminal);
  await terminal.open();

  await terminal.command(
    terminal.stdin('latest_follower --welcome'),
    terminal.stdout('welcome %h, you have followed. now go clean the lavoratory.', username),
  );

  terminal.close(5000);
}

// ?subject=newSubscriber&username=poob
async function processNewSubscriber(params, playSparks) {
  const terminal = new Terminal({ rows: 5, columns: 40 });
  const username = params.get('username');
  const formatStr = `
    %h, your credits have been accepted. enjoy your new esmojis and this
    complimentary message.
  `.replaceAll(/\s+/g, ' ').trim();

  playSparks(terminal);
  await terminal.open();

  await terminal.command(
    terminal.stdin('latest_subscriber --welcome'),
    terminal.stdout(formatStr, username),
  );

  terminal.close(5000);
}

// ?subject=raid&username=SneakyFoxtrot&raidCount=7
async function processRaid(params, playSparks) {
  const terminal = new Terminal({ rows: 5, columns: 40 });
  const username = params.get('username');
  const raidCount = params.get('raidCount');

  playSparks(terminal);
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

  // need sparks on top of terminal (maybe eventually ensure Terminal
  // is always prepended and sparks always appended to body?) so will
  // use a callback for instantiation/playing. since there is currently
  // only one opening/closing animation, they can all share the same sparks.
  function playSparks(terminal, open = true) {
    const {
      left: terminalLeft,
      width: terminalWidth,
    } = terminal.rect;

    const commonOpts = {
      autostart: true,
      top: -5,
      duration: 4000, // opening animation is 3s
      rotationVariation: Math.PI * (1 / 8),
    };

    new Sparks({
      ...commonOpts,
      id: 'middleSparks',
      left: [terminalLeft + 100, terminalLeft + 300],
      speed: 80,
      scaleFactor: [0.2, 0.4],
      sparkDuration: [300, 600],
      frequency: 3,
    });

    new Sparks({
      ...commonOpts,
      id: 'sparksLeft',
      left: terminalLeft,
      speed: 60,
      scaleFactor: [0.5, 0.7],
      sparkDuration: [100, 800],
      frequency: 4,
    });

    new Sparks({
      ...commonOpts,
      id: 'sparksRight',
      left: terminalLeft + terminalWidth,
      speed: 30,
      scaleFactor: [0.5, 0.7],
      sparkDuration: [100, 750],
      frequency: 2,
    });
  }

  switch (queryParams.get('subject')) {
    case 'drive':
      processDrive(queryParams, playSparks);
      break;

    case 'newFollower':
      processNewFollower(queryParams, playSparks);
      break;

    case 'newSubscriber':
      processNewSubscriber(queryParams, playSparks);
      break;

    case 'raid':
      processRaid(queryParams, playSparks);
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
