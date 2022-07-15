import Component from '../lib/mixins/component.mjs';


export default class DriftMask extends Component() {
  static assets = ['./components/DriftMask.css'];


  // should pass a background color for maximum effectiveness
  // when content is transparent. additionally, best results
  // when wrapping drifted content. ensures maximum effect on
  // all children
  constructor(props = {}) {
    super();

    // could potentially change mask size, animation duration, etc
    const { yMax, ...css } = props;

    this.$el = $('<div>')
      .addClass('DriftMask')
      .css({
        position: 'relative',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        ...css,
      });

    if (yMax) {
      this.$el.css('--Drift-mask-y-max', yMax);
    }
  }
}
