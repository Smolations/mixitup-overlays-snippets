
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
    './components/Grid/Grid.css',
  ];

  gridRows;

  constructor(...gridRows) {
    this.gridRows = gridRows;
    this.$el = $('<main>').addClass('Grid');

    this.buildGrid(gridRows);
  }

  buildGrid(gridRows) {
    gridRows.forEach((gridRow, ndx) => {
      this.$el.append(gridRow.$el);
      this[ndx] = gridRow;
    });
  }
}
