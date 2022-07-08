export default class Panel {
  static assets = [
    // './components/Panel/Panel.css',
  ];

  frameWidth = '5px';

  panelCommonCss = {
    boxSizing: 'border-box',
    background: 'repeat url("./img/rusty-iron-plate-bg.jpg")',
    borderRadius: '1px',
  };


  constructor({ height, width }) {
    this.height = height;
    this.width = width;

    this.$el = this.$getPanel();
    this.$frame = this.$getPanelFrame().appendTo(this.$el);
  }

  $getPanel() {
    const { height, width } = this;

    const $panel = $('<div>')
      .addClass('Panel')
      .css({
        ...this.panelCommonCss,
        position: 'relative',
        height,
        width,
        padding: this.frameWidth,

        // testing
        background: 'blueviolet',
        color: 'white',
      });

      return $panel;
  }

  $getPanelFrame() {
    const { frameWidth } = this;
    const $frame = $('<div>')
      .addClass('Panel--frame')
      .css({
        ...this.panelCommonCss,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        mask: `polygon(
          ${frameWidth} ${frameWidth},
          calc(100% - ${frameWidth}) ${frameWidth},
          calc(100% - ${frameWidth}) 98%
        ) alpha ${frameWidth} ${frameWidth}`.replaceAll(/\s+/g, ' '),
      });

    return $frame;
  }

  addContent(content) {
    this.$el.append(content);
  }
}
