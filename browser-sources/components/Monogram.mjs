import Component from '../lib/mixins/component.mjs';


export default class Monogram extends Component() {
  basePath = './img';

  constructor(props = {}) {
    super();

    const { variant = 'none', padding = 0 } = props;

    this.filePath = this.#getFilePath(variant);

    this.$el = $('<img>')
      .addClass('Monogram')
      .attr({
        src: this.filePath,
      })
      .css({
        padding,
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
