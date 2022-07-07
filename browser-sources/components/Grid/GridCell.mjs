export default class GridCell {
  static assets = [
    './components/Grid/GridCell.css',
  ];


  constructor() {
    this.$el = $('<div>').addClass('GridCell');
    this.$el.css('outline', '1px dotted blue'); // debugging
  }
}
