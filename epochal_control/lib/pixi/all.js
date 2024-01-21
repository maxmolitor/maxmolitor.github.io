(function () {
'use strict';

/**
 * Class that represents a PixiJS Theme.
 *
 * @example
 * // Create the theme
 * const yellow = new Theme({
 *     fill: 0xfecd2d,
 *     fillActive: 0xfe9727,
 *     strokeActive: 0xfecd2d,
 *     strokeActiveWidth: 4,
 *     textStyle: {
 *         fill: 0x5ec7f8
 *     },
 *     textStyleActive: {
 *         fill: 0x5954d3
 *     },
 *     textStyleLarge: {
 *         fontSize: 36
 *     }
 * })
 *
 * // Create the app and apply the new theme to it
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 450,
 *     height: 150,
 *     theme: yellow
 * }).setup().run()
 *
 * @class
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
 */
class Theme {

    /**
     * Creates an instance of a Theme.
     *
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the theme.
     * @param {number} [opts.margin=10] - The outer spacing (distance to other objects) from the border.
     * @param {number} [opts.padding=10] - The inner spacing (distance from icon and/or label) to the border.
     * @param {number} [opts.radius=4] - The radius used when drawing a rounded rectangle.
     * @param {number} [opts.fast=0.25] - The duration of time when it has to be fast.
     * @param {number} [opts.normal=0.5] - The duration of time when it has to be normal.
     * @param {number} [opts.slow=1] - The duration of time when it has to be slow.
     * @param {number} [opts.primaryColor=0x5ec7f8] - The primary color of the theme.
     * @param {number} [opts.color1=0x282828] - The first color of the theme. For example used for the background.
     * @param {number} [opts.color2=0xf6f6f6] - The second color of the theme. For example used for the border.
     * @param {number} [opts.fill=color1] - The color of the background as a hex value.
     * @param {number} [opts.fillAlpha=1] - The alpha value of the background.
     * @param {number} [opts.fillActive=color1] - The color of the background when activated.
     * @param {number} [opts.fillActiveAlpha=1] - The alpha value of the background when activated.
     * @param {number} [opts.stroke=color2] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=0.6] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=1] - The alpha value of the border.
     * @param {number} [opts.strokeActive=color2] - The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=0.6] - The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=1] - The alpha value of the border when activated.
     * @param {number} [opts.iconColor=color2] - The color of the icon (set by the tint property) as a hex value.
     * @param {number} [opts.iconColorActive=colorPrimary] - The color of the icon when activated.
     * @param {number} [opts.background=color1] - The color of a background for a component (e.g. at the Modal class).
     * @param {object} [opts.textStyle={}] - A textstyle object for the styling of text. See PIXI.TextStyle
     *     for possible options. Default object:
     * @param {string} [opts.textStyle.fontFamily="Avenir Next", "Open Sans", "Segoe UI", ...] - The font family.
     * @param {string} [opts.textStyle.fontWeight=400] - The font weight.
     * @param {number} [opts.textStyle.fontSize=16] - The font size.
     * @param {number} [opts.textStyle.fill=color2] - The fill color.
     * @param {number} [opts.textStyle.stroke=color1] - The stroke color.
     * @param {number} [opts.textStyle.strokeThickness=0] - The thickness of the stroke.
     * @param {number} [opts.textStyle.miterLimit=1] - The meter limit.
     * @param {string} [opts.textStyle.lineJoin=round] - The line join.
     * @param {object} [opts.textStyleActive=textStyle + {fill: primaryColor}] - A textstyle object which is used
     *     for actived text.
     * @param {object} [opts.textStyleSmall=textStyle + {fontSize: -= 3}] - A textstyle object which is used for
     *     small text.
     * @param {object} [opts.textStyleSmallActive=textStyleSmall + {fill: primaryColor}] - A textstyle object which
     *     is used for small actived text.
     * @param {object} [opts.textStyleLarge=textStyle + {fontSize: += 3}] - A textstyle object which is used for
     *     large text.
     * @param {object} [opts.textStyleLargeActive=textStyleLarge + {fill: primaryColor}] - A textstyle object which
     *     is used for large actived text.
     */
    constructor(opts = {}) {

        const colorPrimary = opts.primaryColor != null ? opts.primaryColor : 0x5ec7f8;               // blue
        const color1 = opts.color1 != null ? opts.color1 : 0x282828;                                 // black
        const color2 = opts.color2 != null ? opts.color2 : 0xf6f6f6;                                 // white

        this.opts = Object.assign({}, {
            margin: 12,
            padding: 12,
            radius: 4,
            fast: .25,
            normal: .5,
            slow: 1,
            primaryColor: colorPrimary,
            color1: color1,
            color2: color2,
            fill: color1,
            fillAlpha: 1,
            fillActive: color1,
            fillActiveAlpha: 1,
            stroke: color2,
            strokeWidth: .6,
            strokeAlpha: 1,
            strokeActive: color2,
            strokeActiveWidth: .6,
            strokeActiveAlpha: 1,
            iconColor: color2,
            iconColorActive: colorPrimary,
            background: color1
        }, opts);

        // Set textStyle and variants
        this.opts.textStyle = Object.assign({}, {
            fontFamily: '"Avenir Next", "Open Sans", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, system-ui, BlinkMacSystemFont, Arial, sans-serif !default',
            fontWeight: '500',
            fontSize: 18,
            fill: color2,
            stroke: color1,
            strokeThickness: 0,
            miterLimit: 1,
            lineJoin: 'round'
        }, this.opts.textStyle);
        this.opts.textStyleSmall = Object.assign({}, this.opts.textStyle, {fontSize: this.opts.textStyle.fontSize - 3}, this.opts.textStyleSmall);
        this.opts.textStyleLarge = Object.assign({}, this.opts.textStyle, {fontSize: this.opts.textStyle.fontSize + 3}, this.opts.textStyleLarge);
        this.opts.textStyleActive = Object.assign({}, this.opts.textStyle, {fill: this.opts.primaryColor}, this.opts.textStyleActive);
        this.opts.textStyleSmallActive = Object.assign({}, this.opts.textStyleSmall, {fill: this.opts.primaryColor}, this.opts.textStyleSmallActive);
        this.opts.textStyleLargeActive = Object.assign({}, this.opts.textStyleLarge, {fill: this.opts.primaryColor}, this.opts.textStyleLargeActive);

        Object.assign(this, this.opts);
    }

    /**
     * Factory function
     *
     * @static
     * @param {string} theme=dark - The name of the theme to load.
     * @return {Theme} Returns a newly created Theme object.
     */
    static fromString(theme) {

        if (theme && typeof theme === 'object') {
            return theme
        }

        switch (theme) {
            case 'light':
                return new ThemeLight()
            case 'red':
                return new ThemeRed()
            default:
                return new ThemeDark()
        }
    }
}

/**
 * Class that represents a PixiJS ThemeDark.
 *
 * @example
 * // Create the app with a new dark theme
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 450,
 *     height: 150,
 *     theme: new ThemeDark()
 * }).setup().run()
 *
 * @class
 * @extends Theme
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
 */
class ThemeDark extends Theme {

}

/**
 * Class that represents a PixiJS ThemeLight.
 * The color1 is set to 0xf6f6f6, color2 to 0x282828.
 *
 * @example
 * // Create the app with a new light theme
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 450,
 *     height: 150,
 *     theme: new ThemeLight()
 * }).setup().run()
 *
 * @class
 * @extends Theme
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
 */
class ThemeLight extends Theme {

    /**
     * Creates an instance of a ThemeLight.
     *
     * @constructor
     */
    constructor() {

        super({color1: 0xf6f6f6, color2: 0x282828});
    }
}

/**
 * Class that represents a PixiJS ThemeRed.
 * The primaryColor is set to 0xd92f31.
 *
 * @example
 * // Create the app with a new red theme
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 450,
 *     height: 150,
 *     theme: new ThemeRed()
 * }).setup().run()
 *
 * @class
 * @extends Theme
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
 */
class ThemeRed extends Theme {

    /**
     * Creates an instance of a ThemeRed.
     *
     * @constructor
     */
    constructor() {

        super({primaryColor: 0xd92f31});
    }
}

/**
 * Class that represents a PixiJS Progress.
 * 
 * @example
 * // Create the progress
 * const progress = new Progress({
 *     app: app
 * })
 *
 * // Add the progress to a DisplayObject
 * app.scene.addChild(progress)
 *
 * @class
 * @extends PIXI.Container
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/progress.html|DocTest}
 */
class Progress extends PIXI.Container {
    
    /**
     * Creates an instance of a Progress.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the progress.
     * @param {number} [opts.id=auto generated] - The id of the progress.
     * @param {PIXIApp} [opts.app=window.app] - The app where the progress belongs to.
     * @param {number} [opts.width] - The width of the progress bar. When not set, the width is the size of the app
     *     minus 2 * opts.margin.
     * @param {number} [opts.height=2] - The height of the progress bar.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this progress. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.margin=100] - The outer spacing to the edges of the app.
     * @param {number} [opts.padding=0] - The inner spacing (distance from icon and/or label) to the border.
     * @param {number} [opts.fill=Theme.fill] - The color of the progress background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.fillActive=Theme.primaryColor] - The color of the progress background when activated.
     * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=0] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=0] - The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
     * @param {boolean} [opts.background=false] - The alpha value of the border when activated.
     * @param {number} [opts.backgroundFill=Theme.background] - A textstyle object for the styling of the label. See PIXI.TextStyle
     *     for possible options.
     * @param {number} [opts.backgroundFillAlpha=1] - A textstyle object for the styling of the label when the
     *     progress is activated. See PIXI.TextStyle for possible options.
     * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the progress (which is a rounded rectangle).
     * @param {boolean} [opts.destroyOnComplete=true] - Should the progress bar destroy itself after reaching 100 %?
     * @param {boolean} [opts.visible=true] - Is the progress initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            app: window.app,
            width: null,
            height: 2,
            margin: 100,
            padding: 0,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            fillActive: theme.primaryColor,
            fillActiveAlpha: theme.fillActiveAlpha,
            stroke: theme.stroke,
            strokeWidth: 0,
            strokeAlpha: theme.strokeAlpha,
            strokeActive: theme.strokeActive,
            strokeActiveWidth: 0,
            strokeActiveAlpha: theme.strokeActiveAlpha,
            background: false,
            backgroundFill: theme.background,
            backgroundFillAlpha: 1,
            radius: theme.radius,
            destroyOnComplete: true,
            visible: true
        }, opts);

        this.id = this.opts.id;

        this.background = null;
        this.bar = null;
        this.barActive = null;

        this.alpha = 0;
        
        this.visible = this.opts.visible;

        this._progress = 0;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    setup() {

        // interaction
        //-----------------
        this.on('added', e => {
            this.show();
        });

        // background
        //-----------------
        if (this.opts.background) {
            const background = new PIXI.Graphics();
            this.background = background;
            this.addChild(background);
        }

        // bar
        //-----------------
        const bar = new PIXI.Graphics();
        this.bar = bar;
        this.addChild(bar);

        const barActive = new PIXI.Graphics();
        this.barActive = barActive;
        this.bar.addChild(barActive);

        return this
    }
    
    /**
     * Should be called to refresh the layout of the progress. Can be used after resizing.
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    layout() {

        const width = this.opts.app.size.width;
        const height = this.opts.app.size.height;

        // background
        //-----------------
        if (this.opts.background) {
            this.background.clear();
            this.background.beginFill(this.opts.backgroundFill, this.opts.backgroundFillAlpha);
            this.background.drawRect(0, 0, width, height);
            this.background.endFill();
        }

        this.draw();

        return this
    }
    
    /**
     * Draws the canvas.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    draw() {

        this.bar.clear();
        this.barActive.clear();

        this.drawBar();
        this.drawBarActive();

        return this
    }
    
    /**
     * Draws the bar.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    drawBar() {

        const width = this.opts.app.size.width;
        const height = this.opts.app.size.height;

        this.radius = this.opts.radius;
        if ((this.radius * 2) > this.opts.height) {
            this.radius = this.opts.height / 2;
        }

        const wantedWidth = this.opts.width || (width - (2 * this.opts.margin));
        const wantedHeight = this.opts.height;

        this.bar.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
        this.bar.beginFill(this.opts.fill, this.opts.fillAlpha);
        if (this.radius > 1) {
            this.bar.drawRoundedRect(0, 0, wantedWidth, wantedHeight, this.radius);
        } else {
            this.bar.drawRect(0, 0, wantedWidth, wantedHeight);
        }
        this.bar.endFill();
        
        this.bar.x = width / 2 - this.bar.width / 2;
        this.bar.y = height / 2 - this.bar.height / 2;

        return this
    }
    
    /**
     * Draws the active bar.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    drawBarActive() {

        const wantedWidth = this.bar.width - (2 * this.opts.padding);
        const wantedHeight = this.bar.height - (2 * this.opts.padding);
        
        const barActiveWidth = wantedWidth * this._progress / 100;

        this.barActive.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha);
        this.barActive.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha);
        if (barActiveWidth > 0) {
            if (this.radius > 1) {
                this.barActive.drawRoundedRect(0, 0, barActiveWidth, wantedHeight, this.radius);
            } else {
                this.barActive.drawRect(0, 0, barActiveWidth, wantedHeight);
            }
        }
        this.barActive.endFill();

        this.barActive.x = this.opts.padding;
        this.barActive.y = this.opts.padding;

        return this
    }
    
    /**
     * Shows the progress (sets his alpha values to 1).
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    show() {
        TweenMax.to(this, this.theme.fast, {alpha: 1});

        return this
    }
    
    /**
     * Hides the progress (sets his alpha values to 1).
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    hide() {
        TweenMax.to(this, this.theme.fast, {alpha: 0, onComplete: () => this.visible = false});

        return this
    }
    
    /**
     * Gets or sets the progress. Has to be a number between 0 and 100.
     * 
     * @member {number}
     */
    get progress() {
        return this._progress
    }
    set progress(value) {

        value = Math.round(value);

        if (value < 0) {
            value = 0;
        }

        if (value > 100) {
            value = 100;
        }

        TweenMax.to(this, this.theme.normal, {
            _progress: value,
            onUpdate: () => this.draw(),
            onComplete: () => {
                if (value === 100 && this.opts.destroyOnComplete) {
                    TweenMax.to(this, this.theme.fast, {
                        alpha: 0,
                        onComplete: () => this.destroy({children: true})
                    });
                }
            }
        });
    }
}

/**
 * Callback for the popup onHidden.
 *
 * @callback hiddenCallback
 * @param {AbstractPopup} abstractPopup - A reference to the popup (also this refers to the popup).
 */

/**
 * Class that represents a PixiJS AbstractPopup.
 * The class is used for various other Popup-like classes
 * like Popup, Message, Tooltip...
 *
 * @class
 * @abstract
 * @extends PIXI.Graphics
 * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
 */
class AbstractPopup extends PIXI.Graphics {
    
    /**
     * Creates an instance of an AbstractPopup (only for internal use).
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the popup.
     * @param {number} [opts.id=auto generated] - The id of the popup.
     * @param {number} [opts.x=0] - The x position of the popup. Can be also set after creation with popup.x = 0.
     * @param {number} [opts.y=0] - The y position of the popup. Can be also set after creation with popup.y = 0.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this popup. Possible values are dark, light, red
     *     or a Theme object.
     * @param {string|number|PIXI.Text} [opts.header] - The heading inside the popup as a string, a number (will be
     *     converted to a text) or as a PIXI.Text object.
     * @param {string|number|PIXI.DisplayObject} [opts.content] - A text, a number (will be converted to a text) or
     *     an PIXI.DisplayObject as the content of the popup.
     * @param {number} [opts.minWidth=320] - The minimum width of the popup.
     * @param {number} [opts.minHeight=130] - The minimum height of the popup.
     * @param {number} [opts.padding=Theme.padding] - The inner spacing (distance from header and content) the the border.
     * @param {number} [opts.fill=Theme.fill] - The color of the button background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {object} [opts.headerStyle=Theme.textStyleLarge] - A textstyle object for the styling of the header. See PIXI.TextStyle
     *     for possible options.
     * @param {object} [opts.textStyle=Theme.textStyleSmall] - A textstyle object for the styling of the text. See PIXI.TextStyle
     *     for possible options.
     * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the popup (which is a rounded rectangle).
     * @param {hiddenCallback} [opts.onHidden] - Executed when the popup gets hidden.
     * @param {boolean} [opts.visible=true] - Is the popup initially visible (property visible)?
     * @param {string} [opts.orientation] - When set to portrait, the popup cannot be displayed in landscape mode. When set
     *     to landscape, the popup cannot be displayed in portrait mode.
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            x: 0,
            y: 0,
            header: null,                       // null or null
            content: null,                      // null or String or PIXI.DisplayObject
            minWidth: 320,
            minHeight: 130,
            maxWidth: null,
            padding: theme.padding,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            strokeAlpha: theme.strokeAlpha,
            headerStyle: theme.textStyleLarge,
            textStyle: theme.textStyleSmall,
            radius: theme.radius,
            onHidden: null,
            visible: true,
            orientation: null
        }, opts);

        this.id = this.opts.id;

        this.headerStyle = new PIXI.TextStyle(this.opts.headerStyle);
        this.textStyle = new PIXI.TextStyle(this.opts.textStyle);

        if (this.opts.maxWidth) {
            this.headerStyle.wordWrap = true;
            this.headerStyle.wordWrapWidth = this.opts.maxWidth - (2 * this.opts.padding);

            this.textStyle.wordWrap = true;
            this.textStyle.wordWrapWidth = this.opts.maxWidth - (2 * this.opts.padding);
        }

        this.alpha = 0;
        this.visible = this.opts.visible;

        this._header = null;
        this._content = null;

        // position
        this.x = this.opts.x;
        this.y = this.opts.y;

        // padding
        this.innerPadding = this.opts.padding * 1.5;
        
        // interaction
        //-----------------
        this.interactive = true;
        this.on('added', e => {
            this.show();
        });
    }
    
    /**
     * Creates the framework and instantiates everything.
     * 
     * @private
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    setup() {

        // position
        //-----------------
        this.sy = this.opts.padding;

        // header
        //-----------------
        if (this.opts.header != null) {

            let header = null;

            if (this.opts.header instanceof PIXI.Text) {
                header = this.opts.header;
            } else if (typeof this.opts.header === 'number') {
                header =  new PIXI.Text(this.opts.header.toString(), this.headerStyle);
            } else {
                header =  new PIXI.Text(this.opts.header, this.headerStyle);
            }

            header.x = this.opts.padding;
            header.y = this.sy;

            this.addChild(header);

            this.sy += header.height;

            this._header = header;
        }

        if (this.opts.header && this.opts.content) {
            this.sy += this.innerPadding;
        }

        // content
        //-----------------
        if (this.opts.content != null) {

            let content = null;

            if (typeof this.opts.content === 'string') {
                content = new PIXI.Text(this.opts.content, this.textStyle);
            } else if (typeof this.opts.content === 'number') {
                content = new PIXI.Text(this.opts.content.toString(), this.textStyle);
            } else {
                content = this.opts.content;
            }

            content.x = this.opts.padding;
            content.y = this.sy;

            this.sy += content.height;

            this.addChild(content);

            this._content = content;
        }

        return this
    }
    
    /**
     * Should be called to refresh the layout of the popup. Can be used after resizing.
     * 
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    layout() {
        
        // wanted width & wanted height
        //-----------------
        const padding = this.opts.padding;
        const size = this.getInnerSize();
        const width = size.width + (2 * padding);
        const height = size.height + (2 * padding);

        this.wantedWidth = Math.max(width, this.opts.minWidth);
        this.wantedHeight = Math.max(height, this.opts.minHeight);
        
        if (this.opts.maxWidth) {
            this.wantedWidth = Math.min(this.wantedWidth, this.opts.maxWidth);
        }

        if (this.opts.radius * 2 > this.wantedWidth) {
            this.wantedWidth = this.opts.radius * 2;
        }

        if (this.opts.radius * 2 > this.wantedHeight) {
            this.wantedHeight = this.opts.radius * 2;
        }

        switch (this.opts.orientation) {
            case 'portrait':
                if (this.wantedWidth > this.wantedHeight) {
                    this.wantedHeight = this.wantedWidth;
                }
                break
            case 'landscape':
                if (this.wantedHeight > this.wantedWidth) {
                    this.wantedWidth = this.wantedHeight;
                }
                break
        }

        this.draw();

        return this
    }
    
    /**
     * Draws the canvas.
     * 
     * @private
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    draw() {

        const square = Math.round(this.wantedWidth) === Math.round(this.wantedHeight);
        const diameter = Math.round(this.opts.radius * 2);

        this.clear();
        this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
        this.beginFill(this.opts.fill, this.opts.fillAlpha);
        if (square && diameter === this.wantedWidth) {
            this.drawCircle(this.wantedWidth / 2, this.wantedHeight / 2, this.opts.radius);
        } else {
            this.drawRoundedRect(0, 0, this.wantedWidth, this.wantedHeight, this.opts.radius);
        }
        this.endFill();

        return this
    }
    
    /**
     * Calculates the size of the children of the AbstractPopup.
     * Cannot use getBounds() because it is not updated when children
     * are removed.
     * 
     * @private
     * @returns {object} An JavaScript object width the keys width and height.
     */
    getInnerSize() {

        let width = 0;
        let height = 0;

        if (this._header) {
            width = this._header.width;
            height = this._header.height;
        }

        if (this._header && this._content) {
            height += this.innerPadding;
        }

        if (this._content) {
            width = Math.max(width, this._content.width);
            height += this._content.height;
        }

        return {width, height}
    }
    
    /**
     * Shows the popup (sets his alpha values to 1).
     * 
     * @param {callback} [cb] - Executed when show animation was completed.
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    show(cb) {

        TweenMax.to(this, this.theme.fast, {
            alpha: 1,
            onComplete: () => {
                if (cb) {
                    cb.call(this);
                }
            }
        });

        return this
    }
    
    /**
     * Hides the popup (sets his alpha values to 0).
     * 
     * @param {callback} [cb] - Executed when hide animation was completed.
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    hide(cb) {

        TweenMax.to(this, this.theme.fast, {
            alpha: 0,
            onComplete: () => {
                this.visible = false;
                if (cb) {
                    cb.call(this);
                }
            }
        });

        if (this.opts.onHidden) {
            this.opts.onHidden.call(this, this);
        }

        return this
    }

    /**
     * Sets or gets the header. The getter always returns a PIXI.Text object. The setter can receive
     * a string, a number or a PIXI.Text object.
     * 
     * @member {string|number|PIXI.Text}
     */
    get header() {
        return this._header
    }
    set header(value) {
        if (this._header) {
            this._header.destroy();
        }
        this.opts.header = value;
        this.setup().layout();
    }
    
    /**
     * Sets or gets the content. The getter always returns an PIXI.DisplayObject. The setter can receive
     * a string, a number or a PIXI.DisplayObject.
     * 
     * @member {string|number|PIXI.DisplayObject}
     */
    get content() {
        return this._content
    }
    set content(value) {
        if (this._content) {
            this._content.destroy();
        }
        this.opts.content = value;
        this.setup().layout();
    }
}

/**
 * Class that represents a PixiJS Tooltip.
 * 
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * // Add an DisplayObject to the app
 * const circle = new PIXI.Graphics()
 * circle.beginFill(0x5251a3)
 * circle.drawCircle(50, 50, 40)
 * app.scene.addChild(circle)
 * 
 * const tooltip = new Tooltip({
 *     object: circle,
 *     container: app.scene,
 *     content: 'Das Gesetz ist der Freund des Schwachen.'
 * })
 *
 * @class
 * @extends AbstractPopup
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/tooltip.html|DocTest}
 */
class Tooltip extends AbstractPopup {
    
    /**
     * Creates an instance of a Tooltip.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the tooltip.
     * @param {number} [opts.minWidth=0] - The minimum width of the tooltip.
     * @param {number} [opts.minHeight=0] - The minimum height of the tooltip.
     * @param {number} [opts.padding=Theme.padding / 2] - The inner spacing of the tooltip.
     * @param {PIXI.DisplayObject} opts.object - The object, where the tooltip should be displayed.
     * @param {PIXI.DisplayObject} [opts.container=object] - The container where the tooltip should be attached to.
     * @param {number} [opts.offsetLeft=8] - The horizontal shift of the tooltip.
     * @param {number} [opts.offsetTop=-8] - The vertical shift of the tooltip.
     * @param {number} [opts.delay=0] - A delay, after which the tooltip should be opened.
     */
    constructor(opts = {}) {
        
        const theme = Theme.fromString(opts.theme);
        
        opts = Object.assign({}, {
            minWidth: 0,
            minHeight: 0,
            padding: theme.padding / 2,
            object: null,
            container: null,
            offsetLeft: 8,
            offsetTop: -8,
            delay: 0
        }, opts);

        opts.container = opts.container || opts.object;

        super(opts);

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Tooltip} A reference to the tooltip for chaining.
     */
    setup() {

        super.setup();

        // bind events this
        //-----------------
        this.interactive = true;

        let mouseoverTooltip = false;
        
        this.on('mouseover', e => {
            mouseoverTooltip = true;
        });

        this.on('mouseout', e => {
            mouseoverTooltip = false;
            if (!mouseoverObject) {
                this.hide(() => {
                    this.opts.container.removeChild(this);
                });
            }
        });
        
        // bind events object
        //-----------------
        const object = this.opts.object;
        object.interactive = true;

        let mouseoverObject = false;

        object.on('mouseover', e => {

            this.timeout = window.setTimeout(() => {
                mouseoverObject = true;
                this.visible = true;
                this.opts.container.addChild(this);
                this.setPosition(e);
            }, this.opts.delay * 1000);
        });

        object.on('mousemove', e => {
            if (mouseoverObject) {
                this.setPosition(e);
            }
        });

        object.on('mouseout', e => {
            mouseoverObject = false;
            window.clearTimeout(this.timeout);
            if (!mouseoverTooltip) {
                this.hide(() => {
                    this.opts.container.removeChild(this);
                });
            }
        });

        return this
    }
    
    /**
     * Calculates and sets the position of the tooltip.
     * 
     * @private
     * @return {Tooltip} A reference to the tooltip for chaining.
     */
    setPosition(e) {

        const position = e.data.getLocalPosition(this.opts.container);

        this.x = position.x + this.opts.offsetLeft;
        this.y = position.y + this.opts.offsetTop - this.height;

        return this
    }
}

/**
 * Class that represents a PixiJS Badge.
 * 
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * // Add an DisplayObject to the app
 * const circle = new PIXI.Graphics()
 * circle.beginFill(0x5251a3)
 * circle.drawCircle(50, 50, 40)
 * app.scene.addChild(circle)
 * 
 * const badge1 = new Badge({
 *     object: circle,
 *     container: app.scene,
 *     content: 'Das Gesetz ist der Freund des Schwachen.'
 * })
 *
 * @class
 * @extends AbstractPopup
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/badge.html|DocTest}
 */
class Badge extends AbstractPopup {
    
    /**
     * Creates an instance of a Badge.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the badge.
     * @param {number} [opts.minWidth=0] - The minimum width of the badge.
     * @param {number} [opts.minHeight=0] - The minimum height of the badge.
     * @param {number} [opts.padding=Theme.padding / 2] - The inner spacing of the badge.
     * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
     *     to display.
     */
    constructor(opts = {}) {
        
        const theme = Theme.fromString(opts.theme);
        
        opts = Object.assign({}, {
            minWidth: 0,
            minHeight: 0,
            padding: theme.padding / 2,
            tooltip: null
        }, opts);

        super(opts);

        this.tooltip = null;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     *
     * @private
     * @override
     * @return {Badge} A reference to the badge for chaining.
     */
    setup() {

        super.setup();

        // tooltip
        //-----------------
        if (this.opts.tooltip) {
            if (typeof this.opts.tooltip === 'string') {
                this.tooltip = new Tooltip({object: this, content: this.opts.tooltip});
            } else {
                this.opts.tooltip = Object.assign({}, {object: this}, this.opts.tooltip);
                this.tooltip = new Tooltip(this.opts.tooltip);
            }
        }

        return this
    }
    
    /**
     * Should be called to refresh the layout of the badge. Can be used after resizing.
     * 
     * @override
     * @return {Badge} A reference to the badge for chaining.
     */
    layout() {

        super.layout();

        this.content.x = this.width / 2 - this.content.width / 2 - this.opts.strokeWidth / 2;
        this.content.y = this.height / 2 - this.content.height / 2 - this.opts.strokeWidth / 2;

        return this
    }
}

/**
 * Callback for the button action.
 *
 * @callback actionCallback
 * @param {object} event - The event object.
 * @param {Button} button - A reference to the button (also this refers to the button).
 */

/**
 * Callback for the button beforeAction.
 *
 * @callback beforeActionCallback
 * @param {object} event - The event object.
 * @param {Button} button - A reference to the button (also this refers to the button).
 */

/**
 * Callback for the button afterAction.
 *
 * @callback afterActionCallback
 * @param {object} event - The event object.
 * @param {Button} button - A reference to the button (also this refers to the button).
 */

/**
 * Class that represents a PixiJS Button.
 *
 * @example
 * // Create the button
 * const button = new Button({
 *     label: 'My Button',
 *     action: () => console.log('Button was clicked')
 * })
 *
 * // Add the button to a DisplayObject
 * app.scene.addChild(button)
 *
 * @class
 * @extends PIXI.Container
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/button.html|DocTest}
 */
class Button extends PIXI.Container {

    /**
     * Creates an instance of a Button.
     *
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the button.
     * @param {number} [opts.id=auto generated] - The id of the button.
     * @param {string} [opts.label] - The label of the button.
     * @param {number} [opts.x=0] - The x position of the button. Can be also set after creation with button.x = 0.
     * @param {number} [opts.y=0] - The y position of the button. Can be also set after creation with button.y = 0.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this button. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.minWidth=44] - The minimum width of the button.
     * @param {number} [opts.minHeight=44] - The minimum height of the button.
     * @param {number} [opts.padding=Theme.padding] - The inner spacing (distance from icon and/or label) to the border.
     * @param {string|PIXI.DisplayObject} [opts.icon] - The icon of the button. Can be a predefined one, an URL or an PIXI.DisplayObject.
     * @param {string|PIXI.DisplayObject} [opts.iconActive=icon] - The icon of the button when activated. Can be a predefined one, an URL or an PIXI.DisplayObject.
     * @param {string} [opts.iconPosition=left] - The position of the icon in relation to the label. Can be left or right.
     * @param {number} [opts.iconColor=Theme.iconColor] - The color of the icon (set by the tint property) as a hex value.
     * @param {number} [opts.iconColorActive=Theme.iconColorActive] - The color of the icon when activated.
     * @param {number} [opts.fill=Theme.fill] - The color of the button background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.fillActive=Theme.fillActive] - The color of the button background when activated.
     * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=Theme.strokeActiveWidth] - The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
     * @param {object} [opts.textStyle=Theme.textStyle] - A textstyle object for the styling of the label. See PIXI.TextStyle
     *     for possible options.
     * @param {number} [opts.textStyleActive=Theme.textStyleActive] - A textstyle object for the styling of the label when the
     *     button is activated. See PIXI.TextStyle for possible options.
     * @param {string} [opts.style=default] - A shortcut for styling options. Possible values are default, link.
     * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the button (which is a rounded rectangle).
     * @param {boolean} [opts.disabled=false] - Is the button disabled? When disabled, the button has a lower alpha value
     *     and cannot be clicked (interactive is set to false).
     * @param {boolean} [opts.active=false] - Is the button initially active?
     * @param {actionCallback} [opts.action] - Executed when the button was triggered (by pointerup).
     * @param {beforeActionCallback} [opts.beforeAction] - Executed before the main action is triggered.
     * @param {afterActionCallback} [opts.afterAction] - Executed after the main action was triggered.
     * @param {string} [opts.type=default] - The type of the button. Can be default or checkbox. When the type is
     *     checkbox, the active state is toggled automatically.
     * @param {string} [opts.align=center] - The horizontal position of the label and the icon. Possible values are
     *     left, center and right. Only affects the style when the minWidth is bigger than the width of the icon and label.
     * @param {string} [opts.verticalAlign=middle] - The vertical position of the label and the icon. Possible values are
     *     top, middle and button. Only affects the style when the minHeight is bigger than the height of the icon and label.
     * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
     *     to display.
     * @param {string|object} [opts.badge] - A string for the label of the badge or an object to configure the badge to display.
     *     If the parameter is an object, all badge options can be set plus the following:
     * @param {string} [opts.badge.align=right] - The horizontal alignment of the badge. Possible values: left, center, right
     * @param {string} [opts.badge.verticalAlign=top] - The vertical alignment of the badge. Possible values: top, middle, bottom
     * @param {number} [opts.badge.offsetLeft=0] - The horizontal shift of the badge.
     * @param {number} [opts.badge.offsetTop=0] - The vertical shift of the badge.
     * @param {boolean} [opts.visible=true] - Is the button initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();

        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            label: null,
            x: 0,
            y: 0,
            minWidth: 44,
            minHeight: 44,
            padding: theme.padding,
            icon: undefined,
            iconActive: undefined,
            iconPosition: 'left',
            iconColor: theme.iconColor,
            iconColorActive: theme.iconColorActive,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            fillActive: theme.fillActive,
            fillActiveAlpha: theme.fillActiveAlpha,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            strokeAlpha: theme.strokeAlpha,
            strokeActive: theme.strokeActive,
            strokeActiveWidth: theme.strokeActiveWidth,
            strokeActiveAlpha: theme.strokeActiveAlpha,
            textStyle: theme.textStyle,
            textStyleActive: theme.textStyleActive,
            style: 'default',
            radius: theme.radius,
            disabled: false,
            active: false,
            action: null,
            beforeAction: null,
            afterAction: null,
            type: 'default',
            align: 'center',
            verticalAlign: 'middle',
            tooltip: null,
            badge: null,
            visible: true
        }, opts);

        this.id = this.opts.id;

        if (typeof this.opts.icon === 'undefined' && typeof this.opts.iconActive !== 'undefined') {
            this.opts.icon = this.opts.iconActive;
        } else if (typeof this.opts.icon !== 'undefined' && typeof this.opts.iconActive === 'undefined') {
            this.opts.iconActive = this.opts.icon;
        }

        if (this.opts.style === 'link') {
            Object.assign(this.opts, {strokeAlpha: 0, strokeActiveAlpha: 0, fillAlpha: 0, fillActiveAlpha: 0});
        }

        this._active = null;
        this._disabled = null;

        this.iconInactive = null;
        this.iconActive = null;
        this.text = null;

        this.button = null;
        this.content = null;

        this.tooltip = null;
        this.badge = null;

        this.visible = this.opts.visible;

        // setup
        //-----------------
        this.setup();
    }

    /**
     * Creates children and instantiates everything.
     *
     * @private
     * @return {Button} A reference to the button for chaining.
     */
    setup() {

        // Button
        //-----------------
        let button = new PIXI.Graphics();
        this.button = button;
        this.addChild(button);

        // Content
        //-----------------
        let content = new PIXI.Container();
        this.content = content;
        this.addChild(content);

        // Text
        //-----------------
        if (this.opts.label) {
            this.text = new PIXI.Text(this.opts.label, this.opts.textStyle);
        }

        // Icon
        //-----------------
        if (this.opts.icon) {
            this.iconInactive = this.loadIcon(this.opts.icon, this.opts.iconColor);
        }

        if (this.opts.iconActive) {
            this.iconActive = this.loadIcon(this.opts.iconActive, this.opts.iconColorActive);
        }
        
        // interaction
        //-----------------
        this.button.on('pointerover', e => {
            TweenMax.to([this.button, this.content], this.theme.fast, {alpha: .83, overwrite: 'none'});
        });

        this.button.on('pointerout', e => {
            TweenMax.to([this.button, this.content], this.theme.fast, {alpha: 1, overwrite: 'none'});
        });

        this.button.on('pointerdown', e => {
            TweenMax.to([this.button, this.content], this.theme.fast, {alpha: .7, overwrite: 'none'});
        });

        this.button.on('pointerup', e => {

            if (this.opts.beforeAction) {
                this.opts.beforeAction.call(this, e, this);
            }

            if (this.opts.action) {
                this.opts.action.call(this, e, this);
            }

            TweenMax.to([this.button, this.content], this.theme.fast, {alpha: .83, overwrite: 'none'});

            if (this.opts.type === 'checkbox') {
                this.active = !this.active;
            }

            if (this.opts.afterAction) {
                this.opts.afterAction.call(this, e, this);
            }
        });

        // disabled
        //-----------------
        this.disabled = this.opts.disabled;

        // active
        //-----------------
        this.active = this.opts.active;      // calls .layout()

        // tooltip
        //-----------------
        if (this.opts.tooltip) {
            if (typeof this.opts.tooltip === 'string') {
                this.tooltip = new Tooltip({object: this, content: this.opts.tooltip});
            } else {
                this.opts.tooltip = Object.assign({}, {object: this}, this.opts.tooltip);
                this.tooltip = new Tooltip(this.opts.tooltip);
            }
        }

        // badge
        //-----------------
        if (this.opts.badge) {
            let opts = Object.assign({}, {
                align: 'right',
                verticalAlign: 'top',
                offsetLeft: 0,
                offsetTop: 0
            });
            if (typeof this.opts.badge === 'string') {
                opts = Object.assign(opts, {content: this.opts.badge});
            } else {
                opts = Object.assign(opts, this.opts.badge);
            }

            const badge = new Badge(opts);

            switch (opts.align) {
                case 'left':
                    badge.x = this.x - badge.width / 2 + opts.offsetLeft;
                    break
                case 'center':
                    badge.x = this.x + this.width / 2 - badge.width / 2 + opts.offsetLeft;
                    break
                case 'right':
                    badge.x = this.x + this.width - badge.width / 2 + opts.offsetLeft;
            }

            switch (opts.verticalAlign) {
                case 'top':
                    badge.y = this.y - badge.height / 2 + opts.offsetTop;
                    break
                case 'middle':
                    badge.y = this.y + this.height / 2 - badge.height / 2 + opts.offsetTop;
                    break
                case 'bottom':
                    badge.y = this.y + this.height - badge.height / 2 + opts.offsetTop;
            }

            this.addChild(badge);

            this.badge = badge;
        }
        
        // set position
        //-----------------
        this.position.set(this.opts.x, this.opts.y);

        return this
    }

    /**
     * Should be called to refresh the layout of the button. Can be used after resizing.
     *
     * @return {Button} A reference to the button for chaining.
     */
    layout() {

        // Clear content
        //-----------------
        this.removeChild(this.content);
        this.content = new PIXI.Container();
        this.addChild(this.content);

        // Set the icon
        //-----------------
        let icon = null;
        
        if (!this.active && this.iconInactive) {
            icon = this.iconInactive;
        } else if (this.active && this.iconActive) {
            icon = this.iconActive;
        }

        // Set the text
        //-----------------
        if (this.text) {
            this.text.position.set(0, 0);
        }
        
        // Width and Height
        //-----------------
        let width = 0;
        if (icon && this.text) {
            width = icon.width + this.text.width + 3 * this.opts.padding;
        } else if (icon) {
            width = icon.width + 2 * this.opts.padding;
        } else if (this.text) {
            width = this.text.width + 2 * this.opts.padding;
        }

        if (width < this.opts.minWidth) {
            width = this.opts.minWidth;
        }

        let height = 0;
        if (icon) {
            height = icon.height + 2 * this.opts.padding;
        } else if (this.text) {
            height = this.text.height + 2 * this.opts.padding;
        }

        if (height < this.opts.minHeight) {
            height = this.opts.minHeight;
        }
        
        this._width = width;
        this._height = height;

        // Position icon and text
        //-----------------
        if (icon && this.text) {
            if (this.opts.iconPosition === 'right') {
                icon.x = this.text.width + this.opts.padding;
            } else {
                this.text.x = icon.width + this.opts.padding;
            }
            this.content.addChild(icon, this.text);
        } else if (icon) {
            this.content.addChild(icon);
        } else if (this.text) {
            this.content.addChild(this.text);
        }

        this.layoutInnerContent();
        this.layoutContent();

        this.icon = icon;

        // draw
        //-----------------
        this.draw();

        return this
    }

    /**
     * Calculates the positions of the content children (icon and/or text).
     * 
     * @private
     * @return {Button} A reference to the button for chaining.
     */
    layoutInnerContent() {

        for (let child of this.content.children) {
            switch (this.opts.verticalAlign) {
                case 'top':
                    child.y = 0;
                    break
                case 'middle':
                    child.y = this.content.height / 2 - child.height / 2;
                    break
                case 'bottom':
                    child.y = this.content.height - child.height;
                    break
            }
        }

        return this
    }

    /**
     * Sets the horizontal and vertical position of the content.
     * Uses the option keys "align" and "verticalAlign".
     * 
     * @private
     * @return {Button} A reference to the button for chaining.
     */
    layoutContent() {

        switch (this.opts.align) {
            case 'left':
                this.content.x = this.opts.padding;
                break
            case 'center':
                this.content.x = ((this._width - this.content.width) / 2);
                break
            case 'right':
                this.content.x = this._width - this.opts.padding - this.content.width;
                break
        }

        switch (this.opts.verticalAlign) {
            case 'top':
                this.content.y = this.opts.padding;
                break
            case 'middle':
                this.content.y = (this._height - this.content.height) / 2;
                break
            case 'bottom':
                this.content.y = this._height - this.opts.padding - this.content.height;
                break
        }

        return this
    }

    /**
     * Draws the canvas.
     *
     * @private
     * @return {Button} A reference to the button for chaining.
     */
    draw() {

        this.button.clear();
        if (this.active) {
            this.button.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha);
            this.button.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha);
        } else {
            this.button.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
            this.button.beginFill(this.opts.fill, this.opts.fillAlpha);
        }
        this.button.drawRoundedRect(0, 0, this._width, this._height, this.opts.radius);
        this.button.endFill();

        return this
    }

    /**
     * Gets or sets the active state.
     *
     * @member {boolean}
     */
    get active() {
        return this._active
    }
    set active(value) {

        this._active = value;

        if (this._active) {
            if (this.text) {
                this.text.style = this.opts.textStyleActive;
            }
        } else {
            if (this.text) {
                this.text.style = this.opts.textStyle;
            }
        }

        this.layout();
    }

    /**
     * Gets or sets the disabled state. When disabled, the button cannot be clicked.
     *
     * @member {boolean}
     */
    get disabled() {
        return this._disabled
    }
    set disabled(value) {

        this._disabled = value;

        if (this._disabled) {
            this.button.interactive = false;
            this.button.buttonMode = false;
            this.button.alpha = .5;
            if (this.icon) {
                this.icon.alpha = .5;
            }
            if (this.text) {
                this.text.alpha = .5;
            }
        } else {
            this.button.interactive = true;
            this.button.buttonMode = true;
            this.button.alpha = 1;
            if (this.icon) {
                this.icon.alpha = 1;
            }
            if (this.text) {
                this.text.alpha = 1;
            }
        }
    }

    /**
     * Shows the button (sets his alpha values to 1).
     *
     * @return {Button} A reference to the button for chaining.
     */
    show() {

        this.opts.strokeAlpha = 1;
        this.opts.strokeActiveAlpha = 1;
        this.opts.fillAlpha = 1;
        this.opts.fillActiveAlpha = 1;

        this.layout();

        return this
    }

    /**
     * Hides the button (sets his alpha values to 0).
     *
     * @return {Button} A reference to the button for chaining.
     */
    hide() {

        this.opts.strokeAlpha = 0;
        this.opts.strokeActiveAlpha = 0;
        this.opts.fillAlpha = 0;
        this.opts.fillActiveAlpha = 0;

        this.layout();

        return this
    }
    
    /**
     * Loads an icon
     * 
     * @private
     * @param {string|PIXI.DisplayObject} icon - The icon to load.
     * @param {number} color - The color of the icon (if not an PIXI.DisplayObject).
     * @return {PIXI.DisplayObject} Return the icon as an PIXI.DisplayObject.
     */
    loadIcon(icon, color) {

        let displayObject = null;

        if (icon instanceof PIXI.DisplayObject) {
            displayObject = icon;
        } else {
            let size = 17;
            if (this.text) {
                size = this.text.height;
            } else if (this.opts.minHeight) {
                size = this.opts.minHeight - (2 * this.opts.padding);
            }

            const url = Button.iconIsUrl(icon) ? icon : `../../assets/icons/png/flat/${icon}.png`;
            const iconTexture = PIXI.Texture.fromImage(url, true);

            const sprite = new PIXI.Sprite(iconTexture);
            sprite.tint = color;
            sprite.width = size;
            sprite.height = size;

            displayObject = sprite;
        }

        return displayObject
    }
    
    /**
     * Tests if an icon string is an url.
     * 
     * @private
     * @static
     * @param {string} url - The url to test.
     * @return {boolean} true if the url is an url to an image.
     */
    static iconIsUrl(url) {
        return /\.(png|svg|gif|jpg|jpeg|tif|tiff)$/i.test(url)
    }

    /**
     * Gets or sets the color of the current icon (no matter how the status is). Changing the color, changes
     * the tint property of the icon sprite.
     *
     * @member {number}
     */
    get iconColor() {
        return this.icon ? this.icon.tint : null
    }
    set iconColor(value) {
        if (this.icon) {
            this.icon.tint = value;
        }
    }
}

/**
 * Class that represents a PixiJS ButtonGroup.
 * 
 * @example
 * // Create the button group
 * const buttonGroup = new ButtonGroup({
 *     buttons: [
 *         {label: 'Button 1', action: event => console.log(event)},
 *         {label: 'Button 2', action: event => console.log(event)},
 *         {label: 'Button 3', action: event => console.log(event)}
 *     ],
 *     minWidth: 100
 * })
 *
 * // Add the button group to a DisplayObject
 * app.scene.addChild(buttonGroup)
 *
 * @class
 * @extends PIXI.Graphics
 * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/buttongroup.html|DocTest}
 */
class ButtonGroup extends PIXI.Graphics {

    /**
     * Creates an instance of a ButtonGroup.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the button group.
     * @param {number} [opts.id=auto generated] - The id of the button group.
     * @param {number} [opts.x=0] - The x position of the button group. Can be also set after creation with buttonGroup.x = 0.
     * @param {number} [opts.y=0] - The y position of the button group. Can be also set after creation with buttonGroup.y = 0.
     * @param {object[]} [opts.buttons=[]] - An array of the buttons of the button group. One item of the array (one object)
     *     can have exactly the same properties as an Button object when instantiating a Button. If a property of the button group
     *     conflicts with a property of a button object, the value from the button object will be used.
     * @param {string|Theme=} [opts.theme=dark] - The theme to use for this button group. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.minWidth=44] - Button: The minimum width of one button.
     * @param {number} [opts.minHeight=44] - Button: The minimum height of one button.
     * @param {number} [opts.padding=Theme.padding] - Button: The inner spacing (distance from icon and/or label) the the border.
     * @param {number} [opts.margin=Theme.margin] - The outer spacing (distance from one button to the previous/next button).
     * @param {string} [opts.iconPosition=left] - Button: The position of the icon in relation to the label. Can be left or right.
     * @param {number} [opts.iconColor=Theme.iconColor] - Button: The color of the icon (set by the tint property) as a hex value.
     * @param {number} [opts.iconColorActive=Theme.iconColorActive] - Button: The color of the icon when activated.
     * @param {number} [opts.fill=Theme.fill] - Button: The color of the button background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - Button: The alpha value of the background.
     * @param {number} [opts.fillActive=Theme.fillActive] - Button: The color of the button background when activated.
     * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - Button: The alpha value of the background when activated.
     * @param {number} [opts.stroke=Theme.stroke] - Button: The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=Theme.strokeWidth] - Button: The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - Button: The alpha value of the border.
     * @param {number} [opts.strokeActive=Theme.strokeActive] - Button: The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=Theme.strokeActiveWidth] - Button: The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - Button: The alpha value of the border when activated.
     * @param {object} [opts.textStyle=Theme.textStyle] - Button: A textstyle object for the styling of the label. See PIXI.TextStyle
     *     for possible options.
     * @param {number} [opts.textStyleActive=Theme.textStyleActive] - Button: A textstyle object for the styling of the label when the
     *     button is activated. See PIXI.TextStyle for possible options.
     * @param {string} [opts.style=default] - A shortcut for styling options. Possible values are default, link.
     * @param {number} [opts.radius=Theme.radius] - Button: The radius of the four corners of the button (which is a rounded rectangle).
     * @param {boolean} [opts.disabled=false] - Is the button group disabled? When disabled, the button group has a lower alpha value
     *     and cannot be clicked (interactive of every button is set to false).
     * @param {string} [opts.type=default] - The type of the button group. Can be default, checkbox or radio. When the type is
     *     checkbox, the active state is toggled for each button automatically. When the type is radio, only one button can
     *     be activated at the same time.
     * @param {string} [opts.orientation=horizontal] - The orientation of the button group. Can be horizontal or vertical.
     * @param {string} [opts.align=center] - Button: The horizontal position of the label and the icon. Possible values are
     *     left, center and right. Only affects the style when the minWidth is bigger than the width of the icon and label.
     * @param {string} [opts.verticalAlign=middle] - Button: The vertical position of the label and the icon. Possible values are
     *     top, middle and button. Only affects the style when the minHeight is bigger than the height of the icon and label.
     * @param {boolean} [opts.visible=true] - Is the button group initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            x: 0,
            y: 0,
            buttons: [],
            minWidth: 44,
            minHeight: 44,
            padding: theme.padding,
            margin: theme.margin,
            iconPosition: 'left',             // left, right
            iconColor: theme.iconColor,
            iconColorActive: theme.iconColorActive,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            fillActive: theme.fillActive,
            fillActiveAlpha: theme.fillActiveAlpha,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            strokeAlpha: theme.strokeAlpha,
            strokeActive: theme.strokeActive,
            strokeActiveWidth: theme.strokeActiveWidth,
            strokeActiveAlpha: theme.strokeActiveAlpha,
            textStyle: theme.textStyle,
            textStyleActive: theme.textStyleActive,
            style: 'default',
            radius: theme.radius,
            disabled: null,
            type: 'default',                   // default, checkbox, radio
            orientation: 'horizontal',
            align: 'center',                   // left, center, right
            verticalAlign: 'middle',           // top, middle, bottom
            visible: true
        }, opts);

        this.buttons = [];

        this._disabled = null;
        
        this.visible = this.opts.visible;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {ButtonGroup} A reference to the button group for chaining.
     */
    setup() {

        // Buttons
        //-----------------
        let position = 0;

        for (let it of this.opts.buttons) {

            delete it.x;
            delete it.y;

            if (this.opts.orientation === 'horizontal') {
                it.x = position;
            } else {
                it.y = position;
            }

            it.theme = it.theme || this.opts.theme;
            it.minWidth = it.minWidth || this.opts.minWidth;
            it.minHeight = it.minHeight || this.opts.minHeight;
            it.padding = it.padding || this.opts.padding;
            it.iconPosition = it.iconPosition || this.opts.iconPosition;
            it.iconColor = it.iconColor || this.opts.iconColor;
            it.iconColorActive = it.iconColorActive || this.opts.iconColorActive;
            it.fill = it.fill || this.opts.fill;
            it.fillAlpha = it.fillAlpha || this.opts.fillAlpha;
            it.fillActive = it.fillActive || this.opts.fillActive;
            it.fillActiveAlpha = it.fillActiveAlpha || this.opts.fillActiveAlpha;
            it.stroke = it.stroke || this.opts.stroke;
            it.strokeWidth = it.strokeWidth != null ? it.strokeWidth : this.opts.strokeWidth;
            it.strokeAlpha = it.strokeAlpha != null ? it.strokeAlpha : this.opts.strokeAlpha;
            it.strokeActive = it.strokeActive || this.opts.strokeActive;
            it.strokeActiveWidth = it.strokeActiveWidth != null ? it.strokeActiveWidth : this.opts.strokeActiveWidth;
            it.strokeActiveAlpha = it.strokeActiveAlpha != null ? it.strokeActiveAlpha : this.opts.strokeActiveAlpha;
            it.textStyle = it.textStyle || this.opts.textStyle;
            it.textStyleActive = it.textStyleActive || this.opts.textStyleActive;
            it.style = it.style || this.opts.style;
            it.radius = it.radius != null ? it.radius : this.opts.radius;
            if (!it.type) {
                switch (this.opts.type) {
                    case 'checkbox':
                        it.type = this.opts.type;
                        break
                    default:
                        it.type = 'default';
                        break
                }
            }
            //it.type = it.type || this.opts.type || 'default'
            it.align = it.align || this.opts.align;
            it.verticalAlign = it.verticalAlign || this.opts.verticalAlign;
            it.afterAction = (event, button) => {
                if (this.opts.type === 'radio' && button.opts.type === 'default') {
                    this.buttons.forEach(it => {
                        if (it.opts.type === 'default') {
                            it.active = false;
                        }
                    });

                    if (button.opts.type === 'default') {
                        button.active = true;
                    }
                }
            };

            if (it.tooltip) {
                if (typeof it.tooltip === 'string') {
                    it.tooltip = {content: it.tooltip, container: this};
                } else {
                    it.tooltip = Object.assign({}, {container: this}, it.tooltip);
                }
            }
            
            let button = new Button(it);

            this.addChild(button);
            this.buttons.push(button);

            position += (this.opts.orientation === 'horizontal' ? button.width : button.height) + this.opts.margin;
        }

        if (this.opts.orientation === 'vertical') {
            const maxWidth = this.getMaxButtonWidth();

            this.buttons.forEach(it => {
                it.opts.minWidth = maxWidth;
                it.layout();
            });
        }

        // disabled
        //-----------------
        if (this.opts.disabled != null) {
            this.disabled = this.opts.disabled;
        }

        return this
    }
    
    /**
     * Should be called to refresh the layout of the button group. Can be used after resizing.
     * 
     * @return {ButtonGroup} A reference to the button group for chaining.
     */
    layout() {
        
        // set position
        //-----------------
        this.position.set(this.opts.x, this.opts.y);

        // draw
        //-----------------
        this.draw();

        return this
    }
    
    /**
     * Draws the canvas.
     * 
     * @private
     * @return {ButtonGroup} A reference to the button group for chaining.
     */
    draw() {

        if (this.opts.margin === 0) {

            this.buttons.forEach(it => it.hide());

            this.clear();
            this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
            this.beginFill(this.opts.fill, this.opts.fillAlpha);
            this.drawRoundedRect(0, 0, this.width, this.height, this.opts.radius);

            // Draw borders
            this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha / 2);

            this.buttons.forEach((it, i) => {
                if (i > 0) {
                    this.moveTo(it.x, it.y);

                    if (this.opts.orientation === 'horizontal') {
                        this.lineTo(it.x, it.height);
                    } else {
                        this.lineTo(it.width, it.y);
                    }
                    
                }
            });

            this.endFill();
        }

        return this
    }
    
    /**
     * Gets or sets the disabled state. When disabled, no button of the button group can be clicked.
     * 
     * @member {boolean}
     */
    get disabled() {
        return this._disabled
    }

    set disabled(value) {

        this._disabled = value;

        this.buttons.forEach(it => it.disabled = value);
    }
    
    /**
     * Searches all buttons of the button group and returns the maximum width of one button.
     * 
     * @private
     * @return {number} The maximum with of a button of the button group.
     */
    getMaxButtonWidth() {

        let widths = this.buttons.map(it => it.width);

        return Math.max(...widths)
    }
    
    /**
     * Shows the button group (sets his alpha value to 1).
     * 
     * @return {ButtonGroup} A reference to the button group for chaining.
     */
    show() {

        this.alpha = 1;

        return this
    }

    /**
     * Hides the button group (sets his alpha value to 0).
     * 
     * @return {ButtonGroup} A reference to the button group for chaining.
     */
    hide() {

        this.alpha = 0;

        return this
    }
}

