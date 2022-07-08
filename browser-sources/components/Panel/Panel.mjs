export default class Panel {
  static assets = [
    // './components/Panel/Panel.css',
  ];

  xFrameWidth = '10px';
  yFrameWidth = '20px';

  logoWidth = '200px';
  logoHeight = '21px'; // approx; update if width ever changes
  logoOffset = '10px';

  cssVars = {
    '--y-offset': this.yFrameWidth,
    '--x-offset': this.xFrameWidth,
    '--y-offset-calc': `calc(100% - ${this.yFrameWidth})`,
    '--x-offset-calc': `calc(100% - ${this.xFrameWidth})`,
    '--logo-width': this.logoWidth,
    '--logo-unused-width': `calc(100% - ${this.logoWidth})`,
    '--logo-unused-width-half': `calc((100% - ${this.logoWidth}) / 2)`,
    '--logo-offset': this.logoOffset,
    '--logo-offset-2x': `calc(2 * ${this.logoOffset})`,
    '--logo-total-height': `calc(${this.logoHeight} + 2 * ${this.logoOffset})`,
    '--border-radius': '3px',
  };

  panelCommonCss = {
    boxSizing: 'border-box',
    background: 'repeat url("./img/rusty-iron-plate-bg.jpg")',
    borderRadius: 'var(--border-radius)',
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
        ...this.cssVars,
        ...this.panelCommonCss,
        position: 'relative',
        height,
        width,
        padding: this.frameWidth,
        filter: 'drop-shadow(0 -4px 8px #000)',

        // testing
        background: 'white',
        color: 'white',
      });




    return $panel;
  }

  getPanelFrameClipPath() {
    const aroundBoxAtTopLeft = '0 0, 100% 0, 100% 100%, 0 100%, 0 0,';

    // can't go same direction as initial path in order
    // to clip out just the frame
    const topLeftToBottomLeft = `
      var(--x-offset) var(--y-offset),
      var(--x-offset) var(--y-offset-calc),
    `;

    // left to right
    const logoLip = `
      calc(var(--logo-unused-width-half) - var(--logo-offset-2x)) var(--y-offset-calc),
      calc(var(--logo-unused-width-half)) calc(100% - var(--logo-total-height)),
      calc(100% - var(--logo-unused-width-half)) calc(100% - var(--logo-total-height)),
      calc(100% - (var(--logo-unused-width-half) - var(--logo-offset-2x))) var(--y-offset-calc),
    `;

    const bottomRightToTopLeft = `
      var(--x-offset-calc) var(--y-offset-calc),
      var(--x-offset-calc) var(--y-offset),
      var(--x-offset) var(--y-offset)
    `;

    return `polygon(
      ${aroundBoxAtTopLeft}
      ${topLeftToBottomLeft}
      ${logoLip}
      ${bottomRightToTopLeft}
    )`;
  }

  $getPanelFrame() {
    const { frameWidth, panelCommonCss: { borderRadius } } = this;
    const clipPath = this.getPanelFrameClipPath();

    const $frame = $('<div>')
      .addClass('Panel--frame')
      .css({
        ...this.panelCommonCss,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        clipPath,
      });


    // for masking, was only able to get default alpha to work. take black/white
    // image into gimp, create a layer mask from a greyscale copy of the image
    // (option when creating the mask) and then check "invert". the shorthand
    // `mask` property didn't work either, only webkit-prefixed props
    const $logo = $('<img>')
      .attr('src', './img/primary2.png')
      .css({
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: this.logoOffset,
        left: '50%',
        transform: 'translateX(-50%)',
        width: this.logoWidth, // height then ~21px
        '-webkit-mask-image': 'url("./img/mask_rust_alpha_black.png")',
        '-webkit-mask-size': '100%',
        filter: 'drop-shadow(0px 0px 3px #000) brightness(0.9)',
      })
      .appendTo($frame);

    return $frame;
  }

  attachFrameShadowElements() {
    const $wrapper = $('<div>')
      .css({
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 'var(--logo-total-height)',
        filter: 'drop-shadow(0 -4px 8px #000)',
      });

    // clipped element needs a wrapper to apply drop shadow. for
    // some reason (probably complexity) applying shadow to the
    // Panel did not produce any shadows on the frame
    $('<div>')
      .css({
        ...this.panelCommonCss,
        width: '100%',
        height: '100%',
        clipPath: `polygon(
          0 var(--y-offset-calc),
          calc(var(--logo-unused-width-half) - var(--logo-offset-2x)) var(--y-offset-calc),
          calc(var(--logo-unused-width-half)) calc(100% - var(--logo-total-height)),
          calc(100% - var(--logo-unused-width-half)) calc(100% - var(--logo-total-height)),
          calc(100% - (var(--logo-unused-width-half) - var(--logo-offset-2x))) var(--y-offset-calc),
          100% var(--y-offset-calc),
          100% 100%,
          0 100%,
          0 var(--y-offset-calc)
        )`,
      })
      .appendTo($wrapper);

    $wrapper.prependTo(this.$el);
  }

  addContent(content) {
    this.$el.append(content);
  }
}
