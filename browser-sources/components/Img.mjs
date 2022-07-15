import Component from '../lib/mixins/component.mjs';


export default class Img extends Component() {
  constructor(props = {}) {
    super();

    const {
      src,
      height,
      width,
      ...css
    } = props;

    this.$el = $('<img>')
      .addClass('Img')
      .attr({
        src,
        height,
        width,
      })
      .css({
        boxSizing: 'border-box',
        maxHeight: '100%',
        maxWidth: '100%',
        ...css,
      });
  }
}