/**
 * Class that represents a PixiJS InteractivePopup.
 * The class is used for various other Popup-like classes
 * like Popup, Message...
 *
 * @class
 * @abstract
 * @extends AbstractPopup
 */
class InteractivePopup extends AbstractPopup {

    /**
     * Creates an instance of an InteractivePopup (only for internal use).
     *
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the popup.
     * @param {boolean} [opts.closeOnPopup=false] - Should the popup be closed when the user clicks on the popup?
     * @param {boolean} [opts.closeButton=true] - Should a close button be displayed on the upper right corner?
     * @param {object} [opts.button] - A Button object to be display on the lower right corner.
     * @param {object} [opts.buttonGroup] - A ButtonGroup object to be displayed on the lower right corner.
     */
    constructor(opts = {}) {

        opts = Object.assign({}, {
            closeOnPopup: false,
            closeButton: true,
            button: null,
            buttonGroup: null
        }, opts);

        super(opts);

        this._closeButton = null;
        this._buttons = null;

        // padding
        this.smallPadding = this.opts.padding / 2;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }

    /**
     * Creates the framework and instantiates everything.
     *
     * @private
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    setup() {

        super.setup();

        // interaction
        //-----------------
        this.on('pointerup', e => {
            if (this.opts.closeOnPopup) {
                this.hide();
            } else {
                e.stopPropagation();
            }
        });

        // closeButton
        //-----------------
        if (this.opts.closeButton) {
            let closeButton = PIXI.Sprite.fromImage('../../assets/icons/png/flat/close.png', true);
            closeButton.width = this.headerStyle.fontSize;
            closeButton.height = closeButton.width;
            closeButton.tint = this.theme.color2;
            // This is needed, because the closeButton belongs to the content. The popup must resize with the closeButton.
            if (this._header) {
                closeButton.x = this._header.width + this.innerPadding;
            } else if (this._content) {
                closeButton.x = this._content.width + this.innerPadding;
            }

            closeButton.interactive = true;
            closeButton.buttonMode = true;
            closeButton.on('pointerdown', e => {
                this.hide();
            });

            this._closeButton = closeButton;
            this.addChild(closeButton);

            // maxWidth is set and a closeButton should be displayed
            //-----------------
            if (this.opts.maxWidth) {
                const wordWrapWidth = this.opts.maxWidth - (2 * this.opts.padding) - this.smallPadding - this._closeButton.width;
                if (this._header) {
                    this.headerStyle.wordWrapWidth = wordWrapWidth;
                } else if (this._content) {
                    this.textStyle.wordWrapWidth = wordWrapWidth;
                }
            }
        }

        // buttons
        //-----------------
        if (this.opts.button || this.opts.buttonGroup) {
            if (this.opts.button) {
                this._buttons = new Button(Object.assign({textStyle: this.theme.textStyleSmall}, this.opts.button));
            } else {
                this._buttons = new ButtonGroup(Object.assign({textStyle: this.theme.textStyleSmall}, this.opts.buttonGroup));
            }
            this.addChild(this._buttons);

            this._buttons.y = this.innerPadding + this.sy;
        }

        return this
    }

    /**
     * Should be called to refresh the layout of the popup. Can be used after resizing.
     *
     * @return {AbstractPopup} A reference to the popup for chaining.
     */
    layout() {

        super.layout();
        
        // closeButton
        //-----------------
        if (this.opts.closeButton) {
            this._closeButton.x = this.wantedWidth - this.smallPadding - this._closeButton.width;
            this._closeButton.y = this.smallPadding;
        }

        // buttons
        //-----------------
        if (this._buttons) {
            this._buttons.x = this.wantedWidth - this.opts.padding - this._buttons.width;
            this._buttons.y = this.wantedHeight - this.opts.padding - this._buttons.height;
        }

        return this
    }

    /**
     * Calculates the size of the children of the AbstractPopup.
     * Cannot use getBounds() because it is not updated when children
     * are removed.
     * 
     * @private
     * @override
     * @returns {object} An JavaScript object width the keys width and height.
     */
    getInnerSize() {

        let size = super.getInnerSize();

        if (this._closeButton) {
            size.width += this.smallPadding + this._closeButton.width;
        }

        if (this._buttons) {
            size.width = Math.max(size.width, this._buttons.x + this._buttons.width);
            size.height += this.innerPadding + this._buttons.height;
        }

        return size
    }
}

/**
 * Class that represents a PixiJS Popup.
 *
 * @example
 * // Create the popup
 * const popup = new Popup({
 *     header: 'Goethe',
 *     content: 'Man kann die Erfahrung nicht früh genug machen, wie entbehrlich man in der Welt ist.'
 * })
 *
 * // Add the popup to a DisplayObject
 * app.scene.addChild(popup)
 *
 * @class
 * @extends InteractivePopup
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/popup.html|DocTest}
 */
class Popup extends InteractivePopup {

    /**
     * Creates an instance of a Popup.
     *
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the popup.
     * @param {boolean} [opts.closeButton=false] - Should a close button be displayed on the upper right corner?
     * @param {number} [opts.minWidth=0] - The minimum width of the popup.
     * @param {number} [opts.minHeight=0] - The minimum height of the popup.
     */
    constructor(opts = {}) {

        opts = Object.assign({}, {
            closeButton: false,
            minWidth: 0,
            minHeight: 0
        }, opts);

        super(opts);
    }
}

/**
 * Class that represents a PixiJS Modal.
 * 
 * @example
 * // Create the button and the modal when clicked
 * const button = new Button({
 *     label: 'Show Modal',
 *     action: e => {
 *         const modal = new Modal({
 *             app: app,
 *             header: 'This is the header',
 *             content: 'This is the text.'
 *         })
 *         app.scene.addChild(modal)
 *     }
 * })
 *
 * // Add the button to a DisplayObject
 * app.scene.addChild(button)
 *
 * @class
 * @extends PIXI.Container
 * @extends InteractivePopup
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/modal.html|DocTest}
 */
class Modal extends PIXI.Container {

    /**
     * Creates an instance of a Modal.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the modal.
     * @param {number} [opts.id=auto generated] - The id of the modal.
     * @param {PIXIApp} [opts.app=window.app] - The app where the modal belongs to.
     * @param {number} [opts.backgroundFill=Theme.background] - The color of the background.
     * @param {number} [opts.backgroundFillAlpha=0.6] - The opacity of the background.
     * @param {boolean} [opts.closeOnBackground=true] - Should the modal be closed when the user clicks the
     *     background?
     * @param {boolean} [opts.visible=true] - Is the modal initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            app: window.app,
            backgroundFill: theme.background,
            backgroundFillAlpha: .6,
            closeOnBackground: true,
            visible: true
        }, opts);

        this.id = this.opts.id;

        this.background = null;
        this.popup = null;

        this.alpha = 0;
        this.visible = this.opts.visible;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Modal} A reference to the modal for chaining.
     */
    setup() {

        // interaction
        //-----------------
        this.interactive = true;
        this.on('added', e => {
            if (this.visible) {
                this.show();
            }
        });

        // background
        //-----------------
        let background = new PIXI.Graphics();
        this.background = background;
        this.addChild(this.background);

        if (this.opts.closeOnBackground) {
            background.interactive = true;
            background.on('pointerup', e => {
                this.hide();
            });
        }

        // popup
        //-----------------
        const popupOpts = Object.assign({}, this.opts, {
            visible: true,
            onHidden: () => {
                this.hide();
            }
        });
        let popup = new InteractivePopup(popupOpts);
        this.popup = popup;
        this.addChild(popup);
        popup.show();

        return this
    }
    
    /**
     * Should be called to refresh the layout of the modal. Can be used after resizing.
     * 
     * @return {Modal} A reference to the modal for chaining.
     */
    layout() {

        const width = this.opts.app.size.width;
        const height = this.opts.app.size.height;

        // background
        //-----------------
        this.background.clear();
        this.background.beginFill(this.opts.backgroundFill, this.opts.backgroundFillAlpha);
        this.background.drawRect(0, 0, width, height);
        this.background.endFill();

        // position
        this.popup.x = width / 2 - this.popup.width / 2;
        this.popup.y = height / 2 - this.popup.height / 2;

        return this
    }
    
    /**
     * Shows the modal (sets his alpha values to 1).
     * 
     * @return {Modal} A reference to the modal for chaining.
     */
    show() {
        TweenMax.to(this, this.theme.fast, {alpha: 1, onStart: () => this.visible = true});

        return this
    }
    
    /**
     * Hides the modal (sets his alpha values to 0).
     * 
     * @return {Modal} A reference to the modal for chaining.
     */
    hide() {
        TweenMax.to(this, this.theme.fast, {alpha: 0, onComplete: () => this.visible = false});

        return this
    }
    
    /**
     * Sets or gets the header. The getter always returns a PIXI.Text object. The setter can receive
     * a string or a PIXI.Text object.
     * 
     * @member {string|PIXI.Text}
     */
    get header() {
        return this.popup.header
    }
    set header(value) {
        this.opts.header = value;
        this.background.destroy();
        this.popup.destroy();
        this.setup().layout();
    }
    
    /**
     * Sets or gets the content. The getter always returns an PIXI.DisplayObject. The setter can receive
     * a string or a PIXI.DisplayObject.
     * 
     * @member {string|PIXI.DisplayObject}
     */
    get content() {
        return this.popup.content
    }
    set content(value) {
        this.opts.content = value;
        this.background.destroy();
        this.popup.destroy();
        this.setup().layout();
    }
}

/**
 * Class that represents a Message. A message pops up and disappears after a specific amount of time.
 * 
 * @example
 * // Create the PixiJS App
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * // Create a button
 * let button = new Button({
 *     label: 'Click me',
 *     action: e => {
 *         const message = new Message({
 *             app: app,
 *             header: 'Header',
 *             content: 'Text.'
 *         })
 *         app.scene.addChild(message)
 *     }
 * })
 * 
 * // Add the button to the scene
 * app.scene.addChild(button)
 *
 * @class
 * @extends InteractivePopup
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/message.html|DocTest}
 */
class Message extends InteractivePopup {

    /**
     * Creates an instance of a Message.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the message.
     * @param {PIXIApp} [opts.app=window.app] - The PIXIApp where this message belongs to.
     * @param {boolean} [opts.closeButton=false] - Should a close button be displayed in the upper right corner?
     * @param {number} [opts.minWidth=280] - The minimum width of the message box. Automatically expands with the content.
     * @param {number} [opts.minHeight=100] - The minimum height of the message box. Automatically expands with the content.
     * @param {number} [opts.margin=Theme.margin] - The outer spacing of the message box.
     * @param {string} [opts.align=right] - The horizontal position of the message box relative to the app. Possible
     *     values are left, center, right.
     * @param {string} [opts.verticalAlign=top] - The vertical position of the message box relative to the app. Possible
     *     values are top, middle, bottom.
     * @param {number} [opts.duration=5] - The duration in seconds when the message box should disappear.
     * @param {boolean} [opts.autoClose=true] - Should the message box be closed automatically?
     * @param {number} [opts.closeDuration=Theme.fast] - The duration in seconds of the closing of the message box.
     */
    constructor(opts = {}) {
        
        const theme = Theme.fromString(opts.theme);

        opts = Object.assign({}, {
            app: window.app,
            closeButton: false,
            minWidth: 280,
            minHeight: 100,
            margin: theme.margin,
            align: 'right',                     // left, center, right
            verticalAlign: 'top',               // top, middle, bottom
            duration: 5,
            autoClose: true,
            closeDuration: theme.fast
        }, opts);

        super(opts);
    }

    /**
     * Relayouts the position of the message box.
     * 
     * @return {Message} Returns the message box for chaining.
     */
    layout() {

        super.layout();

        // horizontal
        switch (this.opts.align) {
            case 'left':
                this.x = this.opts.margin;
                break
            case 'center':
                this.x = (this.opts.app.size.width / 2) - (this.width / 2);
                break
            case 'right':
                this.x = this.opts.app.size.width - this.opts.margin - this.width;
                break
        }

        // vertical
        switch (this.opts.verticalAlign) {
            case 'top':
                this.y = this.opts.margin;
                break
            case 'middle':
                this.y = (this.opts.app.size.height / 2) - (this.height / 2);
                break
            case 'bottom':
                this.y = this.opts.app.size.height - this.opts.margin - this.height;
                break
        }
    }

    /**
     * Shows the message box.
     * 
     * @private
     */
    show() {

        super.show();

        if (this.opts.autoClose) {
            window.setTimeout(() => {
                this.hide();
            }, this.opts.duration * 1000);
        }
    }
}

/* global apollo, subscriptions, gql */

/**
 * A special InteractionManager for fullscreen apps, which may
 * go beyond the limits of WebGL drawing buffers. On Safari and Chrome
 * the drawing buffers are limited to 4096 in width (Safari) or 4096x4096
 * in total buffer size (Chrome). The original InteractionManager.mapPositionToPoint
 * does not work with these extreme sizes which mainly occur if large
 * retina displays (>= 4K) are used with devicePixelRatio > 1.
 *
 * @private
 * @class
 * @extends PIXI.interaction.InteractionManager
 * @see {@link http://pixijs.download/dev/docs/PIXI.interaction.InteractionManager.html|PIXI.interaction.InteractionManager}
 * @see {@link https://stackoverflow.com/questions/29710696/webgl-drawing-buffer-size-does-not-equal-canvas-size}
 */
class FullscreenInteractionManager extends PIXI.interaction.InteractionManager {

    mapPositionToPoint(point, x, y) {
        let resolution = this.renderer.resolution;
        let extendWidth = 1.0;
        let extendHeight = 1.0;
        let dy = 0;
        let canvas = this.renderer.view;
        let context = canvas.getContext('webgl');
        if (context.drawingBufferWidth < canvas.width ||
            context.drawingBufferHeight < canvas.height) {
            extendWidth = context.drawingBufferWidth / canvas.width;
            extendHeight = context.drawingBufferHeight / canvas.height;
            //dx = wantedWidth - context.drawingBufferWidth
            dy = (canvas.height - context.drawingBufferHeight) / resolution;
        }
        x *= extendWidth;
        y *= extendHeight;

        super.mapPositionToPoint(point, x, y + dy);
    }
}

/**
 * The class PixiApp extends the class PIXI.Application
 * by several functions and makes meaningful pre-assumptions.
 *
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 450,
 *     height: 150,
 *     fpsLogging: true,
 *     theme: 'light',
 *     transparent: false
 * }).setup().run()
 *
 * @class
 * @extends PIXI.Application
 * @see {@link http://pixijs.download/dev/docs/PIXI.Application.html|PIXI.Application}
 */
class PIXIApp extends PIXI.Application {

