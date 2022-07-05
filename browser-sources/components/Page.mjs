import Css from './Css.mjs';
import Javascript from './Javascript.mjs';

// this will import all of the default stuffs for a page.
// the idea will be that components will auto-load all
// the necessary libs/styles they need so that the html
// template only needs to load a single, page-specific
// js that does all the instantiation.
export default class Page {
  #jqSrc = 'https://code.jquery.com/jquery-3.6.0.min.js';

  #defaultCss = [
    './reset.css',
    './common.css',
  ];

  #defaultJs = [];

  #promise;


  constructor({ css = [], js = [] } = {}) {
    const promise = this.#loadJquery()
      .then(() => this.#loadCss(this.#defaultCss))
      .then(() => this.#loadJs(this.#defaultJs))
      .then(() => Promise.all([this.#loadCss(css), this.#loadJs(js)]))
      .catch((err) => {
        throw err;
      });

    this.#promise = promise;
  }


  ready(callback) {
    this.#promise.then(callback);
  }


  #loadCss(hrefs = []) {
    return Promise.all(
      hrefs.map((href) => (new Css(href)).load())
    );
  }

  #loadJs(srcs = []) {
    return Promise.all(
      srcs.map((src) => (new Javascript(src, src.endsWith('.mjs'))).load())
    );
  }

  #loadJquery() {
    return new Promise((resolve, reject) => {
      function handleError(oError) {
        reject(new URIError(`The script ${oError.target.src} didn't load correctly.`));
      }

      function handleLoad() {
        console.debug('jQuery loaded!');
        resolve();
      }

      const newScript = document.createElement('script');
      newScript.onerror = handleError;
      newScript.onload = handleLoad;

      // in this order for handler to fire
      document.head.appendChild(newScript);
      newScript.src = this.#jqSrc;
    });
  }
}
