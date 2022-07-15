import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [
    ...Terminal.assets,
    // './terminal-events.css',
  ],
});


// params: username, name, base, bonus, target
// ?duration=31&subject=drive&username=chode&name=PNY 1kb drive&base=37&bonus=13&target=bytes
function getDriveSession(params) {
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
}

// uses: $arg1_
// params: username
// ?duration=15&subject=newFollower&username=clickfate_
function getNewFollowerSession(params) {
  const username = params.get('username');

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_follower --welcome');
      stdout('welcome %h, you have followed. now go clean the lavoratory.', username);
    });
  };
}

// uses: $arg1_, $message, $usersubplanname, $usersubplan(e.g. Tier 1)
// params: username, message, subName, tier
// ?duration=20&subject=newSubscriber&username=Itzzy&message=great channel&subName=Charlie Package&tier=Tier 1
function getNewSubscriberSession(params) {
  const username = params.get('username');
  const message = params.get('message');
  const subName = params.get('subName');
  const tier = params.get('tier');

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_subscriber --verbose');
      stdout(`Subscriber: %h`, username);
      stdout(`${tier}:     %h`, subName);
      message && stdout('Metadata:   %h', message);
      stdout('Enjoy your new esmojis and this complimentary message.');
    });
  };
}

// uses: $arg1_, $hostviewercount, $raidviewercount
// params: username, hostCount, raidCount
// ?duration=16&subject=raid&username=SneakyFoxtrot&raidCount=72
function getRaidSession(params) {
  const username = params.get('username');
  // const hostCount = params.get('hostCount'); // leftover from mixer; same as raidCount
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

// uses: $arg1_
// params: username
// ?duration=16&subject=host&username=MaHuJa
function getHostSession(params) {
  const username = params.get('username');

  return (command) => {
    command((stdin, stdout) => {
      stdin('host --init');
      stdout((out, resolve) => {
        const $line1 = out.$getTerminalLine('Initializing host...');
        out.$el.append($line1);
        setTimeout(resolve, 2000);
      });
      stdout('Host initialized by %h. Spanks bruv.', username);
    });
  };
}

// uses: $arg1_, $message, $usersubplanname, $usersubplan(e.g. Tier 1), $usersubmonths, $usersubstreak
// params: username, message, subName, tier, months, streak
// ?duration=24&subject=reSubscriber&username=IrishFatty&message=i heart you&subName=Bravo Gold Package&tier=Tier 2&months=8&streak=7
function getReSubscriberSession(params) {
  const username = params.get('username');
  const message = params.get('message');
  const subName = params.get('subName');
  const tier = params.get('tier');
  const months = params.get('months');
  const streak = params.get('streak');

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_subscriber --verbose');
      stdout(`Subscriber: %h`, username);
      stdout(`${tier}:     %h`, subName);
      stdout(`Months:     %h${streak > 1 ? ` (${streak} in a row)` : ''}`, months);
      message && stdout('Metadata:   %h', message);
      stdout('Welcome back. Enjoy your new esmojis and this complimentary message.');
    });
  };
}

// uses: $arg1_, $usersubplanname, $usersubplan(e.g. Tier 1), $usersubmonthsgifted, $isanonymous(bool)
// params: username, subName, tier, monthsGifted, isAnon
// ?duration=24&subject=subGifted&username=jg1_erhardt&subName=Charlie Package&tier=Tier 1&monthsGifted=1&isAnon=false
function getSubGiftedSession(params) {
  const username = params.get('username');
  const subName = params.get('subName');
  const tier = params.get('tier');
  const monthsGifted = params.get('monthsGifted');
  const isAnon = (params.get('isAnon') === 'true');
  const benefactor = isAnon ? '?' : username;

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_subscriber --verbose');
      stdout((out, resolve) => {
        const $line1 = out.$getTerminalLine('santa_protocol (gift sub) initialized...');
        out.$el.append($line1);
        setTimeout(resolve, 3000);
      });
      stdout(`Benefactor: %h`, benefactor);
      stdout(`${tier}:     %h`, subName);
      stdout(`Duration:   %h`, `${monthsGifted} month(s)`);
      stdout('You beneficiaries be lucky. Enjoy your new esmojis and this complimentary message.');
    });
  };
}

