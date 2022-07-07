import Grid from './Grid/Grid.mjs';
import GridRow from './Grid/GridRow.mjs';
import GridCell from './Grid/GridCell.mjs';

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


  constructor({ grid, assets = [] } = {}) {
    const allAssets = [...assets];

    if (grid) {
      allAssets.push(
        ...Grid.assets,
        ...GridRow.assets,
        ...GridCell.assets,
      );
    }

    const css = allAssets.filter((asset) => /\.css$/.test(asset));
    const js = allAssets.filter((asset) => /\.m?js$/.test(asset));

    const promise = this.#loadJquery()
      .then(() => this.#loadCss(this.#defaultCss))
      .then(() => this.#loadJs(this.#defaultJs))
      .then(() => Promise.all([this.#loadCss(css), this.#loadJs(js)]))
      .then(() => {
        if (grid) {
          return this.addGrid(...grid);
        }
      })
      .catch((err) => {
        throw err;
      });

    this.#promise = promise;
  }


  ready(callback) {
    this.#promise.then((grid) => {
      $(document).ready(() => callback(grid));
    });
  }


  /**
   * allowing the Page to build the grid means there won't be an import chain
   * and grids can be nested.
   */
  addGrid(rows, cols) {
    const gridRows = [];

    for (let i = 0; i < rows; i++) {
      const gridCells = [];

      for (let j = 0; j < cols; j++) {
        gridCells.push(new GridCell());
      }

      gridRows.push(new GridRow(...gridCells))
    }

    this.grid = new Grid(...gridRows);
    this.grid.$el.appendTo(document.body);

    return this.grid;
  }


  // letting Page be the master delegator?
  addPanel() {}


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