    /**
     * Creates an instance of a PixiApp.
     *
     * @constructor
     * @param {object} [opts={}] - An options object. The following options can be set:
     * @param {number} [opts.width] - The width of the renderer. If no set, the application will run in fullscreen.
     * @param {number} [opts.height] - The height of the renderer. If no set, the application will run in fullscreen.
     * @param {HTMLElement} [opts.view] - The canvas HTML element. If not set, a render-element is added inside the body.
     * @param {boolean} [opts.transparent=true] - Should the render view be transparent?
     * @param {boolean} [opts.antialias=true] - Sets antialias (only applicable in chrome at the moment).
     * @param {number} [opts.resolution=window.devicePixelRatio | 1] - The resolution / device pixel ratio of the renderer, retina would be 2.
     * @param {boolean} [opts.autoResize=true] - Should the canvas-element be resized automatically if the resolution was set?
     * @param {number} [opts.backgroundColor=0x282828] - The color of the background.
     * @param {string|Theme} [opts.theme=dark] - The name of the theme (dark, light, red) or a Theme object to use for styling.
     * @param {boolean} [opts.fpsLogging=false] - If set to true, the current frames per second are displayed in the upper left corner.
     * @param {object} [opts.progress={}] - Can be used to add options to the progress bar. See class Progress for more informations.
     * @param {boolean} [opts.forceCanvas=false] - Prevents selection of WebGL renderer, even if such is present.
     * @param {boolean} [opts.roundPixels=true] - Align PIXI.DisplayObject coordinates to screen resolution.
     * @param {boolean} [opts.monkeyPatchMapping=true] - Monkey patch for canvas fullscreen support on large displays.
     */
    constructor({
        width = null, height = null, view = null,
        transparent = true, backgroundColor = 0x282828, theme = 'dark',
        antialias = true, resolution = window.devicePixelRatio || 1, autoResize = true,
        fpsLogging = false, progress = {}, forceCanvas = false, roundPixels = true, monkeyPatchMapping = true,
        graphql = false}) {

        const fullScreen = !width || !height;

        if (fullScreen) {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        super({
            view: view,
            width: width,
            height: height,
            transparent: transparent,
            antialias: antialias,
            resolution: resolution,
            autoResize: autoResize,
            backgroundColor: backgroundColor,
            roundPixels: roundPixels,
            forceCanvas: forceCanvas
        });

        this.width = width;
        this.height = height;
        this.theme = Theme.fromString(theme);
        this.fpsLogging = fpsLogging;
        this.progressOpts = progress;
        this.fullScreen = fullScreen;
        this.orient = null;
        this.originalMapPositionToPoint = null;
        this.monkeyPatchMapping = monkeyPatchMapping;
        this.graphql = graphql;
        if (fullScreen) {
            console.log('App is in fullScreen mode');
            window.addEventListener('resize', this.resize.bind(this));
            document.body.addEventListener('orientationchange', this.checkOrientation.bind(this));
        }
        if (monkeyPatchMapping) {
            console.log('Using monkey patched coordinate mapping');
            // Pluggin the specializtion does not work. Monkey patching does
            // this.renderer.plugins.interaction = new FullscreenInteractionManager(this.renderer)
            this.monkeyPatchPixiMapping();
        }
    }

    /**
     * Extra setup method to construct complex scenes, etc...
     * Overwrite this method if you need additonal views and components.
     *
     * @return {PIXIApp} A reference to the PIXIApp for chaining.
     */
    setup() {
        this.scene = this.sceneFactory();
        this.stage.addChild(this.scene);

        // fpsLogging
        if (this.fpsLogging) {
            this.addFpsDisplay();
        }

        // GraphQL
        if (this.graphql && typeof apollo !== 'undefined') {

            const networkInterface = apollo.createNetworkInterface({
                uri: '/graphql'
            });

            const wsClient = new subscriptions.SubscriptionClient(`wss://${location.hostname}/subscriptions`, {
                reconnect: true,
                connectionParams: {}
            });

            const networkInterfaceWithSubscriptions = subscriptions.addGraphQLSubscriptions(
                networkInterface,
                wsClient
            );

            this.apolloClient = new apollo.ApolloClient({
                networkInterface: networkInterfaceWithSubscriptions
            });
        }

        // progress
        this._progress = new Progress(Object.assign({theme: this.theme}, this.progressOpts, {app: this}));
        this._progress.visible = false;
        this.stage.addChild(this._progress);

        return this
    }

    /**
     * Tests whether the width is larger than the height of the application.
     *
     * @return {boolean} Returns true if app is in landscape mode.
     */
    orientation() {
        return this.width > this.height
    }

    /**
     * Checks orientation and adapts view size if necessary. Implements a
     * handler for the orientationchange event.
     *
     * @param {event=} - orientationchange event
     */
    checkOrientation(event) {
        var value = this.orientation();
        if (value != this.orient) {
            setTimeout(100, function() {
                this.orientationChanged(true);
            }.bind(this));
            this.orient = value;
        }
    }

    /**
     * Called if checkOrientation detects an orientation change event.
     *
     * @param {boolean=} [force=false] - Called if checkOrientation detects an orientation change event.
     */
    orientationChanged(force=false) {
        if (this.expandRenderer() || force) {
            this.layout();
        }
    }

    /**
     * Called after a resize. Empty method but can be overwritten to
     * adapt their layout to the new app size.
     *
     * @param {number} [width] - The width of the app.
     * @param {number} [height] - The height of the app.
     */
    layout(width, height) {

    }

    /**
     * Draws the display tree of the app. Typically this can be delegated
     * to the layout method.
     *
     */
    draw() {
        this.layout(this.width, this.height);
    }

    /*
     * Run the application. Override this method with everything
     * that is needed to maintain your App, e.g. setup calls, main loops, etc.
     *
     */
    run() {
        return this
    }

    /*
     * Overwrite this factory method if your application needs a special
     * scene object.
     *
     * @returns {PIXI.Container} - A new PIXI Container for use as a scene.
     */
    sceneFactory() {
        return new PIXI.Container()
    }

    /**
     * Adds the display of the frames per second to the renderer in the upper left corner.
     *
     * @return {PIXIApp} - Returns the PIXIApp for chaining.
     */
    addFpsDisplay() {
        const fpsDisplay = new FpsDisplay(this);
        this.stage.addChild(fpsDisplay);

        return this
    }

    /**
     * Returns the size of the renderer as an object with the keys width and height.
     *
     * @readonly
     * @member {object}
     */
    get size() {
        return {width: this.width, height: this.height}
    }

    /**
     * Returns the center of the renderer as an object with the keys x and y.
     *
     * @readonly
     * @member {object}
     */
    get center() {
        return {x: this.width / 2, y: this.height / 2}
    }

    /**
     * Resizes the renderer to fit into the window or given width and height.
     *
     * @param {object} [event] - The event.
     * @param {object=} [opts={}] - The event.
     * @param {number} [opts.width=window.innerWidth] - The width of the app to resize to.
     * @param {number} [opts.height=window.innerHeight] - The height of the app to resize to.
     * @return {PIXIApp} - Returns the PIXIApp for chaining.
     */
    resize(event, {width = window.innerWidth, height = window.innerHeight} = {}) {
        this.width = width;
        this.height = height;
        this.expandRenderer();
        this.layout(width, height);
        // if (this.scene) {
        // console.log("gl.drawingBufferWidth", this.renderer.view.getContext('webgl').drawingBufferWidth)
        // console.log("scene", this.scene.scale, this.renderer, this.renderer.autoResize, this.renderer.resolution)
        // }
        return this
    }

    /**
     * @todo Write the documentation.
     *
     * @private
     */
    monkeyPatchPixiMapping() {
        if (this.originalMapPositionToPoint === null) {
            let interactionManager = this.renderer.plugins.interaction;
            this.originalMapPositionToPoint = interactionManager.mapPositionToPoint;
            interactionManager.mapPositionToPoint = (point, x, y) => {
                return this.fixedMapPositionToPoint(point, x, y)
            };
        }
    }

    /**
     * @todo Write the documentation.
     *
     * @private
     * @param {any} local
     * @param {number} x
     * @param {number} y
     * @return {} interactionManager.mapPositionToPoint
     */
    fixedMapPositionToPoint(local, x, y) {
        let resolution = this.renderer.resolution;
        let interactionManager = this.renderer.plugins.interaction;
        let extendWidth = 1.0;
        let extendHeight = 1.0;
        let dy = 0;
        let canvas = this.renderer.view;
        let context = canvas.getContext('webgl');

        if (context !== null && (context.drawingBufferWidth < canvas.width ||
            context.drawingBufferHeight < canvas.height)) {
            extendWidth = context.drawingBufferWidth / canvas.width;
            extendHeight = context.drawingBufferHeight / canvas.height;
            //dx = wantedWidth - context.drawingBufferWidth
            dy = (canvas.height - context.drawingBufferHeight) / resolution;
        }
        x *= extendWidth;
        y *= extendHeight;
        return this.originalMapPositionToPoint.call(interactionManager, local, x, y + dy)
    }

    /**
     * Expand the renderer step-wise on resize.
     *
     * @param {number} [expand] - The amount of additional space for the renderer [px].
     * @return {boolean} true if the renderer was resized.
     */
    expandRenderer(expand=256) {
        let renderer = this.renderer;
        let resolution = this.renderer.resolution;
        let ww = this.width;
        let hh = this.height;
        let sw = this.screen.width;
        let sh = this.screen.height;
        if (ww > sw || hh > sh) {
            console.log('App.expandRenderer');
            renderer.resize(ww + expand, hh + expand);
            return true
        }

        renderer.resize(ww, hh);
        return false
    }

    /**
     * Set the loading progress of the application. If called for the first time, display the progress bar.
     *
     * @param {number} [value] - Should be a value between 0 and 100. If 100, the progress bar will disappear.
     * @return {PIXIApp|Progress} The PixiApp object for chaining or the Progress object when the method was
     *     called without a parameter.
     */
    progress(value) {

        if (typeof value === 'undefined') {
            return this._progress
        }

        this._progress.visible = true;
        this._progress.progress = value;

        return this
    }

    /**
     * Opens a new Modal object binded to this app.
     *
     * @param {object} [opts] - An options object for the Modal object.
     * @return {Modal} Returns the Modal object.
     */
    modal(opts = {}) {

        let modal = new Modal(Object.assign({theme: this.theme}, opts, {app: this}));
        this.scene.addChild(modal);

        return modal
    }

    /**
     * Opens a new Message object binded to this app.
     *
     * @param {object} [opts] - An options object for the Message object.
     * @return {Message} Returns the Message object.
     */
    message(opts = {}) {

        let message = new Message(Object.assign({theme: this.theme}, opts, {app: this}));
        this.scene.addChild(message);

        return message
    }

    /**
     * Loads sprites, e.g. images into the PIXI TextureCache.
     *
     * @param {string|string[]} resources - A String or an Array of urls to the images to load.
     * @param {function} [loaded] - A callback which is executed after all resources has been loaded.
     *     Receives one paramter, a Map of sprites where the key is the path of the image which was
     *     loaded and the value is the PIXI.Sprite object.
     * @param {object} [opts] - An options object for more specific parameters.
     * @param {boolean} [opts.resolutionDependent=true] - Should the sprites be loaded dependent of the
     *     renderer resolution?
     * @param {boolean} [opts.progress=false] - Should a progress bar display the loading status?
     * @return {PIXIApp} The PIXIApp object for chaining.
     */
    loadSprites(resources, loaded = null, {resolutionDependent = true, progress = false} = {}) {

        this.loadTextures(resources, textures => {

            let sprites = new Map();

            for (let [key, texture] of textures) {
                sprites.set(key, new PIXI.Sprite(texture));
            }

            if (loaded) {
                loaded.call(this, sprites);
            }

        }, {resolutionDependent, progress});

        return this
    }

    /**
     * Loads textures, e.g. images into the PIXI TextureCache.
     *
     * @param {string|string[]} resources - A String or an Array of urls to the images to load.
     * @param {function} [loaded] - A callback which is executed after all resources has been loaded.
     *     Receives one paramter, a Map of sprites where the key is the path of the image which was
     *     loaded and the value is the PIXI.Sprite object.
     * @param {object} [opts] - An options object for more specific parameters.
     * @param {boolean} [opts.resolutionDependent=true] - Should the textures be loaded dependent of the
     *     renderer resolution?
     * @param {boolean} [opts.progress=false] - Should a progress bar display the loading status?
     * @return {PIXIApp} The PIXIApp object for chaining.
     */
    loadTextures(resources, loaded = null, {resolutionDependent = true, progress = false} = {}) {

        if (!Array.isArray(resources)) {
            resources = [resources];
        }

        const loader = this.loader;

        for (let resource of resources) {

            if (!loader.resources[resource]) {
                
                if (resolutionDependent) {
                    let resolution = Math.round(this.renderer.resolution);
                    switch (resolution) {
                        case 2:
                            loader.add(resource, resource.replace(/\.([^.]*)$/, '@2x.$1'));
                            break
                        case 3:
                            loader.add(resource, resource.replace(/\.([^.]*)$/, '@3x.$1'));
                            break
                        default:
                            loader.add(resource);
                            break
                    }
                } else {
                    loader.add(resource);
                }
            }
        }

        if (progress) {
            loader.on('progress', e => {
                this.progress(e.progress);
            });
        }

        loader.load((loader, resources) => {
            const textures = new Map();

            for (let key in resources) {
                textures.set(key, resources[key].texture);
            }

            if (loaded) {
                loaded.call(this, textures);
            }
        });

        return this
    }

    /**
     * Queries the GraphQL endpoint.
     *
     * @param {string} [query] - The GraphQL query string.
     * @param {object} [opts={}] - An options object. The following options can be set:
     *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query
     * @return {Promise} Returns a Promise which is either resolved with the resulting data or
     *     rejected with an error.
     */
    query(query, opts = {}) {

        if (typeof query === 'string') {
            opts = Object.assign({}, opts, {query});
        } else {
            opts = Object.assign({}, query);
        }

        opts.query = opts.query.trim();

        if (!opts.query.startsWith('query')) {
            if (opts.query.startsWith('{')) {
                opts.query = `query ${opts.query}`;
            } else {
                opts.query = `query {${opts.query}}`;
            }
        }

        opts.query = gql(opts.query);

        return this.apolloClient.query(opts)
    }

    /**
     * Mutate the GraphQL endpoint.
     *
     * @param {string} [mutation] - The GraphQL mutation string.
     * @param {object} [opts={}] - An options object. The following options can be set:
     *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.mutate
     * @return {Promise} Returns a Promise which is either resolved with the resulting data or
     *     rejected with an error.
     */
    mutate(mutation, opts = {}) {

        if (typeof mutation === 'string') {
            opts = Object.assign({}, opts, {mutation});
        } else {
            opts = Object.assign({}, mutation);
        }

        opts.mutation = opts.mutation.trim();

        if (!opts.mutation.startsWith('mutation')) {
            if (opts.mutation.startsWith('{')) {
                opts.mutation = `mutation ${opts.mutation}`;
            } else {
                opts.mutation = `mutation {${opts.mutation}}`;
            }
        }

        opts.mutation = gql(opts.mutation);

        return this.apolloClient.mutate(opts)
    }

    /**
     * Subscribe the GraphQL endpoint.
     *
     * @param {string} [subscription] - The GraphQL subscription.
     * @param {object} [opts={}] - An options object. The following options can be set:
     *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query
     * @return {Promise} Returns a Promise which is either resolved with the resulting data or
     *     rejected with an error.
     */
    subscribe(subscription, opts = {}) {

        if (typeof subscription === 'string') {
            opts = Object.assign({}, opts, {subscription});
        } else {
            opts = Object.assign({}, subscription);
        }

        opts.subscription = opts.subscription.trim();

        if (!opts.subscription.startsWith('subscription')) {
            if (opts.subscription.startsWith('{')) {
                opts.subscription = `subscription ${opts.subscription}`;
            } else {
                opts.subscription = `subscription {${opts.subscription}}`;
            }
        }

        opts.query = gql(opts.subscription);

        delete opts.subscription;

        return this.apolloClient.subscribe(opts)
    }
}

/**
 * The class fpsdisplay shows in the upper left corner
 * of the renderer the current image refresh rate.
 *
 * @private
 * @class
 * @extends PIXI.Graphics
 * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
 */
class FpsDisplay extends PIXI.Graphics {

    /**
     * Creates an instance of a FpsDisplay.
     *
     * @constructor
     * @param {PIXIApp} app - The PIXIApp where the frames per second should be displayed.
     */
    constructor(app) {

        super();

        this.app = app;

        this.lineStyle(3, 0x434f4f, 1)
            .beginFill(0x434f4f, .6)
            .drawRoundedRect(0, 0, 68, 32, 5)
            .endFill()
            .position.set(20, 20);

        this.text = new PIXI.Text(this.fps, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#f6f6f6',
            stroke: '#434f4f',
            strokeThickness: 3
        }));
        this.text.position.set(6, 6);

        this.addChild(this.text);

        this.refreshFps();

        window.setInterval(this.refreshFps.bind(this), 1000);
    }

    /**
     * Refreshes fps numer.
     *
     * @return {PIXIApp} Returns the PIXIApp object for chaining.
     */
    refreshFps() {
        this.text.text = `${(this.app.ticker.FPS).toFixed(1)} fps`;

        return this
    }
}

/**
 * A Gaussian blur filter. With this filter, you can blur an area of a PIXI.DisplayObject. This cannot
 * be done with the PIXI.filters.BlurFilter (when you use the PIXI.filters.BlurFilter with
 * an filter area, all pixels outside of the area are not displayed). Attention: The area of
 * the filter is always in global scope, NOT relative to the PIXI.DisplayObject the filter
 * is assigned to!
 *
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 480,
 *     height: 270,
 *     transparent: false
 * }).setup().run()
 * 
 * // Add a video sprite
 * const sprite = new PIXI.Sprite(PIXI.Texture.fromVideo("assets/blurfilter.mp4"))
 * sprite.width = app.size.width
 * sprite.height = app.size.height
 * app.scene.addChild(sprite)
 * 
 * // Create the filter and assign it to the scene
 * const blurFilter = new BlurFilter(new PIXI.Rectangle(20, 20, 80, 60))
 * app.scene.filters = [blurFilter]
 * 
 * @class
 * @extends PIXI.Filter
 * @param {PIXI.Rectangle|PIXI.DisplayObject} rectangle The area where the blur effect should be applied to. Relative to the
 *     canvas, NOT relative to the PIXI.DisplayObject where the blur effect is assigned to!
 * @param {number} [blur=50] The strength of the blur.
 */
class BlurFilter extends PIXI.Filter {
    
    constructor(rectangle, blur = 50) {
        super();

        if (rectangle instanceof PIXI.DisplayObject) {
            rectangle = rectangle.getBounds();
        }

        this.tiltShiftXFilter = new TiltShiftXFilter(rectangle, blur);
        this.tiltShiftYFilter = new TiltShiftYFilter(rectangle, blur);
    }

    apply(filterManager, input, output) {
        let renderTarget = filterManager.getRenderTarget(true);
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output);
        filterManager.returnRenderTarget(renderTarget);
        //console.log(filterManager)
    }

    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    get blur() {
        return this.tiltShiftXFilter.blur
    }
    set blur(value) {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    }
    
    /**
     * The blur rectangle.
     *
     * @member {PIXI.Rectangle}
     */
    get rectangle() {
        return this.tiltShiftXFilter.rectangle
    }
    set rectangle(value) {
        
        if (value instanceof PIXI.DisplayObject) {
            value = value.getBounds();
        }

        this.tiltShiftXFilter.rectangle = this.tiltShiftYFilter.rectangle = value;
    }
}

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @abstract
 * @private
 */
class TiltShiftAxisFilter extends PIXI.Filter {

    constructor(rectangle, blur){

        const vertex = `
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;

            uniform mat3 projectionMatrix;

            varying vec2 vTextureCoord;

            void main(void) {
                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                vTextureCoord = aTextureCoord;
            }
        `;

        const fragment = `
            varying vec2 vTextureCoord;

            uniform vec4 filterArea;
            uniform sampler2D uSampler;
            uniform vec4 rectangle;
            uniform float blur;
            uniform vec2 delta;
            uniform vec2 texSize;

            float random(vec3 scale, float seed) {
                return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
            }

            void main(void) {
                // textureCoord to pixelCoord
                vec2 pixelCoord = vTextureCoord * filterArea.xy - vec2(4.0, 4.0);   // FIXME: There's a shift of 4 * 4 pixels, don't know why...

                if (pixelCoord.x >= rectangle.x && pixelCoord.x <= rectangle.z && pixelCoord.y >= rectangle.y && pixelCoord.y <= rectangle.w) {
                    vec4 color = vec4(0.0);
                    float total = 0.0;

                    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

                    for (float t = -30.0; t <= 30.0; t++) {
                        float percent = (t + offset - 0.5) / 30.0;
                        float weight = 1.0 - abs(percent);
                        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * blur);
                        sample.rgb *= sample.a;
                        color += sample * weight;
                        total += weight;
                    }

                    gl_FragColor = color / total;
                    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
                } else {
                    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                }
            }
        `;

        super(vertex, fragment);

        this.uniforms.rectangle = [rectangle.left, rectangle.top, rectangle.right, rectangle.bottom];
        this.uniforms.blur = blur;
        this.uniforms.delta = new PIXI.Point(0, 0);
        this.uniforms.texSize = new PIXI.Point(480, 270);

        this.updateDelta();
    }

    /**
     * The strength of the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get blur() {
        return this.uniforms.blur
    }
    set blur(value) {
        this.uniforms.blur = value;
    }
    
    /**
     * The blur rectangle.
     *
     * @member {PIXI.Rectangle}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get rectangle() {
        const rect = this.uniforms.rectangle;
        return new PIXI.Rectangle(rect[0], rect[1], rect[2], rect[3])
    }
    set rectangle(value) {
        this.uniforms.rectangle = [value.left, value.top, value.right, value.bottom];
    }
}

/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @private
 */
class TiltShiftXFilter extends TiltShiftAxisFilter {
    /**
     * Updates the filter delta values.
     */
    updateDelta() {
        this.uniforms.delta.x = 0.1;
        this.uniforms.delta.y = 0;
    }
}

/**
 * A TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @private
 */
class TiltShiftYFilter extends TiltShiftAxisFilter {
    /**
     * Updates the filter delta values.
     */
    updateDelta() {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0.1;
    }
}

/* globals WebKitPoint */

/** Tests whether an object is empty
 * @param {Object} obj - the object to be tested
 * @return {boolean}
 */
function isEmpty(obj) {
    // > isEmpty({})
    // true
    for (let i in obj) {
        return false
    }
    return true
}

/** Returns a universal unique id
 * @return {string}
 * See https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/21963136#21963136
 */


function lerp(start, stop, amt) {
    return amt * (stop - start) + start
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Taken from: https://davidwalsh.name/essential-javascript-functions


/** Returns an id that is guaranteed to be unique within the livetime of the
 * application
 * @return {string}
 */
let _idGenerator = 0;
function getId() {
    return 'id' + _idGenerator++
}

class Dates {
    static create(fullYear, month, day) {
        return new Date(Date.UTC(fullYear, month, day))
    }

    static daysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    static nextYear(date, offset = 1) {
        return this.create(date.getFullYear() + offset, 0, 1)
    }

    static nextMonth(date) {
        return this.create(date.getFullYear(), date.getMonth() + 1, 1)
    }

    static nextDay(date) {
        return this.create(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        )
    }

    static nextHour(date) {
        // See http://stackoverflow.com/questions/1050720/adding-hours-to-javascript-date-object
        return new Date(date.getTime() + 60 * 60 * 1000)
    }

    static nextMinute(date) {
        // See above
        return new Date(date.getTime() + 60 * 1000)
    }

    static nextSecond(date) {
        // See above
        return new Date(date.getTime() + 1000)
    }

    static nextMillisecond(date) {
        // See above
        return new Date(date.getTime() + 1)
    }

    static *iterYears(start, end) {
        let date = this.create(start.getFullYear(), 0, 1);
        while (date <= end) {
            yield date;
            date = this.nextYear(date);
        }
        yield date;
    }

    static *iterMonths(year, limit = 12) {
        let month = 0;
        while (month < limit) {
            let date = this.create(year.getFullYear(), month, 1);
            yield date;
            month += 1;
        }
    }

    static *iterMonthsOfYears(years) {
        for (let year of years) {
            for (let month of this.iterMonths(year)) {
                yield month;
            }
        }
    }

    static *iterDays(month) {
        let day = 1;
        let limit = Dates.daysInMonth(month);
        while (day <= limit) {
            let date = this.create(month.getFullYear(), month.getMonth(), day);
            yield date;
            day += 1;
        }
    }

    static *iterDaysOfMonths(months) {
        for (let month of months) {
            for (let day of this.iterDays(month)) {
                yield day;
            }
        }
    }
}
/* Color conversion functions */

class Colors {
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    static rgb2num(red, green, blue) {
        let rgb = blue | (green << 8) | (red << 16);
        return 0x000000 + rgb
    }

    static rgb2hex(red, green, blue) {
        let rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }

    static hex2rgb(hex) {
        // long version
        let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (r) {
            return r.slice(1, 4).map(x => {
                return parseInt(x, 16)
            })
        }
        // short version
        r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (r) {
            return r.slice(1, 4).map(x => {
                return 0x11 * parseInt(x, 16)
            })
        }
        return null
    }

    static rgb(r, g, b) {
        return {r, g, b}
    }

    static lerp(rgb1, rgb2, amount) {
        return {
            r: Math.round(lerp(rgb1.r, rgb2.r, amount)),
            g: Math.round(lerp(rgb1.g, rgb2.g, amount)),
            b: Math.round(lerp(rgb1.b, rgb2.b, amount))
        }
    }

    static get violet() {
        return Colors.rgb2num(89, 34, 131)
    }

    static get steelblue() {
        return Colors.rgb2num(0, 130, 164)
    }

    static get ochre() {
        return Colors.rgb2num(181, 157, 0)
    }

    static get turquoise() {
        return Colors.rgb2num(34, 164, 131)
    }

    static get eminence() {
        return Colors.rgb2num(150, 60, 134)
    }
}

class Cycle extends Array {
    constructor(...items) {
        super();
        for (let item of items) {
            this.push(item);
        }
        this.index = 0;
    }

    next() {
        if (this.index == this.length) {
            this.index = 0;
        }
        return this[this.index++]
    }

    current() {
        if (this.index === this.length) {
            this.index = 0;
        }
        return this[this.index]
    }
}

/** Static methods to compute 2D points with x and y coordinates.
 */
class Points {
    static length(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y)
    }

    static normalize(p) {
        let len = this.length(p);
        return this.multiplyScalar(p, 1 / len)
    }

    static mean(a, b) {
        return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
    }

    static subtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y}
    }

    static multiply(a, b) {
        return {x: a.x * b.x, y: a.y * b.y}
    }

    static multiplyScalar(a, b) {
        return {x: a.x * b, y: a.y * b}
    }

    static add(a, b) {
        return {x: a.x + b.x, y: a.y + b.y}
    }

    static negate(p) {
        return {x: -p.x, y: -p.y}
    }

    static angle(p1, p2) {
        return Math.atan2(p1.y - p2.y, p1.x - p2.x)
    }

    static arc(p, alpha, radius) {
        return {
            x: p.x + radius * Math.cos(alpha),
            y: p.y + radius * Math.sin(alpha)
        }
    }

    static distance(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy)
    }

    static fromPageToNode(element, p) {
        //    if (window.webkitConvertPointFromPageToNode) {
        //             return window.webkitConvertPointFromPageToNode(element,
        //                                                     new WebKitPoint(p.x, p.y))
        //         }
        return window.convertPointFromPageToNode(element, p.x, p.y)
    }

    static fromNodeToPage(element, p) {
        //  if (window.webkitConvertPointFromNodeToPage) {
        //             return window.webkitConvertPointFromNodeToPage(element,
        //                                                     new WebKitPoint(p.x, p.y))
        //         }
        return window.convertPointFromNodeToPage(element, p.x, p.y)
    }
}

/** Static methods to compute angles.
 */
class Angle {
    static normalize(angle) {
        let twoPI = Math.PI * 2.0;
        while (angle > Math.PI) {
            angle -= twoPI;
        }
        while (angle < -Math.PI) {
            angle += twoPI;
        }
        return angle
    }

    static normalizeDegree(angle) {
        let full = 360.0;
        while (angle > 180.0) {
            angle -= full;
        }
        while (angle < -180.0) {
            angle += full;
        }
        return angle
    }

    static diff(a, b) {
        return Angle.normalize(Math.atan2(Math.sin(a - b), Math.cos(a - b)))
    }

    static degree2radian(degree) {
        return Math.PI * degree / 180.0
    }

    static radian2degree(rad) {
        return 180.0 / Math.PI * rad
    }
}

class Elements$1 {
    static setStyle(element, styles) {
        for (let key in styles) {
            element.style[key] = styles[key];
        }
    }

    static addClass(element, cssClass) {
        element.classList.add(cssClass);
    }

    static removeClass(element, cssClass) {
        element.classList.remove(cssClass);
    }

    static toggleClass(element, cssClass) {
        element.classList.toggle(cssClass);
    }

    static hasClass(element, cssClass) {
        return element.classList.contains(cssClass)
    }
}

class MapProxy {
    /* This class is needed if we want to use the interaction classes
    in Firefox 45.8 and modern Browsers.

    A workaround for https://github.com/babel/babel/issues/2334
  */
    constructor() {
        this.map = new Map();
    }

    get size() {
        return this.map.size
    }

    get(key) {
        return this.map.get(key)
    }

    set(key, value) {
        return this.map.set(key, value)
    }

    delete(key) {
        return this.map.delete(key)
    }

    clear() {
        return this.map.clear()
    }

    has(key) {
        return this.map.has(key)
    }

    keys() {
        return this.map.keys()
    }

    values() {
        return this.map.values()
    }

    entries() {
        return this.map.entries()
    }

    forEach(func) {
        this.map.forEach(func);
    }
}

/* Based om https://gist.github.com/cwleonard/e124d63238bda7a3cbfa */
class Polygon {
    /*
     *  This is the Polygon constructor. All points are center-relative.
     */
    constructor(center) {
        this.points = new Array();
        this.center = center;
    }

    /*
     *  Point x and y values should be relative to the center.
     */
    addPoint(p) {
        this.points.push(p);
    }

    /*
     *  Point x and y values should be absolute coordinates.
     */
    addAbsolutePoint(p) {
        this.points.push({x: p.x - this.center.x, y: p.y - this.center.y});
    }

    /*
     * Returns the number of sides. Equal to the number of vertices.
     */
    getNumberOfSides() {
        return this.points.length
    }

    /*
     * rotate the polygon by a number of radians
     */
    rotate(rads) {
        for (let i = 0; i < this.points.length; i++) {
            let x = this.points[i].x;
            let y = this.points[i].y;
            this.points[i].x = Math.cos(rads) * x - Math.sin(rads) * y;
            this.points[i].y = Math.sin(rads) * x + Math.cos(rads) * y;
        }
    }

    /*
     *  The draw function takes as a parameter a Context object from
     *  a Canvas element and draws the polygon on it.
     */
    draw(context, {lineWidth = 2, stroke = '#000000', fill = null} = {}) {
        context.beginPath();
        context.moveTo(
            this.points[0].x + this.center.x,
            this.points[0].y + this.center.y
        );
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(
                this.points[i].x + this.center.x,
                this.points[i].y + this.center.y
            );
        }
        context.closePath();
        context.lineWidth = lineWidth;
        if (stroke) {
            context.strokeStyle = stroke;
            context.stroke();
        }
        if (fill) {
            context.fillStyle = fill;
            context.fill();
        }
    }

    absolutePoints() {
        let result = new Array();
        for (let p of this.points) {
            result.push(Points.add(p, this.center));
        }
        return result
    }

    flatAbsolutePoints() {
        let result = new Array();
        for (let p of this.points) {
            let a = Points.add(p, this.center);
            result.push(a.x);
            result.push(a.y);
        }
        return result
    }

    /*
     *  This function returns true if the given point is inside the polygon,
     *  and false otherwise.
     */
    containsPoint(pnt) {
        let nvert = this.points.length;
        let testx = pnt.x;
        let testy = pnt.y;

        let vertx = new Array();
        for (let q = 0; q < this.points.length; q++) {
            vertx.push(this.points[q].x + this.center.x);
        }

        let verty = new Array();
        for (let w = 0; w < this.points.length; w++) {
            verty.push(this.points[w].y + this.center.y);
        }

        let i,
            j = 0;
        let c = false;
        for (i = 0, j = nvert - 1; i < nvert; j = i++) {
            if (
                verty[i] > testy != verty[j] > testy &&
                testx <
                    (vertx[j] - vertx[i]) *
                        (testy - verty[i]) /
                        (verty[j] - verty[i]) +
                        vertx[i]
            )
                c = !c;
        }
        return c
    }

    multiplyScalar(scale) {
        let center = Points.multiplyScalar(this.center, scale);
        let clone = new Polygon(center);
        for (let p of this.points) {
            clone.addPoint(Points.multiplyScalar(p, scale));
        }
        return clone
    }

    /*
     *  To detect intersection with another Polygon object, this
     *  function uses the Separating Axis Theorem. It returns false
     *  if there is no intersection, or an object if there is. The object
     *  contains 2 fields, overlap and axis. Moving the polygon by overlap
     *  on axis will get the polygons out of intersection.
     */
    intersectsWith(other) {
        let axis = {x: 0, y: 0};
        let tmp, minA, maxA, minB, maxB;
        let side, i;
        let smallest = null;
        let overlap = 99999999;

        /* test polygon A's sides */
        for (side = 0; side < this.getNumberOfSides(); side++) {
            /* get the axis that we will project onto */
            if (side == 0) {
                axis.x =
                    this.points[this.getNumberOfSides() - 1].y -
                    this.points[0].y;
                axis.y =
                    this.points[0].x -
                    this.points[this.getNumberOfSides() - 1].x;
            } else {
                axis.x = this.points[side - 1].y - this.points[side].y;
                axis.y = this.points[side].x - this.points[side - 1].x;
            }

            /* normalize the axis */
            tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
            axis.x /= tmp;
            axis.y /= tmp;

            /* project polygon A onto axis to determine the min/max */
            minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
            for (i = 1; i < this.getNumberOfSides(); i++) {
                tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                if (tmp > maxA) maxA = tmp;
                else if (tmp < minA) minA = tmp;
            }
            /* correct for offset */
            tmp = this.center.x * axis.x + this.center.y * axis.y;
            minA += tmp;
            maxA += tmp;

            /* project polygon B onto axis to determine the min/max */
            minB = maxB =
                other.points[0].x * axis.x + other.points[0].y * axis.y;
            for (i = 1; i < other.getNumberOfSides(); i++) {
                tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                if (tmp > maxB) maxB = tmp;
                else if (tmp < minB) minB = tmp;
            }
            /* correct for offset */
            tmp = other.center.x * axis.x + other.center.y * axis.y;
            minB += tmp;
            maxB += tmp;

            /* test if lines intersect, if not, return false */
            if (maxA < minB || minA > maxB) {
                return false
            } else {
                let o = maxA > maxB ? maxB - minA : maxA - minB;
                if (o < overlap) {
                    overlap = o;
                    smallest = {x: axis.x, y: axis.y};
                }
            }
        }

        /* test polygon B's sides */
        for (side = 0; side < other.getNumberOfSides(); side++) {
            /* get the axis that we will project onto */
            if (side == 0) {
                axis.x =
                    other.points[other.getNumberOfSides() - 1].y -
                    other.points[0].y;
                axis.y =
                    other.points[0].x -
                    other.points[other.getNumberOfSides() - 1].x;
            } else {
                axis.x = other.points[side - 1].y - other.points[side].y;
                axis.y = other.points[side].x - other.points[side - 1].x;
            }

            /* normalize the axis */
            tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
            axis.x /= tmp;
            axis.y /= tmp;

            /* project polygon A onto axis to determine the min/max */
            minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
            for (i = 1; i < this.getNumberOfSides(); i++) {
                tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                if (tmp > maxA) maxA = tmp;
                else if (tmp < minA) minA = tmp;
            }
            /* correct for offset */
            tmp = this.center.x * axis.x + this.center.y * axis.y;
            minA += tmp;
            maxA += tmp;

            /* project polygon B onto axis to determine the min/max */
            minB = maxB =
                other.points[0].x * axis.x + other.points[0].y * axis.y;
            for (i = 1; i < other.getNumberOfSides(); i++) {
                tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                if (tmp > maxB) maxB = tmp;
                else if (tmp < minB) minB = tmp;
            }
            /* correct for offset */
            tmp = other.center.x * axis.x + other.center.y * axis.y;
            minB += tmp;
            maxB += tmp;

            /* test if lines intersect, if not, return false */
            if (maxA < minB || minA > maxB) {
                return false
            } else {
                let o = maxA > maxB ? maxB - minA : maxA - minB;
                if (o < overlap) {
                    overlap = o;
                    smallest = {x: axis.x, y: axis.y};
                }
            }
        }
        return {overlap: overlap + 0.001, axis: smallest}
    }

    static fromPoints(points) {
        let min = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
        let max = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
        for (let p of points) {
            min.x = Math.min(p.x, min.x);
            max.x = Math.max(p.x, max.x);
            min.y = Math.min(p.y, min.y);
            max.y = Math.max(p.y, max.y);
        }
        let center = Points.mean(min, max);
        let polygon = new Polygon(center);
        for (let p of points) {
            polygon.addAbsolutePoint(p);
        }
        return polygon
    }
}

class Events$1 {

    static stop(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    static extractPoint(event) {
        switch(event.constructor.name) {
            case 'TouchEvent':
                for (let i=0; i<event.targetTouches.length; i++) {
                    let t = event.targetTouches[i];
                    return {x: t.clientX, y: t.clientY}
                }
                break
            default:
                return {x: event.clientX, y: event.clientY}
        }
    }

    static isMouseDown(event) {
        // Attempts to clone the which attribute of events failed in WebKit. May
        // be this is a bug or a security feature. Workaround: we introduce
        // a mouseDownSubstitute attribute that can be assigned to cloned
        // events after instantiation.
        if (Reflect.has(event, 'mouseDownSubstitute'))
            return event.mouseDownSubstitute
        return event.buttons || event.which
    }

    static extractTouches(targets) {
        let touches = [];
        for (let i=0; i<targets.length; i++) {
            let t = targets[i];
            touches.push({
                targetSelector: this.selector(t.target),
                identifier: t.identifier,
                screenX: t.screenX,
                screenY: t.screenY,
                clientX: t.clientX,
                clientY: t.clientY,
                pageX: t.pageX,
                pageY: t.pageY
            });
        }
        return touches
    }

    static createTouchList(targets) {
        let touches = [];
        for (let i=0; i<targets.length; i++) {
            let t = targets[i];
            let touchTarget = document.elementFromPoint(t.pageX, t.pageY);
            let touch = new Touch(undefined, touchTarget, t.identifier,
                                    t.pageX, t.pageY, t.screenX, t.screenY);
            touches.push(touch);
        }
        return new TouchList(...touches)
    }

    static extractEvent(timestamp, event) {
        let targetSelector = this.selector(event.target);
        let infos = { type: event.type,
            time: timestamp,
            constructor: event.constructor,
            data: {
                targetSelector: targetSelector,
                view: event.view,
                mouseDownSubstitute: event.buttons || event.which, // which cannot be cloned directly
                bubbles: event.bubbles,
                cancelable: event.cancelable,
                screenX: event.screenX,
                screenY: event.screenY,
                clientX: event.clientX,
                clientY: event.clientY,
                layerX: event.layerX,
                layerY: event.layerY,
                pageX: event.pageX,
                pageY: event.pageY,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                metaKey: event.metaKey}
        };
        if (event.type.startsWith('touch')) {
            // On Safari-WebKit the TouchEvent has layerX, layerY coordinates
            let data = infos.data;
            data.targetTouches = this.extractTouches(event.targetTouches);
            data.changedTouches = this.extractTouches(event.changedTouches);
            data.touches = this.extractTouches(event.touches);
        }
        if (Events$1.debug) {
            Events$1.extracted.push(this.toLine(event));
        }
        return infos
    }

    static cloneEvent(type, constructor, data) {
        if (type.startsWith('touch')) {
            // We need to find target from layerX, layerY
            //var target = document.querySelector(data.targetSelector)
            // elementFromPoint(data.layerX, data.layerY)
            //data.target = target
            data.targetTouches = this.createTouchList(data.targetTouches);
            data.changedTouches = this.createTouchList(data.changedTouches);
            data.touches = this.createTouchList(data.touches);
        }
        // We need to find target from pageX, pageY which are only
        // available after construction. They seem to getter items.

        let clone = Reflect.construct(constructor, [type, data]);
        clone.mouseDownSubstitute = data.mouseDownSubstitute;
        return clone
    }

    static simulateEvent(type, constructor, data) {
        data.target = document.querySelector(data.targetSelector);
        let clone = this.cloneEvent(type, constructor, data);
        if (data.target != null) {
            data.target.dispatchEvent(clone);
        }
        if (Events$1.debug) {
            Events$1.simulated.push(this.toLine(clone));
        }
    }

    static toLine(event) {
        return `${event.type} #${event.target.id} ${event.clientX} ${event.clientY}`
        let result = event.type;
        let selector = this.selector(event.target);
        result += ' selector: ' + selector;
        if (event.target != document.querySelector(selector))
            console.log('Cannot resolve', selector);
        let keys = ['layerX', 'layerY', 'pageX', 'pageY', 'clientX', 'clientY'];
        for(let key of keys) {
            try {
                result += ' ' + key + ':' + event[key];
            }
            catch(e) {
                console.log('Invalid key: ' + key);
            }
        }
        return result
    }

    static compareExtractedWithSimulated() {
        if (this.extracted.length != this.simulated.length) {
            alert('Unequal length of extracted [' + this.extracted.length +
                    '] and simulated events [' + this.simulated.length + '].');
            
        }
        else {
            for(let i=0; i<this.extracted.length; i++) {
                var extracted = this.extracted[i];
                var simulated = this.simulated[i];
                if (extracted != simulated) {
                    console.log('Events differ:' + extracted + '|' + simulated);
                    
                }
            }
        }
    }

    static selector(context) {
        return OptimalSelect.select(context)
    }

    static reset() {
        this.extracted = [];
        this.simulated = [];
    }

    static resetSimulated() {
        this.simulated = [];
    }

    static showExtractedEvents(event) {
        if (!event.shiftKey) {
            return
        }
        if (this.popup == null) {
            let element = document.createElement('div');
            Elements.setStyle(element, { position: 'absolute',
                width: '480px',
                height: '640px',
                overflow: 'auto',
                backgroundColor: 'lightgray'});
            document.body.appendChild(element);
            this.popup = element;
        }
        this.popup.innerHTML = '';
        for(let line of this.extracted) {
            let div = document.createElement('div');
            div.innerHTML = line;
            this.popup.appendChild(div);
        }
        let div = document.createElement('div');
        div.innerHTML = '------------ Simulated -----------';
        this.popup.appendChild(div);
        for(let line of this.simulated) {
            let div = document.createElement('div');
            div.innerHTML = line;
            this.popup.appendChild(div);
        }
        Elements.setStyle(this.popup,
                { left: event.clientX + 'px', top: event.clientY + 'px'} );
    }
}

Events$1.popup = null;

Events$1.debug = true;
Events$1.extracted = [];
Events$1.simulated = [];

// In order to test this interface implementation run jsc interface.js

class Interface {
    // Abstract interface that should be extended in interface subclasses.
    // By convention all interfaces should start with an upper 'I'