// uses: $arg1_, $subsgiftedamount, $subsgiftedlifetimeamount, $usersubplan(e.g. Tier 1), $isanonymous(bool)
// params: username, amount, lifetimeAmount, tier, isAnon
// ?duration=24&subject=massSubGifted&username=lissanth&amount=5&lifetimeAmount=11&tier=Tier 3&isAnon=true
function getMassSubGiftedSession(params) {
  const username = params.get('username');
  const amount = params.get('amount');
  const lifetimeAmount = params.get('lifetimeAmount');
  const tier = params.get('tier');
  const isAnon = (params.get('isAnon') === 'true');
  const benefactor = isAnon ? '?' : username;

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_subscriber --verbose');
      stdout((out, resolve) => {
        const $line1 = out.$getTerminalLine('santa_baller_protocol (gift subs) initialized...');
        out.$el.append($line1);
        setTimeout(resolve, 3000);
      });
      stdout(`Benefactor: %h`, benefactor);
      stdout(`Level:      %h`, tier);
      stdout(`Amount:     %h (${lifetimeAmount} lifetime)`, amount);
      stdout('You beneficiaries be lucky. %h is a high roller. Enjoy your new esmojis and this complimentary message.', benefactor);
    });
  };
}

// uses: $arg1_, $bitsamount, $bitslifetimeamount, $messagenocheermotes, $message, $isanonymous(bool)
// params: username, amount, lifetimeAmount, messageNoEmotes, message, isAnon
// ?duration=24&subject=cheer&username=RexyMegan&amount=5&lifetimeAmount=11&messageNoEmotes=no emotes&message=uhhh emotes..&isAnon=false
function getCheerSession(params) {
  const username = params.get('username');
  const amount = params.get('amount');
  const lifetimeAmount = params.get('lifetimeAmount');
  const messageNoEmotes = params.get('messageNoEmotes');
  const message = params.get('message'); // hard to test...
  const isAnon = (params.get('isAnon') === 'true');
  const benefactor = isAnon ? '?' : username;

  return (command) => {
    command((stdin, stdout) => {
      stdin('latest_tig_ol_bitties --verbose');
      stdout((out, resolve) => {
        const $line1 = out.$getTerminalLine('make_it_rain initialized...');
        out.$el.append($line1);
        setTimeout(resolve, 3000);
      });
      stdout(`Benefactor: %h`, benefactor);
      stdout(`Amount:     %h (${lifetimeAmount} lifetime)`, amount);
      stdout(`Metadata:   %h`, messageNoEmotes);
      stdout('schedule "buy spider rings" --from=%h', benefactor);
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
  const duration = (queryParams.get('duration') * 1000) || 15000; // reasonable default?
  const cell = grid.cell(0, 1);
  const panel = cell.addPanel('terminalEvent', {
    center: true,
    frameOnly: true,
  });

  const { animationEnterTiming: enter, animationExitTiming: exit } = panel;
  const hideDelay = (duration - enter.duration - exit.duration - 1);

  let terminal;
  let session;


  switch (queryParams.get('subject')) {
    case 'drive':
      terminal = new Terminal({ rows: 6, columns: 40 });
      session = getDriveSession(queryParams);
      break;

    case 'newFollower':
      terminal = new Terminal({ rows: 5, columns: 40 });
      session = getNewFollowerSession(queryParams);
      break;

    case 'host':
      session = getHostSession(queryParams);
      terminal = new Terminal({ rows: 5, columns: 40 });
      break;

    case 'raid':
      session = getRaidSession(queryParams);
      terminal = new Terminal({ rows: 5, columns: 40 });
      break;

    case 'newSubscriber':
      terminal = new Terminal({ rows: 7, columns: 50 });
      session = getNewSubscriberSession(queryParams);
      break;

    case 'reSubscriber': {
      let rows = 6;
      queryParams.get('message') && rows++;
      (queryParams.get('streak') > 1) && rows++;

      terminal = new Terminal({ rows, columns: 50 });
      session = getReSubscriberSession(queryParams);
    } break;

    case 'subGifted':
      terminal = new Terminal({ rows: 7, columns: 50 });
      session = getSubGiftedSession(queryParams);
      break;

    case 'massSubGifted':
      terminal = new Terminal({ rows: 8, columns: 50 });
      session = getMassSubGiftedSession(queryParams);
      break;

    case 'cheer':
      session = getCheerSession(queryParams);
      terminal = new Terminal({ rows: 7, columns: 50 });
      break;

    // maybe not this? sounds make this kinda untenable..maybe conditional?
    // case 'pointsRedeem':
    //   // uses: $arg1_,
    //   session = getPointsRedeemSession(queryParams);
    //   terminal = new Terminal({ rows: 5, columns: 40 });
    //   break;
  }

  // this flow is not ideal..
  panel.addChild(terminal);
  panel.render();

  await panel.show();
  terminal.session(session);
  await panel.hide({ delay: hideDelay });
});
