import Page from './components/Page.mjs';
// import Grid from './components/Grid/Grid.mjs';


const page = new Page({
  grid: [3, 4],
  // assets: [...Grid.assets]
});

page.ready(async (grid) => {

  console.log('some grid row: %o', grid[1])
  console.log('some grid cell: %o', grid[2][0])

});
