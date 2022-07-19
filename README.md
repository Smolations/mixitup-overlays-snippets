# SmolaGaming MixItUp Overlays

## Use http-server

In order to get around CORS issues for local development using javascript modules, a local server (`npm i -g http-server`) needs to be run for security reasons. From the root of the project:
```
// can pass optional --port=xxxx but defaults to 8080
$ http-server ./overlays-snippets

// access in browser, e.g.
http://localhost:8080/browser-sources/terminal-bare.html
```

events:
- stream start/stop
- resub
- sub gift
- mass sub gift
- bits cheered


todo:
- [x] create terminal event notifications for applicable events
  - [x] sub/mass-sub gift giving
  - [x] resub
  - [x] cheer
  - [x] hosting
  - [x] also trigger auto shoutout for raid event
- [x] determine total terminal event overlay duration from MIU (pass to page via query param)
- [~] fix monogram border
- [x] set up new follower/sub with terminal event
- [x] figure out grid system and abstraction for various files
- [x] need new Panel class that will hold a terminal, and anything else
  - [x] panel class will be responsible for defining its own animations and triggering sparks
  - [x] need to monitor actual event triggers to verify working functionality
  - [x] panel has option to not have logo, and probably needs a minimum width
- [~] need sounds
  - [x] typing
  - [x] panel movement
  - [x] cut up sounds into small files and organize
  - [x] create special class for sound effects? could help with randomization and timing, fade volume, etc
  - [\] sparks
  - [x] to accompany certain events (e.g. raid)
    - [x] cheer
      - your ass got sacked
    - [x] host
      - next day theyre on fire
    - [x] raid event
      - different colored hats
    - [x] resub?
      - i just wanna ride my motorcycle
    - [x] gift sub?
      - jamaican
    - [x] mass gift sub?
      - dont give him the stick
  - [ ] preload Stdin keypresses on a static property
  - [ ] delayed terminal output? (not too intrusive/annoying)
- [ ] if dev stream enabled, enable timer to notify chat of dev stream commands
- [x] fix monogram size in terminal events and maybe width
- [x] find css sparks for panels
- [x] experiment with MIU widget
  - can do basically the same thing as the browser source swapping, though url is permanant, so better used with _GLOBAL special identifiers_
  - successive calls reset widget (i.e. refresh page) so still have timing issue if timing needs  to change based on content
  - doesn't seem like stacking order can be controlled so must do with multiple endpoints
  - could use scene changes (i.e. at start/end of stream) to trigger hiding/showing
  - possible candidates:
    - persistent frame
    - latest follower/subscriber
      - [ ] any panels like this would need a delay so they don't show immediately on stream start
- [~] generic browser source just for marquee events?
  - [x] static content can be in MIU overlay widget
    - latest follower/sub
  - [ ] can pass grid, panel opts via MIU
- [x] fine tune new sub event using special event identifiers
- [x] shoutout clip
  - guru url: https://twitch.guru/soclip/soclip.php?channel=SmolaGaming&RID=off&dt=none
- [ ] figure out rando clip functionality when no clips present..
- [ ] get emotes working in terminal
- [ ] make the function variant of stdout(func) more friendly
- [ ] figure out quick displays of stream-specific commands (e.g. !wut)
  - should this be marquee'd?
- [ ] figure out chat box
- [ ] figure out lurker stuffs
- [ ] experiment with webhooks? or something?
- [ ] should this all be reactified?

### bugs
SmolaGaming: !gifttier1
SmolaGamingBot: The user could not be found
SmolaGaming: It's your lucky day, @$arg1username. You just got a free box. Don't you wanna know what's inside? !openbox1kb
