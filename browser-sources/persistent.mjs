import Monogram from './components/Monogram.mjs';
import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  grid: { rows: 2, cols: 2 },
  assets: [
    ...Terminal.assets,
    './persistent.css',
  ],
});


page.ready(async (grid) => {
  const cell = grid.cell(0, 0);
  const panel = cell.addPanel('monogram', {
    preferredAnimationAxis: 'x',
    content: new Monogram({ variant: '', padding: '1ch' }),
    // height: '300px',
    // width: '150%',
    // center: true,
    logo: false,
    frameOnly: true,
  });

  // delay so i can click page before sounds are heard
  await panel.show();
});
