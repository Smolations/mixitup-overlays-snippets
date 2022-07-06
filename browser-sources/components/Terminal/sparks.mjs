export default function sparks({
  top,
  left,
  rotation = 0,
  speed = 120,
} = {}) {
  var two = new Two({
    type: Two.Types.canvas,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);
  window.two = two;

  two.renderer.domElement.style.background = 'transparent';
  two.renderer.ctx.globalCompositeOperation = 'screen';

  var amount = 60;
  const sparklines = [];

  for (var j = 0; j < amount; j++) {
    var x = 0, y = 0;
    var resolution = 4;
    var points = [];
    var vx = (Math.random() - 0.5) * speed;
    var vy = Math.random() * speed;

    for (var i = 0; i < resolution; i++) {
      points.push(new Two.Anchor(x, y));
      x += vx;
      y += vy;
      vy += speed / (resolution * 0.66);
    }

    if (j < 3) {
      console.log(points.map((point) => point.toObject()))
    }

    function getColor() {
      const colors = [
        'rgb(252, 236, 5)', // bumblebee
        'rgb(253, 165, 15)', // fire
        'rgb(255, 253, 208)', // cream
        'rgb(255, 255, 255)', // white
      ];

      return colors[Math.floor(Math.random() * colors.length)]
    }

    var sparkline = two.makeCurve(points, true);
    sparkline.noFill();
    sparkline.linewidth = 8 * Math.random();
    sparkline.cap = 'round';
    sparkline.stroke = getColor();
    two.add(sparkline);
    sparklines.push(sparkline);
  }

  // couold eventually use css variables to location panel edges
  const topPx = Number.isFinite(top) ? top : (two.height / 2);
  const leftPx = Number.isFinite(left) ? left : (two.width / 2);

  two.scene.translation.set(leftPx, topPx);
  two.scene.rotation = rotation;

  // two.bind('resize', function () {
  //   two.scene.translation.set(two.width / 2, two.height / 2);
  // });

  var mouseX = 1;
  //
  // window.addEventListener('mousemove', function (e) {
  //   mouseX = e.clientX / two.width;
  // }, false);

  two.bind('update', function (frameCount) {
    var frames = 30 + (1 - mouseX) * 240;
    var thickness = 0.15;

    for (var i = 0; i < two.scene.children.length; i++) {
      var child = two.scene.children[i];
      var pct = i / two.scene.children.length;
      var offset = frames * pct;
      var ending = ((offset + frameCount) / frames) % 1;
      child.ending = ending;
      child.beginning = Math.max(ending - thickness * pct + thickness, 0);
      child.opacity = 1 - child.ending;
    }

  });

  // const interval = setInterval(() => {
  //   // if (sparklines.length) two.remove(sparklines.shift());
  //   if (sparklines.length) two.scene.children.shift(sparklines.shift());
  //   if (!sparklines.length) clearInterval(interval);
  // }, 300)

  return two;
}
