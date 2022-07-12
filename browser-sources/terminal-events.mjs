import Page from './components/Page.mjs';
import Sparks from './components/Sparks.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [
    ...Terminal.assets,
    // './terminal-events.css',
  ],
});

function render() {
  page.render($('body'));
}



// ?subject=drive&username=chode&name=PNY 1kb drive&base=37&bonus=13&target=bytes
function processDrive(params) {
  const sanitizedName = params.get('name').toLowerCase().replaceAll(' ', '_');
  const username = params.get('username');
  const bytesBase = Number(params.get('base'));
  const bytesBonus = Number(params.get('bonus'));
  const targetPrize = params.get('target');

  const folderName = `/media/${sanitizedName}`;
  const bytesFiles = [`${bytesBase}.${targetPrize}`];

  bytesBonus && bytesFiles.push(`${bytesBonus}.${targetPrize}`);

  return (command) => {
    command((stdin) => {
      stdin(`mkdir ${folderName}`);
    });
    command((stdin) => {
      stdin(`mount /dev/sdb1 ${folderName}`);
    });
    command((stdin, stdout) => {
      stdin(`cd ${folderName} && ls -la`);
      stdout('%h.tar.gz', username);
    });
    command((stdin, stdout) => {
      stdin(`tar -xvf ${username}.tar.gz`);
      bytesFiles.forEach((out) => stdout('%h', out));
    });
  };
//
//
//   await terminal.command(terminal.stdin(`mkdir ${folderName}`));
//   await terminal.command(terminal.stdin(`mount /dev/sdb1 ${folderName}`));
//   await terminal.command(
//     terminal.stdin(`cd ${folderName} && ls -la`),
//     terminal.stdout('%h.tar.gz', username),
//   );
//   await terminal.command(
//     terminal.stdin(`tar -xvf ${username}.tar.gz`),
//     ...bytesFiles.map((out) => terminal.stdout('%h', out)),
//   );
//
//   terminal.close(5000);
}

// ?subject=newFollower&username=poob
function processNewFollower(params) {
  const username = params.get('username');

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_follower --welcome');
      stdout('welcome %h, you have followed. now go clean the lavoratory.', username);
    });
  };
}

// ?subject=newSubscriber&username=poob
function processNewSubscriber(params) {
  const username = params.get('username');
  const formatStr = `
    %h, your credits have been accepted. enjoy your new esmojis and this
    complimentary message.
  `.replaceAll(/\s+/g, ' ').trim();

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_subscriber --welcome');
      stdout(formatStr, username);
    });
  };
}

// ?subject=raid&username=SneakyFoxtrot&raidCount=7
function processRaid(params) {
  const username = params.get('username');
  const raidCount = params.get('raidCount');

  return (command) => {
    command((stdin, stdout) => {
      stdin('raid --welcome');
      stdout(
        'oh damn! %h just raided with %h viewers! shit, are my genitals showing?',
        username,
        raidCount,
      );
    });
  };
}


/**
 * ENTRY
 *
 * Determine subject for processing.
 */
page.ready(async (grid) => {
  const queryParams = new URLSearchParams(window.location.search);
  const cell = grid.cell(0, 1);
  const panel = cell.addPanel('terminalEvent', {
    center: true,
  });
  let terminal;
  let session;

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
      terminal = new Terminal({ rows: 6, columns: 40 });
      session = processDrive(queryParams);
      break;

    case 'newFollower':
      terminal = new Terminal({ rows: 5, columns: 40 });
      session = processNewFollower(queryParams);
      break;

    case 'newSubscriber':
      terminal = new Terminal({ rows: 5, columns: 40 });
      session = processNewSubscriber(queryParams);
      break;

    case 'raid':
      session = processRaid(queryParams);
      terminal = new Terminal({ rows: 5, columns: 40 });
      break;
  }

  panel.addChild(terminal);
  render();

  playSparks(terminal);

  await panel.show();
  await terminal.session(session);
  await panel.hide({ delay: 5000 });
});
