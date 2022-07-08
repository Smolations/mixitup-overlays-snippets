export default class GridRow {
  static assets = [
    // './components/Grid/GridRow.css',
  ];

  gridCells;


  constructor(...gridCells) {
    this.gridCells = gridCells;
    this.$el = $('<section>')
      .addClass('GridRow')
      .css({
        boxSizing: 'border-box',
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'stretch',
        'outline': '1px dotted red', // debugging
      });

    this.buildRow(gridCells);
  }


  buildRow(gridCells) {
    gridCells.forEach((gridCell, ndx) => {
      gridCell.$el.css({ width: `${(1 / gridCells.length) * 100}%` });
      this.$el.append(gridCell.$el);
      this[ndx] = gridCell;
    });
  }
}
