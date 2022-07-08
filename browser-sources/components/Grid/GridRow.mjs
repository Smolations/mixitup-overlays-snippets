export default class GridRow {
  static assets = [
    './components/Grid/GridRow.css',
  ];

  gridCells;


  constructor(...gridCells) {
    this.gridCells = gridCells;
    this.$el = $('<section>').addClass('GridRow');
    this.$el.css('outline', '1px dotted red'); // debugging

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