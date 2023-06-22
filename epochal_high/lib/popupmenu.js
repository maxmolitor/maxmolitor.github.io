import Popup from './popup.js'
import {Elements} from './utils.js'

/** A Popup Menu that shows text labels in a vertical row.
 */
export default class PopupMenu extends Popup {
    /**
    * The constructor.
    * @constructor
    * @param {DOM Element} parent - The DOM parent element.
    * @param {Object} commands - A dict object with command label strings as keys
    *                            and command functions as values.
    * @param {string} fontSize - Describes the font size as CSS value
    * @param {number || string} padding - Describes the padding as CSS value
    * @param {number || string} notchSize - Describes the size of the notch (callout) as CSS value
    * @param {string} highlightColor  - The color of highlighted menu items as CSS value
    * @param {string} backgroundColor  - The color of the background as CSS value
    * @param {string} normalColor  - The color of normal menu items as CSS value
    * @param {boolean} autoClose  - Autoclose the menu after selecting an item
    */
    constructor({parent = null,
                    commands = null,
                    fontSize='1em',
                    fontFamily='Arial',
                    padding=16,
                    zIndex=1,
                    spacing='0px',
                    switchPos=false,
                    notchSize=10,
                    maxWidth=800,
                    backgroundColor='#EEE',
                    normalColor='#444',
                    highlightColor='black',
                    notchPosition='bottomLeft',
                    autoClose=true} = {}) {
        super({parent, fontSize, fontFamily, padding, notchSize, notchPosition, backgroundColor, normalColor, autoClose})
        this.commands = commands
        this.zIndex = zIndex
        this.switchPos = switchPos
        this.spacing = spacing
        this.highlightColor = highlightColor

    }

    /** Setup menu with a dictionary of command labels and command functions.
     * @param {Object} commands - A dict object with command label strings as keys
     *                            and command functions as values.
     * @return {PopupMenu} this
     */
    setup(commands) {

        this.commands = commands
        this.items = {}
        this.element = document.createElement('div')
        this.element.style.zIndex = this.zIndex
        Elements.addClass(this.element, 'unselectable')
        this.notch = document.createElement('div')
        Elements.setStyle(this.notch, this.notchStyle())
        for(let key in commands) {
            let item = document.createElement('div')
            this.element.appendChild(item)
            item.innerHTML = key
            item.style.paddingBottom = item.style.paddingTop = this.spacing
            Elements.setStyle(item, {color: this.normalColor})
            Elements.addClass(item, 'unselectable')
            Elements.addClass(item, 'popupMenuItem')
            this.items[key] = item
            item.onclick = (event) => { this.perform(key) }
            item.ontap = (event) => { this.perform(key) }
            item.onmouseover = (event) => { this.over(event, key) }
            item.onmouseout = (event) => { this.out(event, key) }
        }
        this.element.appendChild(this.notch)
        this.parent.appendChild(this.element)
        Elements.setStyle(this.element, this.defaultStyle())
        this.layout()
        return this
    }

    /** Execute a menu command.
     * @param {string} key - The selected key.
     */
    perform(key) {
        let func = this.commands[key]
        if (this.autoClose) {
            this.close()
            console.log('close')
        }
        setTimeout(() => {
            func.call()
            }, 20)
    }

    /** Update the menu item denoted by key.
     * @param {string} key - The selected key.
     * @param {boolean} highlight - Show the item highlighted.
     */
    update(key, highlight=false) {
        let text = this.items[key]
        text.style.color = (highlight) ? this.highlightColor : this.normalColor
    }

    /** Mouse over handöer.
     * @param {Event} event - The mouse event.
     * @param {boolean} key - The selected key.
     */
    over(event, key) {
        for(let k in this.items) {
            this.update(k, k == key)
        }
    }

    /** Mouse out handöer.
     * @param {Event} event - The mouse event.
     * @param {boolean} key - The selected key.
     */
    out(event, key) {
        this.update(key)
    }

    /** Shows the PopupMenu with the given commands at the specified point.
     * @param {Object} commands - A dict object with command label strings as keys
     *                            and command functions as values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @return {PopupMenu} this
    */
    showAt(commands, point) {
        this.show(commands)
        this.placeAt(point)
        return this
    }

    /** Convenient static methods to show and reuse a PopupMenu implemented
     * as a class variable.
     * @param {Object} commands - A dict object with command label strings as keys
     *                            and command functions as values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @param {string} fontSize - Describes the font size as CSS value
     * @param {number || string} padding - Describes the padding as CSS value
     * @param {number || string} notchSize - Describes the size of the notch (callout) as CSS value
     * @param {string} highlightColor  - The color of highlighted menu items as CSS value
     * @param {string} backgroundColor  - The color of the background as CSS value
     * @param {string} normalColor  - The color of normal menu items as CSS value
     * @param {boolean} autoClose  - Autoclose the menu after selecting an item
     */
    static open(commands, point, {parent = null,
                    fontSize='1em',
                    fontFamily='Arial',
                    padding=16,
                    zIndex=1,
                    spacing='0px',
                    switchPos=false,
                    notchSize=10,
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
        let popup = new PopupMenu({parent, fontSize, padding, zIndex, spacing, switchPos, notchSize,
                                notchPosition,
                                maxWidth, backgroundColor, normalColor,
                                notchPosition, autoClose})
        popup.showAt(commands, point)
        Popup.openPopup = popup
        Popup.closeEventListener = (e) => { if (this.eventOutside(e))
                                                        this.closePopup(e)}
        if (autoClose) {
            window.addEventListener('mousedown', Popup.closeEventListener, true)
            window.addEventListener('touchstart', Popup.closeEventListener, true)
            window.addEventListener('pointerdown', Popup.closeEventListener, true)
        }
    }

    static eventOutside(e) {
        return !Elements.hasClass(e.target, 'popupMenuItem')
    }

    /** Convenient static methods to close the PopupMenu implemented
     * as a class variable.
     */
    static closePopup(e) {
        if (Popup.openPopup) {
            Popup.openPopup.close()
            window.removeEventListener('mousedown', Popup.closeEventListener)
            window.removeEventListener('touchstart', Popup.closeEventListener)
            window.removeEventListener('pointerdown', Popup.closeEventListener)
        }
    }
}
