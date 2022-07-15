import Page from './components/Page.mjs';
import StreamerAvatar from './components/StreamerAvatar.mjs';
import TwitchClip from './components/TwitchClip.mjs';

// test:
// http://localhost:8080/browser-sources/show-clip.html?duration=10&id=SpunkyElatedCatPeoplesChamp-5tSsUE1OYF7_U9w6&displayName=SmolaGaming&avatarUrl=https://static-cdn.jtvnw.net/jtv_user_pictures/86c1ac0e-3702-4d6c-8eaa-5629ef85abc9-profile_image-300x300.png
const page = new Page({
  grid: { rows: 2, cols: 7 },
  assets: [
    // ...Terminal.assets,
  ],
});


page.ready(async (grid) => {
  const queryParams = new URLSearchParams(window.location.search);
  const middleCell = grid.cell(0, 3);
  const rightCell = grid.cell(0, 6);

  const displayName = queryParams.get('displayName'); console.log('displayName: %o', displayName);
  const avatarUrl = queryParams.get('avatarUrl');
  const clipId = queryParams.get('id');
  // const clipTitle = queryParams.get('title');
  const duration = Number(queryParams.get('duration')) * 1000; // ms
  const clip = new TwitchClip({ id: clipId });
  const streamer = new StreamerAvatar({ displayName, avatarUrl });

  // easier to determine height based on width
  const ratio = 1080 / 1920;
  const width = 1100;
  const height = width * ratio;


  // for random panel content to result in accurate animations,
  // ensure at _least_ the mainAxis dimension is set
  const panel = middleCell.addPanel('clip', {
    content: clip,
    height: `${height}px`,
    width: `${width}px`,
    center: true,
    driftMask: true,
  });

  const infoPanel = rightCell.addPanel('info', {
    preferredAnimationAxis: 'x',
    content: streamer,
    height: `400px`,
    width: `380px`,
    center: true,
    logo: false,
  });

  const { animationEnterTiming: enter, animationExitTiming: exit } = panel;
  const hideDelay = (duration - enter.duration - exit.duration - 1);

  // delay so i can click page before sounds are heard
  await panel.show();
  infoPanel.show();
  infoPanel.hide({ delay: hideDelay + 1000 });
  await panel.hide({ delay: hideDelay });
});
