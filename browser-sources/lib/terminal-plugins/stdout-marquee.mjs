export default function StdOutMarquee({ stdoutArgs, numRenders = 1, speed = 200 }) {
  return (stdout, resolve) => {
    const now = Date.now();
    const $output = stdout.$getTerminalLine(...stdoutArgs);
    const numCols = stdout.parent.columns;
    const colsBetweenRenders = Math.ceil(numCols / 2);
    let leftCount = numCols;

    for (let i = 0; i < numRenders; i++) {
      stdout.$el.append($output.clone().css('marginRight', `${colsBetweenRenders}ch`));
    }

    stdout.$el
      .addClass('Terminal--marquee')
      .css({
        position: 'relative',
        left: `${numCols + 1}ch`,
      });

    const numChars = ($output.text().length * numRenders) + (colsBetweenRenders * (numRenders - 1));
    const interval = setInterval(() => {
      stdout.$el.css('left', `${--leftCount}ch`);

      if (leftCount < -numChars - 1) {
        clearInterval(interval);
        console.debug('[StdOutMarquee plugin] marquee duration (%o renders): %o', numRenders, Date.now() - now);
        resolve();
      }
    }, speed);
  };
};
