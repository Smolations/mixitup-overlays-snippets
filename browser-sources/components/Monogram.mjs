import Component from '../lib/mixins/component.mjs';


export default class Monogram extends Component() {
  basePath = './img';

  /**
   * @constructor
   * @param {Object} props
   * @property {String} variant one of 'white' or 'orange'. empty means default.
   * @property {*} [...] the rest are spread into the element's css
   */
  constructor(props = {}) {
    super();

    const {
      variant = 'none',
      ...css
    } = props;

    this.filePath = this.#getFilePath(variant);

    this.$el = $('<img>')
      .addClass('Monogram')
      .attr({
        src: this.filePath,
      })
      .css({
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%',
        ...css,
      });
  }

  #getFilePath(variant) {
    let path = `${this.basePath}/monogram`;

    if (['white', 'orange'].includes(variant)) {
      path += `_${variant}`;
    }

    path += '.png';

    return path;
  }
}
