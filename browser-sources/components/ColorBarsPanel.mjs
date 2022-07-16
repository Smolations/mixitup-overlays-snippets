import Component from '../lib/mixins/component.mjs';

import Img from './Img.mjs';
import SoundEffect from './SoundEffect.mjs';
import Panel from './Panel/Panel.mjs';


export default class ColorBarsPanel extends Component() {
  constructor(props = {}) {
    super();

    const { gridLocation } = props;

    const width = 1920;
    const height = 1080;

    const sound = new SoundEffect('./lib/sounds/colorbars.mp3');
    sound.loop = true;
    sound.readyPromise.then(() => sound.play());

    const bars = new Img({
      src: './img/color_bars_1920x1080.jpg',
      height,
      width,
    });

    // .addPanel triggers a "re-render"
    const panel = new Panel({
      height: `${height}px`,
      width: `${width}px`,
      center: true,
      open: true,
      frameOnly: true,
      driftMask: true,
      gridLocation,
    });

    panel.onClosed(() => sound.stop());

    panel.addChild(bars);

    return panel;
  }
}
