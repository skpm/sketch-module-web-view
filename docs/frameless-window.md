# Frameless Window

> Open a window without toolbars, borders, or other graphical "chrome".

A frameless window is a window that has no [chrome](https://developer.mozilla.org/en-US/docs/Glossary/Chrome), the parts of the window, like toolbars, that are not a part of the web page. These are options on the [`BrowserWindow`](browser-window.md) class.

## Create a frameless window

To create a frameless window, you need to set `frame` to `false` in [BrowserWindow](browser-window.md)'s `options`:

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ width: 800, height: 600, frame: false })
win.show()
```

### Alternatives

Instead of setting `frame` to `false` which disables both the titlebar and window controls, you may want to have the title bar hidden and your content extend to the full window size, yet still preserve the window controls ("traffic lights") for standard window actions. You can do so by specifying the `titleBarStyle` option:

#### `hidden`

Results in a hidden title bar and a full size content window, yet the title bar still has the standard window controls (“traffic lights”) in the top left.

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ titleBarStyle: 'hidden' })
win.show()
```

#### `hiddenInset`

Results in a hidden title bar with an alternative look where the traffic light buttons are slightly more inset from the window edge.

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ titleBarStyle: 'hiddenInset' })
win.show()
```

<!-- #### `customButtonsOnHover`

Uses custom drawn close, miniaturize, and fullscreen buttons that display when hovering in the top left of the window. These custom buttons prevent issues with mouse events that occur with the standard window toolbar buttons. This option is only applicable for frameless windows.

```javascript
const { BrowserWindow } = require('electron')
let win = new BrowserWindow({
  titleBarStyle: 'customButtonsOnHover',
  frame: false,
})
win.show()
``` -->

## Transparent window

By setting the `transparent` option to `true`, you can also make the frameless window transparent:

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ transparent: true, frame: false })
win.show()
```

### Notes

- Any background color set on <html> or <body> will leak to the whole window, even if they are sized smaller than the window.
- To create a "square" corners effect, size a <div> 5px or so shorter than the actual transparent window height and give it a background color.

### Limitations

- You can not click through the transparent area. We are going to introduce an API to set window shape to solve this, see [our issue](https://github.com/electron/electron/issues/1335) for details.
- Transparent windows are not resizable. Setting `resizable` to `true` may make a transparent window stop working on some platforms.
- The `blur` filter only applies to the web page, so there is no way to apply blur effect to the content below the window (i.e. other applications open on the user's system).
- The native window shadow will not be shown on a transparent window.

## Click-through window

To create a click-through window, i.e. making the window ignore all mouse events, you can call the [win.setIgnoreMouseEvents(ignore)][ignore-mouse-events] API:

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow()
win.setIgnoreMouseEvents(true)
```

## Draggable region

By default, the frameless window is non-draggable. Apps need to specify the attribute `data-app-region="drag"` to tell which regions are draggable (like the OS's standard titlebar), and apps can also use `data-app-region="no-drag"` to exclude the non-draggable area from the draggable region.

To make the whole window draggable, you can add `data-app-region="drag"` as `body`'s attribute:

```html
<body data-app-region="drag">
</body>
```

## Text selection

In a frameless window the dragging behavior may conflict with selecting text. For example, when you drag the titlebar you may accidentally select the text on the titlebar. To prevent this, you need to disable text selection within a draggable area like this:

```css
.titlebar {
  -webkit-user-select: none;
  user-select: none;
}
```
