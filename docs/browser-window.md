# BrowserWindow

> Create and control browser windows.

```javascript
// In the plugin.
const BrowserWindow = require('sketch-module-web-view')

let win = new BrowserWindow({ width: 800, height: 600 })
win.on('closed', () => {
  win = null
})

// Load a remote URL
win.loadURL('https://github.com')

// Or load a local HTML file
win.loadURL(require('./index.html'))
```

## Frameless window

To create a window without chrome, or a transparent window in arbitrary shape, you can use the [Frameless Window](frameless-window.md) API.

## Showing window gracefully

When loading a page in the window directly, users may see the page load incrementally, which is not a good experience for a native app. To make the window display without visual flash, there are two solutions for different situations.

### Using `ready-to-show` event

While loading the page, the `ready-to-show` event will be emitted when the renderer process has rendered the page for the first time if the window has not been shown yet. Showing the window after this event will have no visual flash:

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow({ show: false })
win.once('ready-to-show', () => {
  win.show()
})
```

This event is usually emitted after the `did-finish-load` event, but for pages with many remote resources, it may be emitted before the `did-finish-load` event.

### Setting `backgroundColor`

For a complex app, the `ready-to-show` event could be emitted too late, making the app feel slow. In this case, it is recommended to show the window immediately, and use a `backgroundColor` close to your app's background:

```javascript
const BrowserWindow = require('sketch-module-web-view')

let win = new BrowserWindow({ backgroundColor: '#2e2c29' })
win.loadURL('https://github.com')
```

Note that even for apps that use `ready-to-show` event, it is still recommended to set `backgroundColor` to make app feel more native.

## Parent and child windows

A modal window is a child window that disables parent window, to create a modal window, you have to set both `parent` and `modal` options:

```javascript
const BrowserWindow = require('sketch-module-web-view')
const sketch = require('sketch')

