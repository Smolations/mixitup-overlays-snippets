import Component from '../lib/mixins/component.mjs';

import Img from './Img.mjs';
import Panel from './Panel/Panel.mjs';


export default class StreamStartingPanel extends Component() {
  constructor(props = {}) {
    super();

    const { gridLocation } = props;

    const width = 1920;
    const height = 1080;



    // .addPanel triggers a "re-render"
    const panel = new Panel({
      height: `${height}px`,
      width: `${width}px`,
      center: true,
      open: true,
      // frameOnly: true,
      // driftMask: true,
      gridLocation,
    });


    return panel;
  }
}
