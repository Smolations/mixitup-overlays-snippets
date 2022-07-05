export default class Css {
  #isAlreadyLoaded = true;

  // will initially require a method call to load,
  // but if it doesn't matter an opts object could
  // be passed to change behavior..
  constructor(href) {
    let $link = $(`link[href="${href}"]`);

    if (!$link.length) {
      this.#isAlreadyLoaded = false;
      $link = this.#createLink(href);
    }

    this.href = href;
    this.$root = $(':root');
    this.$link = $link;
  }

  load() {
    return new Promise((resolve, reject) => {
      if (this.#isAlreadyLoaded) {
        console.debug(`CSS ALREADY LOADED: ${this.href}`);
        resolve();
      } else {
        this.$link.on('error', reject);
        this.$link.on('load', () => {
          console.debug(`CSS LOADED: ${this.href}`);
          resolve();
        });

        this.$link.appendTo('head');
      }
    });
  }

  #createLink(href) {
    const $link = $('<link>');

    $link
      .attr('rel', 'stylesheet')
      .attr('type', 'text/css')
      .attr('href', href);

    return $link;
  }
}
