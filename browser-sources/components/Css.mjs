export default class Css {
  // will initially require a method call to load,
  // but if it doesn't matter an opts object could
  // be passed to change behavior..
  constructor(href) {
    const $link = $('<link>');

    $link
      .attr('rel', 'stylesheet')
      .attr('type', 'text/css')
      .attr('href', href);

    this.href = href;
    this.$root = $(':root');
    this.$link = $link;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.$link.on('error', reject);
      this.$link.on('load', () => {
        console.debug(`CSS LOADED: ${this.href}`);
        resolve();
      });

      this.$link.appendTo('head');
    });
  }
}
