import Monogram from './components/Monogram.mjs';
import Page from './components/Page.mjs';
// import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  grid: { rows: 2, cols: 2 },
  assets: [
    // ...Terminal.assets,
  ],
});


page.ready(async (grid) => {
  const cell = grid.cell(0, 0);

  const monogram = new Monogram({ variant: '', padding: '1ch' });

  // for random panel content to result in accurate animations,
  // ensure at _least_ the mainAxis dimension is set
  const panel = cell.addPanel('monogram', {
    preferredAnimationAxis: 'x',
    content: monogram,
    width: '100px',
    logo: false,
    frameOnly: true,
    driftMask: { backgroundColor: 'rgba(255, 255, 255, 0.6)' },
  });

  // delay so i can click page before sounds are heard
  await panel.show();
});
