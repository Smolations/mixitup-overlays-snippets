import Component from '../lib/mixins/component.mjs';

/*
<iframe
    src="https://clips.twitch.tv/embed?clip=<slug>&parent=streamernews.example.com"
    height="<height>"
    width="<width>"
    allowfullscreen>
</iframe>
*/
export default class IFrame extends Component() {
  constructor(props = {}) {
    super();

    // const {
    //   height,
    //   width,
    //   src,
    //   clip,
    //   allowFullscreen = false,
    // } = props;

    this.$el = $('<iframe>')
      .addClass('IFrame')
      .attr({
        ...props,
      });
  }
}
