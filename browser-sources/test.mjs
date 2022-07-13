import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
import Monogram from './components/Monogram.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  // assets: [...Terminal.assets]
});

page.ready(async (grid) => {
  // console.log('gridRow: %o', gridRow)
  // $('body').css('background', 'grey');

  const tests = [
    [0, 1], // top
    // [1, 0], // left
    // [2, 1], // bottom
    // [1, 2], // right
  ].map(async (coords) => {
    const cell = grid.cell(...coords);
    // const terminal = new Terminal({
    //   rows: 4,
    //   columns: 18,
    // });

    // .addPanel triggers a "re-render"
    const panel = cell.addPanel(`[${coords.join(',')}]`, {
      // preferredAnimationAxis: 'x',
      content: new Monogram({ variant: '' }),
      // height: '300px',
      // width: '150%',
      // center: true,
      logo: false,
    });
    window.panel = panel;


    // delay so i can click page before sounds are heard
    await panel.show();

    // await terminal.session((command) => {
    //   command((stdin, stdout) => {
    //     stdin('first input');
    //     stdout('with some %h output', 'longer');
    //   });
    // });

    // await panel.hide({ delay: 3000 });
  });

});
