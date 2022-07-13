import Component from '../../lib/mixins/component.mjs';
import Panel from '../Panel/Panel.mjs';


export default class GridCell extends Component() {
  static assets = [
    ...Panel.assets,
    // './components/Grid/GridCell.css',
  ];

  // require id's for all content for quick storage/access
  content = {};


  #location = {
    top: false,
    bottom: false,
    right: false,
    left: false,
  };

  // props is an object with position props (^^)
  constructor(props) {
    super();

    const { width, ...locationProps } = props;

    Object.assign(this.#location, locationProps);

    this.$el = $('<div>')
      .addClass('GridCell')
      .css({
        boxSizing: 'border-box',
        flexGrow: 1,
        position: 'relative',
        width,
        // outline: '1px dotted blue',  // debugging
      });
  }


  // @returns {Promise}
  show(contentId, { delay } = {}) {
    const { content } = this.content[contentId] || {};

    if (!content) {
      throw new Error(`Unable to find content with id: ${contentId}`);
    }

    // maybe of Animatable type?
    return content.show({
      delay,
    });
  }

  hide(contentId, { delay } = {}) {
    const { content } = this.content[contentId] || {};

    if (!content) {
      throw new Error(`Unable to find content with id: ${contentId}`);
    }

    // maybe of Animatable type?
    return content.hide({
      delay,
    });
  }

  addPanel(contentId, {
    content,
    ...panelOpts
  }) {
    const panel = new Panel({
      ...panelOpts,
      gridLocation: { ...this.#location },
    });

    content && panel.addChild(content);
    // console.log('[GridCell] after adding panel content, height: %o', panel.$el.css('height'))
    this.addChild(panel);
    this.content[contentId] = {
      id: contentId,
      content: panel,
      // spec,
    };

    if (this.mounted) this.render(this.parent);

    return panel;
  }
}
