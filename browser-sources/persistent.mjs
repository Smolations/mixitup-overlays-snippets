import Monogram from './components/Monogram.mjs';
import Page from './components/Page.mjs';
// import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [
    // ...Terminal.assets,
  ],
});


page.ready(async (grid) => {
  const cell = grid.cell(1, 0);
  const width = 1920;
  const height = 1080;

  // for random panel content to result in accurate animations,
  // ensure at _least_ the mainAxis dimension is set
  const panel = cell.addPanel('frame', {
    height: `${height}px`,
    width: `${width}px`,
    center: true,
    open: true,
    frameOnly: true,
  });
});
