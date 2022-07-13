import Randable from '../lib/mixins/randable.mjs';
import SoundEffect from './SoundEffect.mjs';


export default class SoundGroup extends Randable() {
  sounds = [];


  constructor(name, basePath, numFiles, { prefix = '', fileExt = '.ogg' } = {}) {
    super();

    this.name = name;
    this.basePath = basePath;
    this.numFiles = numFiles;
    this.prefix = prefix;
    this.fileExt = fileExt;

    this.readyPromise = new Promise((resolve, reject) => {
      this.loadFiles().then(resolve);
    });
  }


  loadFiles() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.numFiles; i++) {
        this.sounds.push(
          new SoundEffect(`${this.basePath}/${this.prefix}${i + 1}${this.fileExt}`),
        );
      }

      Promise.all(this.sounds.map((sound) => sound.readyPromise))
        .then(resolve);
    });
  }

  random() {
    const keyIndex = this.randInt(this.sounds.length - 1);

    // check to see if it's playing and choose another if so?

    return this.sounds[keyIndex];
  }
}
