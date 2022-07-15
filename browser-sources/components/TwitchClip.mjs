import Component from '../lib/mixins/component.mjs';
import IFrame from './IFrame.mjs';

/*
<iframe
    src="https://clips.twitch.tv/embed?clip=<slug>&parent=streamernews.example.com"
    height="<height>"
    width="<width>"
    allowfullscreen>
</iframe>
*/
export default class TwitchClip extends Component() {
  baseSrc = 'https://clips.twitch.tv/embed';
  parent = 'localhost';

  constructor(props = {}) {
    super();

    const {
      id,
      height = '100%',
      width = '100%',
    } = props;

    const urlParams = new URLSearchParams({
      clip: id,
      parent: this.parent,
      autoplay: true,
    });

    this.$el = $('<div>')
      .addClass('TwitchClip')
      .css({
        height,
        width,
      });

    this.addChild(new IFrame({
      height,
      width,
      src: `${this.baseSrc}?${urlParams.toString()}`,
    }));
  }
}
