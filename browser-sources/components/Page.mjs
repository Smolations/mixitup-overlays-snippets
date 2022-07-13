import Component from '../lib/mixins/component.mjs';

import Grid from './Grid/Grid.mjs';

import Css from './Css.mjs';
import Javascript from './Javascript.mjs';

// this will import all of the default stuffs for a page.
// the idea will be that components will auto-load all
// the necessary libs/styles they need so that the html
// template only needs to load a single, page-specific
// js that does all the instantiation.
export default class Page extends Component() {
  #jqSrc = 'https://code.jquery.com/jquery-3.6.0.min.js';

  #defaultCss = [
    './reset.css',
    './common.css',
  ];

  #defaultJs = [];

  #promise;


  constructor({ grid, assets = [] } = {}) {
    super();

    const allAssets = [...assets];

    if (grid) {
      allAssets.push(
        ...Grid.assets,
      );
    }

    const css = allAssets.filter((asset) => /\.css$/.test(asset));
    const js = allAssets.filter((asset) => /\.m?js$/.test(asset));

    const promise = this.#loadJquery()
      .then(() => this.#loadCss(this.#defaultCss))
      .then(() => this.#loadJs(this.#defaultJs))
      .then(() => Promise.all([this.#loadCss(css), this.#loadJs(js)]))
      .then(() => {
        // only when jquery is loaded..maybe a better place for this?
        this.$el = $('<div>')
          .addClass('Page')
          .css({
            width: '100%',
            height: '100%',
            position: 'relative',
          });

        if (grid) {
          const gridComponent = new Grid(grid);
          this.addChild(gridComponent);
          return gridComponent;
        }
      })
      .catch((err) => {
        throw err;
      });

    this.#promise = promise;
  }


  ready(callback) {
    this.#promise.then((grid) => {
      $(document).ready(() => {
        // render the page/grid up front so that grid
        // cells are positioned/size for any incoming
        // content.
        this.render($('body'));

        // provide grid to page script
        callback(grid);
      });
    });
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
