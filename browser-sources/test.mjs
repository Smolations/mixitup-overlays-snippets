import Page from './components/Page.mjs';
import Terminal from './components/Terminal/Terminal.mjs';


const page = new Page({ assets: [...Terminal.assets] });

page.ready(async () => {
  const terminal = new Terminal({
    rows: 3,
    columns: 40,
    // initialLine: false,
  });

  await terminal.open();

  // const stdin = terminal.stdin('stdin types, then immediate response');
  // stdin.render().then(() => { console.log('typed') });

  terminal.command(
    terminal.stdin('stdin types'),
    terminal.stdout('foobar %h', 'response'),
  );
  // const stdout = terminal.stdout('foobar %h', 'response');
  // stdout.render();



  // terminal.command(
    //   terminal.stdin('stdin types, then immediate response'),
    //   terminal.stdout('foobar response'),
    // )


  // terminal.session();
  // terminal.clear();    // a terminal instance implies one "session" so just allow clears

  // stdin never colored, always typed
  // terminal.session(
    // terminal.command(
    //   terminal.stdin('no output from this command, just new prompt'),
    // ),
    // terminal.command(
    //   terminal.stdin('stdin types, then immediate response'),
    //   terminal.stdout('foobar response'),
    // ),
    // terminal.command(
    //   terminal.stdin('typed input then a long-running process followed by more input'),
    //   terminal.stdout(async ($stdoutLine) => {
//         for (await some of loop) {
//           $stdoutLine.html('update on timeout/interval');
//         }
//
//         // how to emulate loading glyph? key to updating async stdout..
//         await someShit();
//         return 'maybe something from someShit()?';
      // }),

      // terminal.stdin('followup input'),
      // terminal.stdout('that be it'),
      // terminal.stdin(), // trailing blinking cursor
    // ),
  // );

  // .session() expects all commands so can trail with prompt
  // what if session has no args? probs wouldn't happen but....

  //stdin/out somehow just represent the elements so .command() can use them..

  // inside .command()
  // if Stdin
  //   await stdin.exec()
  // else if Stdout
  //   await stdout.exec()

  // terminal.stdin();
  // terminal.stdout();
  // await terminal.stdout();

  // commands always start with input

  // new Terminal() can create terminal without lines (and blinking cursor/prompt)


});