    static implementationError(klass) {
        let interfaceKeys = Reflect.ownKeys(this.prototype);
        let classKeys = Reflect.ownKeys(klass.prototype);
        for(let key of interfaceKeys) {
            let interfaceDesc = this.prototype[key];
            let classDesc = klass.prototype[key];
            if (typeof(classDesc) == 'undefined')
                return 'Missing ' + key
        }
        return null
    }

    static implementedBy(klass) {
        // In the first step only checks whether the methods of this
        // interface are all implemented by the given class
        let error = this.implementationError(klass);
        return error == null
    }

        // TODO: Specify optional methods
//     static optionalMethods() {
//         return [this.onMouseWheel]
//     }
}

/** Interaction patterns

    See interaction.html for explanation
*/

class IInteractionTarget extends Interface {
    capture(event) {
        return typeof true
    }

    onStart(event, interaction) {}
    onMove(event, interaction) {}
    onEnd(event, interaction) {}

    onMouseWheel(event) {}
}

class IInteractionMapperTarget extends Interface {
    capture(event) {
        return typeof true
    }

    findTarget(event, local, global) {
        return IInteractionTarget
    }
}

class PointMap extends MapProxy {
    // Collects touch points, mouse coordinates, etc. as key value pairs.
    // Keys are pointer and touch ids, the special "mouse" key.
    // Values are points, i.e. all objects with numeric x and y properties.
    constructor(points = {}) {
        super();
        for (let key in points) {
            this.set(key, points[key]);
        }
    }

    toString() {
        let points = [];
        for (let key of this.keys()) {
            let value = this.get(key);
            points.push(`${key}:{x:${value.x}, y:${value.y}}`);
        }
        let attrs = points.join(', ');
        return `[PointMap ${attrs}]`
    }

    clone() {
        let result = new PointMap();
        for (let key of this.keys()) {
            let value = this.get(key);
            result.set(key, {x: value.x, y: value.y});
        }
        return result
    }

    farthests() {
        if (this.size == 0) {
            return null
        }
        let pairs = [];
        for (let p of this.values()) {
            for (let q of this.values()) {
                pairs.push([p, q]);
            }
        }
        let sorted = pairs.sort((a, b) => {
            return Points.distance(b[0], b[1]) - Points.distance(a[0], a[1])
        });
        return sorted[0]
    }

    mean() {
        if (this.size == 0) {
            return null
        }
        let x = 0.0,
            y = 0.0;
        for (let p of this.values()) {
            x += p.x;
            y += p.y;
        }
        return {x: x / this.size, y: y / this.size}
    }
}

class InteractionDelta {
    constructor(x, y, zoom, rotate, about) {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
        this.rotate = rotate;
        this.about = about;
    }

    toString() {
        let values = [];
        for (let key of Object.keys(this)) {
            let value = this[key];
            if (key == 'about') {
                values.push(`${key}:{x:${value.x}, y:${value.y}}`);
            } else {
                values.push(`${key}:${value}`);
            }
        }
        let attrs = values.join(', ');
        return `[InteractionDelta ${attrs}]`
    }
}

class InteractionPoints {
    constructor(parent = null) {
        this.parent = parent;
        this.current = new PointMap();
        this.previous = new PointMap();
        this.start = new PointMap();
        this.ended = new PointMap();
        this.timestamps = new Map();
    }

    moved(key) {
        let current = this.current.get(key);
        let previous = this.previous.get(key);
        return Points.subtract(current, previous)
    }

    move() {
        let current = this.current.mean();
        let previous = this.previous.mean();
        return Points.subtract(current, previous)
    }

    delta() {
        var current = [];
        var previous = [];
        for (let key of this.current.keys()) {
            let c = this.current.get(key);
            if (this.previous.has(key)) {
                let p = this.previous.get(key);
                current.push(c);
                previous.push(p);
            }
        }
        if (current.length >= 2) {
            if (current.length > 2) {
                current = this.current.farthests();
                previous = this.previous.farthests();
            }
            let c1 = current[0];
            let c2 = current[1];

            let p1 = previous[0];
            let p2 = previous[1];

            let cm = Points.mean(c1, c2);
            let pm = Points.mean(p1, p2);

            let delta = Points.subtract(cm, pm);
            let zoom = 1.0;
            let distance1 = Points.distance(p1, p2);
            let distance2 = Points.distance(c1, c2);
            if (distance1 != 0 && distance2 != 0) {
                zoom = distance2 / distance1;
            }
            let angle1 = Points.angle(c2, c1);
            let angle2 = Points.angle(p2, p1);
            let alpha = Angle.diff(angle1, angle2);
            return new InteractionDelta(delta.x, delta.y, zoom, alpha, cm)
        } else if (current.length == 1) {
            let delta = Points.subtract(current[0], previous[0]);
            return new InteractionDelta(delta.x, delta.y, 1.0, 0.0, current[0])
        }
        return null
    }

    update(key, point) {
        // Returns true iff the key is new
        this.current.set(key, point);
        if (!this.start.has(key)) {
            this.start.set(key, point);
            this.previous.set(key, point);
            this.timestamps.set(key, performance.now());
            return true
        }
        return false
    }

    updatePrevious() {
        for (let key of this.current.keys()) {
            this.previous.set(key, this.current.get(key));
        }
    }

    stop(key, point) {
        if (this.current.has(key)) {
            this.current.delete(key);
            this.previous.delete(key);
            this.ended.set(key, point);
        }
    }

    finish(key, point) {
        this.current.delete(key);
        this.previous.delete(key);
        this.start.delete(key);
        this.timestamps.delete(key);
        this.ended.delete(key);
    }

    isFinished() {
        return this.current.size == 0
    }

    isNoLongerTwoFinger() {
        return this.previous.size > 1 && this.current.size < 2
    }

    isTap(key) {
        return this.parent.isTap(key)
    }

    isLongPress(key) {
        return this.parent.isLongPress(key)
    }
}

class Interaction extends InteractionPoints {
    constructor(tapDistance = 10, longPressTime = 500.0) {
        super();
        this.tapDistance = tapDistance;
        this.longPressTime = longPressTime;
        this.targets = new Map();
        this.subInteractions = new Map(); // target:Object : InteractionPoints
    }

    stop(key, point) {
        super.stop(key, point);
        for (let points of this.subInteractions.values()) {
            points.stop(key, point);
        }
    }

    addTarget(key, target) {
        this.targets.set(key, target);
        this.subInteractions.set(target, new InteractionPoints(this));
    }

    removeTarget(key) {
        let target = this.targets.get(key);
        this.targets.delete(key);
        // Only remove target if no keys are refering to the target
        let remove = true;
        for (let t of this.targets.values()) {
            if (target === t) {
                remove = false;
            }
        }
        if (remove) {
            this.subInteractions.delete(target);
        }
    }

    finish(key, point) {
        super.finish(key, point);
        this.removeTarget(key);
    }

    mapInteraction(points, aspects, mappingFunc) {
        // Map centrally registered points to target interactions
        // Returns an array of [target, updated subInteraction] pairs
        let result = new Map();
        for (let key in points) {
            if (this.targets.has(key)) {
                let target = this.targets.get(key);
                if (this.subInteractions.has(target)) {
                    let interaction = this.subInteractions.get(target);
                    for (let aspect of aspects) {
                        let pointMap = this[aspect];
                        let point = pointMap.get(key);
                        let mapped = mappingFunc(point);
                        interaction[aspect].set(key, mapped);
                    }
                    result.set(target, interaction);
                }
            }
        }
        return result
    }

    isTap(key) {
        let ended = this.ended.get(key);
        let start = this.start.get(key);
        if (
            start &&
            ended &&
            Points.distance(ended, start) < this.tapDistance
        ) {
            let t1 = this.timestamps.get(key);
            let tookLong = performance.now() > t1 + this.longPressTime;
            if (tookLong) {
                return false
            }
            return true
        }
        return false
    }

    isAnyTap() {
        for (let key of this.ended.keys()) {
            if (this.isTap(key)) return true
        }
        return false
    }

    isLongPress(key) {
        let ended = this.ended.get(key);
        let start = this.start.get(key);
        if (
            start &&
            ended &&
            Points.distance(ended, start) < this.tapDistance
        ) {
            let t1 = this.timestamps.get(key);
            let tookLong = performance.now() > t1 + this.longPressTime;
            if (tookLong) {
                return true
            }
            return false
        }
        return false
    }

    isAnyLongPress() {
        for (let key of this.ended.keys()) {
            if (this.isLongPress(key)) return true
        }
        return false
    }

    isStylus(key) {
        return key === 'stylus'
    }
}

class InteractionDelegate {
    // Long press: http://stackoverflow.com/questions/1930895/how-long-is-the-event-onlongpress-in-the-android
    // Stylus support: https://w3c.github.io/touch-events/

    constructor(
        element,
        target,
        {mouseWheelElement = null, debug = false} = {}
    ) {
        this.debug = debug;
        this.interaction = new Interaction();
        this.element = element;
        this.mouseWheelElement = mouseWheelElement || element;
        this.target = target;
        this.setupInteraction();
    }

    setupInteraction() {
        if (this.debug) {
            let error = this.targetInterface.implementationError(
                this.target.constructor
            );
            if (error != null) {
                throw new Error('Expected IInteractionTarget: ' + error)
            }
        }
        this.setupTouchInteraction();
        this.setupMouseWheelInteraction();
    }

    get targetInterface() {
        return IInteractionTarget
    }

    setupTouchInteraction() {
        let element = this.element;
        let useCapture = true;
        if (window.PointerEvent) {
            if (this.debug) console.log('Pointer API' + window.PointerEvent);
            element.addEventListener(
                'pointerdown',
                e => {
                    if (this.debug) console.log('pointerdown', e.pointerId);
                    if (this.capture(e)) {
                        element.setPointerCapture(e.pointerId);
                        this.onStart(e);
                    }
                },
                useCapture
            );
            element.addEventListener(
                'pointermove',
                e => {
                    if (this.debug) console.log('pointermove', e.pointerId);
                    if (
                        e.pointerType == 'touch' ||
                        (e.pointerType == 'mouse' && Events$1.isMouseDown(e))
                    ) {
                        // this.capture(e) &&
                        if (this.debug)
                            console.log('pointermove captured', e.pointerId);
                        this.onMove(e);
                    }
                },
                useCapture
            );
            element.addEventListener(
                'pointerup',
                e => {
                    if (this.debug) console.log('pointerup');
                    this.onEnd(e);
                    element.releasePointerCapture(e.pointerId);
                },
                useCapture
            );
            element.addEventListener(
                'pointercancel',
                e => {
                    if (this.debug) console.log('pointercancel');
                    this.onEnd(e);
                    element.releasePointerCapture(e.pointerId);
                },
                useCapture
            );
            element.addEventListener(
                'pointerleave',
                e => {
                    if (this.debug) console.log('pointerleave');
                    if (e.target == element) this.onEnd(e);
                },
                useCapture
            );
        } else if (window.TouchEvent) {
            if (this.debug) console.log('Touch API');
            element.addEventListener(
                'touchstart',
                e => {
                    if (this.debug)
                        console.log('touchstart', this.touchPoints(e));
                    if (this.capture(e)) {
                        for (let touch of e.changedTouches) {
                            this.onStart(touch);
                        }
                    }
                },
                useCapture
            );
            element.addEventListener(
                'touchmove',
                e => {
                    if (this.debug)
                        console.log('touchmove', this.touchPoints(e), e);
                    for (let touch of e.changedTouches) {
                        this.onMove(touch);
                    }
                    for (let touch of e.targetTouches) {
                        this.onMove(touch);
                    }
                },
                useCapture
            );
            element.addEventListener(
                'touchend',
                e => {
                    if (this.debug) console.log('touchend', this.touchPoints(e));
                    for (let touch of e.changedTouches) {
                        this.onEnd(touch);
                    }
                },
                useCapture
            );
            element.addEventListener(
                'touchcancel',
                e => {
                    if (this.debug)
                        console.log(
                            'touchcancel',
                            e.targetTouches.length,
                            e.changedTouches.length
                        );
                    for (let touch of e.changedTouches) {
                        this.onEnd(touch);
                    }
                },
                useCapture
            );
        } else {
            if (this.debug) console.log('Mouse API');

            element.addEventListener(
                'mousedown',
                e => {
                    if (this.debug) console.log('mousedown', e);
                    if (this.capture(e)) this.onStart(e);
                },
                useCapture
            );
            element.addEventListener(
                'mousemove',
                e => {
                    // Dow we only use move events if the mouse is down?
                    // HOver effects have to be implemented by other means
                    // && Events.isMouseDown(e))

                    if (Events$1.isMouseDown(e))
                        if (this.debug)
                            // this.capture(e) &&
                            console.log('mousemove', e);
                    this.onMove(e);
                },
                useCapture
            );
            element.addEventListener(
                'mouseup',
                e => {
                    if (this.debug) console.log('mouseup', e);
                    this.onEnd(e);
                },
                true
            );
            element.addEventListener(
                'mouseout',
                e => {
                    if (e.target == element) this.onEnd(e);
                },
                useCapture
            );
        }
    }

    touchPoints(event) {
        let result = [];
        for (let touch of event.changedTouches) {
            result.push(this.extractPoint(touch));
        }
        return result
    }

    setupMouseWheelInteraction() {
        this.mouseWheelElement.addEventListener(
            'mousewheel',
            this.onMouseWheel.bind(this),
            true
        );
        this.mouseWheelElement.addEventListener(
            'DOMMouseScroll',
            this.onMouseWheel.bind(this),
            true
        );
    }

    onMouseWheel(event) {
        if (this.capture(event) && this.target.onMouseWheel) {
            this.target.onMouseWheel(event);
        } else {
            //console.warn('Target has no onMouseWheel callback')
        }
    }

    onStart(event) {
        let extracted = this.extractPoint(event);
        this.updateInteraction(event, extracted);
        this.target.onStart(event, this.interaction);
    }

    onMove(event) {
        let extracted = this.extractPoint(event, 'all');
        this.updateInteraction(event, extracted);
        this.target.onMove(event, this.interaction);
        this.interaction.updatePrevious();
    }

    onEnd(event) {
        let extracted = this.extractPoint(event, 'changedTouches');
        this.endInteraction(event, extracted);
        this.target.onEnd(event, this.interaction);
        this.finishInteraction(event, extracted);
    }

    capture(event) {
        let captured = this.target.capture(event);
        return captured
    }

    getPosition(event) {
        return {x: event.clientX, y: event.clientY}
    }

    extractPoint(event, touchEventKey = 'all') {
        // 'targetTouches'
        let result = {};
        switch (event.constructor.name) {
            case 'MouseEvent':
                let buttons = event.buttons || event.which;
                if (buttons) result['mouse'] = this.getPosition(event);
                break
            case 'PointerEvent':
                result[event.pointerId.toString()] = this.getPosition(event);
                break
            case 'Touch':
                let id =
                    event.touchType === 'stylus'
                        ? 'stylus'
                        : event.identifier.toString();
                result[id] = this.getPosition(event);
                break
            //             case 'TouchEvent':
            //                 // Needs to be observed: Perhaps changedTouches are all we need. If so
            //                 // we can remove the touchEventKey default parameter
            //                 if (touchEventKey == 'all') {
            //                     for(let t of event.targetTouches) {
            //                         result[t.identifier.toString()] = this.getPosition(t)
            //                     }
            //                     for(let t of event.changedTouches) {
            //                         result[t.identifier.toString()] = this.getPosition(t)
            //                     }
            //                 }
            //                 else {
            //                     for(let t of event.changedTouches) {
            //                         result[t.identifier.toString()] = this.getPosition(t)
            //                     }
            //                 }
            //                 break
            default:
                break
        }
        return result
    }

    interactionStarted(event, key, point) {
        // Callback: can be overwritten
    }

    interactionEnded(event, key, point) {
        // Callback: can be overwritten
    }

    interactionFinished(event, key, point) {}

    updateInteraction(event, extracted) {
        for (let key in extracted) {
            let point = extracted[key];
            if (this.interaction.update(key, point)) {
                this.interactionStarted(event, key, point);
            }
        }
    }

    endInteraction(event, ended) {
        for (let key in ended) {
            let point = ended[key];
            this.interaction.stop(key, point);
            this.interactionEnded(event, key, point);
        }
    }

    finishInteraction(event, ended) {
        for (let key in ended) {
            let point = ended[key];
            this.interaction.finish(key, point);
            this.interactionFinished(event, key, point);
        }
    }
}

class InteractionMapper$1 extends InteractionDelegate {
    /* A special InteractionDelegate that maps events to specific parts of
    the interaction target. The InteractionTarget must implement a findTarget
    method that returns an object implementing the IInteractionTarget interface.

    If the InteractionTarget also implements a mapPositionToPoint method this
    is used to map the points to the local coordinate space of the the target.

    This makes it easier to lookup elements and relate events to local
    positions.
    */

    constructor(
        element,
        target,
        {tapDistance = 10, longPressTime = 500.0, mouseWheelElement = null} = {}
    ) {
        super(element, target, {tapDistance, longPressTime, mouseWheelElement});
    }

    get targetInterface() {
        return IInteractionMapperTarget
    }

    mapPositionToPoint(point) {
        if (this.target.mapPositionToPoint) {
            return this.target.mapPositionToPoint(point)
        }
        return point
    }

    interactionStarted(event, key, point) {
        if (this.target.findTarget) {
            let local = this.mapPositionToPoint(point);
            let found = this.target.findTarget(event, local, point);
            if (found != null) {
                this.interaction.addTarget(key, found);
            }
        }
    }

    onMouseWheel(event) {
        if (this.capture(event)) {
            if (this.target.findTarget) {
                let point = this.getPosition(event);
                let local = this.mapPositionToPoint(point);
                let found = this.target.findTarget(event, local, point);
                if (found != null && found.onMouseWheel) {
                    found.onMouseWheel(event);
                    return
                }
            }
            if (this.target.onMouseWheel) {
                this.target.onMouseWheel(event);
            } else {
                console.warn('Target has no onMouseWheel callback', this.target);
            }
        }
    }

    onStart(event) {
        let extracted = this.extractPoint(event);
        this.updateInteraction(event, extracted);
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['current', 'start'],
            this.mapPositionToPoint.bind(this)
        );
        for (let [target, interaction] of mapped.entries()) {
            target.onStart(event, interaction);
        }
    }

    onMove(event) {
        let extracted = this.extractPoint(event, 'all');

        this.updateInteraction(event, extracted);
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['current', 'previous'],
            this.mapPositionToPoint.bind(this)
        );
        for (let [target, interaction] of mapped.entries()) {
            target.onMove(event, interaction);
            interaction.updatePrevious();
        }
        this.interaction.updatePrevious();
    }

    onEnd(event) {
        let extracted = this.extractPoint(event, 'changedTouches');
        this.endInteraction(event, extracted);
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['ended'],
            this.mapPositionToPoint.bind(this)
        );
        for (let [target, interaction] of mapped.entries()) {
            target.onEnd(event, interaction);
        }
        this.finishInteraction(event, extracted);
    }
}

window.InteractionMapper = InteractionMapper$1;

/** Report capabilities with guaranteed values.
 */
class Capabilities {

    /** Returns the browser userAgent.
    @return {string}
    */
    static get userAgent() {
        return navigator.userAgent || 'Unknown Agent'
    }

    /** Tests whether the app is running on a mobile device.
    Implemented as a readonly attribute.
    @return {boolean}
    */
    static get isMobile() {
        return (/Mobi/.test(navigator.userAgent))
    }

    /** Tests whether the app is running on a iOS device.
    Implemented as a readonly attribute.
    @return {boolean}
    */
    static get isIOS() {
        return (/iPad|iPhone|iPod/.test(navigator.userAgent)) && !window.MSStream
    }

     /** Tests whether the app is running in a Safari environment.
    See https://stackoverflow.com/questions/7944460/detect-safari-browser
    Implemented as a readonly attribute.
    @return {boolean}
    */
    static get isSafari() {
        return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent && !navigator.userAgent.match('CriOS')
    }


    /** Returns the display resolution. Necessary for retina displays.
    @return {number}
    */
    static get devicePixelRatio() {
        return window.devicePixelRatio || 1
    }

    /** Returns true if the device is a multi-touch table. This method is currently not universal usable and not sure!
    @return {boolean}
    */
    static get isMultiTouchTable() {
        return Capabilities.devicePixelRatio > 2 && Capabilities.isMobile === false && /Windows/i.test(Capabilities.userAgent)
    }

    /** Returns true if mouse events are supported
    @return {boolean}
    */
    static supportsMouseEvents() {
        return typeof(window.MouseEvent) != 'undefined'
    }

    /** Returns true if touch events are supported
    @return {boolean}
    */
    static supportsTouchEvents() {
        return typeof(window.TouchEvent) != 'undefined'
    }

    /** Returns true if pointer events are supported
    @return {boolean}
    */
    static supportsPointerEvents() {
        return typeof(window.PointerEvent) != 'undefined'
    }

    /** Returns true if DOM templates are supported
    @return {boolean}
    */
    static supportsTemplate() {
        return 'content' in document.createElement('template');
    }
}

/** Basic tests for Capabilities.
 */
class CapabilitiesTests {

    static testConfirm() {
        let bool = confirm('Please confirm');
        document.getElementById('demo').innerHTML = (bool) ? 'Confirmed' : 'Not confirmed';
    }

    static testPrompt() {
        let person = prompt('Please enter your name', 'Harry Potter');
        if (person != null) {
            demo.innerHTML =
            'Hello ' + person + '! How are you today?';
        }
    }

    static testUserAgent() {
        let agent = 'User-agent: ' + Capabilities.userAgent;
        user_agent.innerHTML = agent;
    }

    static testDevicePixelRatio() {
        let value = 'Device Pixel Ratio: ' + Capabilities.devicePixelRatio;
        device_pixel_ratio.innerHTML = value;
    }

    static testMultiTouchTable() {
        let value = 'Is the device a multi-touch table? ' + Capabilities.isMultiTouchTable;
        multi_touch_table.innerHTML = value;
    }

    static testSupportedEvents() {
        let events = [];
        if (Capabilities.supportsMouseEvents()) {
            events.push('MouseEvents');
        }
        if (Capabilities.supportsTouchEvents()) {
            events.push('TouchEvents');
        }
        if (Capabilities.supportsPointerEvents()) {
            events.push('PointerEvents');
        }
        supported_events.innerHTML = 'Supported Events: ' + events.join(', ');
    }

    static testAll() {
        this.testUserAgent();
        this.testDevicePixelRatio();
        this.testMultiTouchTable();
        this.testSupportedEvents();
    }
}

/* Optional global variables, needed in DocTests. */
window.Capabilities = Capabilities;
window.CapabilitiesTests = CapabilitiesTests;

/**
 * A base class for scatter specific events.
 *
 * @constructor
 * @param {name} String - The name of the event
 * @param {target} Object - The target of the event
 */
class BaseEvent {
    constructor(name, target) {
        this.name = name;
        this.target = target;
    }
}

// Event types
const START = 'onStart';
const UPDATE = 'onUpdate';
const END = 'onEnd';
const ZOOM = 'onZoom';
/**
 * A scatter event that describes how the scatter has changed.
 *
 * @constructor
 * @param {target} Object - The target scatter of the event
 * @param {optional} Object - Optional parameter
 */
class ScatterEvent extends BaseEvent {
    constructor(
        target,
        {
            translate = {x: 0, y: 0},
            scale = null,
            rotate = 0,
            about = null,
            fast = false,
            type = null
        } = {}
    ) {
        super('scatterTransformed', {target: target});
        this.translate = translate;
        this.scale = scale;
        this.rotate = rotate;
        this.about = about;
        this.fast = fast;
        this.type = type;
    }

    toString() {
        return (
            "Event('scatterTransformed', scale: " +
            this.scale +
            ' about: ' +
            this.about.x +
            ', ' +
            this.about.y +
            ')'
        )
    }
}

/**
 * A scatter resize event that describes how the scatter has changed.
 *
 * @constructor
 * @param {target} Object - The target scatter of the event
 * @param {optional} Object - Optional parameter
 */
class ResizeEvent extends BaseEvent {
    constructor(target, {width = 0, height = 0} = {}) {
        super('scatterResized', {width: width, height: height});
        this.width = width;
        this.height = height;
    }

    toString() {
        return (
            'Event(scatterResized width: ' +
            this.width +
            'height: ' +
            this.height +
            ')'
        )
    }
}

/**
 * A abstract base class that implements the throwable behavior of a scatter
 * object.
 *
 * @constructor
 */
class Throwable {
    constructor({
        movableX = true,
        movableY = true,
        throwVisibility = 44,
        throwDamping = 0.95,
        autoThrow = true
    } = {}) {
        this.movableX = movableX;
        this.movableY = movableY;
        this.throwVisibility = throwVisibility;
        this.throwDamping = throwDamping;
        this.autoThrow = autoThrow;
        this.velocities = [];
        this.velocity = null;
        this.timestamp = null;
    }

    observeVelocity() {
        this.lastframe = performance.now();
    }

    addVelocity(delta, buffer = 5) {
        let t = performance.now();
        let dt = t - this.lastframe;
        this.lastframe = t;
        let velocity = {t: t, dt: dt, dx: delta.x, dy: delta.y};
        this.velocities.push(velocity);
        while (this.velocities.length > buffer) {
            this.velocities.shift();
        }
    }

    meanVelocity(milliseconds = 30) {
        this.addVelocity({x: 0, y: 0});
        let sum = {x: 0, y: 0};
        let count = 0;
        let t = 0;
        for (let i = this.velocities.length - 1; i > 0; i--) {
            let v = this.velocities[i];
            t += v.dt;
            let nv = {x: v.dx / v.dt, y: v.dy / v.dt};
            sum = Points.add(sum, nv);
            count += 1;
            if (t > milliseconds) {
                break
            }
        }
        if (count === 0) return sum // empty vector
        return Points.multiplyScalar(sum, 1 / count)
    }

    killAnimation() {
        this.velocity = null;
        this.velocities = [];
    }

    startThrow() {
        this.velocity = this.meanVelocity();
        if (this.velocity != null) {
            // Call next velocity to ansure that specializations
            // that use keepOnStage are called
            this.velocity = this.nextVelocity(this.velocity);
            if (this.autoThrow) this.animateThrow(performance.now());
        } else {
            this.onDragComplete();
        }
    }

    animateThrow(time) {
        if (this.velocity != null) {
            let t = performance.now();
            let dt = t - this.lastframe;
            this.lastframe = t;
            // console.log("animateThrow", dt)
            let next = this.nextVelocity(this.velocity);
            let prevLength = Points.length(this.velocity);
            let nextLength = Points.length(next);
            if (nextLength > prevLength) {
                let factor = nextLength / prevLength;
                next = Points.multiplyScalar(next, 1 / factor);
                console.log('Prevent acceleration', factor, this.velocity, next);
            }
            this.velocity = next;
            let d = Points.multiplyScalar(this.velocity, dt);
            this._move(d);
            this.onDragUpdate(d);
            if (dt == 0 || this.needsAnimation()) {
                requestAnimationFrame(this.animateThrow.bind(this));
                return
            } else {
                if (this.isOutside()) {
                    requestAnimationFrame(this.animateThrow.bind(this));
                }
            }
        }
        this.onDragComplete();
    }

    needsAnimation() {
        return Points.length(this.velocity) > 0.01
    }

    nextVelocity(velocity) {
        // Must be overwritten: computes the changed velocity. Implement
        // damping, collison detection, etc. here
        return Points.multiplyScalar(velocity, this.throwDamping)
    }

    _move(delta) {}

    onDragComplete() {}

    onDragUpdate(delta) {}
}

class AbstractScatter extends Throwable {
    constructor({
        minScale = 0.1,
        maxScale = 1.0,
        startScale = 1.0,
        autoBringToFront = true,
        autoThrow = true,
        translatable = true,
        scalable = true,
        rotatable = true,
        resizable = false,
        movableX = true,
        movableY = true,
        throwVisibility = 44,
        throwDamping = 0.95,
        overdoScaling = 1,
        mouseZoomFactor = 1.1,
        rotationDegrees = null,
        rotation = null,
        onTransform = null
    } = {}) {
        if (rotationDegrees != null && rotation != null) {
            throw new Error('Use rotationDegrees or rotation but not both')
        } else if (rotation != null) {
            rotationDegrees = Angle.radian2degree(rotation);
        } else if (rotationDegrees == null) {
            rotationDegrees = 0;
        }
        super({
            movableX,
            movableY,
            throwVisibility,
            throwDamping,
            autoThrow
        });
        this.startRotationDegrees = rotationDegrees;
        this.startScale = startScale; // Needed to reset object
        this.minScale = minScale;
        this.maxScale = maxScale;
        this.overdoScaling = overdoScaling;
        this.translatable = translatable;
        this.scalable = scalable;
        this.rotatable = rotatable;
        this.resizable = resizable;
        this.mouseZoomFactor = mouseZoomFactor;
        this.autoBringToFront = autoBringToFront;
        this.dragging = false;
        this.onTransform = onTransform != null ? [onTransform] : null;
    }

    addTransformEventCallback(callback) {
        if (this.onTransform == null) {
            this.onTransform = [];
        }
        this.onTransform.push(callback);
    }

    startGesture(interaction) {
        this.bringToFront();
        this.killAnimation();
        this.observeVelocity();
        return true
    }

    gesture(interaction) {
        let delta = interaction.delta();
        if (delta != null) {
            this.addVelocity(delta);
            this.transform(delta, delta.zoom, delta.rotate, delta.about);
            if (delta.zoom != 1) this.interactionAnchor = delta.about;
        }
    }

    get polygon() {
        let w2 = this.width * this.scale / 2;
        let h2 = this.height * this.scale / 2;
        let center = this.center;
        let polygon = new Polygon(center);
        polygon.addPoint({x: -w2, y: -h2});
        polygon.addPoint({x: w2, y: -h2});
        polygon.addPoint({x: w2, y: h2});
        polygon.addPoint({x: -w2, y: h2});
        polygon.rotate(this.rotation);
        return polygon
    }

    isOutside() {
        let stagePolygon = this.containerPolygon;
        let polygon = this.polygon;
        let result = stagePolygon.intersectsWith(polygon);
        return result === false || result.overlap < this.throwVisibility
    }

    recenter() {
        // Return a small vector that guarantees that the scatter is moving
        // towards the center of the stage
        let center = this.center;
        let target = this.container.center;
        let delta = Points.subtract(target, center);
        return Points.normalize(delta)
    }

    nextVelocity(velocity) {
        return this.keepOnStage(velocity)
    }

    bouncing() {
        // Implements the bouncing behavior of the scatter. Moves the scatter
        // to the center of the stage if the scatter is outside the stage or
        // not within the limits of the throwVisibility.

        let stagePolygon = this.containerPolygon;
        let polygon = this.polygon;
        let result = stagePolygon.intersectsWith(polygon);
        if (result === false || result.overlap < this.throwVisibility) {
            let cv = this.recenter();
            let recentered = false;
            while (result === false || result.overlap < this.throwVisibility) {
                polygon.center.x += cv.x;
                polygon.center.y += cv.y;
                this._move(cv);
                result = stagePolygon.intersectsWith(polygon);
                recentered = true;
            }
            return recentered
        }
        return false
    }

    keepOnStage(velocity, collision = 0.5) {
        let stagePolygon = this.containerPolygon;
        if (!stagePolygon) return
        let polygon = this.polygon;
        let bounced = this.bouncing();
        if (bounced) {
            let stage = this.containerBounds;
            let x = this.center.x;
            let y = this.center.y;
            let dx = this.movableX ? velocity.x : 0;
            let dy = this.movableY ? velocity.y : 0;
            let factor = this.throwDamping;
            // if (recentered) {
            if (x < 0) {
                dx = -dx;
                factor = collision;
            }
            if (x > stage.width) {
                dx = -dx;
                factor = collision;
            }
            if (y < 0) {
                dy = -dy;
                factor = collision;
            }
            if (y > stage.height) {
                dy = -dy;
                factor = collision;
            }
            // }
            return Points.multiplyScalar({x: dx, y: dy}, factor)
        }
        return super.nextVelocity(velocity)
    }

    endGesture(interaction) {
        this.startThrow();
    }

    rotateDegrees(degrees, anchor) {
        let rad = Angle.degree2radian(degrees);
        this.rotate(rad, anchor);
    }

    rotate(rad, anchor) {
        this.transform({x: 0, y: 0}, 1.0, rad, anchor);
    }

    move(d, {animate = 0} = {}) {
        if (this.translatable) {
            if (animate > 0) {
                let startPos = this.position;
                TweenLite.to(this, animate, {
                    x: '+=' + d.x,
                    y: '+=' + d.y,
                    /* scale: scale, uo: not defined, why was this here? */
                    onUpdate: e => {
                        let p = this.position;
                        let dx = p.x - startPos.x;
                        let dy = p.x - startPos.y;
                        this.onMoved(dx, dy);
                    }
                });
            } else {
                this._move(d);
                this.onMoved(d.x, d.y);
            }
        }
    }

    moveTo(p, {animate = 0} = {}) {
        let c = this.origin;
        let delta = Points.subtract(p, c);
        this.move(delta, {animate: animate});
    }

    centerAt(p, {animate = 0} = {}) {
        let c = this.center;
        let delta = Points.subtract(p, c);
        this.move(delta, {animate: animate});
    }

    zoom(
        scale,
        {
            animate = 0,
            about = null,
            delay = 0,
            x = null,
            y = null,
            onComplete = null
        } = {}
    ) {
        let anchor = about || this.center;
        if (scale != this.scale) {
            if (animate > 0) {
                TweenLite.to(this, animate, {
                    scale: scale,
                    delay: delay,
                    onComplete: onComplete,
                    onUpdate: this.onZoomed.bind(this)
                });
            } else {
                this.scale = scale;
                this.onZoomed(anchor);
            }
        }
    }

    _move(delta) {
        this.x += this.movableX ? delta.x : 0;
        this.y += this.movableX ? delta.y : 0;
    }

    transform(translate, zoom, rotate, anchor) {
        let delta = {
            x: this.movableX ? translate.x : 0,
            y: this.movableY ? translate.y : 0
        };
        if (this.resizable) var vzoom = zoom;
        if (!this.translatable) delta = {x: 0, y: 0};
        if (!this.rotatable) rotate = 0;
        if (!this.scalable) zoom = 1.0;
        if (zoom == 1.0 && rotate == 0) {
            this._move(delta);
            if (this.onTransform != null) {
                let event = new ScatterEvent(this, {
                    translate: delta,
                    scale: this.scale,
                    rotate: 0,
                    about: anchor,
                    fast: false,
                    type: UPDATE
                });
                this.onTransform.forEach(function(f) {
                    f(event);
                });
            }
            return
        }
        let origin = this.rotationOrigin;
        let beta = Points.angle(origin, anchor);
        let distance = Points.distance(origin, anchor);
        let newScale = this.scale * zoom;

        let minScale = this.minScale / this.overdoScaling;
        let maxScale = this.maxScale * this.overdoScaling;
        if (newScale < minScale) {
            newScale = minScale;
            zoom = newScale / this.scale;
        }
        if (newScale > maxScale) {
            newScale = maxScale;
            zoom = newScale / this.scale;
        }

        let newOrigin = Points.arc(anchor, beta + rotate, distance * zoom);
        let extra = Points.subtract(newOrigin, origin);
        let offset = Points.subtract(anchor, origin);
        this._move(offset);
        this.scale = newScale;
        this.rotation += rotate;
        offset = Points.negate(offset);
        offset = Points.add(offset, extra);
        offset = Points.add(offset, translate);
        this._move(offset);

        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: delta,
                scale: newScale,
                rotate: rotate,
                about: anchor
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
        if (this.resizable) {
            this.resizeAfterTransform(vzoom);
        }
    }

    resizeAfterTransform(zoom) {
        // Overwrite this in subclasses.
    }