let child = new BrowserWindow({
  parent: sketch.getSelectedDocument(),
  modal: true,
  show: false,
})
child.loadURL('https://github.com')
child.once('ready-to-show', () => {
  child.show()
})
```

Modal windows will be displayed as sheets attached to the parent Document.

## Class: BrowserWindow

> Create and control browser windows.

`BrowserWindow` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter).

It creates a new `BrowserWindow` with native properties as set by the `options`.

### `new BrowserWindow([options])`

- `options` Object (optional)
  - `width` Integer (optional) - Window's width in pixels. Default is `800`.
  - `height` Integer (optional) - Window's height in pixels. Default is `600`.
  - `x` Integer (optional) (**required** if y is used) - Window's left offset from screen. Default is to center the window.
  - `y` Integer (optional) (**required** if x is used) - Window's top offset from screen. Default is to center the window.
  - `hidesOnDeactivate` Boolean (optional) - Whether the window is removed from the screen when Sketch becomes inactive. Default is `true`.
  - `remembersWindowFrame` Boolean (optional) - Whether to remember the position and the size of the window the next time. Defaults is `false`.
  - `useContentSize` Boolean (optional) - The `width` and `height` would be used as web page's size, which means the actual window's size will include window frame's size and be slightly larger. Default is `false`.
  - `center` Boolean (optional) - Show window in the center of the screen.
  - `minWidth` Integer (optional) - Window's minimum width. Default is `0`.
  - `minHeight` Integer (optional) - Window's minimum height. Default is `0`.
  - `maxWidth` Integer (optional) - Window's maximum width. Default is no limit.
  - `maxHeight` Integer (optional) - Window's maximum height. Default is no limit.
  - `resizable` Boolean (optional) - Whether window is resizable. Default is `true`.
  - `movable` Boolean (optional) - Whether window is movable. Default is `true`.
  - `minimizable` Boolean (optional) - Whether window is minimizable. Default is `true`.
  - `maximizable` Boolean (optional) - Whether window is maximizable. Default is `true`.
  - `closable` Boolean (optional) - Whether window is closable. Default is `true`.
    <!-- * `focusable` Boolean (optional) - Whether the window can be focused. Default is `true`. -->
  - `alwaysOnTop` Boolean (optional) - Whether the window should always stay on top of other windows. Default is `false`.
  - `fullscreen` Boolean (optional) - Whether the window should show in fullscreen. When explicitly set to `false` the fullscreen button will be hidden or disabled. Default is `false`.
  - `fullscreenable` Boolean (optional) - Whether the window can be put into fullscreen mode. Also whether the maximize/zoom button should toggle full screen mode or maximize window. Default is `true`.
  - `title` String (optional) - Default window title. Default is your plugin name.
  - `show` Boolean (optional) - Whether window should be shown when created. Default is `true`.
  - `frame` Boolean (optional) - Specify `false` to create a [Frameless Window](frameless-window.md). Default is `true`.
  - `parent` Document (optional) - Specify parent [Document](https://developer.sketchapp.com/reference/api/#document). Default is `null`.
  - `modal` Boolean (optional) - Whether this is a modal window. This only works when the window is a child window. Default is `false`.
  - `acceptsFirstMouse` Boolean (optional) - Whether the web view accepts a single mouse-down event that simultaneously activates the window. Default is `false`.
  - `disableAutoHideCursor` Boolean (optional) - Whether to hide cursor when typing. Default is `false`.
  - `backgroundColor` String (optional) - Window's background color as a hexadecimal value, like `#66CD00` or `#FFF` or `#80FFFFFF` (alpha is supported). Default is `NSColor.windowBackgroundColor()`.
  - `hasShadow` Boolean (optional) - Whether window should have a shadow. Default is `true`.
  - `opacity` Number (optional) - Set the initial opacity of the window, between 0.0 (fully transparent) and 1.0 (fully opaque).
  - `transparent` Boolean (optional) - Makes the window [transparent](frameless-window.md). Default is `false`.
  - `titleBarStyle` String (optional) - The style of window title bar. Default is `default`. Possible values are:
    - `default` - Results in the standard gray opaque Mac title bar.
    - `hidden` - Results in a hidden title bar and a full size content window, yet the title bar still has the standard window controls ("traffic lights") in the top left.
    - `hiddenInset` - Results in a hidden title bar with an alternative look where the traffic light buttons are slightly more inset from the window edge. <!-- * `customButtonsOnHover` Boolean (optional) - Draw custom close, minimize, and full screen buttons on macOS frameless windows. These buttons will not display unless hovered over in the top left of the window. These custom buttons prevent issues with mouse events that occur with the standard window toolbar buttons. **Note:** This option is currently experimental. -->
  - `vibrancy` String (optional) - Add a type of vibrancy effect to the window, only on macOS. Can be `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`, `sidebar`, `medium-light` or `ultra-dark`. Please note that using `frame: false` in combination with a vibrancy value requires that you use a non-default `titleBarStyle` as well.
  - `webPreferences` Object (optional) - Settings of web page's features. - `devTools` Boolean (optional) - Whether to enable DevTools. If it is set to `false`, can not use `BrowserWindow.webContents.openDevTools()` to open DevTools. Default is `true`. - `javascript` Boolean (optional) - Enables JavaScript support. Default is `true`. - `plugins` Boolean (optional) - Whether plugins should be enabled. Default is `false`. - `minimumFontSize` Integer (optional) - Defaults to `0`. - `zoomFactor` Number (optional) - The default zoom factor of the page, `3.0` represents `300%`. Default is `1.0`.
    <!--
  - `nodeIntegration` Boolean (optional) - Whether node integration is enabled. Default is `true`.
  - `nodeIntegrationInWorker` Boolean (optional) - Whether node integration is enabled in web workers. Default is `false`. More about this can be found in [Multithreading](../tutorial/multithreading.md).
  - `preload` String (optional) - Specifies a script that will be loaded before other scripts run in the page. This script will always have access to node APIs no matter whether node integration is turned on or off. The value should be the absolute file path to the script. When node integration is turned off, the preload script can reintroduce Node global symbols back to the global scope. See example [here](process.md#event-loaded).
  - `sandbox` Boolean (optional) - If set, this will sandbox the renderer associated with the window, making it compatible with the Chromium OS-level sandbox and disabling the Node.js engine. This is not the same as the `nodeIntegration` option and the APIs available to the preload script are more limited. Read more about the option [here](sandbox-option.md). **Note:** This option is currently experimental and may change or be removed in future Electron releases.
  - `session` [Session](session.md#class-session) (optional) - Sets the session used by the page. Instead of passing the Session object directly, you can also choose to use the `partition` option instead, which accepts a partition string. When both `session` and `partition` are provided, `session` will be preferred. Default is the default session.
  - `partition` String (optional) - Sets the session used by the page according to the session's partition string. If `partition` starts with `persist:`, the page will use a persistent session available to all pages in the app with the same `partition`. If there is no `persist:` prefix, the page will use an in-memory session. By assigning the same `partition`, multiple pages can share the same session. Default is the default session.
  - `affinity` String (optional) - When specified, web pages with the same `affinity` will run in the same renderer process. Note that due to reusing the renderer process, certain `webPreferences` options will also be shared between the web pages even when you specified different values for them, including but not limited to `preload`, `sandbox` and `nodeIntegration`. So it is suggested to use exact same `webPreferences` for web pages with the same `affinity`.
  - `webSecurity` Boolean (optional) - When `false`, it will disable the same-origin policy (usually using testing websites by people), and set `allowRunningInsecureContent` to `true` if this options has not been set by user. Default is `true`.
  - `allowRunningInsecureContent` Boolean (optional) - Allow an https page to run JavaScript, CSS or plugins from http URLs. Default is `false`.
  - `images` Boolean (optional) - Enables image support. Default is `true`.
  - `textAreasAreResizable` Boolean (optional) - Make TextArea elements resizable. Default is `true`.
  - `webgl` Boolean (optional) - Enables WebGL support. Default is `true`.
  - `webaudio` Boolean (optional) - Enables WebAudio support. Default is `true`.
  - `experimentalFeatures` Boolean (optional) - Enables Chromium's experimental features. Default is `false`.
  - `experimentalCanvasFeatures` Boolean (optional) - Enables Chromium's experimental canvas features. Default is `false`.
  - `scrollBounce` Boolean (optional) - Enables scroll bounce (rubber banding) effect on macOS. Default is `false`.
  - `blinkFeatures` String (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to enable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5][blink-feature-string] file.
  - `disableBlinkFeatures` String (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to disable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5][blink-feature-string] file.
  - `defaultFontFamily` Object (optional) - Sets the default font for the font-family.
    - `standard` String (optional) - Defaults to `Times New Roman`.
    - `serif` String (optional) - Defaults to `Times New Roman`.
    - `sansSerif` String (optional) - Defaults to `Arial`.
    - `monospace` String (optional) - Defaults to `Courier New`.
    - `cursive` String (optional) - Defaults to `Script`.
    - `fantasy` String (optional) - Defaults to `Impact`.
  - `defaultFontSize` Integer (optional) - Defaults to `16`.
  - `defaultMonospaceFontSize` Integer (optional) - Defaults to `13`.
  - `defaultEncoding` String (optional) - Defaults to `ISO-8859-1`.
  - `backgroundThrottling` Boolean (optional) - Whether to throttle animations and timers when the page becomes background. This also affects the [Page Visibility API](#page-visibility). Defaults to `true`.
  - `offscreen` Boolean (optional) - Whether to enable offscreen rendering for the browser window. Defaults to `false`. See the [offscreen rendering tutorial](../tutorial/offscreen-rendering.md) for more details.
  - `contextIsolation` Boolean (optional) - Whether to run Electron APIs and the specified `preload` script in a separate JavaScript context. Defaults to `false`. The context that the `preload` script runs in will still have full access to the `document` and `window` globals but it will use its own set of JavaScript builtins (`Array`, `Object`, `JSON`, etc.) and will be isolated from any changes made to the global environment by the loaded page. The Electron API will only be available in the `preload` script and not the loaded page. This option should be used when loading potentially untrusted remote content to ensure the loaded content cannot tamper with the `preload` script and any Electron APIs being used. This option uses the same technique used by [Chrome Content Scripts][chrome-content-scripts]. You can access this context in the dev tools by selecting the 'Electron Isolated Context' entry in the combo box at the top of the Console tab. **Note:** This option is currently experimental and may change or be removed in future Electron releases.
  - `nativeWindowOpen` Boolean (optional) - Whether to use native `window.open()`. Defaults to `false`. **Note:** This option is currently experimental.
  - `webviewTag` Boolean (optional) - Whether to enable the [`<webview>` tag](webview-tag.md). Defaults to the value of the `nodeIntegration` option. **Note:** The `preload` script configured for the `<webview>` will have node integration enabled when it is executed so you should ensure remote/untrusted content is not able to create a `<webview>` tag with a possibly malicious `preload` script. You can use the `will-attach-webview` event on [webContents](web-contents.md) to strip away the `preload` script and to validate or alter the `<webview>`'s initial settings.
  - `additionalArguments` String[](optional) - A list of strings that will be appended to `process.argv` in the renderer process of this app. Useful for passing small bits of data down to renderer process preload scripts.
  - `safeDialogs` Boolean (optional) - Whether to enable browser style consecutive dialog protection. Default is `false`.
  - `safeDialogsMessage` String (optional) - The message to display when consecutive dialog protection is triggered. If not defined the default message would be used, note that currently the default message is in English and not localized. -->

When setting minimum or maximum window size with `minWidth`/`maxWidth`/ `minHeight`/`maxHeight`, it only constrains the users. It won't prevent you from passing a size that does not follow size constraints to `setBounds`/`setSize` or to the constructor of `BrowserWindow`.

### Instance Events

Objects created with `new BrowserWindow` emit the following events:

#### Event: 'page-title-updated'

Returns:

- `event` Event
- `title` String

Emitted when the document changed its title, calling `event.preventDefault()` will prevent the native window's title from changing.

#### Event: 'close'

Returns:

- `event` Event

Emitted when the window is going to be closed. It's emitted before the `beforeunload` and `unload` event of the DOM. Calling `event.preventDefault()` will cancel the close.

<!-- Usually you would want to use the `beforeunload` handler to decide whether the
window should be closed, which will also be called when the window is
reloaded. For example:

```javascript
window.onbeforeunload = (e) => {
  console.log('I do not want to be closed')

  // Unlike usual browsers that a message box will be prompted to users, returning
  // a non-void value will silently cancel the close.
  // It is recommended to use the dialog API to let the user confirm closing the
  // application.
  e.returnValue = false // equivalent to `return false` but not recommended
}
```
_**Note**: There is a subtle difference between the behaviors of `window.onbeforeunload = handler` and `window.addEventListener('beforeunload', handler)`. It is recommended to always set the `event.returnValue` explicitly, instead of just returning a value, as the former works more consistently within Electron._ -->

#### Event: 'closed'

Emitted when the window is closed. After you have received this event you should remove the reference to the window and avoid using it any more.

#### Event: 'blur'

Emitted when the window loses focus.

#### Event: 'focus'

Emitted when the window gains focus.

<!-- #### Event: 'show'

Emitted when the window is shown.

#### Event: 'hide'

Emitted when the window is hidden. -->

#### Event: 'ready-to-show'

Emitted when the web page has been rendered (while not being shown) and window can be displayed without a visual flash.

<!-- #### Event: 'maximize'

Emitted when window is maximized.

#### Event: 'unmaximize'

Emitted when the window exits from a maximized state.  -->

#### Event: 'minimize'

Emitted when the window is minimized.

#### Event: 'restore'

Emitted when the window is restored from a minimized state.

#### Event: 'resize'

Emitted when the window is being resized.

#### Event: 'move'

Emitted when the window is being moved to a new position.

**Note**: This event is just an alias of `moved`.

#### Event: 'moved' _macOS_

Emitted once when the window is moved to a new position.

#### Event: 'enter-full-screen'

Emitted when the window enters a full-screen state.

#### Event: 'leave-full-screen'

Emitted when the window leaves a full-screen state.

<!-- #### Event: 'enter-html-full-screen'

Emitted when the window enters a full-screen state triggered by HTML API.

#### Event: 'leave-html-full-screen'

Emitted when the window leaves a full-screen state triggered by HTML API.

#### Event: 'scroll-touch-begin' _macOS_

Emitted when scroll wheel event phase has begun.

#### Event: 'scroll-touch-end' _macOS_

Emitted when scroll wheel event phase has ended.

#### Event: 'scroll-touch-edge' _macOS_

Emitted when scroll wheel event phase filed upon reaching the edge of element.

#### Event: 'swipe' _macOS_

Returns:

* `event` Event
* `direction` String

Emitted on 3-finger swipe. Possible directions are `up`, `right`, `down`, `left`.

#### Event: 'sheet-begin' _macOS_

Emitted when the window opens a sheet.

#### Event: 'sheet-end' _macOS_

Emitted when the window has closed a sheet. -->

### Static Methods

The `BrowserWindow` class has the following static methods:

<!-- #### `BrowserWindow.getAllWindows()`

Returns `BrowserWindow[]` - An array of all opened browser windows.

#### `BrowserWindow.getFocusedWindow()`

Returns `BrowserWindow | null` - The window that is focused in this application, otherwise returns `null`.

#### `BrowserWindow.fromWebContents(webContents)`

* `webContents` [WebContents](web-contents.md)

Returns `BrowserWindow` - The window that owns the given `webContents`.

#### `BrowserWindow.fromBrowserView(browserView)`

* `browserView` [BrowserView](browser-view.md)

Returns `BrowserWindow | null` - The window that owns the given `browserView`. If the given view is not attached to any window, returns `null`. -->

#### `BrowserWindow.fromId(id)`

- `id` Integer

Returns `BrowserWindow` - The window with the given `id`.

<!-- #### `BrowserWindow.addExtension(path)`

* `path` String

Adds Chrome extension located at `path`, and returns extension's name.

The method will also not return if the extension's manifest is missing or incomplete.

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `BrowserWindow.removeExtension(name)`

* `name` String

Remove a Chrome extension by name.

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `BrowserWindow.getExtensions()`

Returns `Object` - The keys are the extension names and each value is
an Object containing `name` and `version` properties.

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `BrowserWindow.addDevToolsExtension(path)`

* `path` String

Adds DevTools extension located at `path`, and returns extension's name.

The extension will be remembered so you only need to call this API once, this
API is not for programming use. If you try to add an extension that has already
been loaded, this method will not return and instead log a warning to the
console.

The method will also not return if the extension's manifest is missing or incomplete.

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `BrowserWindow.removeDevToolsExtension(name)`

* `name` String

Remove a DevTools extension by name.

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `BrowserWindow.getDevToolsExtensions()`

Returns `Object` - The keys are the extension names and each value is
an Object containing `name` and `version` properties.

To check if a DevTools extension is installed you can run the following:

```javascript
const {BrowserWindow} = require('electron')

let installed = BrowserWindow.getDevToolsExtensions().hasOwnProperty('devtron')
console.log(installed)
```

**Note:** This API cannot be called before the `ready` event of the `app` module
is emitted. -->

### Instance Properties

Objects created with `new BrowserWindow` have the following properties:

```javascript
const BrowserWindow = require('sketch-module-web-view')
// In this example `win` is our instance
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
```

#### `win.webContents`

A `WebContents` object this window owns. All web page related events and operations will be done via it.

See the [`webContents` documentation](web-contents.md) for its methods and events.

#### `win.id`

A `Integer` representing the unique ID of the window.

### Instance Methods

Objects created with `new BrowserWindow` have the following instance methods:

#### `win.destroy()`

Force closing the window, the `unload` and `beforeunload` event won't be emitted for the web page, and `close` event will also not be emitted for this window, but it guarantees the `closed` event will be emitted.

#### `win.close()`

Try to close the window. This has the same effect as a user manually clicking the close button of the window. The web page may cancel the close though. See the [close event](#event-close).

#### `win.focus()`

Focuses on the window.

#### `win.blur()`

Removes focus from the window.

#### `win.isFocused()`

Returns `Boolean` - Whether the window is focused.

#### `win.isDestroyed()`

Returns `Boolean` - Whether the window is destroyed.

#### `win.show()`

Shows and gives focus to the window.

#### `win.showInactive()`

Shows the window but doesn't focus on it.

#### `win.hide()`

Hides the window.

#### `win.isVisible()`

Returns `Boolean` - Whether the window is visible to the user.

#### `win.isModal()`

Returns `Boolean` - Whether current window is a modal window.

#### `win.maximize()`

Maximizes the window. This will also show (but not focus) the window if it isn't being displayed already.

#### `win.unmaximize()`

Unmaximizes the window.

#### `win.isMaximized()`

Returns `Boolean` - Whether the window is maximized.

#### `win.minimize()`

Minimizes the window. On some platforms the minimized window will be shown in the Dock.

#### `win.restore()`

Restores the window from minimized state to its previous state.

#### `win.isMinimized()`

Returns `Boolean` - Whether the window is minimized.

#### `win.setFullScreen(flag)`

- `flag` Boolean

Sets whether the window should be in fullscreen mode.

#### `win.isFullScreen()`

Returns `Boolean` - Whether the window is in fullscreen mode.

#### `win.setAspectRatio(aspectRatio[, extraSize])`

- `aspectRatio` Float - The aspect ratio to maintain for some portion of the content view.
- `extraSize` [Size](structures/size.md) - The extra size not to be included while maintaining the aspect ratio.

This will make a window maintain an aspect ratio. The extra size allows a developer to have space, specified in pixels, not included within the aspect ratio calculations. This API already takes into account the difference between a window's size and its content size.

Consider a normal window with an HD video player and associated controls. Perhaps there are 15 pixels of controls on the left edge, 25 pixels of controls on the right edge and 50 pixels of controls below the player. In order to maintain a 16:9 aspect ratio (standard aspect ratio for HD @1920x1080) within the player itself we would call this function with arguments of 16/9 and [ 40, 50 ]. The second argument doesn't care where the extra width and height are within the content view--only that they exist. Just sum any extra width and height areas you have within the overall content view.

#### `win.setBounds(bounds[, animate])`

- `bounds` [Rectangle](rectangle.md)
- `animate` Boolean (optional)

Resizes and moves the window to the supplied bounds. Any properties that are not supplied will default to their current values.

```js
// set all bounds properties
win.setBounds({ x: 440, y: 225, width: 800, height: 600 })
// set a single bounds property
win.setBounds({ width: 200 })
// { x: 440, y: 225, width: 200, height: 600 }
console.log(win.getBounds())
```

#### `win.getBounds()`

Returns [`Rectangle`](rectangle.md)

#### `win.setContentBounds(bounds[, animate])`

- `bounds` [Rectangle](rectangle.md)
- `animate` Boolean (optional)

Resizes and moves the window's client area (e.g. the web page) to the supplied bounds.

#### `win.getContentBounds()`

Returns [`Rectangle`](rectangle.md)

#### `win.setEnabled(enable)`

- `enable` Boolean

Disable or enable the window.

#### `win.setSize(width, height[, animate])`

- `width` Integer
- `height` Integer
- `animate` Boolean (optional)

Resizes the window to `width` and `height`.

#### `win.getSize()`

Returns `Integer[]` - Contains the window's width and height.

#### `win.setContentSize(width, height[, animate])`

- `width` Integer
- `height` Integer
- `animate` Boolean (optional)

Resizes the window's client area (e.g. the web page) to `width` and `height`.

#### `win.getContentSize()`

Returns `Integer[]` - Contains the window's client area's width and height.

#### `win.setMinimumSize(width, height)`

- `width` Integer
- `height` Integer

Sets the minimum size of window to `width` and `height`.

#### `win.getMinimumSize()`

Returns `Integer[]` - Contains the window's minimum width and height.

#### `win.setMaximumSize(width, height)`

- `width` Integer
- `height` Integer

Sets the maximum size of window to `width` and `height`.

#### `win.getMaximumSize()`

Returns `Integer[]` - Contains the window's maximum width and height.

#### `win.setResizable(resizable)`

- `resizable` Boolean

Sets whether the window can be manually resized by user.

#### `win.isResizable()`

Returns `Boolean` - Whether the window can be manually resized by user.

#### `win.setMovable(movable)`

- `movable` Boolean

Sets whether the window can be moved by user.

#### `win.isMovable()`

Returns `Boolean` - Whether the window can be moved by user.

#### `win.setMinimizable(minimizable)`

- `minimizable` Boolean

Sets whether the window can be manually minimized by user.

#### `win.isMinimizable()`

Returns `Boolean` - Whether the window can be manually minimized by user.

#### `win.setMaximizable(maximizable)`

- `maximizable` Boolean

Sets whether the window can be manually maximized by user.

#### `win.isMaximizable()`

Returns `Boolean` - Whether the window can be manually maximized by user.

#### `win.setFullScreenable(fullscreenable)`

- `fullscreenable` Boolean

Sets whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

#### `win.isFullScreenable()`

Returns `Boolean` - Whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

#### `win.setClosable(closable)`

- `closable` Boolean

Sets whether the window can be manually closed by user.

#### `win.isClosable()`

Returns `Boolean` - Whether the window can be manually closed by user.

#### `win.setAlwaysOnTop(flag[, level][, relativeLevel])`

- `flag` Boolean
- `level` String (optional) _macOS_ - Values include `normal`, `floating`, `torn-off-menu`, `modal-panel`, `main-menu`, `status`, `pop-up-menu`, `screen-saver`, and ~~`dock`~~ (Deprecated). The default is `floating`. See the [macOS docs][https://developer.apple.com/documentation/appkit/nswindow/level] for more details.
- `relativeLevel` Integer (optional) - The number of layers higher to set this window relative to the given `level`. The default is `0`. Note that Apple discourages setting levels higher than 1 above `screen-saver`.

Sets whether the window should show always on top of other windows. After setting this, the window is still a normal window, not a toolbox window which can not be focused on.

#### `win.isAlwaysOnTop()`

Returns `Boolean` - Whether the window is always on top of other windows.

#### `win.moveTop()`

Moves window to top(z-order) regardless of focus

#### `win.center()`

Moves window to the center of the screen.

#### `win.setPosition(x, y[, animate])`

- `x` Integer
- `y` Integer
- `animate` Boolean (optional)

Moves window to `x` and `y`.

#### `win.getPosition()`

Returns `Integer[]` - Contains the window's current position.

#### `win.setTitle(title)`

- `title` String

Changes the title of native window to `title`.

#### `win.getTitle()`

Returns `String` - The title of the native window.

**Note:** The title of web page can be different from the title of the native window.

<!-- #### `win.setSheetOffset(offsetY[, offsetX])`

* `offsetY` Float
* `offsetX` Float (optional)

Changes the attachment point for sheets on macOS. By default, sheets are attached just below the window frame, but you may want to display them beneath a HTML-rendered toolbar. For example:

```javascript
const BrowserWindow = require('sketch-module-web-view')
let win = new BrowserWindow()

let toolbarRect = document.getElementById('toolbar').getBoundingClientRect()
win.setSheetOffset(toolbarRect.height)
``` -->

#### `win.flashFrame(flag)`

- `flag` Boolean

Starts or stops flashing the window to attract user's attention.

#### `win.getNativeWindowHandle()`

Returns `Buffer` - The platform-specific handle of the window.

The native type of the handle is an `NSPanel`.

#### `win.loadURL(url)`

- `url` String

Same as `webContents.loadURL(url)`.

The `url` can be a remote address (e.g. `http://`) or a path to a local HTML file using the `file://` protocol.

To ensure that file URLs are properly formatted, it is recommended to use `require`.

#### `win.reload()`

Same as `webContents.reload`.

#### `win.setHasShadow(hasShadow)`

- `hasShadow` Boolean

Sets whether the window should have a shadow.

#### `win.hasShadow()`

Returns `Boolean` - Whether the window has a shadow.

#### `win.setOpacity(opacity)`

- `opacity` Number - between 0.0 (fully transparent) and 1.0 (fully opaque)

Sets the opacity of the window.

#### `win.getOpacity()`

Returns `Number` - between 0.0 (fully transparent) and 1.0 (fully opaque)

<!-- #### `win.showDefinitionForSelection()` _macOS_

Same as `webContents.showDefinitionForSelection()`. -->

#### `win.setVisibleOnAllWorkspaces(visible)`

- `visible` Boolean

Sets whether the window should be visible on all workspaces.

#### `win.isVisibleOnAllWorkspaces()`

Returns `Boolean` - Whether the window is visible on all workspaces.

#### `win.setIgnoreMouseEvents(ignore)`

- `ignore` Boolean

Makes the window ignore all mouse events.

All mouse events happened in this window will be passed to the window below this window, but if this window has focus, it will still receive keyboard events.

#### `win.setContentProtection(enable)`

- `enable` Boolean

Prevents the window contents from being captured by other apps.

It sets the NSWindow's sharingType to NSWindowSharingNone.

#### `win.setAutoHideCursor(autoHide)`

- `autoHide` Boolean

Controls whether to hide cursor when typing.

#### `win.setVibrancy(type)` _macOS_

- `type` String - Can be `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`, `sidebar`, `medium-light` or `ultra-dark`. See the [macOS documentation][vibrancy-docs] for more details.

Adds a vibrancy effect to the browser window. Passing `null` or an empty string will remove the vibrancy effect on the window.

[blink-feature-string]: https://cs.chromium.org/chromium/src/third_party/WebKit/Source/platform/runtime_enabled_features.json5?l=70
[page-visibility-api]: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
[quick-look]: https://en.wikipedia.org/wiki/Quick_Look
[vibrancy-docs]: https://developer.apple.com/documentation/appkit/nsvisualeffectview?preferredLanguage=objc
[window-levels]: https://developer.apple.com/reference/appkit/nswindow/1664726-window_levels
[chrome-content-scripts]: https://developer.chrome.com/extensions/content_scripts#execution-environment
