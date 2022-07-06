export default class Javascript {
  #isAlreadyLoaded = true;

  // will initially require a method call to load,
  // but if it doesn't matter an opts object could
  // be passed to change behavior..
  constructor(src, isModule = true) {
    let $script = $(`script[src="${src}"]`);

    if (!$script.length) {
      this.#isAlreadyLoaded = false;
      $script = this.#createScript(src, isModule);
    }

    this.src = src;
    this.$script = $script;
  }

  load() {
    return new Promise((resolve, reject) => {
      if (this.#isAlreadyLoaded) {
        console.debug(`JS ALREADY LOADED: ${this.src}`);
        resolve();
      } else {
        this.$script.on('error', reject);
        this.$script.on('load', () => {
          console.debug(`JS LOADED: ${this.src}`);
          resolve();
        });

        // weirdly, must be done in this order for load
        // handler to fire..  =/
        this.$script.appendTo('head');
        this.$script.attr('src', this.src);
      }
    });
  }

  #createScript(src, isModule) {
    const $script = $('<script>');
    const type = isModule ? 'module' : 'application/javascript';

    // if (src.startsWith('http')) {
    //   $script.attr('crossorigin', 'anonymous');
    // }

    $script.attr('type', type);

    return $script;
  }
}
