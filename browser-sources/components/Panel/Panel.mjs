import Component from '../../lib/mixins/component.mjs';

import Sparks from '../Sparks.mjs';

export default class Panel extends Component() {
  static assets = [
    // './components/Panel/Panel.css',
  ];

  specs;
  sparksOpen = [];

  // hiding any lingering shadow from hidden content
  offscreenShift = '10px';

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

  crossAxisTransforms = [];

  constructor(props = {}) {
    super();

    const {
      height,
      width,
      gridLocation,
      center = false,
      preferredAnimationAxis = 'y',
    } = props;

    this.height = height;
    this.width = width;
    this.center = center;
    this.gridLocation = gridLocation;
    this.preferredAnimationAxis = preferredAnimationAxis;

    this.$el = this.$getPanel();
  }

  $getPanel() {
    const {
      height,
      width,
      center,
    } = this;


    return $('<div>')
      .addClass('Panel')
      .css({
        ...this.cssVars,
        ...this.panelCommonCss,
        position: 'absolute', // must have in order for content to fill container
        // top: 0,
        // left: 0,
        height,
        width,
        padding: `var(--y-offset) var(--x-offset)`,
        backgroundBlendMode: 'hard-light',
        borderRadius: 'var(--border-radius)',
        color: 'white',
        transform: center ? 'translate(-50%, 0)' : 'translate(0, 0)',

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

  getSparks() {
    const panelLeft = this.rect.left;
    const panelWidth = this.rect.width;

    const sparksMiddle = new Sparks({
      id: 'middleSparks',
      top: -5,
      left: [panelLeft + 100, panelLeft + 300],
      speed: 80,
      duration: 4000, // opening animation is 3s
      scaleFactor: [0.2, 0.4],
      sparkDuration: [300, 600],
      frequency: 3,
      rotationVariation: Math.PI * (1 / 8),
    });

    const sparksLeft = new Sparks({
      id: 'sparksLeft',
      top: -5,
      left: panelLeft,
      speed: 60,
      duration: 4000, // opening animation is 3s
      scaleFactor: [0.5, 0.7],
      sparkDuration: [100, 800],
      frequency: 4,
      rotationVariation: Math.PI * (1 / 8),
    });

    const sparksRight = new Sparks({
      id: 'sparksRight',
      top: -5,
      left: panelLeft + panelWidth,
      speed: 30,
      duration: 4000, // opening animation is 3s
      scaleFactor: [0.5, 0.7],
      sparkDuration: [100, 750],
      frequency: 2,
      rotationVariation: Math.PI * (1 / 8),
    });

    this.sparksOpen.push(sparksLeft, sparksMiddle, sparksRight);
  }


  positionOffscreen() {
    const gridSpec = this.getSpec();
    const {
      from,
      mainAxisDimName,
    } = gridSpec;

    const defaultLength = `var(--min-${mainAxisDimName})`;
    const elLength = this.$el.css(mainAxisDimName);
    const offscreenLength = parseInt(elLength, 10)
      ? elLength
      : defaultLength;

    this.$el.css({
      [from]: `calc(-1 * (${offscreenLength} + ${this.offscreenShift}))`,
    });
  }


  positionCrossAxis() {
    const { mainAxis } = this.getSpec();

    if (this.center) {
      if (mainAxis === 'y') {
        this.$el.css({
          left: '50%',
          transform: `translateX(-50%)`,
        });
      } else {
        this.$el.css({
          top: '50%',
          transform: `translateY(-50%)`,
        });
      }
    }
  }


  render(...args) {
    super.render(...args);

    this.positionCrossAxis();
    this.positionOffscreen();
    this.getSparks();

    // ensuring this is the last appended element
    this.$el.append(this.$getPanelFrame())
    console.log('[Panel render()] new height: %o', this.$el.css('height'))
  }


  // requires content.animationAxis
  // or maybe the cell can store metadata via original idea
  // of storing content dictionary objects instead of
  // just the content object itself..
  getSpec() {
    const { preferredAnimationAxis } = this;
    this.specs ||= this.buildSpecs();

    const { x: xSpec, y: ySpec } = this.specs;
    const isCornerCell = (!!xSpec && !!ySpec);
    const spec = isCornerCell
      ? this.specs[preferredAnimationAxis]
      : (xSpec || ySpec);

    if (!spec) {
      throw new Error('Panel is not within a GridCell on an edge!');
    }

    return spec;
  }

  buildSpecs() {
    const { gridLocation, center } = this;
    const froms = Object.keys(gridLocation).reduce((fromsArr, from) => {
      return gridLocation[from] ? [...fromsArr, from] : fromsArr;
    }, []);

    return froms.reduce((specs, from) => {
      const dim = ['top', 'bottom'].includes(from) ? 'Y' : 'X';
      const mainAxis = dim.toLowerCase();

      return {
        ...specs,
        [mainAxis]: {
          from,
          mainAxis,
          mainAxisDimName: (dim === 'Y') ? 'height' : 'width',
          translate: (val) => {
            const translations = [0, val];
            if (center) (translations[0] = '-50%');
            if (mainAxis === 'x') translations.reverse();
            // const currentTransform = this.$el.css('transform');
            return `translate(${translations.join(', ')})`;
            return `translateX(-50%) translate${dim}(${val})`;
            return `${currentTransform === 'none' ? '' : currentTransform} translate${dim}(${val})`;
          },
        },
      };
    }, {});
  }

  // expects an object with an $el
  // @returns {Promise}
  show({ delay = 0 } = {}) {
    console.log('just before animateIn, width: %o', this.$el.css('width'))
    return new Promise((resolve) => {
      setTimeout(() => {
        const { mainAxisDimName, translate } = this.getSpec();
        const length = this.$el.css(mainAxisDimName);
        console.log('translate(0): %o', translate(0))
        const contentEnter = [
          { transform: translate(0) },
          { offset: 0.15, transform: translate(`calc(0.7 * ${length})`) },
          { offset: 0.20, transform: translate(`calc(0.65 * ${length})`) },
          { transform: translate(`calc(${length} + ${this.offscreenShift})`) },
        ];
        const contentEnterTiming = {
          duration: 3000,
          easing: 'ease-in',
          fill: 'forwards',
        };

        this.sparksOpen.forEach((spark) => spark.play());

        const animation = this.$el[0].animate(contentEnter, contentEnterTiming);
        animation.onfinish = resolve;
      }, delay);
    });
  }

  // expects an object with an $el
  // @returns {Promise}
  hide({ delay = 0 } = {}) {
    const { mainAxisDimName, translate } = this.getSpec();
    const length = this.$el.css(mainAxisDimName);

    // cell will need to know orientation for correct entry/exit animations
    const contentExit = [
      { transform: translate(`calc(${length} + ${this.offscreenShift})`) },
      { offset: 0.40, transform: translate(`calc(0.3 * ${length})`) },
      { transform: translate(0) },
    ];
    const contentExitTiming = {
      duration: 2000,
      easing: 'ease-in',
      fill: 'forwards',
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        const animation = this.$el[0].animate(contentExit, contentExitTiming);
        animation.onfinish = resolve;
      }, delay);
    });
  }
}
