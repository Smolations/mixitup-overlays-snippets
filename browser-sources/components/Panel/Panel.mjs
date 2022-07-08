export default class Panel {
  static assets = [
    './components/Panel/Panel.css',
  ];


  constructor({ height, width, animationAxis = 'y' }) {
    this.$el = $('<div>')
      .addClass('Panel')
      .css({
        height,
        width,
      });
  }

  addContent(content) {

    this.$el.append(content);
  }
}
