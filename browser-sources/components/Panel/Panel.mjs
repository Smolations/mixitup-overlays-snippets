import Component from '../../lib/mixins/component.mjs';
import Logable from '../../lib/mixins/logable.mjs';
import Randable from '../../lib/mixins/randable.mjs';

import DriftMask from '../DriftMask.mjs';
import SoundGroup from '../SoundGroup.mjs';
import Sparks from '../Sparks.mjs';


export default class Panel extends Logable(Randable(Component())) {
  static assets = [
    ...DriftMask.assets,
    ...Sparks.assets,
    // './components/Panel/Panel.css',
  ];

  specs;
  sparksOpen = [];
  sparksClose = [];

  onOpenCallbacks = [];
  onOpenedCallbacks = [];
  onCloseCallbacks = [];
  onClosedCallbacks = [];

  sounds = {};

  // hiding any lingering shadow from hidden content
  offscreenShift = '10px';

  xFrameWidth = '16px';
  yFrameWidth = '16px';

  logoWidth = '200px';
  logoHeight = '21px'; // approx; update if width ever changes
  logoOffset = '10px';

  cssVars;

  panelCommonCss = {
    boxSizing: 'border-box',
    background: 'var(--battletech-grey) url("./img/rusty-iron-plate-bg.jpg") repeat',
    minHeight: 'var(--min-height)',
    minWidth: 'var(--min-width)',
  };

  crossAxisTransforms = [];

  animationEnterTiming = {
    duration: 3000,
    easing: 'ease-in',
    fill: 'forwards',
  };

  animationExitTiming = {
    duration: 2000,
    easing: 'ease-in',
    fill: 'forwards',
  };

  get $childrenContainer() {
    return this.driftMask?.$el || this.$el;
  }


  constructor(props = {}) {
    super();

    const {
      height,
      width,
      gridLocation,
      preferredAnimationAxis = 'y',
      open = false,
      center = false,
      logo = true,
      frameOnly = false,
      driftMask = false,
    } = props;

    this.height = height;
    this.width = width;
    this.open = open;
    this.center = center;
    this.gridLocation = gridLocation;
    this.preferredAnimationAxis = preferredAnimationAxis;
    this.logo = logo;
    this.frameOnly = frameOnly;

    if (!logo) {
      this.logoWidth = 0;
      this.logoHeight = 0;
      this.logoOffset = 0;
    }

    this.cssVars = this.getCssVars();

    this.$el = this.$getPanel();

    if (driftMask) {
      this.driftMask = (typeof(driftMask) === 'object')
        ? new DriftMask(driftMask)
        : new DriftMask();
      this.$el.append(this.driftMask.$el);
    }

    this.readyPromise = this.loadSounds();
  }


  getCssVars() {
    const _this = this;
    return {
      get '--y-offset'() { return _this.yFrameWidth; },
      get '--x-offset'() { return _this.xFrameWidth; },
      get '--y-offset-calc'() { return `calc(100% - ${_this.yFrameWidth})`; },
      get '--x-offset-calc'() { return `calc(100% - ${_this.xFrameWidth})`; },
      get '--logo-unused-width-half'() { return `calc((100% - ${_this.logoWidth}) / 2)`; },
      get '--logo-offset-2x'() { return `calc(2 * ${_this.logoOffset})`; },
      get '--logo-total-height'() { return `calc(${_this.logoHeight} + 2 * ${_this.logoOffset})`; },
      get '--min-width'() { return `calc(2 * ${_this.logoOffset} + ${_this.logoWidth})`; },
      get '--min-height'() { return `calc(2 * ${_this.logoOffset} + ${_this.logoHeight} + 2 * var(--y-offset))`; },
      get '--border-radius'() { return '3px'; },
      get '--drop-shadow'() { return 'drop-shadow(0 -4px 8px #000)'; },
      get '--rust-mask-image'() { return 'url("./img/mask_rust_alpha_black.png")'; },
    }
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
        height,
        width,
        padding: `var(--y-offset) var(--x-offset)`,
        backgroundBlendMode: 'hard-light',
        borderRadius: 'var(--border-radius)',
        color: 'white',
        transform: center ? 'translate(-50%, 0)' : 'translate(0, 0)',
        ...(this.frameOnly && { background: 'none' })

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

    const $frameBottom = $('<div>')
      .addClass('Panel--frame-bottom')
      .css({
        ...this.panelCommonCss,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: this.logo ? 'var(--logo-total-height)' : 'var(--y-offset)',
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
      });

    if (this.logo) {
      $frameBottom.append($logo);
    }

    return $frameBottom;
  }