    validScale(scale) {
        scale = Math.max(scale, this.minScale);
        scale = Math.min(scale, this.maxScale);
        return scale
    }

    animateZoomBounce(dt = 1) {
        if (this.zoomAnchor != null) {
            let zoom = 1;
            let amount = Math.min(0.01, 0.3 * dt / 100000.0);
            if (this.scale < this.minScale) zoom = 1 + amount;
            if (this.scale > this.maxScale) zoom = 1 - amount;
            if (zoom != 1) {
                this.transform({x: 0, y: 0}, zoom, 0, this.zoomAnchor);
                requestAnimationFrame(dt => {
                    this.animateZoomBounce(dt);
                });
                return
            }
            this.zoomAnchor = null;
        }
    }

    checkScaling(about, delay = 0) {
        this.zoomAnchor = about;
        clearTimeout(this.animateZoomBounce.bind(this));
        setTimeout(this.animateZoomBounce.bind(this), delay);
    }

    onMouseWheel(event) {
        if (event.claimedByScatter) {
            if (event.claimedByScatter != this) return
        }
        this.killAnimation();
        this.targetScale = null;
        let direction = event.detail < 0 || event.wheelDelta > 0;
        let globalPoint = {x: event.clientX, y: event.clientY};
        let centerPoint = this.mapPositionToContainerPoint(globalPoint);
        if (event.shiftKey) {
            let degrees = direction ? 5 : -5;
            let rad = Angle.degree2radian(degrees);
            return this.transform({x: 0, y: 0}, 1.0, rad, centerPoint)
        }
        const zoomFactor = this.mouseZoomFactor;
        let zoom = direction ? zoomFactor : 1 / zoomFactor;
        this.transform({x: 0, y: 0}, zoom, 0, centerPoint);
        this.checkScaling(centerPoint, 200);

        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: 0, y: 0},
                scale: this.scale,
                rotate: 0,
                about: null,
                fast: false,
                type: ZOOM
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }

    onStart(event, interaction) {
        if (this.startGesture(interaction)) {
            this.dragging = true;
            this.interactionAnchor = null;
        }
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: 0, y: 0},
                scale: this.scale,
                rotate: 0,
                about: null,
                fast: false,
                type: START
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }

    onMove(event, interaction) {
        if (this.dragging) {
            this.gesture(interaction);
        }
    }

    onEnd(event, interaction) {
        if (interaction.isFinished()) {
            this.endGesture(interaction);
            this.dragging = false;
            for (let key of interaction.ended.keys()) {
                if (interaction.isTap(key)) {
                    let point = interaction.ended.get(key);
                    this.onTap(event, interaction, point);
                }
            }
            if (this.onTransform != null) {
                let event = new ScatterEvent(this, {
                    translate: {x: 0, y: 0},
                    scale: this.scale,
                    rotate: 0,
                    about: null,
                    fast: false,
                    type: END
                });
                this.onTransform.forEach(function(f) {
                    f(event);
                });
            }
        }
        let about = this.interactionAnchor;
        if (about != null) {
            this.checkScaling(about, 100);
        }
    }

    onTap(event, interaction, point) {}

    onDragUpdate(delta) {
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                fast: true,
                translate: delta,
                scale: this.scale,
                about: this.currentAbout,
                type: null
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }

    onDragComplete() {
        if (this.onTransform) {
            let event = new ScatterEvent(this, {
                scale: this.scale,
                about: this.currentAbout,
                fast: false,
                type: null
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }

    onMoved(dx, dy, about) {
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: dx, y: dy},
                about: about,
                fast: true,
                type: null
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }

    onZoomed(about) {
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                scale: this.scale,
                about: about,
                fast: false,
                type: null
            });
            this.onTransform.forEach(function(f) {
                f(event);
            });
        }
    }
}

/** A container for scatter objects, which uses a single InteractionMapper
 * for all children. This reduces the number of registered event handlers
 * and covers the common use case that multiple objects are scattered
 * on the same level.
 */


let zIndex = 1000;

class DOMScatter extends AbstractScatter {
    constructor(
        element,
        container,
        {
            startScale = 1.0,
            minScale = 0.1,
            maxScale = 1.0,
            overdoScaling = 1.5,
            autoBringToFront = true,
            translatable = true,
            scalable = true,
            rotatable = true,
            movableX = true,
            movableY = true,
            rotationDegrees = null,
            rotation = null,
            onTransform = null,
            transformOrigin = 'center center',
            // extras which are in part needed
            x = 0,
            y = 0,
            width = null,
            height = null,
            resizable = false,
            simulateClick = false,
            verbose = true,
            onResize = null,
            touchAction = 'none',
            throwVisibility = 44,
            throwDamping = 0.95,
            autoThrow = true
        } = {}
    ) {
        super({
            minScale,
            maxScale,
            startScale,
            overdoScaling,
            autoBringToFront,
            translatable,
            scalable,
            rotatable,
            movableX,
            movableY,
            resizable,
            rotationDegrees,
            rotation,
            onTransform,
            throwVisibility,
            throwDamping,
            autoThrow
        });
        if (container == null || width == null || height == null) {
            throw new Error('Invalid value: null')
        }
        this.element = element;
        this.x = x;
        this.y = y;
        this.meanX = x;
        this.meanY = y;
        this.width = width;
        this.height = height;
        this.throwVisibility = Math.min(width, height, throwVisibility);
        this.container = container;
        this.simulateClick = simulateClick;
        this.scale = startScale;
        this.rotationDegrees = this.startRotationDegrees;
        this.transformOrigin = transformOrigin;
        this.initialValues = {
            x: x,
            y: y,
            width: width,
            height: height,
            scale: startScale,
            rotation: this.startRotationDegrees,
            transformOrigin: transformOrigin
        };
        // For tweenlite we need initial values in _gsTransform
        TweenLite.set(element, this.initialValues);
        this.onResize = onResize;
        this.verbose = verbose;
        if (touchAction !== null) {
            Elements$1.setStyle(element, {touchAction});
        }
        container.add(this);
    }

    /** Returns geometry data as object. **/
    getState() {
        return {
            scale: this.scale,
            x: this.x,
            y: this.y,
            rotation: this.rotation
        }
    }

    get rotationOrigin() {
        return this.center
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    set x(value) {
        this._x = value;
        TweenLite.set(this.element, {x: value});
    }

    set y(value) {
        this._y = value;
        TweenLite.set(this.element, {y: value});
    }

    get position() {
        let transform = this.element._gsTransform;
        let x = transform.x;
        let y = transform.y;
        return {x, y}
    }

    get origin() {
        let p = this.fromNodeToPage(0, 0);
        return Points.fromPageToNode(this.container.element, p)
    }

    get bounds() {
        let stage = this.container.element.getBoundingClientRect();
        let rect = this.element.getBoundingClientRect();
        return {
            top: rect.top - stage.top,
            left: rect.left - stage.left,
            width: rect.width,
            height: rect.height
        }
    }

    get center() {
        let r = this.bounds;
        let w2 = r.width / 2;
        let h2 = r.height / 2;
        if (this.resizable) {
            w2 *= this.scale;
            h2 *= this.scale;
        }
        var x = r.left + w2;
        var y = r.top + h2;
        return {x, y}
    }

    set rotation(radians) {
        let rad = radians; // Angle.normalize(radians)
        let degrees = Angle.radian2degree(rad);
        TweenLite.set(this.element, {rotation: degrees});
        this._rotation = rad;
    }

    set rotationDegrees(degrees) {
        let deg = degrees; // Angle.normalizeDegree(degrees)
        TweenLite.set(this.element, {rotation: deg});
        this._rotation = Angle.degree2radian(deg);
    }

    get rotation() {
        return this._rotation
    }

    get rotationDegrees() {
        return this._rotation
    }

    set scale(scale) {
        TweenLite.set(this.element, {
            scale: scale,
            transformOrigin: this.transformOrigin
        });
        this._scale = scale;
    }

    get scale() {
        return this._scale
    }

    get containerBounds() {
        return this.container.bounds
    }

    get containerPolygon() {
        return this.container.polygon
    }

    mapPositionToContainerPoint(point) {
        return this.container.mapPositionToPoint(point)
    }

    capture(event) {
        return true
    }

    reset() {
        TweenLite.set(this.element, this.initialValues);
    }

    hide() {
        TweenLite.to(this.element, 0.1, {
            display: 'none',
            onComplete: e => {
                this.element.parentNode.removeChild(this.element);
            }
        });
    }

    show() {
        TweenLite.set(this.element, {display: 'block'});
    }

    showAt(p, rotationDegrees) {
        TweenLite.set(this.element, {
            display: 'block',
            x: p.x,
            y: p.y,
            rotation: rotationDegrees,
            transformOrigin: this.transformOrigin
        });
    }

    bringToFront() {
        // this.element.parentNode.appendChild(this.element)
        // uo: On Chome and Electon appendChild leads to flicker
        TweenLite.set(this.element, {zIndex: zIndex++});
    }

    toggleVideo(element) {
        if (element.paused) {
            element.play();
        } else {
            element.pause();
        }
    }

    onTap(event, interaction, point) {
        if (this.simulateClick) {
            let p = Points.fromPageToNode(this.element, point);
            let iframe = this.element.querySelector('iframe');
            if (iframe) {
                let doc = iframe.contentWindow.document;
                let element = doc.elementFromPoint(p.x, p.y);
                if (element == null) {
                    return
                }
                switch (element.tagName) {
                    case 'VIDEO':
                        console.log(element.currentSrc);
                        if (PopupMenu) {
                            PopupMenu.open(
                                {
                                    Fullscreen: () =>
                                        window.open(element.currentSrc),
                                    Play: () => element.play()
                                },
                                {x, y}
                            );
                        } else {
                            this.toggleVideo(element);
                        }
                        break
                    default:
                        element.click();
                }
            }
        }
    }

    isDescendant(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true
            }
            node = node.parentNode;
        }
        return false
    }

    fromPageToNode(x, y) {
        return Points.fromPageToNode(this.element, {x, y})
    }

    fromNodeToPage(x, y) {
        return Points.fromNodeToPage(this.element, {x, y})
    }

    _move(delta) {
        // UO: We need to keep TweenLite's _gsTransform and the private
        // _x and _y attributes aligned
        let x = this.element._gsTransform.x;
        let y = this.element._gsTransform.y;
        if (this.movableX) {
            x += delta.x;
        }
        if (this.movableY) {
            y += delta.y;
        }
        this._x = x;
        this._y = y;
        TweenLite.set(this.element, {x: x, y: y});
    }

    resizeAfterTransform(zoom) {
        let w = this.width * this.scale;
        let h = this.height * this.scale;
        TweenLite.set(this.element, {width: w, height: h});
        if (this.onResize) {
            let event = new ResizeEvent(this, {width: w, height: h});
            this.onResize(event);
        }
    }
}

class CardLoader {
    constructor(
        src,
        {
            x = 0,
            y = 0,
            width = 1000,
            height = 800,
            maxWidth = null,
            maxHeight = null,
            scale = 1,
            minScale = 0.5,
            maxScale = 1.5,
            rotation = 0
        } = {}
    ) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = 0;
        this.maxScale = maxScale;
        this.minScale = minScale;
        this.wantedWidth = width;
        this.wantedHeight = height;
        this.maxWidth = maxWidth != null ? maxWidth : window.innerWidth;
        this.maxHeight = maxHeight != null ? maxHeight : window.innerHeight;
        this.addedNode = null;
    }

    unload() {
        if (this.addedNode) {
            this.addedNode.remove();
            this.addedNode = null;
        }
    }
}







class DOMFlip {
    constructor(
        domScatterContainer,
        flipTemplate,
        frontLoader,
        backLoader,
        {
            autoLoad = false,
            center = null,
            preloadBack = false,
            translatable = true,
            scalable = true,
            rotatable = true,
            onFront = null,
            onBack = null,
            onClose = null,
            onUpdate = null,
            onRemoved = null
        } = {}
    ) {
        this.domScatterContainer = domScatterContainer;
        this.id = getId();
        this.flipTemplate = flipTemplate;
        this.frontLoader = frontLoader;
        this.backLoader = backLoader;
        this.translatable = translatable;
        this.scalable = scalable;
        this.rotatable = rotatable;
        this.onFrontFlipped = onFront;
        this.onBackFlipped = onBack;
        this.onClose = onClose;
        this.onRemoved = onRemoved;
        this.onUpdate = onUpdate;
        this.center = center;
        this.preloadBack = preloadBack;
        if (autoLoad) {
            this.load();
        }
    }

    load() {
        return new Promise((resolve, reject) => {
            let t = this.flipTemplate;
            let dom = this.domScatterContainer.element;
            let wrapper = t.content.querySelector('.flipWrapper');
            wrapper.id = this.id;
            let clone = document.importNode(t.content, true);
            dom.appendChild(clone);
            // We cannot use the document fragment itself because it
            // is not part of the main dom tree. After the appendChild
            // call we can access the new dom element by id
            this.cardWrapper = dom.querySelector('#' + this.id);
            let front = this.cardWrapper.querySelector('.front');
            this.frontLoader.load(front).then(loader => {
                this.frontLoaded(loader).then(resolve);
            });
        })
    }

    frontLoaded(loader) {
        return new Promise((resolve, reject) => {
            let scatter = new DOMScatter(
                this.cardWrapper,
                this.domScatterContainer,
                {
                    x: loader.x,
                    y: loader.y,
                    startScale: loader.scale,
                    scale: loader.scale,
                    maxScale: loader.maxScale,
                    minScale: loader.minScale,
                    width: loader.wantedWidth,
                    height: loader.wantedHeight,
                    rotation: loader.rotation,
                    translatable: this.translatable,
                    scalable: this.scalable,
                    rotatable: this.rotatable
                }
            );
            if (this.center) {
                scatter.centerAt(this.center);
            }

            let flippable = new DOMFlippable(this.cardWrapper, scatter, this);
            let back = this.cardWrapper.querySelector('.back');

            if (this.preloadBack) {
                this.backLoader.load(back).then(loader => {
                    this.setupFlippable(flippable, loader);
                });
            }
            this.flippable = flippable;
            resolve(this);
        })
    }

    centerAt(p) {
        this.center = p;
        this.flippable.centerAt(p);
    }

    zoom(scale) {
        this.flippable.zoom(scale);
    }

    setupFlippable(flippable, loader) {
        flippable.wantedWidth = loader.wantedWidth;
        flippable.wantedHeight = loader.wantedHeight;
        flippable.wantedScale = loader.scale;
        flippable.minScale = loader.minScale;
        flippable.maxScale = loader.maxScale;
        flippable.scaleButtons();
    }

    start({duration = 1.0, targetCenter = null} = {}) {
        console.log('DOMFlip.start', targetCenter);
        if (this.preloadBack) this.flippable.start({duration, targetCenter});
        else {
            let back = this.cardWrapper.querySelector('.back');
            let flippable = this.flippable;
            this.backLoader.load(back).then(loader => {
                this.setupFlippable(flippable, loader);
                flippable.start({duration, targetCenter});
            });
        }
    }

    fadeOutAndRemove() {
        TweenLite.to(this.cardWrapper, 0.2, {
            opacity: 0,
            onComplete: () => {
                this.cardWrapper.remove();
            }
        });
    }

    closed() {
        if (!this.preloadBack) {
            this.backLoader.unload();
        }
    }
}

class DOMFlippable {
    constructor(element, scatter, flip) {
        // Set log to console.log or a custom log function
        // define data structures to store our touchpoints in

        this.element = element;
        this.flip = flip;
        this.card = element.querySelector('.flipCard');
        this.front = element.querySelector('.front');
        this.back = element.querySelector('.back');
        this.flipped = false;
        this.scatter = scatter;
        this.onFrontFlipped = flip.onFrontFlipped;
        this.onBackFlipped = flip.onBackFlipped;
        this.onClose = flip.onClose;
        this.onRemoved = flip.onRemoved;
        this.onUpdate = flip.onUpdate;
        scatter.addTransformEventCallback(this.scatterTransformed.bind(this));
        console.log('lib.DOMFlippable', 5000);
        TweenLite.set(this.element, {perspective: 5000});
        TweenLite.set(this.card, {transformStyle: 'preserve-3d'});
        TweenLite.set(this.back, {rotationY: -180});
        TweenLite.set([this.back, this.front], {backfaceVisibility: 'hidden', perspective: 5000});
        TweenLite.set(this.front, {visibility: 'visible'});
        this.infoBtn = element.querySelector('.infoBtn');
        this.backBtn = element.querySelector('.backBtn');
        this.closeBtn = element.querySelector('.closeBtn');
        /* Buttons are not guaranteed to exist. */
        if (this.infoBtn) {
            this.infoBtn.onclick = () => {
                this.flip.start();
            };
            this.show(this.infoBtn);
        }
        if (this.backBtn) {
            this.backBtn.onclick = () => {
                this.start();
            };
        }
        if (this.closeBtn) {
            this.closeBtn.onclick = () => {
                this.close();
            };
            this.show(this.closeBtn);
        }
        this.scaleButtons();
        this.bringToFront();
    }

    close() {
        this.hide(this.infoBtn);
        this.hide(this.closeBtn);
        if (this.onClose) {
            this.onClose(this);
            this.flip.closed();
        } else {
            this.scatter.zoom(0.1, {
                animate: 0.5,
                onComplete: () => {
                    this.element.remove();
                    this.flip.closed();
                    if (this.onRemoved) {
                        this.onRemoved.call(this);
                    }
                }
            });
        }
    }

    showFront() {
        TweenLite.set(this.front, {visibility: 'visible'});
    }

    centerAt(p) {
        this.scatter.centerAt(p);
    }

    zoom(scale) {
        this.scatter.zoom(scale);
    }

    get buttonScale() {
        let iscale = 1.0;
        if (this.scatter != null) {
            iscale = 1.0 / this.scatter.scale;
        }
        return iscale
    }

    scaleButtons() {
        TweenLite.set([this.infoBtn, this.backBtn, this.closeBtn], {
            scale: this.buttonScale
        });
    }

    bringToFront() {
        this.scatter.bringToFront();
        TweenLite.set(this.element, {zIndex: DOMFlippable.zIndex++});
    }

    clickInfo() {
        this.bringToFront();
        this.infoBtn.click();
    }

    scatterTransformed(event) {
        this.scaleButtons();
    }

    targetRotation(alpha) {
        let ortho = 90;
        let rest = alpha % ortho;
        let delta = 0.0;
        if (rest > ortho / 2.0) {
            delta = ortho - rest;
        } else {
            delta = -rest;
        }
        return delta
    }

    infoValues(info) {
        let startX = this.element._gsTransform.x;
        let startY = this.element._gsTransform.y;
        let startAngle = this.element._gsTransform.rotation;
        let startScale = this.element._gsTransform.scaleX;
        let w = this.element.style.width;
        let h = this.element.style.height;
        console.log(info, startX, startY, startAngle, startScale, w, h);
    }

    show(element) {
        if (element) {
            TweenLite.set(element, {visibility: 'visible', display: 'initial'});
        }
    }

    hide(element) {
        if (element) {
            TweenLite.set(element, {visibility: 'hidden', display: 'none'});
        }
    }

    start({duration = 1.0, targetCenter = null} = {}) {
        this.bringToFront();
        if (!this.flipped) {
            this.startX = this.element._gsTransform.x;
            this.startY = this.element._gsTransform.y;
            this.startAngle = this.element._gsTransform.rotation;
            this.startScale = this.element._gsTransform.scaleX;
            this.startWidth = this.element.style.width;
            this.startHeight = this.element.style.height;
            this.scatterStartWidth = this.scatter.width;
            this.scatterStartHeight = this.scatter.height;
            this.show(this.back);
            this.hide(this.infoBtn);
            this.hide(this.closeBtn);
        } else {
            this.show(this.front);
            this.hide(this.backBtn);
        }
        let {scalable, translatable, rotatable} = this.scatter;
        this.saved = {scalable, translatable, rotatable};
        this.scatter.scalable = false;
        this.scatter.translatable = false;
        this.scatter.rotatable = false;

        this.flipped = !this.flipped;
        let targetY = this.flipped ? 180 : 0;
        let targetZ = this.flipped
            ? this.startAngle + this.targetRotation(this.startAngle)
            : this.startAngle;
        let targetScale = this.flipped ? this.wantedScale : this.startScale;
        let w = this.flipped ? this.wantedWidth : this.startWidth;
        let h = this.flipped ? this.wantedHeight : this.startHeight;
        let dw = this.wantedWidth - this.scatter.width;
        let dh = this.wantedHeight - this.scatter.height;

        let xx =
            targetCenter != null ? targetCenter.x - w / 2 : this.startX - dw / 2;
        let yy =
            targetCenter != null ? targetCenter.y - h / 2 : this.startY - dh / 2;
        let x = this.flipped ? xx : this.startX;
        let y = this.flipped ? yy : this.startY;

        //console.log("DOMFlippable.start", this.flipped, targetCenter, x, y, this.saved)
        // targetZ = Angle.normalizeDegree(targetZ)
        let onUpdate = this.onUpdate !== null ? () => this.onUpdate(this) : null;
        TweenLite.to(this.card, duration, {
            rotationY: targetY + 0.1,
            transformOrigin: '50% 50%',
            onUpdate,
            onComplete: e => {
                if (this.flipped) {
                    //this.hide(this.front)
                    this.show(this.backBtn);
                    if (this.onFrontFlipped) {
                        this.onFrontFlipped(this);
                    }
                } else {
                    //this.hide(this.back)
                    if (this.onBackFlipped == null) {
                        this.show(this.infoBtn);
                        this.show(this.closeBtn);
                    } else {
                        this.onBackFlipped(this);
                    }
                    this.flip.closed();
                }
                this.scatter.scale = targetScale;
                this.scaleButtons();
                this.scatter.rotationDegrees = targetZ;
                this.scatter.width = this.flipped ? w : this.scatterStartWidth;
                this.scatter.height = this.flipped ? h : this.scatterStartHeight;

                let {scalable, translatable, rotatable} = this.saved;
                this.scatter.scalable = scalable;
                this.scatter.translatable = translatable;
                this.scatter.rotatable = rotatable;

                this.bringToFront();
            },
            force3D: true
        });

        TweenLite.to(this.element, duration / 2, {
            scale: targetScale,
            rotationZ: targetZ  + 0.1,
            transformOrigin: '50% 50%',
            width: w,
            height: h,
            x: x,
            y: y,
            onComplete: e => {
                if (this.flipped) {
                    this.hide(this.front);
                } else {
                    this.hide(this.back);
                }
            }
        });
    }
}

DOMFlippable.zIndex = 0;

function isEven(n) {
    return n % 2 == 0
}

/**
 * A utility class that holds information typically provided by DZI files, i.e.
 * height and width of the overall image, overlap, and image type.
 *
 * @constructor
 * @param {obj} attrs - A JSON-Object holding the listed keys and values
 * @example
 *     {
 *         "tileSize": 1024,
 *         "format": "jpeg",
 *         "overlap": 1,
 *         "height": 4794,
 *         "width": 4095,
 *         "clip": { "minLevel": 12, "maxLevel": 20, "startCol": 301436, "startRow": 354060 },
 *                   // optional: minLevel and maxLevel define the level bounds
 *                   // startCol: first col at maxLevel
 *                   // startRow: first row at maxLevel
 *         "path": "var/Vermeer/Vermeer_files",
 *         "type": "dzi",  // optional: dzi (default) or map
 *         "urlTileTemplate": "{path}/{level}/{column}/{row}.{format}"
 *           // optional: {path}/{level}/{column}_{row}.{format} (default) or
 *           // a template String with the format of the URL
 *     }
 */
class DeepZoomInfo {
    constructor(attrs) {
        for (let key in attrs) {
            this[key] = attrs[key];
        }
        this.maxLevel = 0; // The highest level number, typically corresponds to the
        // number in the file system for the folder with tiles
        this.clip = this.clip || null; // e.g. { level: 12, col: 301436, row: 354060 }
        this.type = this.type || 'dzi';
        this.urlTileTemplate =
            this.urlTileTemplate || '{path}/{level}/{column}_{row}.{format}';
        this.setupDimensions();
    }

    /* Computes the needed number of layers from the width and height
    *  of the image. Note that this includes the level 0, i.e. 0 ... 4
    * means that 5 levels exist.
    **/
    numLevels() {
        let maxDimension = Math.max(this.width, this.height);
        let boundary = this.type === 'dzi' ? 1 : this.tileSize;
        let numLevels = 0;
        while (maxDimension >= boundary) {
            maxDimension /= 2;
            numLevels++;
        }
        return numLevels
    }

    /** Computes the scale at the given level.
     * @param {number} level - The level of the wanted layer
     * @returns {number} scale
     **/
    getScale(level) {
        let scale = 1;
        if (this.type === 'dzi') {
            scale = Math.pow(0.5, this.maxLevel - level + 1);
        } else {
            scale = Math.pow(0.5, this.maxLevel - level);
        }
        return scale
    }

    /** Computes the scaled width and height of the given level.
     * @param {number} level - The level of the wanted layer
     * @returns {array} size - The width and height
     **/
    getDimensions(level) {
        let scale = this.getScale(level);
        let w = Math.ceil(this.width * scale);
        let h = Math.ceil(this.height * scale);
        return [w, h]
    }

    /** Computes the number of cols and rows of tiles.
     * @param {number} level - The level of the wanted layer
     * @returns {array} size - The cols and rows
     **/
    getNumTiles(level) {
        let dim = this.getDimensions(level);
        let cols = Math.ceil(dim[0] / this.tileSize);
        let rows = Math.ceil(dim[1] / this.tileSize);
        if (this.clip) {
            let rest = this.rests[level];
            if (rest) {
                if (rest.restCol) {
                    cols += 1;
                }
                if (rest.restRows) {
                    rows += 1;
                }
            }
        }
        return [cols, rows]
    }

    setupDimensions(loadBaseImage = false) {
        /** Setup instance variables and load the base image, i.e. the largest
        image that can be represented as a single tile.
        @private
        **/
        let ww = this.width;
        let hh = this.height;
        let scale = 1.0;
        let level = 0;
        let single = 0;
        const tsize = this.tileSize;

        if (this.clip) {
            this.baseLevel = this.clip.minLevel;
            this.maxLevel = this.clip.maxLevel;
            this.baseImage = null;
            this.size = this.getDimensions(this.baseLevel);
            this.offsets = {};
            this.rests = {};
            let startCol = this.clip.startCol;
            let startRow = this.clip.startRow;
            let floatStartCol = startCol;
            let floatStartRow = startRow;
            for (let i = this.maxLevel; i >= this.baseLevel; i--) {
                this.offsets[i] = {startCol, startRow};
                let restCol = floatStartCol % 1;
                let restRow = floatStartRow % 1;
                this.rests[i] = {restCol, restRow};
                startCol = Math.floor(startCol / 2);
                startRow = Math.floor(startRow / 2);
                floatStartCol /= 2;
                floatStartRow /= 2;
            }
        } else {
            const boundary = this.type === 'dzi' ? 1.0 : tsize;
            while (ww > boundary && hh > boundary) {
                if (ww >= tsize && hh >= tsize) {
                    single += 1;
                }
                scale = scale / 2.0;
                ww = Math.ceil(this.width * scale);
                hh = Math.ceil(this.height * scale);
                level += 1;
            }
            this.baseLevel = level - single;
            this.maxLevel = this.numLevels() - 1;
            this.baseURL = this.urlForTile(this.baseLevel, 0, 0, false);

            if (loadBaseImage) {
                this.imageForURL(this.baseURL, e => {
                    this.size = [e.target.naturalWidth, e.target.naturalHeight];
                    this.baseImage = e.target;
                });
            } else {
                this.baseImage = null;
                this.size = this.getDimensions(this.baseLevel);
            }
        }
    }

    get maxLoadableLevel() {
        if (this.clip) {
            return this.maxLevel
        }
        return this.type === 'dzi' ? this.maxLevel : this.maxLevel
    }

    /** Computes the url for the given level, column and and row.
     * @param {number} level - The level of the wanted layer
     * @param {number} column - The column of the tile
     * @param {number} row - The row of the tile
     * @returns {string} url
     **/
    urlForTile(level, column, row, compressed = true) {
        let format = this.format;
        if (compressed && this.compression) {
            let supported = Capabilities.isIOS ? 'pvr' : 'dds';
            if (this.compression.indexOf(supported) >= 0) {
                format = supported;
            }
        }
        if (this.clip) {
            let offset = this.offsets[level];
            if (offset) {
                let {startCol, startRow} = offset;
                column += startCol;
                row += startRow;
            }
        }
        let url = this.urlTileTemplate
            .replace(/\{path\}/g, this.path)
            .replace(/\{level\}/g, level)
            .replace(/\{row\}/g, row)
            .replace(/\{column\}/g, column)
            .replace(/\{format\}/g, format);
        return url
    }

    /** Loads the image for the given url and executes a callback function
    on completion.
    * @param {string} url - The url of the tile
    * @param {function} complete - The callback function
    * @returns {Image} obj
    **/
    imageForURL(url, complete) {
        let img = new Image();
        img.onload = complete.bind(this);
        img.src = url;
        return img
    }

    /** Computes the columns and rows as well as scaled width and height.
     * @param {number} level - The level of the wanted layer
     * @returns {array} [cols, rows, width, height]
     **/
    dimensions(level) {
        let dim = this.getDimensions(level);
        let tiles = this.getNumTiles(level);
        return [tiles[0], tiles[1], dim[0], dim[1]]
    }

    test() {
        //console.log("w=" + this.width + " h=" + this.height + " maxlevel=" + this.maxLevel + " base=" + this.baseLevel)
        for (let i = 0; i <= this.maxLevel; i++) {
            console.log(
                ' ' +
                    i +
                    ' -> ' +
                    this.getScale(i) +
                    ' [' +
                    this.dimensions(i) +
                    ']'
            );
        }
        console.log(this.urlForTile(this.baseLevel, 0, 0));
    }
}

/**
 * A utility class that describes a quad tree of tiles. Each tile on a given
 * level has up to four corresponding tiles on the next level. A TileQuadNode
 * uses the attributes nw (i.e. northwest), ne, sw, se to link to the
 * quad nodes on the next level. The previous attributes links to the quad
 * one level below that holds the given quad as nw, ne, sw, or se.
 * We use this node class because we need a representation of tiles that are
 * needed but not loaded yet to compute tiles which can be abandoned to reduce
 * the memory pressure.
 *
 * @constructor
 * @param {level} Number - The level the quad node belongs to
 * @param {col} Number - The col of the quad
 * @param {row} Number - The level the quad node belongs to
 * @param {url} String - The level the quad node belongs to
 */
class TileQuadNode {
    constructor(level, col, row, url) {
        this.level = level;
        this.col = col;
        this.row = row;
        this.url = url;
        this.nw = null;
        this.ne = null;
        this.sw = null;
        this.se = null;
        this.previous = null;
    }

    /** Return True if this node has no successors and can be used as
    an indicator of tiles to free.
    **/
    noQuads() {
        if (this.previous === null) return false
        return (
            this.nw === null &&
            this.ne === null &&
            this.sw === null &&
            this.se === null
        )
    }

    /** Unlink the given quad node

    * @param {node} TileQuadNode - The TileQuadNode to remove
    **/
    unlink(node) {
        if (this.nw === node) this.nw = null;
        if (this.ne === node) this.ne = null;
        if (this.sw === node) this.sw = null;
        if (this.se === node) this.se = null;
    }

    /** Link this quad node to the given previous node. Use the north
    * and west flags to address nw, ne, sw, and se.

    * @param {node} TileQuadNode - The TileQuadNode to remove
    * @param {north} Boolean - Link to north (true) or south (false)
    * @param {west} Boolean - Link to west (true) or east (false)
    **/
    link(north, west, previous) {
        this.previous = previous;
        if (north) {
            if (west) {
                previous.nw = this;
            } else {
                previous.ne = this;
            }
        } else {
            if (west) {
                previous.sw = this;
            } else {
                previous.se = this;
            }
        }
    }
}

/** The current Tile implementation simply uses PIXI.Sprites.
 *
 * BTW: PIXI.extras.TilingSprite is not appropriate. It should be used for
 * repeating patterns.
 **/
class Tile extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
    }
}

/**
 * A Tile Loader component that can be plugged into a Tiles Layer.
 */
class TileLoader {
    constructor(tiles) {
        this.debug = false;
        this.tiles = tiles;
        this.setup();
    }

    /** Setup collections and instance vars. */
    setup() {
        this.map = new Map(); // Map {url : [ col, row]}
        this.loading = new Set(); // Set url
        this.loaded = new Map(); // Map {url : sprite }
        this.loadQueue = [];
    }

    /** Schedules a tile url for loading. The loading itself must be triggered
    by a call to loadOneTile or loadAll

    * @param {String} url - the url of the texture / tile
    * @param {Number} col - the tile col
    * @param {Number} row - the tile row
    **/
    schedule(url, col, row) {
        if (this.loaded.has(url)) return false
        if (this.loading.has(url)) return false
        this.map.set(url, [col, row]);
        this.loading.add(url);
        this.loadQueue.push(url);
        return true
    }

    /** Cancels loading by clearing the load queue **/
    cancel() {
        this.loadQueue = [];
        this.loading.clear();
    }

    /** Destroys alls collections. **/
    destroy() {
        this.setup();
    }

    /** Private method. Informs the tile layer about a texture for a given url.
     * Creates the sprite for the loaded texture and informs the tile layer.
     * @param {String} url - the url
     * @param {Object} texture - the loaded resource
     **/
    _textureAvailable(url, col, row, texture) {
        let tile = new Tile(texture);
        this.loaded.set(url, tile);
        this.tiles.tileAvailable(tile, col, row, url);
    }
}

/**
 * A Tile Loader component that can be plugged into a Tiles Layer.
 * Uses the PIXI Loader but can be replaced with othe loaders implementing
 * the public methods without underscore.
 * Calls the Tiles.tileAvailable method if the sprite is available.
 **/
class PIXITileLoader extends TileLoader {

    constructor(tiles, compression) {
        super(tiles);
        this.loader = new PIXI.loaders.Loader();
        this.loader.on('load', this._onLoaded.bind(this));
        this.loader.on('error', this._onError.bind(this));
        if (compression) {
            this.loader.pre(PIXI.compressedTextures.imageParser());
        }
    }

    schedule(url, col, row) {
        // Overwritten schedule to avoid BaseTexture and Texture already loaded errors.
        let texture = PIXI.utils.TextureCache[url];
        if (texture) {
            if (this.debug) console.log('Texture already loaded', texture);
            this._textureAvailable(url, col, row, texture);
            return false
        }
        let base = PIXI.utils.BaseTextureCache[url];
        if (base) {
            if (this.debug) console.log('BaseTexture already loaded', base);
            let texture = new PIXI.Texture(base);
            this._textureAvailable(url, col, row, texture);
            return false
        }
        return super.schedule(url, col, row)
    }

    /** Load one and only one of the scheduled tiles **/
    loadOneTile() {
        this._loadOneTile();
    }

    /** Load all scheduled tiles **/
    loadAll() {
        this._loadAllTiles();
    }

    /** Destroys the loader completly **/
    destroy() {
        this.loader.reset();
        super.destroy();
    }

    _onError(loader, error) {
        console.warn('Cannot load', error);
    }

    /** Private method. Called by the PIXI loader after each successfull
     * loading of a single tile.
     * Creates the sprite for the loaded texture and informs the tile layer.
     * @param {Object} loader - the loader instance
     * @param {Object} resource - the loaded resource with url and texture attr
     **/
    _onLoaded(loader, resource) {
        try {
            let [col, row] = this.map.get(resource.url);
            this._textureAvailable(resource.url, col, row, resource.texture);
        }
        catch(err) {
            console.warn("Texture unavailable: " + err.message);
        }
    }

    /** Private method: loads one tile from the queue. **/
    _loadOneTile(retry = 1) {
        //console.log("_loadOneTile")
        if (this.loader.loading) {
            setTimeout(() => {
                this._loadOneTile();
            }, retry);
            return
        }
        if (this.loadQueue.length > 0) {
            let url = this.loadQueue.pop();
            this.loader.add(url, url);
            this.loader.load();
        }
    }

    /** Private method: loads all tiles from the queue in batches. Batches are
    helpfull to avoid loading tiles that are no longer needed because the
    user has already zoomed to a different level.**/
    _loadAllTiles(batchSize = 8, retry = 16) {
        if (this.loadQueue.length > 0) {
            if (this.loader.loading) {
                //console.log("Loader busy", this.loadQueue.length)
                setTimeout(() => {
                    this._loadAllTiles();
                }, retry);
                return
            }
            let i = 0;
            let urls = [];
            while (i < batchSize && this.loadQueue.length > 0) {
                let url = this.loadQueue.pop();
                if (!this.loaded.has(url)) {
                    urls.push(url);
                    i += 1;
                }
            }
            this.loader.add(urls).load(() => this._loadAllTiles());
        }
    }
}

class WorkerTileLoader extends TileLoader {

    constructor(tiles) {
        super(tiles);
        let worker = this.worker = new Worker("../../lib/pixi/tileloader.js");
        worker.onmessage = (event) => {
            if (event.data.success) {
                 let {url, col, row, buffer} = event.data;
                 //console.log("WorkerTileLoader.loaded", url, buffer)
                 let CompressedImage = PIXI.compressedTextures.CompressedImage;
                 let compressed = CompressedImage.loadFromArrayBuffer(buffer, url);
                 let base = new PIXI.BaseTexture(compressed);
                 let texture = new PIXI.Texture(base);
                 this._textureAvailable(url, col, row, texture);
            }
         };
    }

