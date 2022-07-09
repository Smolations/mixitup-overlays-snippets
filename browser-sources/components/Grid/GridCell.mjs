import Panel from '../Panel/Panel.mjs';


export default class GridCell {
  static assets = [
    ...Panel.assets,
    // './components/Grid/GridCell.css',
  ];

  // require id's for all content for quick storage/access
  content = {};

  // grid cell defining how content can be animated within it: { x, y }
  specs;

  // hiding any lingering shadow from hidden content
  offscreenShift = '10px';


  constructor() {
    this.$el = $('<div>')
      .addClass('GridCell')
      .css({
        boxSizing: 'border-box',
        flexGrow: 1,
        position: 'relative',
        outline: '1px dotted blue',  // debugging
      });
  }


  // @returns {Promise}
  show(contentId, { delay } = {}) {
    const { content, spec } = this.content[contentId] || {};

    if (!content) {
      throw new Error(`Unable to find content with id: ${contentId}`);
    } else if (!spec) {
      throw new Error('GridCell is not on an edge!');
    }

    return this.animateIn(content, spec, {
      delay,
    });
  }

  hide(contentId, { delay } = {}) {
    const { content, spec } = this.content[contentId] || {};

    if (!content) {
      throw new Error(`Unable to find content with id: ${contentId}`);
    } else if (!spec) {
      throw new Error('GridCell is not on an edge!');
    }

    return this.animateOut(content, spec, {
      delay,
    });
  }

  addPanel(contentId, {
    content,
    height,
    width,
    center = false,
    animationAxis: preferredAnimationAxis,
  }) {
    const panel = new Panel({ height, width });
    const spec = this.getSpec(preferredAnimationAxis);
    const { from, animationDimensionName } = spec;
    // console.log('length(%o): %o', animationDimensionName, length)
    const contentObj = {
      id: contentId,
      content: panel,
      spec,
    };


    function getLength() {
      const defaultLength = `var(--min-${animationDimensionName})`;
      const elLength = panel.$el.css(animationDimensionName);
      return parseInt(elLength, 10)
        ? elLength
        : defaultLength;
    }


    if (center) {
      if (spec.animationAxis === 'y') {
        panel.$el.css({
          left: '50%',
          transform: `translateX(-50%)`,
        });
      } else {
        panel.$el.css({
          top: '50%',
          transform: `translateY(-50%)`,
        });
      }
    }

    this.content[contentId] = contentObj;

    this.$el.append(panel.$el);

    panel.addContent(content);
    console.log('after adding panel content, height: %o', panel.$el.css('height'))

    panel.$el.css({
      [from]: `calc(-1 * (${getLength()} + ${this.offscreenShift}))`,
    });

    return panel;
  }

  // requires content.animationAxis
  // or maybe the cell can store metadata via original idea
  // of storing content dictionary objects instead of
  // just the content object itself..
  getSpec(preferredAnimationAxis = 'y') {
    this.specs ||= this.buildSpecs();

    const { x: xSpec, y: ySpec } = this.specs;
    const isCornerCell = (!!xSpec && !!ySpec);
    const spec = isCornerCell
      ? this.specs[preferredAnimationAxis]
      : (xSpec || ySpec);

    if (!spec) {
      throw new Error('GridCell is not on an edge!');
    }

    return spec;
  }

  buildSpecs() {
    const $rows = $('.GridRow');
    const $firstRow = $rows.first();
    const $lastRow = $rows.last();
    const froms = [];

    // note: if/else only works with multi-row/multi-cell
    if (!!$firstRow.find(this.$el).length) {
      froms.push('top');
    } else if (!!$lastRow.find(this.$el).length) {
      froms.push('bottom');
    }

    if (this.$el.is(':last-of-type')) {
      froms.push('right');
    } else if (this.$el.is(':first-of-type')) {
      froms.push('left');
    }

    return froms.reduce((specs, from) => {
      const dim = ['top', 'bottom'].includes(from) ? 'Y' : 'X';
      const animationAxis = dim.toLowerCase();

      return {
        ...specs,
        [animationAxis]: {
          from,
          animationAxis,
          animationDimensionName: (dim === 'Y') ? 'height' : 'width',
          translate(val) {
            // expect `this` to be some content with .$el
            // (e.g. translate.call(content,...))
            const currentTransform = this.$el.css('transform');
            return `${currentTransform === 'none' ? '' : currentTransform} translate${dim}(${val})`
          },
        },
      };
    }, {});
  }

  // expects an object with an $el
  // @returns {Promise}
  animateIn(content, spec, { delay = 0 } = {}) {
    const { animationDimensionName, translate } = spec;
    const length = content.$el.css(animationDimensionName);
    // cell will need to know orientation for correct entry/exit animations
    const contentEnter = [
      { transform: translate.call(content, 0) },
      { offset: 0.15, transform: translate.call(content, `calc(0.7 * ${length})`) },
      { offset: 0.20, transform: translate.call(content, `calc(0.65 * ${length})`) },
      { transform: translate.call(content, `calc(${length} + ${this.offscreenShift})`) },
    ];
    const contentEnterTiming = {
      duration: 3000,
      easing: 'ease-in',
      fill: 'forwards',
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const animation = content.$el[0].animate(contentEnter, contentEnterTiming);
        animation.onfinish = resolve;
      }, delay);
    });
  }

  // expects an object with an $el
  // @returns {Promise}
  animateOut(content, spec, { delay = 0 } = {}) {
    const { animationDimensionName, translate } = spec;
    const length = content.$el.css(animationDimensionName);

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
        const animation = content.$el[0].animate(contentExit, contentExitTiming);
        animation.onfinish = resolve;
      }, delay);
    });
  }
}