  onOpen(cb) {
    this.onOpenCallbacks.push(cb);
  }

  onOpened(cb) {
    this.onOpenedCallbacks.push(cb);
  }

  onClose(cb) {
    this.onCloseCallbacks.push(cb);
  }

  onClosed(cb) {
    this.onClosedCallbacks.push(cb);
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
        '-webkit-mask-image': 'var(--rust-mask-image)',
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

  getCommonSparkOpts() {
    const { from } = this.getSpec();
    const { right, left, top, bottom } = this.rect;
    const offscreenOffset = 5;
    // this.log('rect: %o', this.rect);

    const common = {
      duration: this.animationEnterTiming.duration + 1000,
      rotationVariation: Math.PI * (1 / 8),
    };

    switch (from) {
      case 'top':
        common.top = -offscreenOffset;
        common.left = [left, right];
        common.rotation = 0;
        break;
      case 'bottom':
        common.top = top + offscreenOffset;
        common.left = [left, right];
        common.rotation = Math.PI;
        break;
      case 'right':
        common.top = [top, bottom];
        common.left = left + offscreenOffset;
        common.rotation = 0.5 * Math.PI;
        break;
      case 'left':
        common.top = [top, bottom];
        common.left = -offscreenOffset;
        common.rotation = -0.5 * Math.PI;
        break;
    }

    return common;
  }

  getOpeningSparks() {
    const common = this.getCommonSparkOpts();
    common.duration = this.animationEnterTiming.duration + 1000;

    return [
      new Sparks({
        ...common,
        id: 'bigSparks',
        speed: 110,
        scaleFactor: [0.5, 0.7],
        sparkDuration: [500, 900],
        frequency: 4,
      }),
      new Sparks({
        ...common,
        id: 'smallSparks',
        speed: 130,
        scaleFactor: [0.2, 0.4],
        sparkDuration: [300, 600],
        frequency: 3,
      }),
    ];
  }

  getClosingSparks() {
    const common = this.getCommonSparkOpts();
    common.duration = this.animationExitTiming.duration + 1000;

    return [
      new Sparks({
        ...common,
        id: 'smallerSparks',
        speed: 160,
        scaleFactor: [0.2, 0.4],
        sparkDuration: [300, 600],
        frequency: 3,
      }),
      new Sparks({
        ...common,
        id: 'biggerSparks',
        speed: 110,
        scaleFactor: [0.5, 0.7],
        sparkDuration: [400, 950],
        frequency: 2,
      }),
    ];
  }

  createSparks() {
    const openingSparks = this.getOpeningSparks();
    const closingSparks = this.getClosingSparks();

    this.sparksOpen.push(...openingSparks);
    this.sparksClose.push(...closingSparks);
  }

  // @returns {Function} so that sounds can be kicked off along with animations
  syncSoundsWithAnimation(keyframes, timing) {
    return () => {
      this.syncThuds(keyframes, timing)();
      this.syncAmbient(keyframes, timing)();
      this.syncRandom(keyframes, timing)();
    };
  }

  syncThuds(keyframes, timing) {
    const { duration } = timing;

    return () => {
      // expect animations (except first/last) will have an
      // offset for realism (but be ready for otherwise)
      keyframes.forEach((keyframe, ndx) => {
        if (ndx === 0) {
          // animation start
          this.sounds.thud.random().play();
        } else if (ndx === keyframes.length - 1) {
          // animation end
          setTimeout(() => this.sounds.thud.random().play(), duration);
        } else {
          // interstitial animations
          const { offset } = keyframe;
          setTimeout(() => this.sounds.thud.random().play(), duration * offset);
        }
      });
    };
  }

  syncAmbient(keyframes, timing) {
    const { duration } = timing;

    return () => {
      const sound = this.sounds.ambient.random();

      if (sound.duration < duration) {
        const rate = (duration / sound.duration);
        sound.rate(rate);
      }

      sound.play();

      setTimeout(() => sound.reset(), duration);
    };
  }

  syncRandom(keyframes, timing) {
    const { duration } = timing;
    const soundPool = [
      'clattering',
      'grind',
      'grind',
      'groan',
      'groan',
      'groan-screech',
      'screech',
      'screech',
    ].map((groupName) => this.sounds[groupName].random())
      .filter((sound) => (sound.duration <= duration));

    // this.log('this.sounds: %o', this.sounds);
    // this.log('soundPool: %o', soundPool);
    const sound = soundPool[this.randInt(soundPool.length - 1)];
    // this.log('sound: %o', sound);
    const durationDiff = duration - sound.duration;
    const randomStart = this.randFloat(durationDiff);

    return () => {
      setTimeout(() => sound.play(), randomStart);
      setTimeout(() => sound.reset(), duration);
    };
  }
  // etc..


  positionOffscreen() {
    const gridSpec = this.getSpec();
    const {
      from,
      mainAxisDimName,
      transformScalar,
    } = gridSpec;

    const defaultLength = `var(--min-${mainAxisDimName})`;
    const elLength = this.$el.css(mainAxisDimName);
    const offscreenLength = parseInt(elLength, 10)
      ? elLength
      : defaultLength;

    this.log('positionOffscreen elLength: %o', elLength)
    this.log('positionOffscreen offscreenLength: %o', offscreenLength)
    this.$el.css({
      [from]: `calc(-1 * (${offscreenLength} + ${this.offscreenShift}))`,
      ...(this.open && { transform: this.translate(`calc(${transformScalar} * (${offscreenLength} + ${this.offscreenShift}))`) })
    });
    // debugger;
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

    // we'll add positioning after elements gain some layout
    // when added to the DOM.
    this.positionCrossAxis();
    this.positionOffscreen();
    this.createSparks();


    // ensuring this is the last appended element
    this.$el.append(this.$getPanelFrame());
  }


  /**
   * In order for animations/effects to occur for a panel, it must have some
   * idea about its position on the grid (i.e. information about its containing
   * GridCell). Using the grid cell's location data, some helpful information
   * can be generated for use in other methods which require this positioning
   * data.
   *
   * @returns {Object} spec An object with information about the panel's
   *                        containing cell, containing the following properties:
   *                          {String} spec.from        One of 'top', 'left', 'bottom', 'right'.
   *                          {String} spec.mainAxis    Either 'x' or 'y'.
   *                          {String} spec.mainAxisDimName Either 'height' or 'width'.
   *                          {Number} spec.transformScalar Either -1 or 1.
   *                          {Function} spec.translate A function that provides a value for
   *                                                    the css `transform` property given a
   *                                                    main axis translation length.
   */
  getSpec() {
    const { preferredAnimationAxis } = this;
    this.specs ||= this.buildSpecs();
    // this.log(this.specs)

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
          transformScalar: ['right', 'bottom'].includes(from) ? -1 : 1,
          translate: (val) => {
            const translations = [0, val];
            if (center) (translations[0] = '-50%');
            if (mainAxis === 'x') translations.reverse();

            return `translate(${translations.join(', ')})`;
          },
        },
      };
    }, {});
  }

  translate(val) {
    const { center } = this;
    const { mainAxis } = this.getSpec();
    const translations = [0, val];

    if (center) (translations[0] = '-50%');
    if (mainAxis === 'x') translations.reverse();

    return `translate(${translations.join(', ')})`;
  }

  // @returns {Promise}
  loadSounds() {
    const basePath = './lib/sounds/metal';
    const groupPromises = [];

    [
      ['ambient', 11],
      ['clattering', 3],
      ['grind', 10],
      ['groan', 15],
      ['groan-screech', 3],
      ['screech', 9],
      ['thud', 14],
    ].forEach((group) => {
      const [name, numFiles] = group;

      this.sounds[name] = new SoundGroup(name, `${basePath}/${name}`, numFiles);

      groupPromises.push(this.sounds[name].readyPromise);
    });

    return Promise.all(groupPromises);
  }

  // expects an object with an $el
  // @returns {Promise}
  async show({ delay = 0 } = {}) {
    // console.log('just before animateIn, width: %o', this.$el.css('width'))
    await this.readyPromise;

    // process onOpen callbacks
    this.onOpenCallbacks.forEach((cb) => cb());

    let promise = Promise.resolve();

    if (!this.open) {
      promise = new Promise((resolve) => {
        setTimeout(() => {
          const {
            mainAxisDimName,
            transformScalar,
            translate,
          } = this.getSpec();
          const length = this.$el.css(mainAxisDimName);
          // this.log('length: %o', length);
          // this.log('rect length: %o', this.rect[mainAxisDimName]);

          // console.log('translate(0): %o', translate(0))
          const contentEnter = [
            { transform: translate(0) },
            { offset: 0.15, transform: translate(`calc(0.7 * ${length} * ${transformScalar})`) },
            { offset: 0.20, transform: translate(`calc(0.65 * ${length} * ${transformScalar})`) },
            { transform: translate(`calc(${transformScalar} * (${length} + ${this.offscreenShift}))`) },
          ];

          const playSounds = this.syncSoundsWithAnimation(contentEnter, this.animationEnterTiming);
          const sparks = this.sparksOpen;

          sparks.forEach((spark) => spark.play());
          playSounds();

          const animation = this.$el[0].animate(
            contentEnter,
            this.animationEnterTiming,
          );

          animation.onfinish = () => {
            this.open = true;

            setTimeout(() => (
              sparks.forEach((spark) => spark.hide())
            ), 1000);

            resolve();
          };
        }, delay);
      });
    }

    promise = promise.then(() => {
      this.onOpenedCallbacks.forEach((cb) => cb());
    });

    // this means it would never open again?
    return promise;
  }

  // expects an object with an $el
  // @returns {Promise}
  async hide({ delay = 0 } = {}) {
    await this.readyPromise;

    let promise = Promise.resolve();

    // process onOpen callbacks
    this.onCloseCallbacks.forEach((cb) => cb());

    if (this.open) {
      promise = new Promise((resolve) => {
        setTimeout(() => {
          const {
            mainAxisDimName,
            transformScalar,
            translate,
          } = this.getSpec();
          const length = this.$el.css(mainAxisDimName);

          // bottom may need more offset since drop shadow offsets upward
          const contentExit = [
            { transform: translate(`calc(${transformScalar} * (${length} + ${this.offscreenShift}))`) },
            { offset: 0.40, transform: translate(`calc(0.3 * ${length} * ${transformScalar})`) },
            { transform: translate(0) },
          ];

          const playSounds = this.syncSoundsWithAnimation(contentExit, this.animationExitTiming);
          const sparks = this.sparksClose;

          sparks.forEach((spark) => spark.play());
          playSounds();

          const animation = this.$el[0].animate(
            contentExit,
            this.animationExitTiming,
          );

          animation.onfinish = () => {
            this.open = false;

            setTimeout(() => (
              sparks.forEach((spark) => spark.hide())
            ), 1000);

            resolve();
          };
        }, delay);
      });
    }

    promise = promise.then(() => {
      this.onClosedCallbacks.forEach((cb) => cb());
    });

    return promise;
  }
}
