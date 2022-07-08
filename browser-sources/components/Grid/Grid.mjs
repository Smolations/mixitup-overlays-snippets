// width of 1080p is 100 columns at 32px font-size

export default class Grid {
  static assets = [
    // './components/Grid/Grid.css',
  ];

  gridRows;

  constructor(...gridRows) {
    this.gridRows = gridRows;
    this.$el = $('<main>')
      .addClass('Grid')
      .css({
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
      });

    this.buildGrid(gridRows);
  }

  buildGrid(gridRows) {
    gridRows.forEach((gridRow, ndx) => {
      gridRow.$el.css({ height: `${(1 / gridRows.length) * 100}%` });
      this.$el.append(gridRow.$el);
      this[ndx] = gridRow;
    });
  }
}
