import Page from './components/Page.mjs';
// import Panel from './components/Panel/Panel.mjs';


const page = new Page({
  grid: [3, 4],
  // assets: [...Panel.assets]
});

page.ready(async (grid) => {

  const gridCell = grid[1][0].addPanel('testPanel', {
    // animationAxis: 'x',
    content: 'HELLLOO',
    height: '100px',
    width: '80%',
  });

  await gridCell.show('testPanel');
  console.log('open!');
  // await gridCell.hide('testPanel');

  // $('body').css({
  //   background: 'repeat url("./img/rusty-iron-plate-bg.jpg")',
  // });
});
