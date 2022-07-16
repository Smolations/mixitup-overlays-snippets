import Page from './components/Page.mjs';
// import Panel from './components/Panel/Panel.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
import ColorBarsPanel from './components/ColorBarsPanel.mjs';
import StreamStartingPanel from './components/StreamStartingPanel.mjs';
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
    // [0, 1], // top
    [1, 0], // left
    // [2, 1], // bottom
    // [1, 2], // right
  ].map(async (coords) => {
    const leftMiddleCell = grid.cell(...coords);
    const topMiddleCell = grid.cell(0, 1);
    const colorBarsPanel = new ColorBarsPanel({ gridLocation: leftMiddleCell.location });
    const streamStartingPanel = new StreamStartingPanel({ gridLocation: topMiddleCell.location });


    topMiddleCell.addChild(streamStartingPanel);
    leftMiddleCell.addChild(colorBarsPanel);
    topMiddleCell.render();
    leftMiddleCell.render();


    await colorBarsPanel.hide({ delay: 5000 });


    // .addPanel triggers a "re-render"
    // const panel = cell.addPanel(`[${coords.join(',')}]`, {
    //   // preferredAnimationAxis: 'x',
    //   content: bars,
    //   height: `${height}px`,
    //   width: `${width}px`,
    //   center: true,
    //   // logo: false,
    //   open: true,
    //   frameOnly: true,
    //   driftMask: true,
    // });


    // delay so i can click page before sounds are heard
    // await panel.show();

    // await terminal.session((command) => {
    //   command((stdin, stdout) => {
    //     stdin('first input');
    //     stdout('with some %h output', 'longer');
    //   });
    // });


    // await panel.hide({ delay: 3000 });
  });

});
