// original codepen:
// https://codepen.io/jonobr1/pen/yRpoPQ?editors=0010

export default class Sparks {
  get COLORS() {
    return [
      'rgb(252, 236, 5)', // bumblebee
      'rgb(253, 165, 15)', // fire
      'rgb(255, 253, 208)', // cream
      'rgb(255, 255, 255)', // white
    ]
  }

  get left() {
    return this.getOptValueOrRandom('left');
  }

  get top() {
    return this.getOptValueOrRandom('top');
  }

  // get rotation() {
  //   return this.getOptValueOrRandom('rotation');
  // }

  get scaleFactor() {
    return this.getOptValueOrRandom('scaleFactor');
  }

  get sparkDuration() {
    return this.getOptValueOrRandom('sparkDuration');
  }


  /**
   * @param {Object} opts
   * @property {Number} top  represents pixels; will be centered by default for visibility
   * @property {Number} left represents pixels; will be centered by default for visibility
   * @property {Number} rotation float; radians, where 0 represents "up" and positive numbers rotate clockwise
   * @property {Number} [speed=120] how "long" the curves are and, thus, how fast the sparks travel
   * @property {Number} [amount=60] the number of total spark curves in a single rendering loop
   */
  constructor(opts) {
    this.opts = {
      amount: 60,
      speed: 120,
      frequency: 6,
      duration: 3000,
      sparkDuration: 500,
      rotation: 0,
      rotationVariation: 0.1,
      scaleFactor: 1,
      startDelay: 0, // does not affect overall duration
      fullscreen: true,
      autostart: false,
      ...opts,
    };
    console.log('Sparks opts: %o', this.opts);

    this.two = (new Two({
      type: Two.Types.canvas,
      autostart: false, // will use instance's .play() based on opts
      fullscreen: this.opts.fullscreen,
    })).appendTo(document.body);

    // need this.two here
    this.opts.top ||= (this.two.height / 2);
    this.opts.left ||= (this.two.width / 2);

    this.$canvas = $(this.two.renderer.domElement);
    this.$glare = this.$getGlare();

    this.prepareScene();

    if (this.opts.autostart) {
      this.play();
    }
  }

  /**
   * @param {Number} [max=opts.duration] in milliseconds
   * @param {Number} [delay=opts.startDelay] in milliseconds
   */
  getRandomTime(
    max = this.opts.duration,
    delay = this.opts.startDelay,
  ) {
    return Math.floor(Math.random() * (max - delay)) + delay;
  }

  /**
   * @param {Number} [radians=opts.rotation]
   * @param {Number} [variation=opts.rotationVariation]
   */
  getRandomRotation(
    radians = this.opts.rotation,
    variation = this.opts.rotationVariation,
  ) {
    const sign = (Math.random() < 0.5) ? -1 : 1;
    const variationValue = (sign * Math.random() * variation);

    return (variationValue + radians);
  }

  /**
   * @param {Number} min
   * @param {Number} max
   */
  getRandomNumber(min, max) {
    const diff = (max - min);
    const randomDiff = Math.floor(Math.random() * diff);

    return (min + randomDiff);
  }

  // alternative to a *Variation opt for vars
  // @todo set up for rotation opt
  // @param {String} optName the name of the option matching constructor opts
  getOptValueOrRandom(optName) {
    if (!(optName in this.opts)) {
      throw new Error(`No option named ${optName} exists!`);
    }

    let value = this.opts[optName];

    if (Array.isArray(value)) {
      // type checking?
      value = this.getRandomNumber(...value);
    }
    console.log('optValueOrRandom(%o) => %o', optName, value);
    return value;
  }

  // @todo "squeeze" element via transform to better match shape of sparks
  $getGlare(width = 80) {
    const scaledWidth = (this.opts.scale * width);
    const radialGradient = [
      'rgba(255, 255, 255, 0.45)',
      'rgba(255, 255, 255, 0.08)',
      'rgba(255, 255, 255, 0)',
    ].join(', ');

    return $('<div>')
      .addClass('Sparks--glare')
      .css({
        position: 'absolute',
        top: 0 - (scaledWidth / 2),
        left: this.opts.left - (scaledWidth / 2),
        width: `${scaledWidth}px`,
        height: `${scaledWidth}px`,
        borderRadius: `${(scaledWidth / 2)}px`,
        background: `radial-gradient(${radialGradient})`,
      });
  }

