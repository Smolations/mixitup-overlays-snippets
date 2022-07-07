export default class SoundEffect {
  fadeIn = false;
  fadeOut = false;

  constructor(filePath) {
    this.filePath = filePath;
    this.audio = new Audio(filePath);
  }

  play(start = 0) {}

  // percentage?
  volume(amount) {}
}
