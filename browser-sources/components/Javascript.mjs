export default class Javascript {
  // will initially require a method call to load,
  // but if it doesn't matter an opts object could
  // be passed to change behavior..
  constructor(src, isModule = true) {
    const $script = $('<script>');
    const type = isModule ? 'module' : 'application/javascript';

    $script.attr('type', type);

    this.src = src;
    this.$script = $script;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.$script.on('error', reject);
      this.$script.on('load', () => {
        console.debug(`JS LOADED: ${this.src}`);
        resolve();
      });

      // weirdly, must be done in this order for load
      // handler to fire..  =/
      this.$script.appendTo('head');
      this.$script.attr('src', this.src);
    });
  }
}
