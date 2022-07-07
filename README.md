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
  - need to monitor actual event triggers to verify working functionality
- [ ] create terminal event notifications for applicable events
  - also trigger auto shoutout for raid event
- [ ] fine tune new sub event using special event identifiers
- [ ] figure out quick displays of stream-specific commands (e.g. !wut)
  - should this be marquee'd?
- [x] fix monogram size in terminal events and maybe width
- [~] find sounds for terminal stuffs
  - [x] keypresses for terminal input
  - [x] panel movement
  - [ ] cut up sounds into small files and organize
  - [ ] create special class for sound effects? could help with randomization and timing, fade volume, etc
- [x] find css sparks for panels
  - [ ] find sounds for sparks
- [ ] figure out chat box
- [ ] figure out grid system and abstraction for various files
- [x] experiment with MIU widget
  - can do basically the same thing as the browser source swapping
  - successive calls reset widget (i.e. refresh page) so still have timing issue
- [ ] experiment with webhooks? or something?
- [ ] should this all be reactified?
