import Component from '../lib/mixins/component.mjs';


export default class Header extends Component() {
  constructor(props = {}) {
    super();

    this.props = props;

    const {
      text,
      size = 1,
      ...css
    } = props;

    const fontSizes = {
      1: '48px',
      2: '32px',
    };

    this.$el = $(`<h${size}>`)
      .addClass('Header')
      .css({
        boxSizing: 'border-box',
        padding: '0.5em 0',
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSizes[size],
        // textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
        wordBreak: 'break-all',
        ...css,
      })
      .text(text);
  }
  render(...args) {
    super.render(...args);
  }
}