    loadOne() {
        if (this.loadQueue.length > 0) {
            let url = this.loadQueue.pop();
            let [col, row] = this.map.get(url);
            let tile = [col, row, url];
            this.worker.postMessage({command: "load", tiles: [tile]});
        }
    }

    loadAll() {
        let tiles = [];
        while(this.loadQueue.length > 0) {
            let url = this.loadQueue.pop();
            let [col, row] = this.map.get(url);
            tiles.push([col, row, url]);
        }
        this.worker.postMessage({command: "load", tiles});
    }

    cancel() {
        super.cancel();
        this.worker.postMessage({command: "abort"});
    }

    destroy() {
        this.worker.postMessage({command: "abort"});
        this.worker.terminate();
        this.worker = null;
        super.destroy();
    }
}
/**
 * A layer of tiles that represents a zoom level of a DeepZoomImage as a grid
 * of sprites.
 * @constructor
 * @param {number} level - the zoom level of the tile layer
 * @param {DeepZoomImage} view - the zoomable image the layer belongs to
 * @param {number} scale - the scale of the tile layer
 * @param {number} cols - the number of columns of the layer
 * @param {number} rows - the number of rows of the layer
 * @param {number} width - the width of the layer in pixel
 * @param {number} height - the height of the layer in pixel
 * @param {number} tileSize - the size of a single tile in pixel
 * @param {number} overlap - the overlap of the tiles in pixel
 * @param {number} fadeInTime - time needed to fade in tiles if TweenLite is set
 **/
class Tiles extends PIXI.Container {
    constructor(
        level,
        view,
        scale,
        cols,
        rows,
        width,
        height,
        tileSize,
        overlap,
        fadeInTime = 0.25
    ) {
        super();
        this.debug = false;
        this.showGrid = false;
        this.view = view;
        this.level = level;
        this.cols = cols;
        this.rows = rows;
        this.pixelWidth = width;
        this.pixelHeight = height;
        this.tileSize = tileSize;
        this.overlap = overlap;
        this.needed = new Map(); // url as key, [col, row] as value
        this.requested = new Set();
        this.available = new Map();
        this.scale.set(scale, scale);
        this.tileScale = scale;
        this.fadeInTime = fadeInTime;
        this.keep = false;
        if (this.view.preferWorker && view.info.compression.length>0)
            this.loader = new WorkerTileLoader(this);
        else
            this.loader = new PIXITileLoader(this, view.info.compression);
        this.interactive = false;
        this._highlight = null;
        this.pprint();
    }

    /** Tests whether all tiles are loaded. **/
    isComplete() {
        return this.cols * this.rows === this.children.length
    }

    /** Returns the highligh graphics layer for debugging purposes.
     **/
    get highlight() {
        if (this._highlight == null) {
            let graphics = new PIXI.Graphics();
            graphics.beginFill(0xffff00, 0.1);
            graphics.lineStyle(2, 0xffff00);
            graphics.drawRect(1, 1, tileSize - 2, tileSize - 2);
            graphics.endFill();
            graphics.interactive = false;
            this._highlight = graphics;
        }
        return this._highlight
    }

    /** Helper method pretty printing debug information. **/
    pprint() {
        console.log(
            'Tiles level: ' +
                this.level +
                ' scale: ' +
                this.scale.x +
                ' cols: ' +
                this.cols +
                ' rows: ' +
                this.rows +
                ' w: ' +
                this.pixelWidth +
                ' h: ' +
                this.pixelHeight +
                ' tsize:' +
                this.tileSize
        );
    }

    /** Computes the tile position and obeys the overlap.
     * @param {number} col - The column of the tile
     * @param {number} row - The row of the tile
     * @returns {PIXI.Point} obj
     **/
    tilePosition(col, row) {
        let x = col * this.tileSize;
        let y = row * this.tileSize;
        let overlap = this.overlap;
        if (col != 0) {
            x -= overlap;
        }
        if (row != 0) {
            y -= overlap;
        }
        return new PIXI.Point(x, y)
    }

    /** Computes the tile size without overlap
     * @param {number} col - The column of the tile
     * @param {number} row - The row of the tile
     * @returns {PIXI.Point} obj
     **/
    tileDimensions(col, row) {
        let w = this.tileSize;
        let h = this.tileSize;
        let pos = this.tilePosition(col, row);
        if (col == this.cols - 1) {
            w = this.pixelWidth - pos.x;
        }
        if (row == this.rows - 1) {
            h = this.pixelHeight - pos.y;
        }
        return new PIXI.Point(w, h)
    }

    /** Method to support debugging. Highlights the specified tile at col, row **/
    highlightTile(col, row) {
        if (col > -1 && row > -1 && col < this.cols && row < this.rows) {
            let graphics = this.highlight;
            let dim = this.tileDimensions(col, row);
            graphics.position = this.tilePosition(col, row);
            graphics.clear();
            graphics.beginFill(0xff00ff, 0.1);
            graphics.lineStyle(2, 0xffff00);
            graphics.drawRect(1, 1, dim.x - 2, dim.y - 2);
            graphics.endFill();
            this.addChild(this.highlight);
        } else {
            this.removeChild(this.highlight);
        }
    }

    /** Loads the tiles for the given urls and adds the tiles as sprites.
     * @param {array} urlpos - An array of URL, pos pairs
     * @param {boolean} onlyone - Loads only on tile at a time if true
     **/
    loadTiles(urlpos, onlyone, refCol, refRow) {
        if (this.showGrid) {
            this.highlightTile(refCol, refRow);
        }
        urlpos.forEach(d => {
            let [url, col, row] = d;
            if (this.loader.schedule(url, col, row)) {
                if (onlyone) {
                    return this.loader.loadOneTile()
                }
            }
        });
        this.loader.loadAll();
    }

    /** Private method: add a red border to a tile for debugging purposes. **/
    _addTileBorder(tile, col, row) {
        let dim = this.tileDimensions(col, row);
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0, 0);
        graphics.lineStyle(2, 0xff0000);
        graphics.drawRect(1, 1, dim.x - 2, dim.y - 2);
        graphics.endFill();
        tile.addChild(graphics);
    }

    /** Adds a tile. **/
    addTile(tile, col, row, url) {
        if (this.available.has(url)) return
        this.addChild(tile);
        this.available.set(url, tile);
    }

    //    * Remove a tile. **/
    //     removeTile(col, row, url) {
    //         if (this.available.has(url)) {
    //             let tile = this.available.get(url)
    //             this.removeChild(tile)
    //             tile.destroy(true)
    //             if (this.debug) console.log("Destroyed tile", url)
    //             this.available.delete(url)
    //         }
    //     }

    /** Called by the loader after each successfull loading of a single tile.
     * Adds the sprite to the tile layer.
     * @param {Object} tile - the loaded tile sprite
     * @param {Number} col - the col position
     * @param {Number} row - the rowposition
     **/
    tileAvailable(tile, col, row, url) {
        let pos = this.tilePosition(col, row);
        if (this.showGrid) {
            this._addTileBorder(tile, col, row);
        }
        tile.position = pos;
        tile.interactive = false;
        if (TweenMax) {
            tile.alpha = 0;
            TweenMax.to(tile, this.fadeInTime, {alpha: this.alpha});
        }
        this.addTile(tile, col, row, url);
    }

    /** Destroys the tiles layer and    destroys the loader. Async load calls are
     * cancelled.
     **/
    destroy() {
        this.loader.destroy();
        app.renderer.textureGC.unload(this);
        super.destroy(true); // Calls destroyChildren
        this.available.clear();
    }

    /* Destroys the tiles which are not with the bounds of the app to free
    * memory.
    **/
    destroyTiles(quadTrees) {
        let count = 0;
        for (let [url, tile] of this.available.entries()) {
            if (!quadTrees.has(url)) {
                this.removeChild(tile);
                tile.destroy(true);
                this.requested.delete(url);
                this.available.delete(url);
                count += 1;
            }
        }
        if (count && this.debug)
            console.log('destroyObsoleteTiles', this.level, count);
    }

    tintTiles(quadTrees) {
        for (let [url, tile] of this.available.entries()) {
            if (!quadTrees.has(url)) tile.tint = 0xff0000;
        }
    }

    untintTiles() {
        for (let [url, tile] of this.available.entries()) {
            tile.tint = 0xffffff;
        }
    }
}

/**
* The main class of a deeply zoomable image that is represented by a hierarchy
* of tile layers for each zoom level. This gives the user the impression that
* even huge pictures (up to gigapixel-images) can be zoomed instantaneously,
* since the tiles at smaller levels are scaled immediately and overloaded by
* more detailed tiles at the larger level as fast as possible.

* @constructor
* @param {DeepZoomInfo} deepZoomInfo - Information extracted from a JSON-Object
*/
class DeepZoomImage extends PIXI.Container {
    constructor(
        deepZoomInfo,
        {
            debug = false,
            shadow = false,
            center = false,
            highResolution = true,
            autoLoadTiles = true,
            preferWorker = false,
            minimumLevel = 0,
            alpha = 1
        } = {}
    ) {
        super();
        this.debug = debug;
        this.shadow = shadow;
        this.preferWorker = preferWorker;
        this.resolution = highResolution
            ? Math.round(window.devicePixelRatio)
            : 1;
        this.alpha = alpha;
        this.fastLoads = 0;
        this.autoLoadTiles = autoLoadTiles;
        this.minimumLevel = minimumLevel;
        this.quadTrees = new Map(); // url as keys, TileQuadNodes as values
        this.setup(deepZoomInfo, center);
        if (debug) {
            console.log('DeepZoomImage.constructor', minimumLevel);
            console.log("   prefers worker loader");
        }
    }

    /** Reads the DeepZoomInfo object and initializes all tile layers.
     * Called by the constructor.
     * Creates the sprite for the loaded texture and add the sprite to the tile
     * layer.
     * @param {Object} deepZoomInfo - the DeepZoomInfo instance
     * @param {boolean} center - If true ensures that the pivot is set to the center
     **/
    setup(deepZoomInfo, center) {
        this.info = deepZoomInfo;
        this.interactive = true;
        this.tileLayers = {};

        this._foreground = null;
        this.tileContainer = new PIXI.Container();
        this.tileContainer.interactive = false;
        let [w, h] = this.baseSize;
        if (this.shadow) {
            this.filters = [new PIXI.filters.DropShadowFilter(45, 3)];
        }
        this.addChild(this.tileContainer);

        if (deepZoomInfo.clip) {
            let mask = new PIXI.Graphics();
            mask.beginFill(1, 1);
            mask.drawRect(0, 0, w, h);
            mask.endFill();
            this.mask = mask;
            this.addChild(mask);
            this.minimumLevel = deepZoomInfo.baseLevel;
        }
        this.currentLevel = Math.max(this.minimumLevel, deepZoomInfo.baseLevel);
        if (this.autoLoadTiles) {
            this.setupTiles(center);
        }
    }

    /** Default setup method for tiles. Loads all tiles of the current level.
    Can be overwritten in subclasses.
    @param {boolean} center - If true ensures that the pivot is set to the center
    **/
    setupTiles(center = false) {
        // First load background tile
        let tiles = this.ensureAllTiles(this.currentLevel);
        if (center) {
            this.pivot.set(w / 2, h / 2);
        }
        let scaleLevel = this.levelForScale(1);
        this.ensureAllTiles(scaleLevel);
    }

    removeTileQuadNode(level, col, row, url) {
        if (this.quadTrees.has(url)) {
            let quad = this.quadTrees.get(url);
            this.tileQuadRemoved(quad);
            this.quadTrees.delete(url);
        }
    }

    addTileQuadNode(level, col, row, url) {
        if (this.quadTrees.has(url)) return this.quadTrees.get(url)
        let quad = new TileQuadNode(level, col, row, url);
        this.quadTrees.set(url, quad);
        this.tileQuadAdded(quad);
        return quad
    }

    tileQuadRemoved(quad) {
        let below = quad.previous;
        // if (this.debug) console.log("tileQuadRemoved", quad)
        if (below) {
            below.unlink(quad);
            if (below.noQuads()) {
                if (this.debug) console.log('Removed tile below');
                let levelBelow = quad.level - 1;
                if (levelBelow < this.minimumLevel) return
                let c = Math.floor(quad.col / 2);
                let r = Math.floor(quad.row / 2);
                let urlBelow = this.info.urlForTile(levelBelow, c, r);
                if (this.quadTrees.has(urlBelow)) {
                    this.removeTileQuadNode(levelBelow, c, r, urlBelow);
                }
            }
        }
    }

    tileQuadAdded(quad) {
        let levelBelow = quad.level - 1;
        if (levelBelow < this.minimumLevel) return
        //if (this.debug) console.log("tileQuadAdded", quad)
        let c = Math.floor(quad.col / 2);
        let r = Math.floor(quad.row / 2);
        let urlBelow = this.info.urlForTile(levelBelow, c, r);
        let below = null;
        if (!this.quadTrees.has(urlBelow)) {
            below = this.addTileQuadNode(levelBelow, c, r, urlBelow);
            quad.link(isEven(quad.row), isEven(quad.col), below);
        }
    }

    /** Returns the tile layer level that corresponds to the given scale.
     * @param {number} scale - the scale factor
     **/
    levelForScale(scale) {
        let level = Math.round(Math.log2(scale * this.resolution)); // Math.floor(Math.log2(event.scale))+1
        let newLevel = this.info.baseLevel + Math.max(level, 0);
        return Math.min(newLevel, this.info.maxLoadableLevel)
    }


    /** Adds a tile layer to the DeepZoomImage.
     * @param {string} key - the access key
     * @param {Tiles} tiles - the tile layer object
     **/
    addTiles(key, tiles) {
        this.tileContainer.addChild(tiles);
        this.tileLayers[key] = tiles;
    }

    /** Getter for PIXI.Container foreground layer.
     * Adds a PIXI.Container if necessary.
     **/
    get foreground() {
        if (this._foreground == null) {
            this._foreground = new PIXI.Container();
            this.addChild(this._foreground);
        }
        return this._foreground
    }

    /** Getter for the DeepZoomInfo base level size.
     **/
    get baseSize() {
        return this.info.getDimensions(this.info.baseLevel)
    }

    /** Getter for the current scaled size in pixels.
     **/
    get pixelSize() {
        let [w, h] = this.baseSize;
        return [w * this.scale.x, h * this.scale.y]
    }

    /** Getter for the max scale factor.
     **/
    get maxScale() {
        let delta = this.info.maxLevel - this.info.baseLevel;
        return Math.pow(2, delta) / this.resolution * 2
    }

    /** Getter for the current width.
     **/
    get width() {
        return this.pixelSize[0]
    }

    /** Getter for the current height.
     **/
    get height() {
        return this.pixelSize[1]
    }

    /** Overrides PIXI.Container.hitArea()
     * Allows to optimize the hit testing. Container with hit areas are directly
     * hit tested without consideration of children.
     */
    get hitArea() {
        return this
    }

    /** Overrides PIXI.Container.contains()
     * Allows to optimize the hit testing.
     */
    contains(x, y) {
        let [w, h] = this.baseSize;
        return x >= 0 && x <= w && y >= 0 && y <= h
    }

    /** Overrides PIXI.Container._calculateBounds()
     * Only considers the base size and reduces the calculation to a single
     * rect.
     */
    _calculateBounds() {
        let [w, h] = this.baseSize;
        this._bounds.addFrame(this.transform, 0, 0, w, h);
    }

    /** Overrides PIXI.Container.calculateBounds()
     * Skips the children and only considers the deep zoom base size. Calls
     * the also overwritten _calculateBounds method.
     */
    calculateBounds() {
        this._bounds.clear();
        this._calculateBounds();
        this._lastBoundsID = this._boundsID;
    }

    /** Returns a single sprite that can be used a thumbnail representation of
     * large images.
     * @return {Sprite} sprite - A sprite with a single tile texture
     */
    thumbnail() {
        return new PIXI.Sprite.fromImage(this.info.baseURL)
    }

    /** Returns a list of all tiles of a given level.
     * @param {Tiles} tiles - the grid of tiles
     * @param {number} level - The zoom level of the grid
     * @return {Array[]} - An array of [url, col, row] arrays
     **/
    allTiles(tiles, level) {
        let result = [];
        for (let col = 0; col < tiles.cols; col++) {
            for (let row = 0; row < tiles.rows; row++) {
                let url = this.info.urlForTile(level, col, row);
                result.push([url, col, row]);
            }
        }
        return result
    }

    /** Loads all tiles that are needed to fill the app bounds.
     * @param {Tiles} tiles - the grid of tiles
     * @param {number} level - The zoom level of the grid
     * @param {boolean} debug
     * @return {Array[]} - An array of [url, col, row] arrays
     */
    neededTiles(tiles, level, debug = false) {
        let result = [];
        let tsize = tiles.tileSize;
        let domBounds = app.view.getBoundingClientRect();
        let maxWidth = domBounds.width;
        let maxHeight = domBounds.height;
        let offset = tsize;
        let bounds = new PIXI.Rectangle(
            -offset,
            -offset,
            maxWidth + 2 * offset,
            maxHeight + 2 * offset
        );
        let scaledTileSize = tsize * tiles.tileScale;
        let pointInWindow = new PIXI.Point();

        let worldTransform = this.worldTransform;
        let worldCenter = new PIXI.Point(maxWidth / 2, maxWidth / 2);

        let tilesCenter = this.toLocal(worldCenter);
        /* UO: we need a toLocal call here since the transform may need an update
        which is guaranteed by the toLocal method. */
        let centerCol = Math.round(tilesCenter.x / scaledTileSize);
        let centerRow = Math.round(tilesCenter.y / scaledTileSize);

        let maxTilesWidth =
            Math.ceil(maxWidth / tiles.tileSize / 2 + 6) * this.resolution;
        let maxTilesHeight =
            Math.ceil(maxHeight / tiles.tileSize / 2 + 4) * this.resolution;

        let startCol = Math.max(0, centerCol - maxTilesWidth);
        let endCol = Math.min(tiles.cols, centerCol + maxTilesWidth);

        let startRow = Math.max(0, centerRow - maxTilesHeight);
        let endRow = Math.min(tiles.rows, centerRow + maxTilesHeight);

        for (let col = startCol; col < endCol; col++) {
            let cx = (col + 0.5) * scaledTileSize;
            for (let row = startRow; row < endRow; row++) {
                let cy = (row + 0.5) * scaledTileSize;
                let tileCenter = new PIXI.Point(cx, cy);
                // This replaces the more traditional this.toGlobal(center, pointInWindow, true)
                worldTransform.apply(tileCenter, pointInWindow);
                if (bounds.contains(pointInWindow.x, pointInWindow.y)) {
                    let url = this.info.urlForTile(level, col, row);
                    result.push([url, col, row]);
                }
            }
        }
        return result
    }

    /** Returns all changed tiles for a given level.
     * @param {Tiles} tiles - the grid of tiles
     * @param {number} level - The zoom level of the grid
     * @return { added: Array[], removed: Array[]} - An object with added and removed [url, col, row] arrays
     */
    changedTiles(tiles, level) {
        if (this.debug) console.time('changedTiles');
        let changed = {added: [], removed: []};
        if (!tiles.isComplete()) {
            let newNeeded = new Map();
            let needed = this.neededTiles(tiles, level);
            needed.forEach(d => {
                let [url, col, row] = d;
                newNeeded.set(url, [col, row]);
                if (!tiles.requested.has(url)) {
                    changed.added.push(d);
                }
            });
            for (let url of tiles.needed.keys()) {
                if (!newNeeded.has(url)) {
                    let [col, row] = tiles.needed.get(url);
                    changed.removed.push([url, col, row]);
                }
            }
            tiles.needed = newNeeded;
            if (this.debug) console.log(newNeeded);
        }
        if (this.debug) console.timeEnd('changedTiles');

        return changed
    }

    /** Populates all tiles for a given level.
     * @param {Tiles} tiles - the grid of tiles
     * @param {number} level - The zoom level of the grid
     */
    populateAllTiles(tiles, level) {
        let all = this.allTiles(tiles, level);
        for (let [url, col, row] of all) {
            this.addTileQuadNode(level, col, row, url);
        }
        tiles.loadTiles(all, false, 0, 0);
    }

    /** Loads all tiles that are needed to fill the browser window.
     * If the optional about parameter is provided (as a point with col as x,
     * and row as y attr) the tiles are sorted by the distance to this point.
     *
     * @param {Tiles} tiles - the grid of tiles
     * @param {number} level - The zoom level of the grid
     * Optional parameter:
     * @param {boolean} onlyone - if true only one tile is loaded
     * @param {PIXI.Point} about - point of interaction
     */
    populateTiles(tiles, level, {onlyone = false, about = null} = {}) {
        let changed = this.changedTiles(tiles, level);
        let removed = changed.removed;
        for (let [url, col, row] of removed) {
            this.removeTileQuadNode(level, col, row, url);
        }
        let added = changed.added;
        if (added.length == 0) return
        for (let [url, col, row] of added) {
            this.addTileQuadNode(level, col, row, url);
        }
        let referenceCol = -1;
        let referenceRow = -1;
        if (about != null) {
            // We want to load tiles in the focus of the user first, therefore
            // we sort according to the distance of the focus of interaction
            let refPoint = this.toLocal(about);
            let scaledTileSize = tiles.tileSize * tiles.tileScale;

            referenceCol = Math.floor(refPoint.x / scaledTileSize);
            referenceRow = Math.floor(refPoint.y / scaledTileSize);

            let ref = new PIXI.Point(referenceCol, referenceRow);

            // Note: The array must be sorted in a way that the nearest tiles
            // are at the end of the array since the load queue uses Array.push
            // Array.pop

            added.sort((a, b) => {
                let aa = new PIXI.Point(a[1], a[2]);
                let bb = new PIXI.Point(b[1], b[2]);
                let da = Points.distance(aa, ref);
                let db = Points.distance(bb, ref);
                return db - da
            });
            //console.log("sorted populateTiles",  referenceCol, referenceRow, missing)
        }
        //console.log("populateTiles " +  missing.length)
        tiles.loadTiles(added, onlyone, referenceCol, referenceRow);
    }

    /** Private method: creates all tiles for a given level.
     * @param {number} level - The zoom level of the grid
     * @return {Tiles} - tiles
     */
    _createTiles(key, level) {
        let [cols, rows, w, h] = this.info.dimensions(level);
        let increasedLevels = level - this.info.baseLevel;
        let invScale = Math.pow(0.5, increasedLevels);
        let tiles = new Tiles(
            level,
            this,
            invScale,
            cols,
            rows,
            w,
            h,
            this.info.tileSize,
            this.info.overlap
        );
        this.addTiles(key, tiles);
        if (this.info.clip) {
            let rest = this.info.rests[level];
            if (rest) {
                let x = rest.restCol * this.info.tileSize * invScale;
                let y = rest.restRow * this.info.tileSize * invScale;
                tiles.x = -x;
                tiles.y = -y;
            }
        }
        return tiles
    }

    /** Ensures that all needed tiles of a given level are loaded. Creates
     * a new Tiles layer if necessary
     * @param {number} level - The zoom level of the grid
     * @return {Tiles} tiles
     */
    ensureTiles(level, about) {
        let key = level.toString();
        if (key in this.tileLayers) {
            let tiles = this.tileLayers[key];
            this.populateTiles(tiles, level, {about: about});
            return tiles
        }
        let tiles = this._createTiles(key, level);
        this.populateTiles(tiles, level, {about: about});
        //console.log("ensureTiles", level)
        return tiles
    }

    untintTiles(level) {
        let key = level.toString();
        if (key in this.tileLayers) {
            let tiles = this.tileLayers[key];
        }
    }

    /** Ensures that all tiles of a given level are loaded.
     * @param {number} level - The zoom level of the grid
     */
    ensureAllTiles(level) {
        let key = level.toString();
        if (key in this.tileLayers) {
            let tiles = this.tileLayers[key];
            this.populateAllTiles(tiles, level);
            tiles.keep = true;
            return
        }
        let tiles = this._createTiles(key, level);
        this.populateAllTiles(tiles, level);
        tiles.keep = true;
        return tiles
    }

    /** Destroys all tiles above a given level to ensure that the memory can
     * be reused.
     * @param {number} level - The zoom level of the grid
     */
    destroyTilesAboveLevel(level) {
        Object.keys(this.tileLayers).forEach(key => {
            let tiles = this.tileLayers[key];
            if (tiles.level > level && !tiles.keep) {
                for (let url of tiles.available.keys()) {
                    let quad = this.quadTrees.get(url);
                    if (quad) this.removeTileQuadNode(quad);
                }
                this.tileContainer.removeChild(tiles);
                tiles.destroy();
                delete this.tileLayers[key];
            }
        });
    }

    destroyTiles() {
        return
        // UO: This is buggy
        Object.keys(this.tileLayers).forEach(key => {
            let tiles = this.tileLayers[key];
            if (!tiles.keep) tiles.destroyTiles(this.quadTrees);
        });
    }

    /* Tint all tiles
    * @param {number} level - The zoom level of the grid
    */
    tintTilesBelowLevel(level) {
        Object.keys(this.tileLayers).forEach(key => {
            let tiles = this.tileLayers[key];
            if (tiles.level < level) {
                tiles.tintTiles(this.quadTrees);
            }
        });
    }

    _eventLevel(event) {
        return this.levelForScale(event.scale)
    }

    /** A callback function that can be used by a Scatter view to inform
     * the zoomable image that it has been moved, rotated or scaled, and should
     * load tiles accordingly.
     * @param {PIXI.Point} translated - the movement of the scatter
     * @param {number} scale - the zoom factor
     * @param {PIXI.Point} about - the anchor point of the zoom
     * @param {boolean} fast - informs the callback to return as fast as possible,
     *  i.e. after loading a single tile
     * @param {boolean} debug - log debug infos
     */
    transformed(event) {
        let key = this.currentLevel.toString();
        let currentTiles = this.tileLayers[key];
        if (event.fast) {
            this.fastLoads += 1;
            this.populateTiles(currentTiles, this.currentLevel, {
                onlyone: false,
                about: event.about
            });
            this.destroyTiles();
            return
        }
        if (event.scale == null) {
            this.ensureTiles(this.currentLevel, event.about);
            return
        }
        let newLevel = Math.max(this._eventLevel(event), this.minimumLevel);
        if (newLevel != this.currentLevel) {
            if (!currentTiles.keep) currentTiles.loader.cancel();
            this.destroyTilesAboveLevel(newLevel);
            if (this.debug) this.tintTilesBelowLevel(newLevel);
            this.destroyTiles();
            let tiles = this.ensureTiles(newLevel, event.about);
            tiles.untintTiles();
            this.currentLevel = newLevel;
        } else {
            this.ensureTiles(this.currentLevel, event.about);
            this.destroyTiles();
        }

        if (this._foreground) {
            this.addChild(this._foreground);
        }
    }
}

let globalScatterLoaderCanvas = null;

class ScatterLoader extends CardLoader {

    get scatter() {
        return this.src
    }

    unscaledSize() {
        let displayObject = this.scatter.displayObject;
        let w = displayObject.width;
        let h = displayObject.height;
        return [w / displayObject.scale.x, h / displayObject.scale.y]
    }

    scaledSize() {
        let displayObject = this.scatter.displayObject;
        let w = displayObject.width;
        let h = displayObject.height;
        return [w, h]
    }

    cloneScatterImage() {
        let w = this.scatter.width;
        let h = this.scatter.height;
        let isSprite = this.scatter.displayObject instanceof PIXI.Sprite;
        let isDeepZoom = this.scatter.displayObject instanceof DeepZoomImage;
        let resolution = app.renderer.resolution;
        if (isSprite) {
            w = this.scatter.displayObject.texture.width;
            h = this.scatter.displayObject.texture.height;
        }
        else if (isDeepZoom) {
            let [ww, hh] = this.scatter.displayObject.baseSize;
            w = ww;
            h = hh;
        }
        if (globalScatterLoaderCanvas === null) {
            globalScatterLoaderCanvas = document.createElement('canvas');
        }
        let canvas = globalScatterLoaderCanvas;
        canvas.width = w;
        canvas.height = h;
        let renderer = new PIXI.WebGLRenderer(w, h, {
                                    view: canvas,
                                    resolution: resolution});

        let displayObject = this.scatter.displayObject;
        let x = displayObject.x;
        let y = displayObject.y;
        let rot = displayObject.rotation;
        let sx = displayObject.scale.x;
        let sy = displayObject.scale.y;
        displayObject.rotation = 0;
        // The Safari WebGLRenderer wants everything flipped
        // See https://github.com/pixijs/pixi.js/issues/2283
        displayObject.x = 0;
        if (Capabilities.isSafari) {
            displayObject.y = h;
            displayObject.scale.set(1, -1); // sx, -sy)
        }
        else {
            displayObject.y = 0;
            displayObject.scale.set(1, 1);
        }
        if (isSprite) {
            displayObject.width = w;
            displayObject.height = h;
        }
        renderer.render(displayObject);
        displayObject.rotation = rot;
        displayObject.x = x;
        displayObject.y = y;
        displayObject.scale.set(sx, sy);

        let url = canvas.toDataURL();
        return [x, y, w, h, url]
    }

    load(domNode) {
        return new Promise((resolve, reject) => {
            let isImage = domNode instanceof HTMLImageElement;
            let isSprite = this.scatter.displayObject instanceof PIXI.Sprite;
            let image = (isImage) ? domNode : document.createElement("img");
            let [x, y, w, h, cloneURL] = this.cloneScatterImage();
            let [ww, hh] = this.unscaledSize();
            image.onload = (e) => {
                if (!isImage)
                    domNode.appendChild(image);
                this.x = x;
                this.y = y;
                this.wantedWidth = ww;
                this.wantedHeight = hh;
                this.scale = 1;
                this.rotation = this.scatter.rotation;
                resolve(this);
            };
            image.onerror = (e) => {
                reject(this);
            };
            image.src = cloneURL;
            })
    }

}

class FlipEffect {

    constructor(scatter, domScatterContainer, flipTemplate, backLoader) {
        this.flipped = false;
        this.scatter = scatter;
        this.backLoader = backLoader;
        this.scatterLoader = new ScatterLoader(scatter);
        this.domFlip = new DOMFlip(domScatterContainer, flipTemplate,
                                    this.scatterLoader,
                                    backLoader, {
                                        onBack: this.backCardClosed.bind(this)
                                    });
        this.setupInfoButton();
    }

    startFlip() {
        let center = this.flipCenter();
        let loader = this.backLoader;
        this.domFlip.load().then((domFlip) => {
            this.scatter.displayObject.visible = false;
            domFlip.centerAt(center);
            domFlip.zoom(this.scatter.scale);
            let target = this.constraintFlipCenter(center, loader);
            console.log("FlipEffect.startFlip", target, loader);
            domFlip.start({targetCenter: target});
        });
    }

    unscaledSize() {
        return this.scatterLoader.unscaledSize()
    }

    flipCenter() {
        let isSprite = this.scatter.displayObject instanceof PIXI.Sprite;
        let resolution = (isSprite) ? app.renderer.resolution : 1;
        let center = this.scatter.center;
        let canvas = app.renderer.view;
        let domNode = this.domFlip.domScatterContainer.element;
        let page = window.convertPointFromNodeToPage(canvas,
                                                        center.x*resolution,
                                                        center.y*resolution);
        let local = window.convertPointFromPageToNode(domNode, page.x, page.y);
        return local
    }

    constraintFlipCenter(center, loader) {
        let w = loader.wantedWidth;
        let h = loader.wantedHeight;
        console.log("constraintFlipCenter", w, h);
        let canvas = app.renderer.view;
        let x = center.x;
        let y = center.y;
        if (x < w/2)
            x = w/2;
        if (y < h/2)
           y = h/2;
        if (x > canvas.width)
            x = canvas.width - w/2;
        if (y > canvas.height)
            y = canvas.height - h/2;
        return { x, y }
    }

    setupInfoButton() {
        let iscale = 1.0 / this.scatter.scale;
        this.infoBtn = new PIXI.Graphics();
        this.infoBtn.beginFill(0x333333);
        this.infoBtn.lineStyle(4, 0xFFFFFF);
        this.infoBtn.drawCircle(0, 0, 22);
        this.infoBtn.endFill();

        this.infoBtn.beginFill(0xFFFFFF);
        this.infoBtn.lineStyle(0);
        this.infoBtn.drawCircle(0, -8, 4);
        this.infoBtn.endFill();

        this.infoBtn.lineStyle(6, 0xFFFFFF);
        this.infoBtn.moveTo(0, -2);
        this.infoBtn.lineTo(0, 14);
        this.infoBtn.endFill();

        this.infoBtn.on('click', (e) => { this.infoSelected(); });
        this.infoBtn.on('tap', (e) => { this.infoSelected(); });

        this.infoBtn.interactive = true;
        this.infoBtn.width = 44;
        this.infoBtn.height = 44;
        this.infoBtn.pivot.x = 30;
        this.infoBtn.pivot.y = 30;

        let displayObject = this.scatter.displayObject;
        let [w, h] = this.unscaledSize();
        this.infoBtn.position = new PIXI.Point(w, h);
        if (displayObject.foreground) {
            this.infoBtn.scale.x = iscale;
            this.infoBtn.scale.y = iscale;
            displayObject.foreground.addChild(this.infoBtn);
        }
        else {
            displayObject.addChild(this.infoBtn);
        }

        this.scatter.addTransformEventCallback(e => {
            let displayObject = this.scatter.displayObject;
            if (displayObject.foreground) {
                if (e.scale) {
                    let iscale = 1.0 / e.scale;
                    this.infoBtn.scale.x = iscale;
                    this.infoBtn.scale.y = iscale;
                }
            }
        });
    }

    setupButton(url) {
        let svgImage = new Image();
        let canvas = document.createElement('canvas');
        canvas.width = 88 * 4;
        canvas.height = 44 * 4;
        svgImage.onload = e => {
            let displayObject = this.scatter.displayObject;
            canvas.getContext ('2d').drawImage(svgImage, 0, 0,
                                            canvas.width, canvas.height);
            let texure = new PIXI.Texture(new PIXI.BaseTexture(canvas));
            this.infoBtn = new PIXI.Sprite(texure);
            this.infoBtn.anchor.set(0.5, 0.5);
            if (displayObject.foreground) {
                displayObject.foreground.addChild(this.infoBtn);
            }
            else {
                displayObject.addChild(this.infoBtn);
            }
            this.infoBtn.scale.set(0.5, 0.5);

            let [w, h] = this.unscaledSize();
            this.infoBtn.position = new PIXI.Point(w, h);
            this.infoBtn.interactive = true;
            this.infoBtn.updateTransform();
            this.infoBtn.on('click', (e) => { this.infoSelected(); });
            this.infoBtn.on('tap', (e) => { this.infoSelected(); });
        };
        svgImage.src = url;
    }

    infoSelected() {
        this.startFlip();
    }

    backSelected() {
        this.domFlip.start();
    }

    backCardClosed() {
        /*** The flip effect should now be in it's initial state again. All
        memory should be freed. ***/
        let displayObject = this.scatter.displayObject;
        displayObject.visible = true;
        this.domFlip.fadeOutAndRemove();
        this.flipped = false;
    }

    targetRotation(alpha) {
        let ortho = 90;
        let rest = alpha % ortho;
        let delta = 0.0;
        if (rest > (ortho / 2.0)) {
            delta = ortho - rest;
        }
        else {
            delta = -rest;
        }
        return delta
    }
}

/**
 * 
 */
class Popover extends PIXI.Graphics {

    constructor({title = null, text = null, x = 0, y = 0, placement = 'top', width = 250, titleStyle = {}, textStyle = {fontSize: '1.6em'}} = {}) {
        super();

        this.opts = {title, text, x, y, placement, width, titleStyle, textStyle};
        
        this.padding = 12;

        let style = {
            fontFamily: 'Arial',
            fontSize: '2em',
            stroke: '#f6f6f6',
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: width - (this.padding * 2)
        };

        this.titleTextStyle = new PIXI.TextStyle(Object.assign({}, style, titleStyle));
        this.textTextStyle = new PIXI.TextStyle(Object.assign({}, style, textStyle));
        
        if (title || text) {
            this.setup();
            this.draw();
            this.positioning();
        }
    }

    setup() {
        this.removeChildren();

        if (this.opts.title) {
            this.titleText = new PIXI.Text(this.opts.title, this.titleTextStyle);
            this.titleText.position.set(this.padding, this.padding);
            this.addChild(this.titleText);
        }

        this.titleY = this.titleText ? this.titleText.y : 0;
        this.titleHeight = this.titleText ? this.titleText.height : 0;

        if (this.opts.text) {
            this.textText = new PIXI.Text(this.opts.text, this.textTextStyle);
            this.textText.position.set(this.padding, this.titleY + this.titleHeight + this.padding);
            this.addChild(this.textText);
        }

        this.textY = this.textText ? this.textText.y : 0;
        this.textHeight = this.textText ? this.textText.height : 0;
    }

    close() {
        this.parent.removeChild(this);
    }

