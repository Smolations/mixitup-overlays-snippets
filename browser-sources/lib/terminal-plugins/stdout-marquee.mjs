export default function StdOutMarquee({ stdoutArgs, numRenders, speed = 200 }) {
  return (stdout, resolve) => {
    const $output = stdout.$getTerminalLine(...stdoutArgs);
    const $separator = $('<code>   ...   </code>');
    const numCols = stdout.parent.columns;
    let renderCount = 1;
    let leftCount = numCols;

    for (let i = 0; i < numRenders; i++) {
      stdout.$el.append($output.clone());
      (i !== numRenders - 1) && stdout.$el.append($separator.clone());
    }

    stdout.$el
      .css('left', `${numCols}ch`)
      .addClass('Terminal--marquee');

    const numChars = stdout.$el.text().length;
    const interval = setInterval(() => {
      stdout.$el.css('left', `${--leftCount}ch`);

      if (leftCount < -numChars - 1) {
        if (renderCount++ < numRenders) {
          leftCount = numCols;
          stdout.$el.css('left', `${numCols}ch`);
        } else {
          clearInterval(interval);
          resolve();
        }
      }
    }, speed);
  };
};
