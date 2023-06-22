/** Report capabilities with guaranteed values.
 */
export class Capabilities {

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
export class CapabilitiesTests {

    static testConfirm() {
        let bool = confirm('Please confirm')
        document.getElementById('demo').innerHTML = (bool) ? 'Confirmed' : 'Not confirmed'
    }

    static testPrompt() {
        let person = prompt('Please enter your name', 'Harry Potter')
        if (person != null) {
            demo.innerHTML =
            'Hello ' + person + '! How are you today?'
        }
    }

    static testUserAgent() {
        let agent = 'User-agent: ' + Capabilities.userAgent
        user_agent.innerHTML = agent
    }

    static testDevicePixelRatio() {
        let value = 'Device Pixel Ratio: ' + Capabilities.devicePixelRatio
        device_pixel_ratio.innerHTML = value
    }

    static testMultiTouchTable() {
        let value = 'Is the device a multi-touch table? ' + Capabilities.isMultiTouchTable
        multi_touch_table.innerHTML = value
    }

    static testSupportedEvents() {
        let events = []
        if (Capabilities.supportsMouseEvents()) {
            events.push('MouseEvents')
        }
        if (Capabilities.supportsTouchEvents()) {
            events.push('TouchEvents')
        }
        if (Capabilities.supportsPointerEvents()) {
            events.push('PointerEvents')
        }
        supported_events.innerHTML = 'Supported Events: ' + events.join(', ')
    }

    static testAll() {
        this.testUserAgent()
        this.testDevicePixelRatio()
        this.testMultiTouchTable()
        this.testSupportedEvents()
    }
}

/* Optional global variables, needed in DocTests. */
window.Capabilities = Capabilities
window.CapabilitiesTests = CapabilitiesTests
