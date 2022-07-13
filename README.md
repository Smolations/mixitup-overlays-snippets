# SmolaGaming MixItUp Overlays

## Use http-server

In order to get around CORS issues for local development using javascript modules, a local server (`npm i -g http-server`) needs to be run for security reasons. From the root of the project:
```
// can pass optional --port=xxxx but defaults to 8080
$ http-server ./overlays-snippets

// access in browser, e.g.
http://127.0.0.1:8080/browser-sources/terminal-bare.html
```

todo:
- [~] fix monogram border
- [x] set up new follower/sub with terminal event
- [x] figure out grid system and abstraction for various files
- [x] need new Panel class that will hold a terminal, and anything else
  - [x] panel class will be responsible for defining its own animations and triggering sparks
  - [x] need to monitor actual event triggers to verify working functionality
  - [ ] panel has option to not have logo, and probably needs a minimum width
- [~] need sounds
  - [x] typing
  - [x] panel movement
  - [x] cut up sounds into small files and organize
  - [x] create special class for sound effects? could help with randomization and timing, fade volume, etc
  - [ ] sparks
  - [ ] to accompany certain events (e.g. raid)
  - [ ] preload Stdin keypresses on a static property
- [x] fix monogram size in terminal events and maybe width
- [x] find css sparks for panels
- [x] experiment with MIU widget
  - can do basically the same thing as the browser source swapping
  - successive calls reset widget (i.e. refresh page) so still have timing issue
- [ ] generic browser source just for marquee events?
  - [ ] can pass grid, panel opts via MIU
- [ ] create terminal event notifications for applicable events
  - [ ] also trigger auto shoutout for raid event
- [ ] fine tune new sub event using special event identifiers
- [ ] figure out quick displays of stream-specific commands (e.g. !wut)
  - should this be marquee'd?
- [ ] figure out chat box
- [ ] experiment with webhooks? or something?
- [ ] should this all be reactified?

### bugs
SmolaGaming: !gifttier1
SmolaGamingBot: The user could not be found
SmolaGaming: It's your lucky day, @$arg1username. You just got a free box. Don't you wanna know what's inside? !openbox1kb
