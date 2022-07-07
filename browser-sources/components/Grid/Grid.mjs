import GridRow from './GridRow.mjs';

// x(cols), y(rows), opts
// const grid = new Grid(3, 3);
// const someCell = grid[1][1];  // top left; [3][3] bottom right

// any of the 4 corners; others only have a single, default option;
// someCell.x(...); // x(horizontal) axis entry of panel
// someCell.y(...); // y(vertical) axis entry of panel

// enter/exit from boom or full terminal?

// width of 1080p is 100 columns at 32px font-size
// someCell.rows(4); // default 2
// someCell.columns(30); // default

export default class Grid {
  static assets = [
    ...GridRow.assets,
    './components/Grid/Grid.css',
  ];

  gridRows = [];

  constructor({ rows, cols }) {
    this.rows = rows;
    this.cols = cols;

    this.$el = $('<main>').addClass('Grid').appendTo('body');

    this.buildGrid(rows, cols);
  }

  buildGrid(rows, cols) {
    for (let i = 0; i < rows; i++) {
      const row = new GridRow(cols);

      this.$el.append(row.$el);
      this.gridRows.push(row);
      this[i] = row;
    }
  }
}
