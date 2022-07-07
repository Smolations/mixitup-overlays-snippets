import GridCell from './GridCell.mjs';


export default class GridRow {
  static assets = [
    ...GridCell.assets,
    './components/Grid/GridRow.css',
  ];

  gridCells = [];


  constructor(cols) {
    this.cols = cols;

    this.$el = $('<section>').addClass('GridRow');
    this.$el.css('outline', '1px dotted red'); // debugging

    this.buildRow(cols);
  }


  buildRow(cols) {
    for (let i = 0; i < cols; i++) {
      const cell = new GridCell();

      this.$el.append(cell.$el);
      this.gridCells.push(cell);
      this[i] = cell;
    }
  }
}
