import Component from '../lib/mixins/component.mjs';
import Header from './Header.mjs';
import Img from './Img.mjs';


export default class StreamerAvatar extends Component() {
  constructor(props = {}) {
    super();

    const {
      avatarUrl,
      displayName,
    } = props;

    this.$el = $('<div>')
      .addClass('StreamerAvatar')
      .css({
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '100%',
        maxWidth: '100%',
        '-webkit-mask-image': 'var(--rust-mask-image)',
        '-webkit-mask-size': '100%',
        filter: 'drop-shadow(0px 0px 3px #000) brightness(0.9)',
      });

    this.addChild(
      new Img({
        src: avatarUrl,
        width: '75%',
        height: '75%',
        // flexGrow: 1,
        flexShrink: 1,
      }),
      new Header({
        size: (displayName.length > 12) ? 2 : 1,
        text: displayName,
        textAlign: 'center',
        flexShrink: 0,
      }),
    );
  }
}
