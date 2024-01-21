import {Elements} from "./utils.js"

/** A Popup that shows text labels, images, or html
 */
export default class Popup {
    /**
    * The constructor.
    * @constructor
    * @param {DOM Element} parent - The DOM parent element.
    * @param {Object} content - A dict object with type strings (text, img, html) as keys
    *                            and corresponding values.
    * @param {string} fontSize - Describes the font size as CSS value
    * @param {string} fontFamily - Describes the font family as CSS value
    * @param {number || string} padding - Describes the padding as CSS value
    * @param {number || string} notchSize - Describes the size of the notch (callout) as CSS value
    * @param {string} backgroundColor  - The color of the background as CSS value
    * @param {string} normalColor  - The color of textitems as CSS value
    * @param {boolean} autoClose  - Autoclose the Popup on tap
    */
    constructor({parent = null,
                    content = null,
                    fontSize='1em',
                    fontFamily='Arial',
                    padding=16,
                    notchSize=10,
                    switchPos=false,
                    maxWidth=800,
                    backgroundColor='#EEE',
                    normalColor='#444',
                    notchPosition='bottomLeft',
                    autoClose=true} = {}) {
        this.padding = padding
        this.notchPosition = notchPosition
        this.notchSize = notchSize
        this.switchPos = switchPos
        this.fontSize = fontSize
        this.fontFamily = fontFamily
        this.maxWidth = maxWidth
        this.normalColor = normalColor
        this.backgroundColor = backgroundColor
        this.autoClose = autoClose
        this.parent = parent || document.body
        if (content) {
            this.show(content)
        }
    }

    /** Setup menu with a dictionary of content types and contents.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
    *                            and corresponding values.
     * @return {Popup} this
     */
    setup(content) {
        this.content = content
        this.items = {}
        this.element = document.createElement('div')
        Elements.addClass(this.element, 'unselectable')
        this.notch = document.createElement('div')
        Elements.setStyle(this.notch, this.notchStyle())
        for(let key in content) {
            switch(key) {
                case 'text':
                    let text = document.createElement('span')
                    this.element.appendChild(text)
                    text.innerHTML = content[key]
                    Elements.setStyle(text, {color: this.normalColor})
                    Elements.addClass(text, 'unselectable')
                    Elements.addClass(text, 'PopupContent')
                    break
                case 'img':
                    alert("img to be implemented")
                    break
                case 'html':
                    let div = document.createElement('div')
                    this.element.appendChild(div)
                    div.innerHTML = content[key]
                    Elements.addClass(div, 'PopupContent')
                    break
                default:
                    alert("Unexpected content type: " + key)
                    break
            }
        }
        this.element.appendChild(this.notch)
        this.parent.appendChild(this.element)
        Elements.setStyle(this.element, this.defaultStyle())
        console.log("Popup.setup", this.defaultStyle())
        this.layout()
        return this
    }

    /** Layout the menu items
     */
    layout() {

    }

    /** Close and remove the Popup from the DOM tree.
    */
    close() {
        this.parent.removeChild(this.element)
        if (Popup.openPopup == this) {
            Popup.openPopup = null
        }
    }

    /** Shows the Popup with the given commands at the specified point.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
     *                            and corresponding values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @return {Popup} this
    */
    showAt(content, point) {
        this.show(content)
        this.placeAt(point)
        return this
    }

    placeAt(point) {
        let x = point.x
        let y = point.y
        let rect = this.element.getBoundingClientRect()
        let h = rect.bottom-rect.top
        /* TODO: Implement different notchPositions */
        switch(this.notchPosition) {
            case "bottomLeft":
                x -= this.padding
                x -= this.notchSize
                y -= (this.notchSize+h);
                Elements.setStyle(this.element,
                     { left: x + 'px', top: y + 'px'} )
                break

            case "topLeft":
                x -= this.padding
                x -= this.notchSize
                y += this.notchSize
                Elements.setStyle(this.element,
                    { left: x + 'px', top: y + 'px'} )
                break
            default:
                Elements.setStyle(this.element,
                    { left: x + 'px', top: y + 'px'} )
                break
        }
    }

