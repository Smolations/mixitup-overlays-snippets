import Page from './components/Page.mjs';
// import Grid from './components/Grid/Grid.mjs';
import Terminal from './components/Terminal/Terminal.mjs';
// import Panel from './components/Panel/Panel.mjs';


const page = new Page({
  grid: { rows: 3, cols: 3 },
  assets: [...Terminal.assets]
});

page.ready(async (grid) => {
  console.log('grid: %o', grid)
  // const gridRow = grid[0];
  // console.log('gridRow: %o', gridRow)
  const gridCell = grid.cell(0, 1);
  console.log('gridCell: %o', gridCell)
  // console.log('gridRow.children: %o', gridRow.children)
  // console.log('gridRow.length: %o', gridRow.length)
  // gridRow.forEach((cell) => console.log('row cell: %o', cell))
  // console.log('gridRow.slice(): %o', gridRow.slice())

  const terminal = new Terminal({
    rows: 4,
    columns: 18,
  });
  const panel = gridCell.addPanel('testPanel', {
    // animationAxis: 'x',
    content: terminal,
    // height: '300px',
    // width: '150%',
    center: true,
  });
  // window.panel = panel;

  // gridCell.addChild(terminal);

  // panel.addContent(terminal);

  // only pages need to fake a Component instance
  page.render($('body'));


  // console.log('after page render, panel height: %o', panel.$el.css('height'))
  await panel.show();
  // console.log('after animateIn, panel width: %o', panel.$el.css('width'))
  // console.log('[test.mjs] opening')
  // setTimeout(() => panel.animateIn(), 0) // somewhere between 30-50 needed.. =/
  // setTimeout(() => gridCell.show('testPanel'), 5000)
  // await gridCell.show('testPanel');
  // console.log('[test.mjs] open!');
  // await gridCell.hide('testPanel');

  // await terminal.command(terminal.stdin('first input'), terminal.stdout('with some output'))
  // await terminal.command(terminal.stdin('third input'))

  await terminal.command((stdin, stdout) => {
    stdin('first input');
    stdout('with some %h output', 'longer');
  });

  console.log('terminal: %o', terminal)
});
