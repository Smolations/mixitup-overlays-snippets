import Component from '../../lib/mixins/component.mjs';

export default class GridRow extends Component() {
  static assets = [
    // './components/Grid/GridRow.css',
  ];


  constructor(props) {
    super();

    const { height } = props;

    this.$el = $('<section>')
      .addClass('GridRow')
      .css({
        boxSizing: 'border-box',
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'stretch',
        height,
        // outline: '1px dotted red', // debugging
      });
  }
}
