export default class SoundEffect {
  fadeIn = false;
  fadeOut = false;

  playable = false;
  readyPromise;

  get duration() {
    return 1000 * this.audio.duration;
  }

  set loop(val) {
    this.audio.loop = val;
  }


  constructor(filePath) {
    const audio = new Audio(filePath);

    this.filePath = filePath;
    this.audio = audio;

    this.readyPromise = new Promise((resolve, reject) => {
      this.on('canplay', () => {
        this.playable = true;
        resolve();
      });
    });

    this.addEventListeners();
  }


  ready(callback) {
    this.readyPromise.then(callback);
  }

  addEventListeners() {
    const { audio } = this;

    // this.on('durationchange', () => {
    //   this.duration = audio.duration;
    // });
    this.on('error', (event) => {
      console.error('[SoundEffect] Error occurred for %o: %o', this.filePath, event);
    });
  }

  play(start = 0) {
    if (this.audio.currentTime !== start) {
      this.audio.currentTime = start;
    }
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.pause();
  }

  reset() {
    this.stop();
    this.audio.currentTime = 0;
    this.audio.playbackRate = 1;
  }

  rate(num) {
    this.audio.playbackRate = num;
  }

  // percentage?
  volume(amount) {}

  on(...args) {
    this.audio.addEventListener(...args);
  }
}

/** EVENTS */
// abort - Fired when the resource was not fully loaded, but not as the result of an error.
// canplay - Fired when the user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content;
// canplaythrough - Fired when the user agent can play the media, and estimates that enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
// durationchange - Fired when the duration attribute has been updated.
// emptied - Fired when the media has become empty; for example, when the media has already been loaded(or partially loaded), and the HTMLMediaElement.load() method is called to reload it.
// ended - Fired when playback stops when end of the media(<audio> or <video>) is reached or because no further data is available.
// error - Fired when the resource could not be loaded due to an error.
// loadeddata - Fired when the first frame of the media has finished loading.
// loadedmetadata - Fired when the metadata has been loaded
// loadstart - Fired when the browser has started to load a resource.
// pause - Fired when a request to pause play is handled and the activity has entered its paused state, most commonly occurring when the media's HTMLMediaElement.pause() method is called.
// play - Fired when the paused property is changed from true to false, as a result of the HTMLMediaElement.play() method, or the autoplay attribute
// playing - Fired when playback is ready to start after having been paused or delayed due to lack of data
// progress - Fired periodically as the browser loads a resource.
// ratechange - Fired when the playback rate has changed.
// seeked - Fired when a seek operation completes
// seeking - Fired when a seek operation begins
// stalled - Fired when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
// suspend - Fired when the media data loading has been suspended.
// timeupdate - Fired when the time indicated by the currentTime attribute has been updated.
// volumechange - Fired when the volume has changed.
// waiting - Fired when playback has stopped because of a temporary lack of data.;
