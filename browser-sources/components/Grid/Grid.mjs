import Component from '../../lib/mixins/component.mjs';

import GridCell from './GridCell.mjs';
import GridRow from './GridRow.mjs';

// width of 1080p is 100 columns at 32px font-size

export default class Grid extends Component() {
  static assets = [
    ...GridRow.assets,
    ...GridCell.assets,
    // './components/Grid/Grid.css',
  ];


  constructor({ rows, cols }) {
    super();

    // this.rows = rows;
    // this.cols = cols;

    // this.gridRows = gridRows;
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

    this.buildGridChildren(rows, cols);
  }


  buildGridChildren(numRows, numCols) {
    for (let i = 0; i < numRows; i++) {
      const gridRow = new GridRow({
        height: `${(1 / numRows) * 100}%`,
      });

      for (let j = 0; j < numCols; j++) {
        gridRow.addChild(new GridCell({
          top: (i === 0),
          bottom: (i === numRows - 1),
          left: (j === 0),
          right: (j === numCols - 1),
          width: `${(1 / numCols) * 100}%`,
        }));
      }

      this.addChild(gridRow);
    }
  }

  cell(row, col) {
    return this.children[row].children[col];
  }
}