    draw() {
        this.clear();
        this.beginFill(0xffffff, 1);
        this.lineStyle(1, 0x282828, .5);

        // Draw rounded rectangle
        const height = this.height + this.padding;
        this.drawRoundedRect(0, 0, this.opts.width, height, 8);

        // Draw anchor
        this.drawAnchor(this.opts.placement);

        // Draw title background
        if (this.opts.title) {
            this.lineStyle(0);
            this.beginFill(0xf7f7f7, 1);
            let x = 1;
            let y = this.titleText.x + this.titleText.height + (this.padding / 2);
            this.moveTo(x, y);
            y = 9;
            this.lineTo(x, y);
            this.quadraticCurveTo(x, y - 8, x + 8, y - 8);
            x += this.opts.width - 7;
            y -= 8;
            this.lineTo(x, y);
            this.quadraticCurveTo(x + 5, y, x + 5, y + 8);
            x += 5;
            y += this.titleText.x + this.titleText.height + (this.padding / 2);
            this.lineTo(x, y);
            if (this.opts.text) {
                x = 1;
                this.lineTo(x, y);
            } else {
                this.quadraticCurveTo(x, y, x - 5, y + 4);
                x = 6;
                y += 4;
                this.lineTo(x, y);
                this.quadraticCurveTo(x, y, x - 5, y - 4);
            }
        }

        this.endFill();
    }

    drawAnchor(placement) {

        let x = 0;
        let y = 0;

        switch (placement) {
            case 'bottom':
                if (this.opts.title) {
                    this.beginFill(0xf7f7f7, 1);
                }
                x = (this.width / 2) - 10;
                y = 1;
                this.moveTo(x, y);
                x += 10;
                y -= 10;
                this.lineTo(x, y);
                x += 10;
                y += 10;
                this.lineTo(x, y);
                break
            case 'right':
                x = 1;
                y = (this.height / 2) - 10;
                if (this.titleY + this.titleHeight > y) {
                    this.beginFill(0xf7f7f7, 1);
                }
                this.moveTo(x, y);
                x -= 10;
                y += 10;
                this.lineTo(x, y);
                x += 10;
                y += 10;
                this.lineTo(x, y);
                break
            case 'left':
                x = this.width - 2;
                y = (this.height / 2) - 10;
                if (this.titleY + this.titleHeight > y) {
                    this.beginFill(0xf7f7f7, 1);
                }
                this.moveTo(x, y);
                x += 10;
                y += 10;
                this.lineTo(x, y);
                x -= 10;
                y += 10;
                this.lineTo(x, y);
                break
            default:
                x = (this.width / 2) - 10;
                y = this.height - 2;
                this.moveTo(x, y);
                x += 10;
                y += 10;
                this.lineTo(x, y);
                x += 10;
                y -= 10;
                this.lineTo(x, y);
                break
        }
    }

    positioning() {

        const x = this.opts.x;
        const y = this.opts.y;

        switch (this.opts.placement) {
            case 'bottom':
                this.position.set(x - (this.width / 2), y + 10);
                break
            case 'right':
                this.position.set(x, y - (this.height / 2));
                break
            case 'left':
                this.position.set(x - this.width, y - (this.height / 2));
                break
            default:
                this.position.set(x - (this.width / 2), y - this.height);
                break
        }
    }
}

/** A container for scatter objects, which uses a single InteractionMapper
 * for all children. This reduces the number of registered event handlers
 * and covers the common use case that multiple objects are scattered
 * on the same level.
 */
class ScatterContainer extends PIXI.Graphics {

    /**
    * @constructor
    * @param {PIXI.Renderer} renderer - PIXI renderer, needed for hit testing
    * @param {Bool} stopEvents - Whether events should be stopped or propagated
    * @param {Bool} claimEvents - Whether events should be marked as claimed
    *                             if findTarget return as non-null value.
    * @param {Bool} showBounds - Show bounds for debugging purposes.
    * @param {Bool} showTouches - Show touches and pointer for debugging purposes.
    * @param {Color} backgroundColor - Set background color if specified.
    * @param {PIXIApp} application - Needed if showBounds is true to register
    *                                update handler.
    */
    constructor(renderer, {stopEvents = true,
                            claimEvents = true,
                            showBounds = false,
                            showPolygon = false,
                            showTouches = false,
                            backgroundColor = null,
                            application = null} = {}) {
        super();
        this.renderer = renderer;
        this.stopEvents = stopEvents;
        this.claimEvents = claimEvents;
        this.delegate = new InteractionMapper$1(this.eventReceiver, this);
        this.showBounds = showBounds;
        this.showTouches = showTouches;
        this.showPolygon = showPolygon;
        this.backgroundColor = backgroundColor;
        if (application && (showBounds || showTouches || showPolygon)) {
            application.ticker.add((delta) => this.update(delta), this);
        }
        if (backgroundColor) {
            this.updateBackground();
        }
    }

    updateBackground() {
        this.clear();
        this.beginFill(this.backgroundColor, 1);
        this.drawRect(0, 0, this.bounds.width, this.bounds.height);
        this.endFill();
    }

    get eventReceiver() {
        return this.renderer.plugins.interaction.interactionDOMElement
    }

    get bounds() {
       // let r = this.eventReceiver.getBoundingClientRect()
        let x = 0; // r.left
        let y = 0; // r.top
        let w = app.width;
        let h = app.height;
        if (app.fullscreen && app.monkeyPatchMapping) {
                let fixed = this.mapPositionToPoint({x : w, y: 0});
            if (fixed.x < w) {
                w = fixed.x;
            }
            if (fixed.y > 0) {
                y += fixed.y;
                h -= fixed.y;
            }
        }
        return new PIXI.Rectangle(x, y, w, h)
    }

    get center() {
        let r = this.bounds;
        return { x: r.width / 2, y: r.height / 2}
    }

    get polygon() {
        let r = this.bounds;
        let w2 = r.width/2;
        let h2 = r.height/2;
        let center = {x: w2, y: h2};
        let polygon = new Polygon(center);
        polygon.addPoint({x: -w2, y: -h2});
        polygon.addPoint({x: w2, y: -h2});
        polygon.addPoint({x: w2, y: h2});
        polygon.addPoint({x: -w2, y: h2});
        return polygon
    }

    update(dt) {
        this.clear();
        this.lineStyle(1, 0x0000FF);
        if (this.showBounds) {
            for(let child of this.children) {
                if (child.scatter) {
                    //let {x, y, width, height} = child.scatter.throwBounds()
                    // new PIXI.Rectangle(x, y, width, height)
                    this.drawShape(child.scatter.bounds);
                    let center =  child.scatter.center;
                    this.drawCircle(center.x, center.y, 4);
                    this.drawCircle(child.scatter.x, child.scatter.y, 4);
                }
            }
            this.lineStyle(2, 0x0000FF);
            this.drawShape(this.bounds);
        }
        if (this.showPolygon) {
            this.lineStyle(2, 0xFF0000);
            for(let child of this.children) {
                if(child.scatter){
                let polygon = child.scatter.polygon;
                let shape = new PIXI.Polygon(polygon.flatAbsolutePoints());
                shape.close();
                this.drawShape(shape);
                }
            }
        }
        if (this.showTouches) {
            let current = this.delegate.interaction.current;
            for(let [key, point] of current.entries()) {
                let local = this.mapPositionToPoint(point);
                this.drawCircle(local.x, local.y, 12);
            }
        }
    }

    capture(event) {
        if (this.stopEvents)
            Events$1.stop(event);
        return true
    }

    fakeInteractionEvent(point, key) {
        return { data: { global: point, key: key }}
    }

    findHitScatter(data, displayObject, hit) {
    //     if (hit) {
//             console.log("findHitScatter", displayObject)
//         }
        if (hit && this.hitScatter === null && typeof(displayObject) != undefined) {
            this.hitScatter = (displayObject.scatter) ? displayObject.scatter : null;
        }
    }

    mapPositionToPoint(point) {
        let local = new PIXI.Point();
        let interactionManager = this.renderer.plugins.interaction;
        interactionManager.mapPositionToPoint(local, point.x, point.y);
        return local
    }

    /**
     * New method hitTest implemented (in InteractionManager, since 4.5.0).
     * See https://github.com/pixijs/pixi.js/pull/3878
     */
    findTarget(event, local, global) {
        if (event.claimedByScatter) {
            return null
        }
        this.hitScatter = null;
        let interactionManager = this.renderer.plugins.interaction;
        let fakeEvent = this.fakeInteractionEvent(local);
        interactionManager.processInteractive(fakeEvent,
                this,
                this.findHitScatter.bind(this), true);
        if (this.claimEvents)
            event.claimedByScatter = this.hitScatter;
        return this.hitScatter
    }

    findTargetNew(event, local, global) {
        // UO: still problematic. Does not find non interactive elements
        // which are needed for some stylus applications
        if (event.claimedByScatter) {
            return null
        }
        this.hitScatter = null;
        let interactionManager = this.renderer.plugins.interaction;
        let displayObject = interactionManager.hitTest(local, this);
        if (displayObject != null && displayObject.scatter != null)
            this.hitScatter = displayObject.scatter;
        if (this.claimEvents)
            event.claimedByScatter = this.hitScatter;
        return this.hitScatter
    }


    onStart(event, interaction) {

    }

    onMove(event, interaction) {

    }

    onEnd(event, interaction) {
        for(let key of interaction.ended.keys()) {
            let point = interaction.ended.get(key);
            if (interaction.isLongPress(key)) {
                this.onLongPress(key, point);
            }
            if (interaction.isTap(key)) {
                this.onTap(key, point);
            }
        }
    }

    onTap(key, point) {
        console.info('ScatterContainer.onTap');
    }

    onLongPress(key, point) {
        console.info('ScatterContainer.onLongPress');
    }

    bringToFront(displayObject) {
        this.addChild(displayObject);
    }
}

/** A wrapper for child elements of a ScatterContainer. Can be used
 *  to combine scattered objects with non-scattered objects. Any
 *  PIXI.DisplayObject can be wrapped.
 */
class DisplayObjectScatter extends AbstractScatter {

    constructor(displayObject, renderer,
                    { x=null, y=null,
                        minScale=0.1,
                        maxScale=1.0,
                        startScale=1.0,
                        autoBringToFront=true,
                        translatable=true, scalable=true, rotatable=true, resizable=false,
                        movableX=true,
                        movableY=true,
                        throwVisibility=44,
                        throwDamping = 0.95,
                        autoThrow=true,
                        rotationDegrees=null,
                        rotation=null,
                        onTransform = null } = {}) {
        // For the simulation of named parameters,
        // see: http://exploringjs.com/es6/ch_parameter-handling.html
        super({ minScale, maxScale,
                        startScale,
                        autoBringToFront,
                        translatable, scalable, rotatable, resizable,
                        movableX, movableY, throwVisibility, throwDamping,
                        autoThrow,
                        rotationDegrees, rotation,
                        onTransform });
        this.displayObject = displayObject;
        this.displayObject.scatter = this;
        this.renderer = renderer;
        this.scale = startScale;
        this.rotationDegrees = this.startRotationDegrees;
        this.x = x;
        this.y = y;
    }

    /** Returns geometry data as object. **/
    getState() {
        return {
            scale: this.scale,
            x: this.x,
            y: this.y,
            rotation: this.rotation
        }
    }

    setup() {
        this.setupMouseWheelInteraction();
    }

    roundPixel(value) {
        // UO: Should be obsolete because Renderer supports roundPixels by default
        return value
        let res = this.renderer.resolution;
        return Math.round(value * res) / res
    }

    get container() {
        return this.displayObject.parent
    }

    get x() {
        return this.position.x
    }

    set x(value) {
        this.position.x = value;
    }

    get y() {
        return this.position.y
    }

    set y(value) {
        this.position.y = value;
    }

    get polygon() {
        let polygon = new Polygon(this.center);
        let w2 = this.width / 2;
        let h2 = this.height / 2;
        polygon.addPoint({x: -w2, y: -h2});
        polygon.addPoint({x: w2, y: -h2});
        polygon.addPoint({x: w2, y: h2});
        polygon.addPoint({x: -w2, y: h2});
        polygon.rotate(this.rotation);
        return polygon
    }

    get containerBounds() {
        return this.displayObject.parent.bounds
    }

    get containerPolygon() {
        return this.displayObject.parent.polygon
    }

    get position()  {
        return this.displayObject.position
    }

    set position(value) {
        console.log("set position");
        this.displayObject.position = value;
    }

    get scale()  {
        return this.displayObject.scale.x
    }

    set scale(value) {
        this.displayObject.scale.x = value;
        this.displayObject.scale.y = value;
    }

    get width() {
        return this.displayObject.width
    }

    get height() {
        return this.displayObject.height
    }

    get bounds() {
        return this.displayObject.getBounds()
    }

    get pivot() {
        return this.displayObject.pivot
    }

    get rotation()  {
        return this.displayObject.rotation
    }

    set rotation(value)  {
        this.displayObject.rotation = value;
    }

    get rotationDegrees()  {
        return Angle.radian2degree(this.displayObject.rotation)
    }

    set rotationDegrees(value)  {
        this.displayObject.rotation = Angle.degree2radian(value);
    }

    get center() {
        let w2 = this.width/2;
        let h2 = this.height/2;
        let dist = Math.sqrt(w2*w2 + h2*h2);
        let angle = Points.angle({x: w2, y: h2}, {x: 0, y: 0});
        let p = this.displayObject.x;
        let c = Points.arc(this.position, this.rotation + angle, dist);
        return c // Points.subtract(c, this.pivot)
    }

    get rotationOrigin() {
        // In PIXI the default rotation and scale origin is the position
        return this.position // Points.add(this.position, this.pivot)
    }

    mapPositionToContainerPoint(point) {
        return this.displayObject.parent.mapPositionToPoint(point)
    }

    capture(event) {
        return true
    }

    bringToFront() {
        if (this.autoBringToFront) {
            let scatterContainer = this.displayObject.parent;
            scatterContainer.bringToFront(this.displayObject);
        }
    }

    validScale(scale) {
        scale = Math.max(scale, this.minScale);
        scale = Math.min(scale, this.maxScale);
        return scale
    }

    get containerPolygon() {
        return this.displayObject.parent.polygon
    }

}

/**
 *
 */
class Command extends PIXI.Graphics {
    /*** Abstract base class for record, play, and stop commands. ***/
    constructor(tools, selectedColor, shape) {
        super();
        this.tools = tools;
        this.shape = shape;
        this.selected = false;
        this.disabled = false;
        this.selectedColor = selectedColor;
        this.draw();
        this.setup();
    }

    setup() {
    }

    draw() {
        this.clear();
        var color = (this.selected) ? this.selectedColor : 0xFFFFFF;
        this.lineStyle(0);
        this.beginFill(color, 1);
        this.drawShape(this.shape);
        this.endFill();
    }

    select() {
        this.selected = true;
        this.draw();
    }

    deselect() {
        this.selected = false;
        this.draw();
    }

    toggle() {
        this.selected = !this.selected;
        this.draw();
    }

    stop() {
        this.selected = false;
        this.draw();
    }
}

class RecordCommand extends Command {
    /*** Records events for later replay. ***/
    setup() {
        this.recorder = new EventRecorder();
    }

    toggle() {
        super.toggle();
        if (!this.selected) {
            this.recorder.stopRecording();
        }
    }

    recordEvent(event) {
    	this.recorder.record(event);
    }

    normalize(value, limit) {
        return value / limit
    }

    normalizeX(value) {
        return this.normalize(value, window.innerWidth)
    }

    normalizeY(value) {
        return this.normalize(value, window.innerHeight)
    }

    whileNotStopped() {
        return this.tools.play.selected
    }

    startReplay() {
        let whileCondition = this.whileNotStopped.bind(this);
        this.recorder.startReplay(whileCondition, () => this.tools.play.stop());
    }
}

class PlayCommand extends Command {
    /*** Plays recorded events. ***/
    toggle() {
        super.toggle();
        if (this.selected && this.tools.record.recorder.recorded.length > 0) {
            this.tools.startReplay();
        }
    }
}

class StopCommand extends Command {
    /*** Stops recording and playing. ***/
    toggle() {
        super.toggle();
        this.tools.record.stop();
        this.tools.play.stop();
        setTimeout(this.deselect.bind(this), 500);
    }
}

class RecorderTools extends PIXI.Container {

    constructor(renderer) {
        super(renderer);
        this.renderer = renderer;
        this.setupToolbar();
        this.replayRate = 100.0;
        this.onReset = null;
        this.touchGraphics = new PIXI.Graphics();
        this.showTouches();
    }

    setup(container) {
        this.delegate = new InteractionMapper(container, this);
    }

    findTarget(event, local, global) {
        return this
    }

    setupToolbar() {
        this.toolbar = new PIXI.Graphics();
        this.record = new RecordCommand(this, 0xCC0000, new PIXI.Circle(0, 0, 16));
        this.play = new PlayCommand(this, 0x0000CC, new PIXI.Polygon(0, 16,
                                               32, 16+16,
                                               0, 16+32,
                                               0, 16));
        this.stop = new StopCommand(this, 0x0000CC,
                                        new PIXI.Rectangle(0, 0, 32, 32));
        this.toolbar.addChild(this.record).position.set(44, 48);
        this.toolbar.addChild(this.play).position.set(44+44, 16);
        this.toolbar.addChild(this.stop).position.set(44+44+44+16, 32);
        this.updateToolbar();
        this.addChild(this.toolbar);
    }

    updateToolbar() {
        var graphics = this.toolbar;
        graphics.clear();
        graphics.beginFill(0x000000, 0.5);
        graphics.lineStyle(2, 0xFFFFFF,  1);
        graphics.drawRoundedRect(16, 16, 44*4+8, 64, 8);
        graphics.endFill();
    }

    onMouseWheel(event) {
        console.log('onMouseWheel missing');
    }

    onMouseDown(point) {
        if (this.record.containsPoint(point)) {
            this.record.toggle();
        }
        if (this.play.containsPoint(point)) {
            this.play.toggle();
        }
        if (this.stop.containsPoint(point)) {
            this.stop.toggle();
            if (this.onReset) {
                this.onReset();
            }
        }
    }

    onTap(point) {
        console.log('onTap');
        if (this.record.getBounds().contains(point.x, point.y)) {
            this.record.toggle();
        }
        if (this.play.getBounds().contains(point.x, point.y)) {
            this.play.toggle();
        }
        if (this.stop.getBounds().contains(point.x, point.y)) {
            this.stop.toggle();
        }
    }

    mapPositionToPoint(point) {
        let local = new PIXI.Point();
        this.renderer.plugins.interaction.mapPositionToPoint(local, point.x, point.y);
        return local
    }

    extractLocal(event) {
        return this.mapPositionToPoint(Events.extractPoint(event))
    }

    capture(event) {
        let local = this.extractLocal(event);
        if (this.toolbar.containsPoint(local)) {
            switch(event.type) {
                case 'mousedown':
                    this.onMouseDown(local);
                    break
                case 'touchstart':
                case 'pointerdown':
                    this.onTap(local);
            }
            event.preventDefault();
            event.stopPropagation();
            console.log('stopPropagation');
            return false
        }
        if (this.record.selected) {
            this.record.recordEvent(event);
        }
        return true
    }

    startReplay() {
        if (this.onReset) {
            this.onReset();
        }
        this.record.startReplay();
    }

    showTouches() {
        this.addChild(this.touchGraphics);
    }

    onStart(event, interaction) {
        this.updateTouchGraphics(interaction);
    }

    onMove(event, interaction) {
        this.updateTouchGraphics(interaction);
    }

    onEnd(event, interaction) {
        this.updateTouchGraphics(interaction);
    }

    updateTouchGraphics(interaction) {
	    let current = interaction.current;
        let graphics = this.touchGraphics;
        if (graphics != null) {
            graphics.clear();
            for(let key of current.keys()) {
                if (interaction.ended.has(key)) {
                    continue
                }
                let p = current.get(key);
                if (key == 'mouse') {
                    graphics.beginFill(0xCC0000, 0.5);
                } else {
                    graphics.beginFill(0xCCCCCC, 0.5);
                }
                graphics.drawCircle(p.x, p.y, 20);
            }
            graphics.endFill();
        }
    }
}


class AppTest extends PIXIApp {

    constructor(canvas, container) {
        super({view: canvas, backgroundColor: 0x000000});
        this.container = container;
    }

    sceneFactory() {
        return new RecorderTools(this.renderer)
    }

    setup() {
        super.setup();
        this.scene.setup(this.container);
    }

    run(reset=null) {
        this.scene.onReset = reset;
        console.log('Running AppTest');
        return this
    }

}

/**
 *
 */
class FontInfo {

    static get small() {
        return app.theme.textStyleSmall
    }

    static get normal() {
        return app.theme.textStyle
    }

    static get centered()  {
        return Object.assign({}, app.theme.textStyle, {align : 'center'})
    }
}


class LabeledGraphics extends PIXI.Graphics {

    constructor() {
        super();
        this.labels = new Map();
    }

    ensureLabel(key, label, attrs, fontInfo=FontInfo.normal) {
        if (!this.labels.has(key)) {
            let text = new PIXI.Text(label, fontInfo);
            this.labels.set(key, text);
            this.addChild(text);
        }
        let text = this.labels.get(key);
        for(let k in attrs) {
            text[k] = attrs[k];
        }
        if (label != text.text)
            text.text = label;
        text.anchor.y = 0.5;
        switch(attrs.align) {
            case 'right':
                text.anchor.x = 1;
                break
            case 'center':
                text.anchor.x = 0.5;
                break
            default:
                text.anchor.x = 0;
                break
        }
        text.visible = true;
        return text
    }
}

class Ticks {

    get reservedPrefixes() {
        return ['decade', 'year', 'month', 'day', 'hour', 'minute', 'second']
    }

    get minWidth() {
        return 10
    }

    format(available) {
        return {year: '2-digit', timeZone: 'UTC'}
    }

    get minLabelWidth() {
        return 44
    }

    get formatKey() {
        return this.key
    }

    dateKey(date) {
        return this.key + date.getFullYear()
    }

    *iter(start, end) {
        let date = this.iterStart(start);
        while (date <= end) {
            yield date;
            date = this.next(date);
        }
        yield date;
    }

    *iterRanges(range) {
        for(let date of this.iter(range.start, range.end)) {
            let next = this.next(date);
            yield { start: date, end: next };
        }
    }

    selectedRange(timeline, info) {
        let first = null;
        let last = null;
        let visibleFirst = null;
        let visibleLast = null;
        let units = 0;
        for(let {start, end} of this.iterRanges(info)) {
            if (timeline.visibleRange(start, end)) {
                if (first == null) {
                    first = start;
                }
                last = end;
            }
            if (timeline.visibleDate(start) && timeline.visibleDate(end)) {
                units += 1;
                if (visibleFirst == null) {
                    visibleFirst = start;
                }
                visibleLast = end;
            }
        }
        if (first == null)
            return info
        return {start: first, end: last, visibleStart: visibleFirst, visibleEnd: visibleLast, units: units}
    }

    drawTick(timeline, x, y, date) {
        let visible = date > timeline.start && date < timeline.end;
        if (!visible)
            return false
        timeline.drawTick(x);
        return true
    }

    toLocaleString(date, format) {
        return date.toLocaleDateString('de', format)
    }

    draw(timeline, range, width, height, available, format, nextFormat, level) {
        let first = null;
        let last = null;
        let keyedFormat = (format) ? format[this.formatKey] : null;
        let keyedNextFormat = (nextFormat) ? nextFormat[this.formatKey] : null;
        let redundant = (nextFormat) ? this.formatKey in nextFormat : false;
        let fullyRedundant = keyedFormat != null &&  keyedFormat == keyedNextFormat;
        let y = timeline.getY();

        for(let {start, end} of this.iterRanges(range)) {
            let x = timeline.toX(start);
            let xx = x;
            let yy = y + timeline.tickLabelOffset(-1);
            if (this.drawTick(timeline, x, y, start) && format) {
                let key = this.dateKey(start);
                let text = this.toLocaleString(start, format);
                let align = 'center';
                let downTick = false;
                if (nextFormat) {
                    yy = y + timeline.tickLabelOffset(-1, 1);
                    align = 'left';
                    timeline.drawTick(x, 4.2);
                    let nextX = timeline.toX(end) - 100;
                    if (x < 0 && nextX > -100 && !redundant) {
                        xx = Math.min(4, nextX);
                    }
                    else {
                        xx -= 2;
                    }
                    downTick = true;
                }
                else if (level > 0) {
                    xx = x + available/2;
                }
                else {
                    downTick = true;
                }
                if (!fullyRedundant) {
                    timeline.ensureLabel(key, text,
                                { x: xx, y: yy, align: align },
                                FontInfo.small);
                }
                if (downTick) timeline.drawTick(x, -1);
            }
            if (timeline.visibleRange(start, end)) {
                if (first == null)
                    first = start;
                last = end;
            }
        }
        if (first == null)
            return null
        return {start: first, end: last}
    }
}

class DecadeTicks extends Ticks {

    get milliseconds() {
        return 10 * 365 * 24 * 60 * 60 * 1000
    }

    format(available) {
        return {year: 'numeric', timeZone: 'UTC'}
    }

    selection(timeline, dates, selected) {
        return dates
    }

    get key() {
        return 'decade'
    }

    get formatKey() {
        return 'year'
    }

    iterStart(start) {
        let modulo = start.getFullYear() % 10;
        let year = start.getFullYear() - modulo;
        return Dates.create(year, 0, 1)
    }

    next(decade) {
        return Dates.nextYear(decade, 10)
    }
}

class YearTicks extends Ticks {

    get milliseconds() {
        return 365 * 24 * 60 * 60 * 1000
    }

    format(available) {
        if (available < 44)
            return {year: '2-digit', timeZone: 'UTC'}
        return {year: 'numeric', timeZone: 'UTC'}
    }

    get minLabelWidth() {
        return 22
    }

    get key() {
        return 'year'
    }

    iterStart(start) {
        return Dates.create(start.getFullYear(), 0, 1)
    }

    next(year) {
        return Dates.nextYear(year)
    }
}

class MonthTicks extends Ticks {

    get milliseconds() {
        return (365 / 12) * 24 * 60 * 60 * 1000
    }

    format(available) {
        let format = {month: 'narrow', timeZone: 'UTC'};
        if (available > 44)
            format.month = 'short';
        if (available > 66)
            format.year = '2-digit';
        if (available > 100) {
            format.month = 'long';
            format.year = 'numeric';
        }
        return format
    }

    get minLabelWidth() {
        return 32
    }

    get key() {
        return 'month'
    }

    dateKey(date) {
        return this.key + date.getFullYear() + date.getMonth()
    }

    iterStart(start) {
        return Dates.create(start.getFullYear(), start.getMonth(), 1)
    }

    next(month) {
        return Dates.nextMonth(month)
    }
}

class DayTicks extends Ticks {

    get milliseconds() {
        return 24 * 60 * 60 * 1000
    }

    format(available) {
        let format = {day: 'numeric', timeZone: 'UTC'};
        if (available > 44)
            format.month = 'short';
        if (available > 100) {
            format.month = 'long';
            format.year = '2-digit';
        }
        if (available > 150) {
            format.weekday = 'short';
        }
        if (available > 200) {
            format.year = 'numeric';
            format.weekday = 'long';
        }
        return format
    }

    get key() {
        return 'day'
    }

    dateKey(date) {
        return this.key + date.getFullYear() + date.getMonth() + date.getDate()
    }

    iterStart(start) {
        return Dates.create(start.getFullYear(), start.getMonth(), start.getDate())
    }

    next(date) {
        return Dates.nextDay(date)
    }
}





class TimeTicks {

    constructor(...ticks) {
        this.ticks = ticks;
    }

    selectedRange(timeline) {
        let info = {start: timeline.start, end: timeline.end, units: 0 };
        for(let ticks of this.ticks) {
            info = ticks.selectedRange(timeline, info);
            if (info.units > 1) {
                timeline.selection = [info.visibleStart, info.visibleEnd];
                return
            }
        }
        timeline.selection = [info.start, info.end];
    }

    draw(timeline, width, height) {
        let range = timeline;
        let start = timeline.toX(range.start);
        let end = timeline.toX(range.end);
        let size = end - start;
        let duration = timeline.end - timeline.start;
        let formats = new Map();
        let nextFormats = new Map();
        let availables = new Map();
        let previous = null;
        let visible = [];
        for(let ticks of this.ticks) {
            let amount = ticks.milliseconds / duration;
            let available = amount * size;
            availables.set(ticks, available);
            if (available < ticks.minWidth)
                break
            formats.set(ticks, (available < ticks.minLabelWidth) ? null : ticks.format(available));
            nextFormats.set(previous, formats.get(ticks));
            previous = ticks;
            visible.push(ticks);
        }
        let level = 0;
        for(let ticks of visible) {
            if (range == null)
                return
            range = ticks.draw(timeline, range, width, height,
                                    availables.get(ticks),
                                    formats.get(ticks),
                                    nextFormats.get(ticks), level);
            level += 1;
        }
    }
}

class ColorRanges {

    constructor(label, color, ranges) {
        this.label = label;
        this.color = color;
        this.ranges = ranges;
    }

    draw(timeline, width, height, size=12) {
        let minimum = 1 / Capabilities.devicePixelRatio;
        let h2 = size;
        timeline.lineStyle(size, this.color);
        for(let range of this.ranges) {
            if (range.to === null) {
                range.to = Dates.nextDay(range.from);
            }
            let start = timeline.toX(range.from);
            let end = timeline.toX(range.to);
            if (end < start + minimum) {
                end = start + minimum;
            }
            timeline.moveTo(start, h2);
            timeline.lineTo(end, h2);
        }
    }
}

class Timeline extends LabeledGraphics {

    constructor(width, height, {ticks=null,
                                baseLine=0.5, showRange=true} = {}) {
        super();
        this.wantedWidth = width;
        this.wantedHeight = height;
        this.extraLeft = 0;
        this.extraRight = 0;
        this.inset = 5;
        this.showRange = showRange;
        this.baseLine = baseLine;
        this.tickHeight = 4;
        this.zoom = 1;
        this.minZoom = 1;
        this.maxZoom = 12000;
        this.scroll = 0;
        this.deltas = [];
        this.labelDates = [];
        this.colorRanges = [];
        this.rangeColors = new Cycle(Colors.eminence,
                            Colors.steelblue,
                            Colors.ochre,
                            Colors.turquoise);
        this.callbacks = [];
        this.progress = null;
        this.start = null;
        this.end = null;
        this.selection = null;
        this.autoScroll = false;
        this.direction = -1;
        this.timeticks = ticks || new TimeTicks(new DecadeTicks(),
                                                new YearTicks(),
                                                new MonthTicks(),
                                                new DayTicks());
        this.labelPrefix = '__';
    }

    updateSelection() {
        if (this.visibleDate(this.start) && this.visibleDate(this.end)) {
            this.selection = [this.start, this.end];
        }
        else {
            this.timeticks.selectedRange(this);
        }

        return this.selection
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    addLabels(labels) {
        this.labelDates = labels;
    }

    range(start, end) {
        this.start = start;
        this.end = end;
    }

    draw(width, height) {
        this.wantedWidth = width;
        this.wantedHeight = height;
        this.redraw();
    }

    updateColorRanges(w, h) {
        let xx = w - this.inset;
        let size = FontInfo.small.fontSize;
        let yy = h - size;
        for(let i=this.colorRanges.length-1; i>=0; i--) {
            let cr = this.colorRanges[i];
            let label = cr.label;
            cr.draw(this, w, h);
            let current = this.ensureLabel('colorRange:' + label, label,
                                { x: xx, y: yy, align: 'right'}, FontInfo.small);
            let r = current.getBounds();
            xx -= r.width + 16;

            this.lineStyle(size, cr.color);
            this.moveTo(xx, yy);
            this.lineTo(xx+size, yy);
            xx -= size + 4;
        }
    }

    drawSelectedRamge(selected) {
        this.lineStyle(2, app.theme.primaryColor);
        let start = this.toX(selected[0]);
        let end = this.toX(selected[1]);
        this.moveTo(start, 0);
        this.lineTo(end, 0);
        this.drawTick(start, -1.5, 0);
        this.drawTick(end, -1.5, 0);
    }

    redraw() {
        this.clear();
        let h = this.wantedHeight;
        let w = this.wantedWidth;
        let y = this.getY();
        this.prepareLabels();
        this.updateColorRanges(w, h);

        this.lineStyle(2, 0xFFFFFF);
        if (this.start != null && this.end != null) {
            this.moveTo(this.toX(this.start), y);
            this.lineTo(this.toX(this.end), y);
            this.updateTicksAndLabels(w, h);
            this.updateSelection();
            let selected = this.selection;
            if (selected[0] != this.start && selected[1] != this.end) {
                if (this.showRange)
                    this.drawSelectedRamge(selected);
            }
            for(let callback of this.callbacks) {
                callback(this.scroll, this.zoom, this.selection);
            }
        }
        else {
            this.moveTo(this.inset, y);
            this.lineTo(w-this.inset, y);
        }

        if (this.progress != null && this.progress < 1) {
            this.lineStyle(2, 0xCCCCFF);
            this.moveTo(this.inset, y);
            this.lineTo((w-this.inset) * this.progress, y);
        }
    }

    totalWidth(bounded=false) {
        let w = this.wantedWidth - (2 * this.inset);
        return w * this.validZoom(this.zoom, bounded)
    }

    validZoom(zoom, bounded=true) {
        let overshoot = (bounded) ? 1.0 : 2.0;
        zoom = Math.max(zoom, this.minZoom / overshoot);
        zoom = Math.min(zoom, this.maxZoom * overshoot);
        return zoom
    }

    getY() {
        return this.wantedHeight * this.baseLine
    }

    toX(date) {
        let total = this.end - this.start;
        let offset = this.inset + this.scroll;
        let width = this.totalWidth();
        let delta = date - this.start;
        let ratio = delta / total;
        return offset + ratio * width
    }

    fromX(value) {
        let total = this.end - this.start;
        let offset = this.inset + this.scroll;
        let width = this.totalWidth();
        let ratio = (value - offset) / width;
        let time = this.start.getTime() + total * ratio;
        let date = new Date(time);
        return date
    }

    drawTick(x, direction=1, y=null) {
        if (y == null) {
            y = this.getY();
        }
        this.moveTo(x, y);
        this.lineTo(x, y - (this.tickHeight * direction * this.direction));
    }

    prepareLabels() {
        for(let key of this.labels.keys()) {
            if (!key.startsWith(this.labelPrefix))
                this.labels.get(key).visible = false;
        }
    }

    updateTicksAndLabels(width, height) {
        this.drawTick(this.toX(this.start));
        this.drawTick(this.toX(this.end));
        this.timeticks.draw(this, width, height);
        this.updateLabels(width, height);
    }

    visibleDate(date, offset=0) {
        if (date >= this.start && date <= this.end) {
            let x = this.toX(date) + offset;
            return (x > 0 && x < this.wantedWidth)
        }
        return false
    }

    visibleRange(start, end) {
        let x = this.toX(start);
        if (x > this.wantedWidth)
            return false
        x = this.toX(end);
        if (x < 0)
            return false
        return true
    }

    tickLabelOffset(direction=1, level=0) {
        let fs = FontInfo.small.fontSize;
        let dh = fs + (level * (fs+2));
        return this.direction * direction * dh
    }

    updateLabels(width, height) {
        let h2 = height / 2;
        if (this.labelDates) {
            let last = null;
            let y = h2 + this.tickLabelOffset();
            for(let i=this.labelDates.length-1; i>=0; i--) {
                let [label, date] = this.labelDates[i];
                let align = 'center'; // (last == null) ? 'right' : 'left'
                let x = this.toX(date);
                let current = this.ensureLabel(this.labelPrefix + label, label,
                                { x: x, y: y,
                                  align },
                                FontInfo.small);
                let r = current.getBounds();
                current.visible = !(last != null && r.x + r.width > last.x);
                if (current.visible) {
                    this.drawTick(x, -1);
                    last = r;
                }
            }
        }
        else {
            let start = this.start.toLocaleDateString('de', {year: 'numeric', month: 'numeric', day: 'numeric'});
            let end = this.end.toLocaleDateString('de', {year: 'numeric', month: 'numeric', day: 'numeric'});
            this.ensureLabel(this.labelPrefix + 'start', start, { x: this.toX(this.start), y: h2 });
            this.ensureLabel(this.labelPrefix + 'end', end, { x: this.toX(this.end), y: h2, align: 'right'});
        }
    }

    onZoom(zoom, anchor) {
        let date = this.fromX(anchor.x);
        let newZoom = this.validZoom(this.zoom * zoom, false);
        this.zoom = newZoom;
        let newX = this.toX(date);
        this.scroll += anchor.x - newX;
    }

    onStart(event, interaction) {
        this.killTweens();
        this.deltas = [];
        this.validScroll();
        ThrowPropsPlugin.track(this, 'delta');
    }

    onMove(event, interaction) {
        let delta = interaction.delta();
        this.scroll += delta.x;
        while(this.deltas.length > 10) {
            this.deltas.pop(0);
        }
        this.deltas.push(delta.x);
        if (interaction.current.size > 1) {
            this.onZoom(delta.zoom, delta.about);
        }
        this.redraw();
    }

    _scrollMinimum(bounded) {
        let total = this.totalWidth(bounded);
        return -total + this.wantedWidth - 2*this.inset
    }

    _scrollMaximum(bounded) {
        let total = this.totalWidth(bounded);
        let limit = this.wantedWidth;
        if (total > limit)
            return 0
        let w = limit - 2*this.inset;
        return (w - total) / 2
    }

    scrollMinimum(bounded) {
        return this._scrollMinimum(bounded) - this.extraRight
    }

    scrollMaximum(bounded) {
        return this._scrollMaximum(bounded) + this.extraLeft
    }

    killTweens() {
        TweenMax.killTweensOf(this);
        this.autoScroll = false;
    }


    validScroll(bounded=true) {
        let minimum = this.scrollMinimum(bounded);
        let maximum = this.scrollMaximum(bounded);

        if (this.scroll < minimum) {
            this.scroll = minimum;
        }
        if (this.scroll > maximum) {
            this.scroll = maximum;
        }
    }

    keepInBounds(delta, anchor) {
        let bounded = true;
        let minimum = this.scrollMinimum(bounded);
        let maximum = this.scrollMaximum(bounded);
        let tweens = {};
        if (this.zoom > this.maxZoom) {
            tweens.zoom = this.maxZoom;
            let date = this.fromX(anchor.x);
            let oldZoom = this.zoom;
            this.zoom = this.maxZoom;
            let newX = this.toX(date);
            tweens.scroll = this.scroll + anchor.x - newX;
            this.zoom = oldZoom;
        }
        else {
            if (this.zoom < this.minZoom) {
                tweens.zoom = this.minZoom;
            }
            if (this.scroll > maximum) {
                tweens.scroll = maximum;
            }
             if (this.scroll < minimum) {
                tweens.scroll = minimum;
            }
        }
        if (!isEmpty(tweens)) {
            tweens.onUpdate = () => { this.redraw(); };
            TweenMax.to(this, 0.5, tweens).delay(0.1);
            return
        }
        this.scroll += delta;
        delta *= 0.985;
        this.redraw();
        if (Math.abs(delta) > 1 && this.autoScroll) {
            setTimeout(() => this.keepInBounds(delta, anchor), 1000 / 100);
        }
    }

    onEnd(event, interaction) {
        let vel = ThrowPropsPlugin.getVelocity(this, 'delta');
        ThrowPropsPlugin.untrack(this);

        this.killTweens();
        this.redraw();
        let delta = 0;
        for(let d of this.deltas) {
            delta += d;
        }
        if (this.deltas.length > 0) {
            delta /= this.deltas.length;
        }
        this.autoScroll = true;
        let anchor = interaction.current.mean();
        this.keepInBounds(delta, anchor);
    }

    onMouseWheel(event) {
        this.killTweens();
        let direction = event.detail < 0 || event.wheelDelta > 0;
        let anchor = { x: event.clientX, y: event.clientY};
        const zoomFactor = 1.5;
        this.onZoom((direction) ? zoomFactor : 1 / zoomFactor, anchor);
        this.redraw();
        this.keepInBounds(0, anchor);
    }

    showRanges(ranges, label="Untitled", color=null) {
        for(let cr of this.colorRanges) {
            if (cr.label == label)
                return
        }
        while(this.colorRanges.length >= this.rangeColors.length) {
            this.colorRanges.shift();
        }
        this.colorRanges.push(new ColorRanges(label, color, ranges));
        this.redraw();
    }
}

/**
 * Callback for the slider action onStart.
 *
 * @callback onStartCallback
 * @param {object} event - The event object.
 * @param {Slider} slider - A reference to the slider (also this refers to the slider).
 */

/**
 * Callback for the slider action onUpdate.
 *
 * @callback onUpdateCallback
 * @param {object} event - The event object.
 * @param {Slider} slider - A reference to the slider (also this refers to the slider).
 */

/**
 * Callback for the slider action onComplete.
 *
 * @callback onCompleteCallback
 * @param {object} event - The event object.
 * @param {Slider} slider - A reference to the slider (also this refers to the slider).
 */

/**
 * Class that represents a PixiJS Slider.
 * 
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * // Create the slider
 * const slider = new Slider({
 *     x: 10,
 *     y: 20
 * })
 *
 * // Add the slider to a DisplayObject
 * app.scene.addChild(slider)
 *
 * @class
 * @extends PIXI.Container
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/slider.html|DocTest}
 */
class Slider extends PIXI.Container {
    
