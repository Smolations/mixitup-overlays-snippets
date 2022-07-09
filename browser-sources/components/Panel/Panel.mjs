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
    '--logo-unused-width-half': `calc((100% - ${this.logoWidth}) / 2)`,
    '--logo-offset-2x': `calc(2 * ${this.logoOffset})`,
    '--logo-total-height': `calc(${this.logoHeight} + 2 * ${this.logoOffset})`,
    '--min-width': `calc(2 * ${this.logoOffset} + ${this.logoWidth})`,
    '--min-height': `calc(2 * ${this.logoOffset} + ${this.logoHeight} + 2 * var(--y-offset))`,
    '--border-radius': '3px',
    '--drop-shadow': 'drop-shadow(0 -4px 8px #000)',
  };

  panelCommonCss = {
    boxSizing: 'border-box',
    background: 'var(--battletech-grey) url("./img/rusty-iron-plate-bg.jpg") repeat',
    minHeight: 'var(--min-height)',
    minWidth: 'var(--min-width)',
  };


  constructor({ height, width }) {
    this.height = height;
    this.width = width;

    this.$el = this.$getPanel();
    this.$frame = this.$getPanelFrame().appendTo(this.$el);
  }

  $getPanel() {
    // minHeight: `calc(2 * ${this.logoOffset} + ${this.logoHeight} + 2 * var(--y-offset))`,
    // minWidth: `calc(2 * ${this.logoOffset} + ${this.logoWidth})`,
    /** COME BACK AND FIX THIS */
    const minHeight = 2 * parseInt(this.logoOffset) + parseInt(this.logoHeight) + 2 * parseInt(this.yFrameWidth);
    const minWidth = 2 * parseInt(this.logoOffset) + parseInt(this.logoWidth);
    const {
      // height,// = `${minHeight}px`,
      height,// = 'var(--min-height)',
      // width,// = `${minWidth}px`,
      width,// = `var(--min-width)`,
    } = this;


    return $('<div>')
      .addClass('Panel')
      .css({
        ...this.cssVars,
        ...this.panelCommonCss,
        position: 'relative',
        height,
        width,
        padding: `var(--y-offset) var(--x-offset)`,
        backgroundBlendMode: 'hard-light',
        borderRadius: 'var(--border-radius)',
        color: 'white',

        // testing
        // background: 'white',
      });
  }

  $getFrameTop() {
    return $('<div>')
      .addClass('Panel--frame-top')
      .css({
        ...this.panelCommonCss,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - var(--y-offset))',
        borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
        clipPath: `polygon(
          0 0,
          100% 0,
          100% 100%,
          var(--x-offset-calc) 100%,
          var(--x-offset-calc) var(--y-offset),
          var(--x-offset) var(--y-offset),
          var(--x-offset) 100%,
          0 100%,
          0 0
        )`,
      });
  }

  $getFrameBottom() {
    const $logo = this.$getFrameLogo();

    return $('<div>')
      .addClass('Panel--frame-bottom')
      .css({
        ...this.panelCommonCss,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 'var(--logo-total-height)',
        borderRadius: '0 0 var(--border-radius) var(--border-radius)',
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
      .append($logo);
  }

  // for masking, was only able to get default alpha to work. take black/white
  // image into gimp, create a layer mask from a greyscale copy of the image
  // (option when creating the mask) and then check "invert". the shorthand
  // `mask` property didn't work either, only webkit-prefixed props
  $getFrameLogo() {
    return $('<img>')
      .addClass('Panel--frame-logo')
      .attr('src', './img/primary2.png')
      .css({
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: this.logoOffset,
        left: '50%',
        transform: 'translateX(-50%)',
        width: this.logoWidth,
        '-webkit-mask-image': 'url("./img/mask_rust_alpha_black.png")',
        '-webkit-mask-size': '100%',
        filter: 'drop-shadow(0px 0px 3px #000) brightness(0.9)',
      });
  }

  // clipped element needs a wrapper to apply drop shadow.
  // to avoid a super complicated clip path, the frame is
  // broken into 2 parts. given the background image, the
  // seam is unnoticeable.
  $getPanelFrame() {
    const $frameTop = this.$getFrameTop();
    const $frameBottom = this.$getFrameBottom();

    const $wrapper = $('<div>')
      .addClass('Panel--frame-wrapper')
      .css({
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        filter: 'var(--drop-shadow)',
      });

    return $wrapper.append($frameTop, $frameBottom);
  }

  addContent(content = {}) {
    // prepend to keep content under frame (and therefore shadow)
    this.$el.prepend(content?.$el || content);

    // maybe some logic to see if previous content has already
    // set a width...take the largest of all available. until then..
    if (content.$el) {
      // debugger;
      const contentWidth = content.$el.css('width');
      console.log({ contentWidth });
      if (parseInt(contentWidth, 10)) {
        setTimeout(() => {
          console.log('content rect: %o', content.$el[0].getBoundingClientRect())
          // this.$el.css('width', `calc(2 * var(--x-offset) + var(--terminal-width))`);
        }, 10);
      }
    }
  }
}
