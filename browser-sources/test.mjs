import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
// import Panel from './components/Panel/Panel.mjs';


const page = new Page({
  grid: [3, 3],
  assets: [...Terminal.assets]
});

page.ready(async (grid) => {
  const gridCell = grid[0][1];
  const terminal = new Terminal({
    rows: 5,
    columns: 25,
  });
  const panel = gridCell.addPanel('testPanel', {
    // animationAxis: 'x',
    // content: terminal,
    height: '300px',
    width: '150%',
    center: true,
  });


  // panel.addContent(terminal);

  console.log('opening')
  // setTimeout(() => gridCell.show('testPanel'), 5000)
  await gridCell.show('testPanel');
  console.log('open!');
  // await gridCell.hide('testPanel');

  // $('body').css({
  //   background: 'repeat url("./img/rusty-iron-plate-bg.jpg")',
  // });
});