    /**
     * Creates an instance of a Slider.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the slider.
     * @param {number} [opts.id=auto generated] - The id of the slider.
     * @param {number} [opts.x=0] - The x position of the slider. Can be also set after creation with slider.x = 0.
     * @param {number} [opts.y=0] - The y position of the slider. Can be also set after creation with slider.y = 0.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this slider. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.width=250] - The width of the slider.
     * @param {number} [opts.height=2] - The height of the slider.
     * @param {PIXI.DisplayObject} [opts.container=window.app|object] - The container where the slider events should be attached to.
     * @param {number} [opts.fill=Theme.fill] - The color of the slider background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.controlFill=Theme.stroke] - The color of the slider control background as a hex value.
     * @param {number} [opts.controlFillAlpha=Theme.strokeAlpha] - The alpha value of the background.
     * @param {number} [opts.controlStroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.controlStrokeWidth=Theme.strokeWidth * 0.8] - The width of the border in pixel.
     * @param {number} [opts.controlStrokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.controlRadius=16] - The radius of the slider control.
     * @param {boolean} [opts.disabled=false] - Is the slider disabled? When disabled, the slider has a lower alpha value
     *     and cannot be clicked (interactive is set to false).
     * @param {onStartCallback} [opts.onStart] - Executed when the slider control starts to move.
     * @param {onUpdateCallback} [opts.onUpdate] - Executed when the slider control is moved.
     * @param {onCompleteCallback} [opts.onComplete] - Executed when the slider control was dropped.
     * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
     *     to display. 
     * @param {boolean} [opts.visible=true] - Is the slider initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            x: 0,
            y: 0,
            width: 250,
            height: 2,
            container: null,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            strokeAlpha: theme.strokeAlpha,
            controlFill: theme.fill,
            controlFillAlpha: .5,
            controlStroke: theme.primaryColor,
            controlStrokeWidth: 2,
            controlStrokeAlpha: theme.strokeAlpha,
            controlRadius: 16,
            orientation: 'horizontal',
            min: 0,
            max: 100,
            value: 0,
            disabled: false,
            onStart: null,
            onUpdate: null,
            onComplete: null,
            tooltip: null,
            visible: true
        }, opts);
        
        this.opts.container = this.opts.container || this;

        // Validation
        //-----------------
        if (this.opts.height > this.opts.width) {
            this.opts.height = this.opts.width;
        }

        if (this.opts.value < this.opts.min) {
            this.opts.value = this.opts.min;
        }

        if (this.opts.value > this.opts.max) {
            this.opts.value = this.opts.max;
        }

        // Properties
        //-----------------
        this.id = this.opts.id;
        this.radius = this.opts.height / 2;

        this._value = this.opts.value;
        this._disabled = null;

        this.sliderObj = null;
        this.control = null;
        this.tooltip = null;
        
        this.visible = this.opts.visible;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Slider} A reference to the slider for chaining.
     */
    setup() {

        // Container events
        //-----------------
        const container = this.opts.container;

        this.on('pointermove', e => {
            if (this.control.dragging) {
                const moveX = this.control.event.data.getLocalPosition(this.control.parent).x;
                this._value = this.pixelToValue(moveX - this.control.delta - this.opts.controlRadius);
                let x = this.valueToPixel(this._value) + this.opts.controlRadius;
                this.control.x = x;

                if (this.opts.onUpdate) {
                    this.opts.onUpdate.call(this, e, this);
                }
            }
        });

        if (container instanceof Element) {
            container.addEventListener('pointerup', e => this.onEnd(e), false);
            container.addEventListener('pointercancel', e => this.onEnd(e), false);
            container.addEventListener('pointerleave', e => this.onEnd(e), false);
            container.addEventListener('pointerout', e => this.onEnd(e), false);
            container.addEventListener('mouseup', e => this.onEnd(e), false);
            container.addEventListener('mousecancel', e => this.onEnd(e), false);
            container.addEventListener('mouseleave', e => this.onEnd(e), false);
            container.addEventListener('mouseout', e => this.onEnd(e), false);
        } else {
            container.interactive = true;
            container.on('pointerup', e => this.onEnd(e));
            container.on('pointercancel', e => this.onEnd(e));
            container.on('pointerleave', e => this.onEnd(e));
            container.on('pointerout', e => this.onEnd(e));
        }

        // Slider
        //-----------------
        let sliderObj = new PIXI.Graphics();
        this.sliderObj = sliderObj;
        this.addChild(sliderObj);

        // Control
        //-----------------
        let control = new PIXI.Graphics();
        control.x = this.opts.controlRadius + this.valueToPixel(this.opts.value);
        control.y = this.opts.controlRadius;

        // pointerdown on the control for dragndrop
        control.on('pointerdown', e => {
            control.event = e;
            control.delta = e.data.getLocalPosition(this.control).x;
            control.dragging = true;

            if (this.opts.onStart) {
                this.opts.onStart.call(this, e, this);
            }
        });

        this.control = control;

        this.addChild(this.control);
        
        // interaction
        //-----------------
        this.sliderObj.on('pointerover', e => {
            TweenMax.to(this.control, this.theme.fast, {alpha: .83});
        });

        this.sliderObj.on('pointerout', e => {
            TweenMax.to(this.control, this.theme.fast, {alpha: 1});
        });

        this.sliderObj.on('pointerdown', e => {
            this.sliderObj.pointerdowned = true;
            TweenMax.to(this.control, this.theme.fast, {alpha: .7});
        });

        // Click on the slider bar
        this.sliderObj.on('pointerup', e => {
            if (this.sliderObj.pointerdowned) {
                this.sliderObj.pointerdowned = false;
                const position = e.data.getLocalPosition(this.control.parent);
                this.value = this.pixelToValue(position.x - this.opts.controlRadius);
                TweenMax.to(this.control, this.theme.fast, {alpha: .83});
            }
        });

        // disabled
        //-----------------
        this.disabled = this.opts.disabled;
        
        // tooltip
        //-----------------
        if (this.opts.tooltip) {
            if (typeof this.opts.tooltip === 'string') {
                this.tooltip = new Tooltip({
                    object: this,
                    content: this.opts.tooltip
                });
            } else {
                this.opts.tooltip.object = this;
                this.tooltip = new Tooltip(this.opts.tooltip);
            }
        }

        return this
    }
    
    /**
     * Should be called to refresh the layout of the slider. Can be used after resizing.
     * 
     * @return {Slider} A reference to the slider for chaining.
     */
    layout() {
        
        // set position
        //-----------------
        this.position.set(this.opts.x, this.opts.y);

        // draw
        //-----------------
        this.draw();

        return this
    }
    
    /**
     * Draws the slider to the canvas.
     * 
     * @private
     * @return {Slider} A reference to the slider for chaining.
     */
    draw() {

        const r = this.radius;
        const cr = this.opts.controlRadius;
        const w = this.opts.width;
        const h = this.opts.height;
        const x = cr + r;
        const y = cr + r - h;

        this.sliderObj.clear();
        this.sliderObj.beginFill(0xffffff, 0);
        this.sliderObj.drawRect(0, 0, x + w + cr, cr * 2);
        this.sliderObj.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
        this.sliderObj.beginFill(this.opts.fill, this.opts.fillAlpha);
        this.sliderObj.moveTo(x, y);
        this.sliderObj.lineTo(x + w, y);
        this.sliderObj.arcTo(x + w + r, y, x + w + r, y + r, r);
        this.sliderObj.lineTo(x + w + r, y + r + 1);                     // BUGFIX: If not specified, there is a small area without a stroke.
        this.sliderObj.arcTo(x + w + r, y + h, x + w, y + h, r);
        this.sliderObj.lineTo(x, y + h);
        this.sliderObj.arcTo(x - r, y + h, x - r, y + r, r);
        this.sliderObj.arcTo(x - r, y, x, y, r);
        this.sliderObj.endFill();

        // Draw control
        this.control.clear();
        this.control.lineStyle(this.opts.controlStrokeWidth, this.opts.controlStroke, this.opts.controlStrokeAlpha);
        this.control.beginFill(this.opts.controlFill, this.opts.controlFillAlpha);
        this.control.drawCircle(0, 0, cr - 1);
        this.control.beginFill(this.opts.controlStroke, this.opts.controlStrokeAlpha);
        this.control.drawCircle(0, 0, cr / 6);
        this.control.endFill();

        return this
    }

    /**
     * Executed, when the slider control movement ended.
     * 
     * @private
     * @return {Slider} A reference to the slider for chaining.
     */
    onEnd(e) {

        if (this.control.dragging) {
            this.control.event = null;
            this.control.dragging = false;
            if (this.opts.onComplete) {
                this.opts.onComplete.call(this, e, this);
            }
        }

        return this
    }

    /**
     * Calculates the value for a given pixel.
     * 
     * @private
     * @param {number} value 
     * @returns  {number} The calucalted pixel.
     */
    valueToPixel(value) {
        if (value < this.opts.min) {
            value = this.opts.min;
        } else if (value > this.opts.max) {
            value = this.opts.max;
        }
        return this.opts.width * (value - this.opts.min) / (this.opts.max - this.opts.min)
    }

    /**
     * Calculates the pixel for a given value.
     * 
     * @private
     * @param {number} pixel 
     * @returns {number} The calucalted value.
     */
    pixelToValue(pixel) {
        if (pixel < 0) {
            pixel = 0;
        } else if (pixel > this.opts.width) {
            pixel = this.opts.width;
        }
        return this.opts.min + ((this.opts.max - this.opts.min) * pixel / this.opts.width)
    }
    
    /**
     * Gets or sets the value.
     * 
     * @member {number}
     */
    get value() {
        return Math.round(this._value)
    }
    set value(value) {
        if (value < this.opts.min) {
            value = this.opts.min;
        } else if (value > this.opts.max) {
            value = this.opts.max;
        }
        this._value = value;

        const x = this.valueToPixel(value) + this.opts.controlRadius;

        TweenMax.to(this.control, this.theme.fast, {x: x});
    }
    
    /**
     * Gets or sets the disabled state. When disabled, the slider cannot be clicked.
     * 
     * @member {boolean}
     */
    get disabled() {
        return this._disabled
    }
    set disabled(value) {

        this._disabled = value;
        
        if (this._disabled) {
            this.interactive = false;
            this.sliderObj.interactive = false;
            this.control.interactive = false;
            this.control.buttonMode = false;
            this.alpha = .5;
        } else {
            this.interactive = true;
            this.sliderObj.interactive = true;
            this.control.interactive = true;
            this.control.buttonMode = true;
            this.alpha = 1;
        }
    }

    /**
     * Shows the slider (sets his alpha values to 1).
     * 
     * @return {Slider} A reference to the slider for chaining.
     */
    show() {

        this.opts.strokeAlpha = 1;
        this.opts.fillAlpha = 1;
        this.opts.controlStrokeAlpha = 1;
        this.opts.controlFillAlpha = 1;

        this.layout();

        return this
    }
    
    /**
     * Hides the slider (sets his alpha values to 1).
     * 
     * @return {Slider} A reference to the slider for chaining.
     */
    hide() {

        this.opts.strokeAlpha = 0;
        this.opts.fillAlpha = 0;
        this.opts.controlStrokeAlpha = 0;
        this.opts.controlFillAlpha = 0;

        this.layout();

        return this
    }
}

/**
 * Callback for the switch action.
 *
 * @callback actionCallback
 * @param {object} event - The event object.
 * @param {Switch} switch - A reference to the switch (also this refers to the switch).
 */

/**
 * Callback for the switch action.
 *
 * @callback actionActiveCallback
 * @param {object} event - The event object.
 * @param {Switch} switch - A reference to the switch (also this refers to the switch).
 */

/**
 * Callback for the switch beforeAction.
 *
 * @callback beforeActionCallback
 * @param {object} event - The event object.
 * @param {Switch} switch - A reference to the switch (also this refers to the switch).
 */

/**
 * Callback for the switch afterAction.
 *
 * @callback afterActionCallback
 * @param {object} event - The event object.
 * @param {Switch} switch - A reference to the switch (also this refers to the switch).
 */

/**
 * Class that represents a PixiJS Switch.
 * 
 * @example
 * // Create the app
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * // Create the switch
 * const switch1 = new Switch({
 *     x: 10,
 *     y: 20
 * })
 *
 * // Add the switch to a DisplayObject
 * app.scene.addChild(switch1)
 *
 * @class
 * @extends PIXI.Container
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/switch.html|DocTest}
 */
class Switch extends PIXI.Container {
    
    /**
     * Creates an instance of a Switch.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the switch.
     * @param {number} [opts.id=auto generated] - The id of the switch.
     * @param {number} [opts.x=0] - The x position of the switch. Can be also set after creation with switch.x = 0.
     * @param {number} [opts.y=0] - The y position of the switch. Can be also set after creation with switch.y = 0.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this switch. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.width=44] - The width of the switch.
     * @param {number} [opts.height=28] - The height of the switch.
     * @param {number} [opts.fill=Theme.fill] - The color of the switch background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.fillActive=Theme.fillActive] - The color of the switch background when activated.
     * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=Theme.strokeActiveWidth] - The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
     * @param {number} [opts.controlFill=Theme.stroke] - The color of the switch control background as a hex value.
     * @param {number} [opts.controlFillAlpha=Theme.strokeAlpha] - The alpha value of the background.
     * @param {number} [opts.controlFillActive=Theme.stroke] - The color of the switch control background when activated.
     * @param {number} [opts.controlFillActiveAlpha=Theme.strokeAlpha] - The alpha value of the background when activated.
     * @param {number} [opts.controlStroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.controlStrokeWidth=Theme.strokeWidth * 0.8] - The width of the border in pixel.
     * @param {number} [opts.controlStrokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.controlStrokeActive=Theme.stroke] - The color of the border when activated.
     * @param {number} [opts.controlStrokeActiveWidth=Theme.strokeActiveWidth * 0.8] - The width of the border in pixel when activated.
     * @param {number} [opts.controlStrokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
     * @param {number} [opts.duration=Theme.fast] - The duration of the animation when the switch gets activated in seconds.
     * @param {number} [opts.durationActive=Theme.fast] - The duration of the animation when the switch gets deactivated in seconds.
     * @param {boolean} [opts.disabled=false] - Is the switch disabled? When disabled, the switch has a lower alpha value
     *     and cannot be clicked (interactive is set to false).
     * @param {boolean} [opts.active=false] - Is the button initially active?
     * @param {actionCallback} [opts.action] - Executed when the switch was triggered in inactive state (by pointerup).
     * @param {actionActiveCallback} [opts.actionActive] - Executed when the button was triggered in active state (by pointerup).
     * @param {beforeActionCallback} [opts.beforeAction] - Executed before an action is triggered.
     * @param {afterActionCallback} [opts.afterAction] - Executed after an action was triggered.
     * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
     *     to display. 
     * @param {boolean} [opts.visible=true] - Is the switch initially visible (property visible)?
     */
    constructor(opts = {}) {

        super();
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            x: 0,
            y: 0,
            width: 44,
            height: 28,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            fillActive: theme.primaryColor,
            fillActiveAlpha: theme.fillActiveAlpha,
            stroke: theme.stroke,
            strokeWidth: theme.strokeWidth,
            strokeAlpha: theme.strokeAlpha,
            strokeActive: theme.primaryColor,
            strokeActiveWidth: theme.strokeActiveWidth,
            strokeActiveAlpha: theme.strokeActiveAlpha,
            controlFill: theme.stroke,
            controlFillAlpha: theme.strokeAlpha,
            controlFillActive: theme.stroke,
            controlFillActiveAlpha: theme.strokeAlpha,
            controlStroke: theme.stroke,
            controlStrokeWidth: theme.strokeWidth * .8,
            controlStrokeAlpha: theme.strokeAlpha,
            controlStrokeActive: theme.stroke,
            controlStrokeActiveWidth: theme.strokeActiveWidth * .8,
            controlStrokeActiveAlpha: theme.strokeActiveAlpha,
            duration: theme.fast,
            durationActive: theme.fast,
            disabled: false,
            active: false,
            action: null,
            actionActive: null,
            beforeAction: null,
            afterAction: null,
            tooltip: null,
            visible: true
        }, opts);

        this.opts.controlRadius = this.opts.controlRadius || (this.opts.height / 2);
        this.opts.controlRadiusActive = this.opts.controlRadiusActive || this.opts.controlRadius;

        // Validation
        //-----------------
        if (this.opts.height > this.opts.width) {
            this.opts.height = this.opts.width;
        }

        // Properties
        //-----------------
        this.id = this.opts.id;
        this.radius = this.opts.height / 2;

        this._active = null;
        this._disabled = null;

        this.switchObj = null;
        this.control = null;
        this.tooltip = null;
        
        this.visible = this.opts.visible;

        // animated
        //-----------------
        this.tempAnimated = {
            fill: this.opts.fill,
            fillAlpha: this.opts.fillAlpha,
            stroke: this.opts.stroke,
            strokeWidth: this.opts.strokeWidth,
            strokeAlpha: this.opts.strokeAlpha,
            controlFill: this.opts.controlFill,
            controlFillAlpha: this.opts.controlFillAlpha,
            controlStroke: this.opts.controlStroke,
            controlStrokeWidth: this.opts.controlStrokeWidth,
            controlStrokeAlpha: this.opts.controlStrokeAlpha,
            controlRadius: this.opts.controlRadius
        };

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Switch} A reference to the switch for chaining.
     */
    setup() {

        // Switch
        //-----------------
        let switchObj = new PIXI.Graphics();
        this.switchObj = switchObj;
        this.addChild(switchObj);

        // Control
        //-----------------
        this.xInactive = this.opts.controlRadius;
        this.xActive = this.opts.width - this.opts.controlRadiusActive;
        
        let control = new PIXI.Graphics();
        control.x = this.opts.active ? this.xActive : this.xInactive;
        control.y = this.opts.height / 2;

        this.control = control;

        this.addChild(this.control);
        
        // interaction
        //-----------------
        this.switchObj.on('pointerover', e => {
            TweenMax.to(this.control, this.theme.fast, {alpha: .83});
        });

        this.switchObj.on('pointerout', e => {
            TweenMax.to(this.control, this.theme.fast, {alpha: 1});
        });

        this.switchObj.on('pointerdown', e => {
            TweenMax.to(this.control, this.theme.fast, {alpha: .7});
        });

        this.switchObj.on('pointerup', e => {

            if (this.opts.beforeAction) {
                this.opts.beforeAction.call(this, e, this);
            }

            this.active = !this.active;

            if (this.active) {
                if (this.opts.action) {
                    this.opts.action.call(this, e, this);
                }
            } else {
                if (this.opts.actionActive) {
                    this.opts.actionActive.call(this, e, this);
                }
            }

            TweenMax.to(this.control, this.theme.fast, {alpha: .83});

            if (this.opts.afterAction) {
                this.opts.afterAction.call(this, e, this);
            }
        });

        // disabled
        //-----------------
        this.disabled = this.opts.disabled;

        // active
        //-----------------
        this.active = this.opts.active;
        
        // tooltip
        //-----------------
        if (this.opts.tooltip) {
            if (typeof this.opts.tooltip === 'string') {
                this.tooltip = new Tooltip({
                    object: this,
                    content: this.opts.tooltip
                });
            } else {
                this.opts.tooltip.object = this;
                this.tooltip = new Tooltip(this.opts.tooltip);
            }
        }

        return this
    }
    
    /**
     * Should be called to refresh the layout of the switch. Can be used after resizing.
     * 
     * @return {Switch} A reference to the switch for chaining.
     */
    layout() {
        
        // set position
        //-----------------
        this.position.set(this.opts.x, this.opts.y);

        // draw
        //-----------------
        this.draw();

        return this
    }
    
    /**
     * Draws the switch to the canvas.
     * 
     * @private
     * @return {Switch} A reference to the switch for chaining.
     */
    draw() {

        this.switchObj.clear();
        if (this.active) {
            this.switchObj.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha);
            this.switchObj.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha);
        } else {
            this.switchObj.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
            this.switchObj.beginFill(this.opts.fill, this.opts.fillAlpha);
        }
        this.switchObj.moveTo(this.radius, 0);
        this.switchObj.lineTo(this.opts.width - this.radius, 0);
        this.switchObj.arcTo(this.opts.width, 0, this.opts.width, this.radius, this.radius);
        this.switchObj.lineTo(this.opts.width, this.radius + 1);                                   // BUGFIX: If not specified, there is a small area without a stroke.
        this.switchObj.arcTo(this.opts.width, this.opts.height, this.opts.width - this.radius, this.opts.height, this.radius);
        this.switchObj.lineTo(this.radius, this.opts.height);
        this.switchObj.arcTo(0, this.opts.height, 0, this.radius, this.radius);
        this.switchObj.arcTo(0, 0, this.radius, 0, this.radius);
        this.switchObj.endFill();

        // Draw control
        this.control.clear();
        if (this.active) {
            this.control.lineStyle(this.opts.controlStrokeActiveWidth, this.opts.controlStrokeActive, this.opts.controlStrokeActiveAlpha);
            this.control.beginFill(this.opts.controlFillActive, this.opts.controlFillActiveAlpha);
            this.control.drawCircle(0, 0, this.opts.controlRadiusActive - 1);
        } else {
            this.control.lineStyle(this.opts.controlStrokeWidth, this.opts.controlStroke, this.opts.controlStrokeAlpha);
            this.control.beginFill(this.opts.controlFill, this.opts.controlFillAlpha);
            this.control.drawCircle(0, 0, this.opts.controlRadius - 1);
        }
        this.control.endFill();

        return this
    }
    
    /**
     * Draws the animation.
     * 
     * @private
     * @return {Switch} A reference to the switch for chaining.
     */
    drawAnimated() {

        this.switchObj.clear();
        this.switchObj.lineStyle(this.tempAnimated.strokeWidth, this.tempAnimated.stroke, this.tempAnimated.strokeAlpha);
        this.switchObj.beginFill(this.tempAnimated.fill, this.tempAnimated.fillAlpha);
        this.switchObj.moveTo(this.radius, 0);
        this.switchObj.lineTo(this.opts.width - this.radius, 0);
        this.switchObj.arcTo(this.opts.width, 0, this.opts.width, this.radius, this.radius);
        this.switchObj.lineTo(this.opts.width, this.radius + 1);                                   // BUGFIX: If not specified, there is a small area without a stroke.
        this.switchObj.arcTo(this.opts.width, this.opts.height, this.opts.width - this.radius, this.opts.height, this.radius);
        this.switchObj.lineTo(this.radius, this.opts.height);
        this.switchObj.arcTo(0, this.opts.height, 0, this.radius, this.radius);
        this.switchObj.arcTo(0, 0, this.radius, 0, this.radius);
        this.switchObj.endFill();

        this.control.clear();
        this.control.lineStyle(this.tempAnimated.controlStrokeWidth, this.tempAnimated.controlStroke, this.tempAnimated.controlStrokeAlpha);
        this.control.beginFill(this.tempAnimated.controlFill, this.tempAnimated.controlFillAlpha);
        this.control.drawCircle(0, 0, this.tempAnimated.controlRadius - 1);
        this.control.endFill();

        return this
    }
    
    /**
     * Gets or sets the active state.
     * 
     * @member {boolean}
     */
    get active() {
        return this._active
    }

    set active(value) {

        this._active = value;

        if (this._active) {

            TweenMax.to(this.control, this.opts.duration, {x: this.xActive});
            TweenMax.to(this.tempAnimated, this.opts.duration, {
                colorProps: {
                    fill: this.opts.fillActive,
                    stroke: this.opts.strokeActive,
                    controlFill: this.opts.controlFillActive,
                    controlStroke: this.opts.controlStrokeActive,
                    format: 'number'
                },
                fillAlpha: this.opts.fillActiveAlpha,
                strokeWidth: this.opts.strokeActiveWidth,
                strokeAlpha: this.opts.strokeActiveAlpha,
                controlFillAlpha: this.opts.controlFillActiveAlpha,
                controlStrokeWidth: this.opts.controlStrokeActiveWidth,
                controlStrokeAlpha: this.opts.controlStrokeActiveAlpha,
                controlRadius: this.opts.controlRadiusActive,
                onUpdate: () => this.drawAnimated(),
                onComplete: () => this.draw()
            });


        } else {
            TweenMax.to(this.control, this.opts.durationActive, {x: this.xInactive});
            TweenMax.to(this.tempAnimated, this.opts.durationActive, {
                colorProps: {
                    fill: this.opts.fill,
                    stroke: this.opts.stroke,
                    controlFill: this.opts.controlFill,
                    controlStroke: this.opts.controlStroke,
                    format: 'number'
                },
                fillAlpha: this.opts.fillAlpha,
                strokeWidth: this.opts.strokeWidth,
                strokeAlpha: this.opts.strokeAlpha,
                controlFillAlpha: this.opts.controlFillAlpha,
                controlStrokeWidth: this.opts.controlStrokeWidth,
                controlStrokeAlpha: this.opts.controlStrokeAlpha,
                controlRadius: this.opts.controlRadius,
                onUpdate: () => this.drawAnimated(),
                onComplete: () => this.draw()
            });
        }
    }
    
    /**
     * Gets or sets the disabled state. When disabled, the switch cannot be clicked.
     * 
     * @member {boolean}
     */
    get disabled() {
        return this._disabled
    }

    set disabled(value) {

        this._disabled = value;
        
        if (this._disabled) {
            this.switchObj.interactive = false;
            this.switchObj.buttonMode = false;
            this.switchObj.alpha = .5;
            this.control.alpha = .5;
        } else {
            this.switchObj.interactive = true;
            this.switchObj.buttonMode = true;
            this.switchObj.alpha = 1;
            this.control.alpha = 1;
        }
    }

    /**
     * Shows the switch (sets his alpha values to 1).
     * 
     * @return {Switch} A reference to the switch for chaining.
     */
    show() {

        this.opts.strokeAlpha = 1;
        this.opts.strokeActiveAlpha = 1;
        this.opts.fillAlpha = 1;
        this.opts.fillActiveAlpha = 1;
        this.opts.controlStrokeAlpha = 1;
        this.opts.controlStrokeActiveAlpha = 1;
        this.opts.controlFillAlpha = 1;
        this.opts.controlFillActiveAlpha = 1;

        this.layout();

        return this
    }
    
    /**
     * Hides the switch (sets his alpha values to 1).
     * 
     * @return {Switch} A reference to the switch for chaining.
     */
    hide() {

        this.opts.strokeAlpha = 0;
        this.opts.strokeActiveAlpha = 0;
        this.opts.fillAlpha = 0;
        this.opts.fillActiveAlpha = 0;
        this.opts.controlStrokeAlpha = 0;
        this.opts.controlStrokeActiveAlpha = 0;
        this.opts.controlFillAlpha = 0;
        this.opts.controlFillActiveAlpha = 0;

        this.layout();

        return this
    }
}

/**
 * Class that represents a PixiJS PopupMenu.
 * 
 * @example
 * // Create the button and the modal when clicked
 * const button = new Button({
 *     label: 'Show PopupMenu',
 *     action: e => {
 *         const popupmenu = new PopupMenu({
 *             items: [
 *                 {label: 'Save', action: () => alert('Saved')},
 *                 {label: 'Edit', action: () => alert('Edited')},
 *                 {label: 'Delete', action: () => alert('Deleted')}
 *             ]
 *         })
 *         app.scene.addChild(popupmenu)
 *     }
 * })
 *
 * // Add the button to a DisplayObject
 * app.scene.addChild(button)
 *
 * @class
 * @extends Popup
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/popupmenu.html|DocTest}
 */
class PopupMenu$1 extends Popup {
    
    /**
     * Creates an instance of a PopupMenu.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the modal.
     * @param {object[]} [opts.items=[]] - A list of the menu items. Each item must be of type object.
     *     If an object has a label property, a PIXI.Text object is created (using the textStyle property).
     *     If an object hasn't a label property, it must contain a content property which has to be a
     *     PIXI.DisplayObject.
     * @param {number} [opts.margin=Theme.margin / 2] - The app where the modal belongs to.
     * @param {object} [opts.textStyle=Theme.textStyle] - The color of the background.
     * @param {boolean} [opts.closeOnPopup=true] - The opacity of the background.
     */
    constructor(opts = {}) {
        
        const theme = Theme.fromString(opts.theme);
        
        opts = Object.assign({}, {
            items: [],
            margin: theme.margin / 2,
            textStyle: theme.textStyle,
            closeOnPopup: true
        }, opts);

        super(opts);
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {PopupMenu} A reference to the popupmenu for chaining.
     */
    setup() {

        // content
        //-----------------
        const content = new PIXI.Container();
        
        let y = 0;
        for (let item of this.opts.items) {

            let object = null;

            if (item.label) {
                object = new PIXI.Text(item.label, item.textStyle || this.opts.textStyle);
            } else {
                object = item.content;
            }

            object.y = y;

            if (item.action) {
                if (item.disabled) {
                    object.alpha = .5;
                } else {
                    object.interactive = true;
                    object.buttonMode = true;
                }
                object.on('pointerover', e => {
                    TweenMax.to(object, this.theme.fast, {alpha: .83, overwrite: 'none'});
                });
                object.on('pointerout', e => {
                    TweenMax.to(object, this.theme.fast, {alpha: 1, overwrite: 'none'});
                });
                object.on('pointerup', e => {
                    item.action.call(object, e, object);
                    if (this.opts.closeOnAction) {
                        this.hide();
                    }
                });
            }

            content.addChild(object);

            y += object.height + this.opts.margin;
        }

        this.opts.content = content;

        super.setup();
    }
}

/* global Quad */

/**
 * Class that represents a PixiJS Volatile.
 * 
 * @example
 * const app = new PIXIApp({
 *     view: canvas,
 *     width: 900,
 *     height: 250
 * }).setup().run()
 * 
 * const button = new Button({
 *     label: 'Volatile!',
 *     action: () => {
 *         new Volatile({
 *             object: button,
 *             direction: 'right',
 *             destroyOnComplete: false
 *         })
 *     }
 * })
 * 
 * app.scene.addChild(button)
 *
 * @class
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/volatile.html|DocTest}
 */
class Volatile {
    
    /**
     * Creates an instance of a Volatile.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the modal.
     * @param {number} [opts.id=auto generated] - The id of the tooltip.
     * @param {PIXI.DisplayObject|PIXI.DisplayObject[]} opts.object - The object where the volatile should be applied to.
     * @param {string} [opts.direction=top] - The animation direction. Possible values: top, right, bottom, left.
     * @param {function} [opts.onStart] - A function which is executed when the volatile animation starts.
     * @param {function} [opts.onComplete] - A function which is executed when the volatile animation finishes.
     * @param {number} [opts.distance=160] - The animation distance.
     * @param {number} [opts.duration=1.5] - The duration of the animation in seconds.
     * @param {object} [opts.ease=Quad.easeOut] - The easing of the animation, see {@link https://greensock.com/docs/Easing}
     * @param {boolean} [opts.destroyOnComplete=true] - Should the object be destroyed after the volatile animation?
     */
    constructor(opts = {}) {
        
        const theme = Theme.fromString(opts.theme);
        this.theme = theme;

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            object: null,
            direction: 'top',               // top, right, bottom, left
            onStart: null,
            onComplete: null,
            distance: 160,
            duration: 1.5,
            ease: Quad.easeOut,
            destroyOnComplete: true
        }, opts);

        this.id = this.opts.id;

        if (!Array.isArray(this.opts.object)) {
            this.opts.object = [this.opts.object];
        }

        this.objects = this.opts.object;

        // setup
        //-----------------
        this.setup();

        // layout
        //-----------------
        this.layout();

        // run
        //-----------------
        this.run();
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Volatile} A reference to the volatile for chaining.
     */
    setup() {

        return this
    }
    
    /**
     * Should be called to refresh the layout of the volatile. Can be used after resizing.
     * 
     * @return {Volatile} A reference to the volatile for chaining.
     */
    layout() {
        
        return this
    }
    
    /**
     * Starts the volatile animation.
     * 
     * @private
     * @return {Volatile} A reference to the volatile for chaining.
     */
    run() {

        for (let object of this.objects) {

            let x = object.x;
            let y = object.y;

            switch (this.opts.direction) {
                case 'top':
                    y -= this.opts.distance;
                    break
                case 'right':
                    x += this.opts.distance;
                    break
                case 'bottom':
                    y += this.opts.distance;
                    break
                case 'left':
                    x -= this.opts.distance;
                    break
            }

            TweenMax.to(object, this.opts.duration, {
                x: x,
                y: y,
                alpha: 0,
                ease: this.opts.ease,
                overwrite: 'all',
                onStart: () => {
                    if (this.opts.onStart) {
                        this.opts.onStart.call(object, object);
                    }
                },
                onComplete: () => {
                    
                    if (this.opts.onComplete) {
                        this.opts.onComplete.call(object, object);
                    }

                    if (this.opts.destroyOnComplete) {
                        object.destroy({children: true});
                    }
                }
            });
        }

        return this
    }
}

/* Needed to ensure that rollup.js includes class definitions and the classes
are visible inside doctests.
*/
window.PIXIApp = PIXIApp;
window.BlurFilter = BlurFilter;
window.FlipEffect = FlipEffect;
window.DeepZoomInfo = DeepZoomInfo;
window.DeepZoomImage = DeepZoomImage;
window.Popover = Popover;
window.ScatterContainer = ScatterContainer;
window.DisplayObjectScatter = DisplayObjectScatter;
window.Command = Command;
window.RecorderTools = RecorderTools;
window.Timeline = Timeline;
window.AppTest = AppTest;
window.Theme = Theme;
window.Button = Button;
window.ButtonGroup = ButtonGroup;
window.Slider = Slider;
window.Switch = Switch;
window.Popup = Popup;
window.PopupMenu = PopupMenu$1;
window.Modal = Modal;
window.Volatile = Volatile;
window.Message = Message;
window.Tooltip = Tooltip;
window.Badge = Badge;
window.Progress = Progress;

}());
//# sourceMappingURL=all.js.map
