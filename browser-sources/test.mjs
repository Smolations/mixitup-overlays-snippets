import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
import TwitchClip from './components/TwitchClip.mjs';
import DriftMask from './components/DriftMask.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [
    // ...Terminal.assets,
    ...DriftMask.assets,
  ],
});

page.ready(async (grid) => {
  // console.log('gridRow: %o', gridRow)
  // $('body').css('background', 'grey');

  const tests = [
    // [0, 0], // top left corner
    [0, 1], // top
    // [1, 0], // left
    // [2, 1], // bottom
    // [1, 2], // right
  ].map(async (coords) => {
    const cell = grid.cell(...coords);

    // duration: 30,
    // id: 'PoliteSleepyBeefPeteZaroll-p-DDnPMyOPmvHgmW',
    const id = 'PoliteSleepyBeefPeteZaroll-p-DDnPMyOPmvHgmW';

    const clip = new TwitchClip({
      id,
    });

    // easier to determine height based on width
    const ratio = 1080/1920;
    const width = 1280;
    const height = width * ratio;

    // .addPanel triggers a "re-render"
    const panel = cell.addPanel(`[${coords.join(',')}]`, {
      // preferredAnimationAxis: 'x',
      content: clip,
      height: `${height}px`,
      width: `${width}px`,
      center: true,
      // logo: false,
      frameOnly: true,
    });
    window.panel = panel;

    // $('.Monogram').after(
    //   $('<div>')
    //     .addClass('drift')
    //     .css({
    //       position: 'absolute',
    //       height: '100%',
    //       width: '100%',
    //       top: 0,
    //       left: 0,
    //       backgroundColor: 'rgba(255, 255, 255, .3)',
    //     })
    // )
    console.log($('.Monogram'))

    // delay so i can click page before sounds are heard
    await panel.show();

    // await terminal.session((command) => {
    //   command((stdin, stdout) => {
    //     stdin('first input');
    //     stdout('with some %h output', 'longer');
    //   });
    // });

    const duration = 30000;
    const { animationEnterTiming, animationExitTiming } = panel;
    const delay = (duration - animationEnterTiming.duration - animationExitTiming.duration);

    await panel.hide({ delay });
  });

});
