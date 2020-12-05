declare module 'sketch-module-web-view' {
  import { EventEmitter } from 'events'

  export interface WebPreferences {
    /**
     * Whether to enable DevTools. If it is set to `false`, can not use
     * `BrowserWindow.webContents.openDevTools()` to open DevTools.
     * Default is `true`. */
    devTools: boolean

    /** Enables JavaScript support. Default is `true`. */
    javascript?: boolean

    /** Whether plugins should be enabled. Default is `false`. */
    plugins?: boolean

    /** Defaults to `0` */
    minimumFontSize?: number

    /**
     * The default zoom factor of the page, `3.0` represents `300%`.
     * Default is `1.0`.
     */
    zoomFactor?: number
  }

  export interface BrowserWindowOptions {
    /** Unique identifier of the window */
    identifier?: string

    /** Window's width in pixels. Default is `800`. */
    width?: number

    /** Window's height in pixels. Default is `600`. */
    height?: number

    /**
     * (required if y is used) - Window's left offset from screen.
     * Default is to center the window.
     */
    x?: number

    /**
     * (required if x is used) - Window's top offset from screen.
     * Default is to center the window.
     */
    y?: number

    /**
     * Whether the window is removed from the screen when Sketch becomes
     * inactive. Default is `true`.
     */
    hidesOnDeactivate?: boolean

    /**
     * Whether to remember the position and the size of the window the next
     * time. Defaults is `false`.
     */
    remembersWindowFrame?: boolean

    /**
     * The `width` and `height` would be used as web page's size, which means
     * the actual window's size will include window frame's size and be slightly
     * larger. Default is `false`.
     */
    useContentSize?: boolean

    /** Show window in the center of the screen. */
    center?: boolean

    /** Window's minimum width. Default is `0`. */
    minWidth?: number

    /** Window's minimum height. Default is `0`. */
    minHeight?: number

    /** Window's maximum width. Default is no limit. */
    maxWidth?: number

    /** Window's maximum height. Default is no limit.  */
    maxHeight?: number

    /** Whether window is resizable. Default is `true`. */
    resizable?: boolean

    /** Whether window is movable. Default is `true`. */
    movable?: boolean

    /** Whether window is minimizable. Default is `true`. */
    minimizable?: boolean

    /** Whether window is maximizable. Default is `true`. */
    maximizable?: boolean

    /** Whether window is closable. Default is `true`. */
    closable?: boolean

    /**
     * Whether the window should always stay on top of other windows.
     * Default is `false`.
     */
    alwaysOnTop?: boolean

    /**
     * Whether the window should show in fullscreen. When explicitly set to
     * `false` the fullscreen button will be hidden or disabled.
     * Default is `false`.
     */
    fullscreen?: boolean

    /**
     * Whether the window can be put into fullscreen mode. Also whether the
     * maximize/zoom button should toggle full screen mode or maximize window.
     * Default is `true`.
     */
    fullscreenable?: boolean

    /** Default window title. Default is your plugin name. */
    title?: string

    /** Whether window should be shown when created. Default is `true`. */
    show?: boolean

    /** Specify `false` to create a Frameless Window. Default is `true`. */
    frame?: boolean

    /** Specify parent Document. Default is `null`. */
    parent?: any

    /**
     * Whether this is a modal window. This only works when the window is a
     * child window. Default is `false`.
     */
    modal?: boolean

    /**
     * Whether the web view accepts a single mouse-down event that
     * simultaneously activates the window. Default is `false`.
     */
    acceptsFirstMouse?: boolean

    /** Whether to hide cursor when typing. Default is `false`. */
    disableAutoHideCursor?: boolean

    /**
     * Window's background color as a hexadecimal value, like `#66CD00` or
     * `#FFF` or `#80FFFFFF` (alpha is supported). Default is
     * `NSColor.windowBackgroundColor()`.
     */
    backgroundColor?: string

    /** Whether window should have a shadow. Default is `true`. */
    hasShadow?: boolean

    /**
     * Set the initial opacity of the window, between `0.0` (fully transparent)
     * and `1.0` (fully opaque).
     */
    opacity?: number

    /** Makes the window transparent. Default is `false`. */
    transparent?: boolean

    /**
     * The style of window title bar. Default is `default`. Possible values are:
     *  - `default` - Results in the standard gray opaque Mac title bar.
     *  - `hidden` - Results in a hidden title bar and a full size content
     *     window, yet the title bar still has the standard window controls
     *     ("traffic lights") in the top left.
     *  - `hiddenInset` - Results in a hidden title bar with an alternative look
     *     where the traffic light buttons are slightly more inset from the
     *     window edge.
     */
    titleBarStyle?: 'default' | 'hidden' | 'hiddenInset'

    /**
     * Add a type of vibrancy effect to the window, only on macOS.
     * Please note that using `frame: false` in combination with a `vibrancy`
     * value requires that you use a non-default `titleBarStyle` as well.
     */
    vibrancy?:
      | 'appearance-based'
      | 'light'
      | 'dark'
      | 'titlebar'
      | 'selection'
      | 'menu'
      | 'popover'
      | 'sidebar'
      | 'medium-light'
      | 'ultra-dark'

    /** Settings of web page's features. */
    webPreferences?: WebPreferences
  }

  export interface Rectangle {
    /** The height of the rectangle (must be an integer). */
    height: number

    /** The width of the rectangle (must be an integer). */
    width: number

    /** The x coordinate of the origin of the rectangle (must be an integer). */
    x: number

    /** The y coordinate of the origin of the rectangle (must be an integer). */
    y: number
  }

  export interface WebContents extends NodeJS.EventEmitter {
    /**
     * Load web page of given url
     * @param url can be a remote address (e.g. `http://`) or a path to a local
     *  HTML file using the `file://` protocol.
     */
    loadURL(url: string): Promise<void>

    /** The URL of the current web page. */
    getURL(): string

    /** The title of the current web page. */
    getTitle(): string

    // todo
    /** Whether the web page is destroyed. */
    // isDestroyed(): boolean;

    /** Whether web page is still loading resources. */
    isLoading(): boolean

    /** Whether web page is waiting for response */
    isWaitingForResponse(): boolean

    /** Stops any pending navigation. */
    stop(): void

    /** Reloads the current web page. */
    reload(): void

    /** Reload the current web page by ignoring local cache. */
    reloadIgnoringCache(): void

    /** Whether the browser can go back to previous web page. */
    canGoBack(): boolean

    /** Whether the browser can go forward to next web page. */
    canGoForward(): boolean

    /** Whether the browser can go to any index web package. */
    canGoToOffset(offset: number): boolean

    /** Makes the browser go back a web page. */
    goBack(): void

    /** Makes the browser go forward a web page. */
    goForward(): void

    /** Navigates browser to the specified absolute web page index. */
    goToIndex(index: number): void

    /** Navigates to the specified offset from the "current entry". */
    goToOffset(offset: number): void

    /** Return the user agent string of webview. */
    getUserAgent(): string | undefined

    /** Inject CSS code into a web page. */
    insertCSS(css: string): void

    /** Inject JS code into a web page. */
    insertJS(source: string): void

    /** Evaluates `code` in page. */
    executeJavaScript<T>(
      code: string,
      callback?: (error: Error | null, result: T) => void
    ): Promise<T>

    /** Changes the zoom factor to the specified factor. */
    setZoomFactor(factor: number): void

    /** Returns the current zoom factor. */
    getZoomFactor(callback: (factor: number) => any): void

    /** Changes the zoom level to the specified level. The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits. */
    setZoomLevel(level: number): void

    /** Returns the current zoom level. */
    getZoomLevel(callback: (level: number) => any): void

    /** Executes the editing command `undo` in web page. */
    undo(): void

    /** Executes the editing command `redo` in web page. */
    redo(): void

    /** Executes the editing command `cut` in web page. */
    cut(): void

    /** Executes the editing command `copy` in web page. */
    copy(): void

    /** Executes the editing command `paste` in web page. */
    paste(): void

    /** Executes the editing command `pasteAndMatchStyle` in web page. */
    pasteAndMatchStyle(): void

    /** Executes the editing command `delete` in web page. */
    delete(): void

    /** Executes the editing command `replace` in web page. */
    replace(): void

    /** Send message to a web page. */
    send(...args: any[]): void
  }

  export class BrowserWindow extends EventEmitter {
    /** Create a browser window. */
    constructor(options?: BrowserWindowOptions)

    /** Return window with the given id */
    static fromId(id: string): BrowserWindow

    /**
     * A `WebContents` object this window owns. All web page related events and
     * operations will be done via it.
     */
    webContents: WebContents

    /** An integer representing the unique ID of the window. */
    id: string

    /**
     * Force closing the window, the `unload` and `beforeunload` event won't be
     * emitted for the web page, and `close` event will also not be emitted for
     * this window, but it guarantees the `closed` event will be emitted.
     */
    destroy(): void

    /**
     * Try to close the window. This has the same effect as a user manually
     * clicking the close button of the window. The web page may cancel the
     * close though.
     */
    close(): void

    /** Focuses on the window. */
    focus(): void

    /** Removes focus from the window. */
    blur(): void

    /** Whether the window is focused. */
    isFocused(): boolean

    /** Whether the window is destroyed. */
    isDestroyed(): boolean

    /** Shows and gives focus to the window. */
    show(): void

    /** Shows the window but doesn't focus on it. */
    showInactive(): void

    /** Hides the window. */
    hide(): void

    /** Whether the window is visible to the user. */
    isVisible(): boolean

    /** Whether current window is a modal window. */
    isModal(): boolean

    /**
     * Maximizes the window. This will also show (but not focus) the window if
     * it isn't being displayed already.
     */
    maximize(): void

    /** Unmaximizes the window. */
    unmaximize(): void

    /** Whether the window is maximized. */
    isMaximized(): boolean

    /**
     * Minimizes the window.
     * On some platforms the minimized window will be shown in the Dock.
     */
    minimize(): void

    /** Restores the window from minimized state to its previous state. */
    restore(): void

    /** Whether the window is minimized. */
    isMinimized(): boolean

    /** Sets whether the window should be in fullscreen mode. */
    setFullScreen(shouldBeFullscreen: boolean): void

    /** Whether the window is in fullscreen mode. */
    isFullScreen(): boolean

    /**
     * Make a window maintain an aspect ratio.
     * @param aspectRatio The aspect ratio to maintain for some portion of the
     *  content view.
     * @param extraSize The extra size not to be included while maintaining the
     *  aspect ratio.
     */
    setAspectRatio(
      aspectRatio: number,
      extraSize?: {
        width: number
        height: number
      }
    ): void

    /**
     * Resizes and moves the window to the supplied bounds.
     * @param bounds The supplied bounds. Any properties that are not supplied
     *  will default to their current values.
     * @param animate Whether to show the animation when resizing
     */
    setBounds(bounds: Partial<Rectangle>, animate: boolean): void

    /** Get the bounds of the browser window */
    getBounds(): Rectangle

    /** Resizes and moves the window's client area to the supplied bounds. */
    setContentBounds(bounds: Rectangle, animate: boolean): void

    /** Get the bounds of the window's client area */
    getContentBounds(): Rectangle

    /** Disable or enable the window. */
    setEnabled(enabled: boolean): void

    /** Resizes the window to given `width` and `height`. */
    setSize(width: number, height: number, animate: boolean): void

    /** Contains the window's width and height. */
    getSize(): [number, number]

    /** Resizes the window's client area to given `width` and `height`. */
    setContentSize(width: number, height: number, animate: boolean): void

    /** Contains the window's client area's width and height. */
    getContentSize(): [number, number]

    /** Sets the minimum size of window to width and height. */
    setMinimumSize(width: number, height: number): void

    /** Contains the window's minimum width and height. */
    getMinimumSize(): [number, number]

    /** Sets the maximum size of window to `width` and `height`. */
    setMaximumSize(width: number, height: number): void

    /** Contains the window's maximum width and height. */
    getMaximumSize(): [number, number]

    /** Sets whether the window can be manually resized by user. */
    setResizable(resizable: boolean): void

    /** Whether the window can be manually resized by user. */
    isResizable(): boolean

    /** Sets whether the window can be moved by user. */
    setMovable(movable: boolean): void

    /** Sets whether the window can be manually minimized by user. */
    setMinimizable(minimizable: boolean): void

    /** Sets whether the window can be manually maximized by user. */
    setMaximizable(maximizable: boolean): void

    /** Whether the window can be manually maximized by user. */
    isMaximizable(): boolean

    /**
     * Sets whether the maximize/zoom window button toggles fullscreen mode or
     * maximizes the window.
     */
    setFullScreenable(fullscreenable: boolean): void

    /**
     * Whether the maximize/zoom window button toggles fullscreen mode or
     * maximizes the window.
     */
    isFullScreenable(): boolean

    /** Sets whether the window can be manually closed by user. */
    setClosable(closable: boolean): void

    /** Whether the window can be manually closed by user. */
    isClosable(): boolean

    /** Sets whether the window should show always on top of other windows. */
    setAlwaysOnTop(flag: boolean, level?: string, relativeLevel?: number): void

    /** Whether the window is always on top of other windows. */
    isAlwaysOnTop(): boolean

    /** Moves window to top(z-order) regardless of focus */
    moveTop(): void

    /** Moves window to the center of the screen. */
    center(): void

    /** Moves window to `x` and `y`. */
    setPosition(x: number, y: number, animate: boolean): void

    /** Contains the window's current position. */
    getPosition(): [number, number]

    /** Changes the title of native window to `title`. */
    setTitle(title: string): void

    /** The title of the native window. */
    getTitle(): string

    /** Starts or stops flashing the window to attract user's attention. */
    flashFrame(flashing: boolean): void

    /** The platform-specific handle of the window. */
    getNativeWindowHandle(): Buffer

    /** Load web page of given url */
    loadURL(url: string): Promise<void>

    /** Reload the page */
    reload(): void

    /** Sets whether the window should have a shadow. */
    setHasShadow(hasShadow: boolean): void

    /** Whether the window has a shadow. */
    hasShadow(): boolean

    /** Sets the opacity of the window. */
    setOpacity(opacity: number): void

    /** Return the opacity of the window */
    getOpacity(): number

    /** Sets whether the window should be visible on all workspaces. */
    setVisibleOnAllWorkspaces(visible: boolean): void

    /** Whether the window is visible on all workspaces. */
    isVisibleOnAllWorkspaces(): boolean

    /** Makes the window ignore all mouse events. */
    setIgnoreMouseEvents(ignore: boolean): void

    /** Prevents the window contents from being captured by other apps. */
    setContentProtection(enabled: boolean): void

    /** Controls whether to hide cursor when typing. */
    setAutoHideCursor(autoHide: boolean): void

    /** Adds a vibrancy effect to the browser window. */
    setVibrancy(type: string | null): void
  }

  export default BrowserWindow
}
