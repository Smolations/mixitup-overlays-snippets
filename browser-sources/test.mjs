import Css from './components/Css.mjs';
import Javascript from './components/Javascript.mjs';
import Page from './components/Page.mjs';


const page = new Page();

page.ready(() => {
  console.log('page ready!');


});

// $(document).ready(() => {
//   const css = new Css('./reset.css');
//   css.load();
//
//   const js = new Javascript('https://cdn.jsdelivr.net/npm/sprintf-js@1.1.2/dist/sprintf.min.js', false);
//   js.load();
//
//   // window.css = css;
// });