    /** Shows the Popup with the given commands at the current position.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
     *                            and corresponding values.
     * @return {Popup} this
     */
    show(content) {
        this.setup(content)
        return this
    }

    /** Configuration object. Return default styles as CSS values.
    */
    defaultStyle() {
        let padding = this.padding
        return {
            borderRadius: Math.round(this.padding / 2) + 'px',
            backgroundColor: this.backgroundColor,
            padding: this.padding + 'px',
            maxWidth: this.maxWidth + 'px',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
            position: 'absolute',
            fontFamily : this.fontFamily,
            fontSize: this.fontSize,
            stroke: 'black',
            fill : 'white'}
    }

    /** Configuration object. Return notch styles as CSS values.
    */
    notchStyle() {
        switch(this.notchPosition) {
            case "bottomLeft":
                return {
                    width: 0,
                    height: 0,
                    boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                    bottom: -this.notchSize + 'px', // '-10px',
                    position: 'absolute',
                    borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                    borderRight: this.notchSize + 'px solid transparent',
                    borderLeft: this.notchSize + 'px solid transparent',
                    borderBottom: 0
                }
            case "topLeft":
                return {
                    width: 0,
                    height: 0,
                    top: -this.notchSize + 'px',
                    position: 'absolute',
                    borderBottom: this.notchSize + 'px solid ' + this.backgroundColor,
                    borderRight: this.notchSize + 'px solid transparent',
                    borderLeft: this.notchSize + 'px solid transparent',
                    borderTop: 0
                }
            default:
                return {
                    width: 0,
                    height: 0,
                    boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                    bottom: -this.notchSize + 'px', // '-10px',
                    position: 'absolute',
                    borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                    borderRight: this.notchSize + 'px solid transparent',
                    borderLeft: this.notchSize + 'px solid transparent',
                    borderBottom: 0
                }
        }
    }

    /** Convenient static methods to show and reuse a Popup implemented
     * as a class variable.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
     *                            and corresponding values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @param {boolean} autoClose - Autoclose the menu after selecting an item.
     */
    static open(content, point, {parent = null,
                    fontSize='1em',
                    fontFamily='Arial',
                    padding=16,
                    notchSize=10,
                    switchPos=false,
                    maxWidth=800,
                    backgroundColor='#EEE',
                    normalColor='#444',
                    autoClose=true} = {}) {
        if (Popup.openPopup) {
            this.closePopup()
            return
        }
        if (parent !== null) {
            point = convertPointFromPageToNode(parent, point.x, point.y)
        }
        let notchPosition = 'bottomLeft'
        if (point.y < 50) {
            if(switchPos)notchPosition = 'topLeft'
        }
        let popup = new Popup({parent, fontSize, padding, notchSize, switchPos,
                                maxWidth, backgroundColor, normalColor,
                                notchPosition, autoClose})
        popup.showAt(content, point)
        Popup.openPopup = popup
        /*if (autoClose) {
            window.addEventListener('mousedown', (e) => this.closePopup(e), true)
            window.addEventListener('touchstart', (e) => this.closePopup(e), true)
            window.addEventListener('pointerdown', (e) => this.closePopup(e), true)
        }*/
        Popup.closeEventListener = (e) => { if (this.eventOutside(e))
                                                        this.closePopup(e);};
        if (autoClose) {
            window.addEventListener('mousedown', Popup.closeEventListener, true);
            window.addEventListener('touchstart', Popup.closeEventListener, true);
            window.addEventListener('pointerdown', Popup.closeEventListener, true);
        }
    }

    static eventOutside(e) {
        return !Elements.hasClass(e.target, 'PopupContent')
    }

    /** Convenient static methods to close the Popup implemented
     * as a class variable.
     */
    static closePopup(e) {
        if (Popup.openPopup) {
            Popup.openPopup.close()
        }
    }
}

/* Class variable */
Popup.openPopup = null