  /**
   * @param {Number} rotation float; radian value
   */
  rotate(rotation) {
    this.two.scene.rotation = rotation;
  }

  /**
   * @param {Number} x basically css "left"
   * @param {Number} y basically css "top"
   */
  translate(x, y) {
    this.two.scene.translation.set(x, y);
  }

  /**
   * @param {Number} scaleFactor percentage scale of original (e.g. 0.6 === 60%)
   */
  scale(scaleFactor) {
    this.two.scene.scale = scaleFactor;
  }


  // @todo need to start timer based on duration so that the
  // scene can be paused afterwards
  play() {
    this.two.play();
    this.generateRandomSparking();
  }


  // placeholders to implement later
  // pausing likely won't be worth working on, unless
  // it takes on a different meaning (e.g. pausing sparks
  // while not sparking to save on resources)
  pause() {}
  // perhaps this could be a way to reconfigure an existing instance?
  restart() {}


  // may only support rgb/hex? or any css color value
  // @returns {String}
  getRandomSparkColor() {
    const numColors = this.COLORS.length;
    return this.COLORS[Math.floor(Math.random() * numColors)];
  }

  generateSparkCurves() {
    const curves = [];
    const resolution = 4; // maybe will become an opt later

    for (let j = 0; j < this.opts.amount; j++) {
      const points = [];
      const vx = (Math.random() - 0.5) * this.opts.speed;
      let vy = Math.random() * this.opts.speed;
      let x = 0;
      let y = 0;

      // creates the curve's "path"?
      // probs pop this out into its own method..
      for (let i = 0; i < resolution; i++) {
        points.push(new Two.Anchor(x, y));
        x += vx;
        y += vy;
        vy += this.opts.speed / (resolution * 0.66);
      }

      // debug..
      // if (j < 3) {
      //   console.log(points.map((point) => point.toObject()));
      // }

      const curve = this.two.makeCurve(points, true);

      curve.noFill();
      curve.linewidth = 8 * Math.random();
      curve.cap = 'round';
      curve.stroke = this.getRandomSparkColor();

      curves.push(curve);
    }

    return curves;
  }

  prepareScene() {
    this.$canvas.css({
      background: 'transparent',
      opacity: 0,
    }); // as overlay
    this.$glare.css({ opacity: 0 }).appendTo('body');

    // ?
    this.two.renderer.ctx.globalCompositeOperation = 'screen';

    this.generateSparkCurves().forEach((curve) => this.two.add(curve));
    // could eventually use css variables to location panel edges
    this.translate(this.left, this.top);
    this.rotate(this.getRandomRotation());
    this.scale(this.scaleFactor);
    this.setUpdateBehavior();
  }

  /**
   * @param {Object} opts
   * @property {Number} opts.frequency number of times a spark occurs within the
   *                                   duration - delay; usually a small integer.
   * @property {Number} opts.duration  total duration where sparking can occur.
   */
  generateRandomSparking({
    frequency = this.opts.frequency,
    duration = this.opts.duration,
  } = {}) {
    for (let i = 0; i < frequency; i++) {
      const time = this.getRandomTime(duration);
      const rotation = this.getRandomRotation();
      const sparkDuration = this.sparkDuration;

      // need to make sure sparks don't step on each other's toes since we're
      // just hiding/showing a continuous animation. random times should be added
      // to the random durations and there should be no overlap


      setTimeout(() => {
        this.rotate(rotation);
        this.scale(this.scaleFactor);
        this.translate(this.left, this.top);
        this.$canvas.css('opacity', 1);
        this.$glare.css('opacity', 1);

        setTimeout(() => {
          this.$canvas.css('opacity', 0);
          this.$glare.css('opacity', 0);
        }, sparkDuration);
      }, time);
    }
  }

  // @todo figure out what this does
  setUpdateBehavior() {
    const mouseX = 1;

    this.two.bind('update', (frameCount) => {
      const frames = 30 + (1 - mouseX) * 240;
      const thickness = 0.15;

      for (let i = 0; i < this.two.scene.children.length; i++) {
        const child = this.two.scene.children[i];
        const pct = i / this.two.scene.children.length;
        const offset = frames * pct;
        const ending = ((offset + frameCount) / frames) % 1;
        child.ending = ending;
        child.beginning = Math.max(ending - (thickness * pct) + thickness, 0);
        child.opacity = 1 - child.ending;
      }
    });
  }
}
