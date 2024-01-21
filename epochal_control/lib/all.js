(function () {
'use strict';

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

/** Basic Application object to be used as a singleton.
    Provides an interface for automatic testing and common device specific
    feature detection.
*/

class IApp extends Interface {
    /** Build the app by registering event handlers,
     *   adding DOM elements, instanciating templates, etc...
     */
    setup() { return this }

    /** Run the application by starting a main loop, ...
     */
    run() { return this }
}

class App extends Object {
    /** Override this method to build your app.
    */
    setup() {
        return this
    }

    /** Start and run the application. Override this method with everything
    that is needed to maintain your App, main loops, etc.
    */
    run() {
        return this
    }

    /** Defines all test suites. Overwrite this method to ensure that
    all testable aspects of your App are evaluated.
    */
    allTests() {
        console.log('Overwrite App.allTests()');
    }

    /** Run all tests. Should return 'ok' and the amount of time needed to
    run App.allTests() or a failure message with diagnostic error decription.
    @return {array} - array with 'ok' as first element and needed time as
                      second element or "Tests failed" and an error string
    */
    runTests() {
        var start = performance.now();
        try {
            this.allTests();
            var end = performance.now();
            return ['ok', end - start]
        }
        catch(e) {
            console.trace();
            return ['Tests failed', e.message]
        }
    }
}

IApp.implementedBy(App);

// Allows browsers to perform doctests.
// Uses the code highlight package from http://highlightjs.readthedocs.io
// if available

var docTestLogMessages = [];

Array.prototype.equals = function(array) {
    return this.length == array.length &&
         this.every( function(this_i,i) { return this_i == array[i] } )
};

class Doctest {

    static assert(value) {
        if (!value) {
            throw new Error('Assertion violated')
        }
    }

    static pprint(obj) {
        let stringified = obj.toString();
        if (stringified == '[object Object]')
            return JSON.stringify(obj)
        return stringified
    }

    static expect(expr, value) {
        if (this.pprint(expr) != this.pprint(value)) {
            //throw new Error("got `" + expr + "` but expected `" + value + "`.")
            throw new Error('got `' + this.pprint(expr) + '` but expected `' + this.pprint(value) + '`.')
        }
    }

    static expectError(error, message) {
        let index = error.toString().indexOf(message);
        if (index < 0) {
            throw new Error('got `' + message + '` but expected `' + error + '`.')
        }
    }

    static expectLog(...messages) {
       // if (!docTestLogMessages.equals(messages)) {
            docTestLogMessages.forEach((msg, i) => {
                if (msg != messages[i])
                    throw new Error('Unexpected log message: `' + messages[i] + '`.')
            });
        //    throw new Error('Uups')
        //}
    }

    static log(message) {
        docTestLogMessages.push(message);
    }

    static highlight(code) {
        if (typeof(hljs) == 'undefined')
            return code
        return hljs.highlight('javascript', code)
    }

    static stripLeadingLines(code) {
        let result = [];
        let informative = false;
        for(let line of code.split('\n')) {
            if (line.trim().length > 0) {
                informative = true;
            }
            if (informative)
                result.push(line);
        }
        return result.join('\n')
    }

    static event(type='mouse', {clientX = 0, clientY = 0} = {}) {
        if (type.startsWith('mouse')) {
            return new MouseEvent(type, { clientX, clientY })
        }
        return { type, clientX, clientY }
    }

    static run(replaceExpect=false) {
        if (typeof(hljs) != 'undefined') {
            hljs.initHighlighting();
        }
        let doctests = document.querySelectorAll('.doctest');
        for(let i=0; i<doctests.length; i++) {
            let doctest = doctests[i];
            let code = this.stripLeadingLines(doctest.innerHTML);
            let text = this.highlight(code);
            let pre = document.createElement('pre');
            // See http://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
            // let re = /Doctest\.expect\(([\s\S]*)[\,\s\S]*([\s\S]*)\)/g
            let lines = text.value.split('\n');
            let better = [];
            for(let line of lines) {
                if (replaceExpect && line.trim().startsWith('Doctest.expect(')) {
                    line = line.replace(/Doctest\.expect\(/, '>>> ').trim();
                    if (line.endsWith(')') || line.endsWith(',')) {
                        line = line.slice(0, -1);
                    }
                }
                better.push(line);
            }
            pre.innerHTML = better.join('\n'); // text.value.replace(re, ">>> $1\n$2")
            doctest.parentNode.replaceChild(pre, doctest);
        }
    }
}

// Needed to make Doctest visible in modules
//window.Doctest = Doctest

var recordedErrors = new Map();

class Errors {

    static countErrors() {
        let total = 0;
        for(let error of recordedErrors.keys()) {
            total += recordedErrors.get(error).size;
        }
        return total
    }

    static setStyle(element, styles) {
        for(let key in styles) {
            element.style[key] = styles[key];
        }
    }

    static appendError(error, source) {
        if (recordedErrors.has(error)) {
            let sources = recordedErrors.get(error);
            sources.add(source);
        }
        else {
            recordedErrors.set(error, new Set([source]));
        }
    }

    static showErrors() {
        if (this.countErrors() == 0) {
            return
        }
        let errors = document.getElementById('runtime-errors');
        if (errors == null) {
            errors = document.createElement('div');
            errors.setAttribute('id', 'runtime-errors');
            this.setStyle(document.body, {
                border: '2px solid red'
            });
            this.setStyle(errors, {position: 'absolute',
                top: '0px',
                padding: '8px',
                width: '100%',
                background: 'red',
                color: 'white'});
            document.body.appendChild(errors);
            let counter = document.createElement('div');
            counter.setAttribute('id', 'runtime-errors-counter');
            this.setStyle(counter, {borderRadius: '50%',
                width: '32px',
                height: '32px',
                background: 'white',
                color: 'red',
                fontSize: '18px',
                textAlign: 'center',
                lineHeight: '32px',
                verticalAlign: 'middle'});
            counter.innerHTML = '1';
            errors.appendChild(counter);

            let header = document.createElement('div');
            this.setStyle(header, {position: 'absolute',
                top: '6px',
                left: '48px',
                height: '44px',
                fontSize: '32px'});
            header.innerHTML = 'Runtime Errors';
            errors.appendChild(header);
            errors.addEventListener('click', this.toggleErrors.bind(this));
        }
        let counter = document.getElementById('runtime-errors-counter');
        counter.innerHTML = this.countErrors();
    }

    static expandErrors() {
        let errors = document.getElementById('runtime-errors');
        for(let error of recordedErrors.keys()) {
            for(var source of recordedErrors.get(error)) {
                if (typeof(source) == 'undefined') {
                    source = 'See console for details';
                    return
                }
                let info = document.createElement('div');
                info.className = 'info';
                info.style.wordWrap = 'break-word';
                info.innerHTML = error + `<br/><small>${source}</small>`;
                errors.appendChild(info);
            }
        }
    }

    static toggleErrors() {
        let errors = document.getElementById('runtime-errors');
        let infos = errors.querySelectorAll('.info');
        if (infos.length > 0) {
            infos.forEach((info) => errors.removeChild(info));
        }
        else {
            this.expandErrors();
        }
    }

    static removeError(event) {
        console.log('removeError', event);
        if (recordedErrors.has(event.error)) {
            let sources = recordedErrors.get(event.error);
            sources.delete(event.source);
            console.log('sources', sources);
        }
    }

    static registerGlobalErrorHandler() {
        // Register more informative error handler
        window.addEventListener('error', (event) => {
        //     if (typeof(event.error) == 'undefined') {
//                 console.info("Catched undefined error", event)
//             }
            this.appendError(event.error, event.filename);
        }, true);

        document.addEventListener('DOMContentLoaded', (event) => {
            this.showErrors();
        });
    }

    static registerFrameAwaitErrors() {
        let iframes = document.getElementsByTagName('iframe');
        for(let i=0; i<iframes.length; i++) {
            let target = iframes[i];
            target.iframeTimeout = setTimeout(
                () => {
                    this.appendError('Cannot load iframe', target.src);},
                frameErrorTimeout);
            target.onload = () => {
                clearTimeout(target.iframeTimeout);
            };
        }
    }
}

Errors.registerGlobalErrorHandler();

class Events {

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
        if (Events.debug) {
            Events.extracted.push(this.toLine(event));
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
        if (Events.debug) {
            Events.simulated.push(this.toLine(clone));
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

Events.popup = null;

Events.debug = true;
Events.extracted = [];
Events.simulated = [];

class EventRecorder {

    constructor() {
        this.recording = [];
        this.recorded = [];
        this.step = 0;
    }

    record(event) {
        let length = this.recording.length;
        if (length == 0) {
            this.startTime = event.timeStamp;
            Events.reset();
        }
        else {
        	let last = this.recording[length - 1];
        	if (event.timeStamp < last.time) {
        		console.log('warning: wrong temporal order');
        	}
        }
        let t = event.timeStamp - this.startTime;
        this.recording.push(Events.extractEvent(t, event));
    }

    stopRecording() {
        this.recorded = this.recording;
        this.recording = [];
        console.log('Recorded ' + this.recorded.length + ' events');
    }

    startReplay(whileCondition=null, onComplete=null) {
        this.step = 0;
        Events.resetSimulated();
        this.replay(whileCondition, onComplete);
    }

    replay(whileCondition=null, onComplete=null) {
        if (this.step < this.recorded.length) {
            var {type, time, constructor, data} = this.recorded[this.step];
            Events.simulateEvent(type, constructor, data);
            this.step += 1;
            let dt = 0;
            if (this.step < this.recorded.length) {
                var next = this.recorded[this.step];
                dt = next.time - time;
                if (dt < 0) {
                	console.log('warning: wrong temporal order');
                }
            }
            if (whileCondition == null || whileCondition()) {
                setTimeout(() => this.replay(whileCondition, onComplete), Math.round(dt));
            }
        }
        else {
        	console.log('Played ' + this.step + ' events' + onComplete);
        	if (onComplete != null) {
        	    onComplete();
        	}
           // Events.compareExtractedWithSimulated()
        }
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
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this,
            args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}

/** Returns an id that is guaranteed to be unique within the livetime of the
 * application
 * @return {string}
 */
let _idGenerator = 0;
function getId$1() {
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
class Points$1 {
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
            result.push(Points$1.add(p, this.center));
        }
        return result
    }

    flatAbsolutePoints() {
        let result = new Array();
        for (let p of this.points) {
            let a = Points$1.add(p, this.center);
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
        let center = Points$1.multiplyScalar(this.center, scale);
        let clone = new Polygon(center);
        for (let p of this.points) {
            clone.addPoint(Points$1.multiplyScalar(p, scale));
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
        let center = Points$1.mean(min, max);
        let polygon = new Polygon(center);
        for (let p of points) {
            polygon.addAbsolutePoint(p);
        }
        return polygon
    }
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
            return Points$1.distance(b[0], b[1]) - Points$1.distance(a[0], a[1])
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
        return Points$1.subtract(current, previous)
    }

    move() {
        let current = this.current.mean();
        let previous = this.previous.mean();
        return Points$1.subtract(current, previous)
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

            let cm = Points$1.mean(c1, c2);
            let pm = Points$1.mean(p1, p2);

            let delta = Points$1.subtract(cm, pm);
            let zoom = 1.0;
            let distance1 = Points$1.distance(p1, p2);
            let distance2 = Points$1.distance(c1, c2);
            if (distance1 != 0 && distance2 != 0) {
                zoom = distance2 / distance1;
            }
            let angle1 = Points$1.angle(c2, c1);
            let angle2 = Points$1.angle(p2, p1);
            let alpha = Angle.diff(angle1, angle2);
            return new InteractionDelta(delta.x, delta.y, zoom, alpha, cm)
        } else if (current.length == 1) {
            let delta = Points$1.subtract(current[0], previous[0]);
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
            Points$1.distance(ended, start) < this.tapDistance
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
            Points$1.distance(ended, start) < this.tapDistance
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
                        (e.pointerType == 'mouse' && Events.isMouseDown(e))
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

                    if (Events.isMouseDown(e))
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
            sum = Points$1.add(sum, nv);
            count += 1;
            if (t > milliseconds) {
                break
            }
        }
        if (count === 0) return sum // empty vector
        return Points$1.multiplyScalar(sum, 1 / count)
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
            let prevLength = Points$1.length(this.velocity);
            let nextLength = Points$1.length(next);
            if (nextLength > prevLength) {
                let factor = nextLength / prevLength;
                next = Points$1.multiplyScalar(next, 1 / factor);
                console.log('Prevent acceleration', factor, this.velocity, next);
            }
            this.velocity = next;
            let d = Points$1.multiplyScalar(this.velocity, dt);
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
        return Points$1.length(this.velocity) > 0.01
    }

    nextVelocity(velocity) {
        // Must be overwritten: computes the changed velocity. Implement
        // damping, collison detection, etc. here
        return Points$1.multiplyScalar(velocity, this.throwDamping)
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
        let delta = Points$1.subtract(target, center);
        return Points$1.normalize(delta)
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
            return Points$1.multiplyScalar({x: dx, y: dy}, factor)
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
        let delta = Points$1.subtract(p, c);
        this.move(delta, {animate: animate});
    }

    centerAt(p, {animate = 0} = {}) {
        let c = this.center;
        let delta = Points$1.subtract(p, c);
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
        let beta = Points$1.angle(origin, anchor);
        let distance = Points$1.distance(origin, anchor);
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

        let newOrigin = Points$1.arc(anchor, beta + rotate, distance * zoom);
        let extra = Points$1.subtract(newOrigin, origin);
        let offset = Points$1.subtract(anchor, origin);
        this._move(offset);
        this.scale = newScale;
        this.rotation += rotate;
        offset = Points$1.negate(offset);
        offset = Points$1.add(offset, extra);
        offset = Points$1.add(offset, translate);
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
class DOMScatterContainer {
    /**
     * @constructor
     * @param {DOM node} element - DOM element that receives events
     * @param {Bool} stopEvents -  Whether events should be stopped or propagated
     * @param {Bool} claimEvents - Whether events should be marked as claimed
     *                             if findTarget return as non-null value.
     * @param {Bool} touchAction - CSS to set touch action style, needed to prevent
     *                              pointer cancel events. Use null if the
     *                              the touch action should not be set.
     */
    constructor(
        element,
        {stopEvents = 'auto', claimEvents = true, touchAction = 'none'} = {}
    ) {
        this.element = element;
        if (stopEvents === 'auto') {
            if (Capabilities.isSafari) {
                document.addEventListener(
                    'touchmove',
                    event => this.preventPinch(event),
                    false
                );
                stopEvents = false;
            } else {
                stopEvents = true;
            }
        }
        this.stopEvents = stopEvents;
        this.claimEvents = claimEvents;
        if (touchAction !== null) {
            Elements$1.setStyle(element, {touchAction});
        }
        this.scatter = new Map();
        this.delegate = new InteractionMapper$1(element, this, {
            mouseWheelElement: window
        });

        if (typeof debugCanvas !== 'undefined') {
            requestAnimationFrame(dt => {
                this.showTouches(dt);
            });
        }
    }

    showTouches(dt) {
        let resolution = window.devicePixelRatio;
        let canvas = debugCanvas;
        let current = this.delegate.interaction.current;
        let context = canvas.getContext('2d');
        let radius = 20 * resolution;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        for (let [key, point] of current.entries()) {
            let local = point;
            context.beginPath();
            context.arc(
                local.x * resolution,
                local.y * resolution,
                radius,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
            context.stroke();
        }
        requestAnimationFrame(dt => {
            this.showTouches(dt);
        });
    }

    preventPinch(event) {
        event = event.originalEvent || event;
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }

    add(scatter) {
        this.scatter.set(scatter.element, scatter);
    }

    capture(event) {
        if (event.target == this.element && this.stopEvents) Events.stop(event);
        return true
    }

    mapPositionToPoint(point) {
        return Points$1.fromPageToNode(this.element, point)
    }

    isDescendant(parent, child, clickable = false) {
        if (parent == child) return true
        let node = child.parentNode;
        while (node != null) {
            if (!clickable && node.onclick) {
                return false
            }
            if (node == parent) {
                return true
            }
            node = node.parentNode;
        }
        return false
    }

    findTarget(event, local, global) {
        /*** Note that elementFromPoint works with clientX, clientY, not pageX, pageY
        The important point is that event should not be used, since the TouchEvent
        points are hidden in sub objects.
        ***/
        let found = document.elementFromPoint(global.x, global.y);
        for (let target of this.scatter.values()) {
            if (this.isDescendant(target.element, found)) {
                if (this.stopEvents) Events.stop(event);
                if (this.claimEvents) event.claimedByScatter = target;
                return target
            }
        }
        return null
    }

    get center() {
        let r = this.bounds;
        let w2 = r.width / 2;
        let h2 = r.height / 2;
        return {x: w2, y: h2}
    }

    get bounds() {
        return this.element.getBoundingClientRect()
    }

    get polygon() {
        let r = this.bounds;
        let w2 = r.width / 2;
        let h2 = r.height / 2;
        let center = {x: w2, y: h2};
        let polygon = new Polygon(center);
        polygon.addPoint({x: -w2, y: -h2});
        polygon.addPoint({x: w2, y: -h2});
        polygon.addPoint({x: w2, y: h2});
        polygon.addPoint({x: -w2, y: h2});
        return polygon
    }
}

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
        return Points$1.fromPageToNode(this.container.element, p)
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
            let p = Points$1.fromPageToNode(this.element, point);
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
        return Points$1.fromPageToNode(this.element, {x, y})
    }

    fromNodeToPage(x, y) {
        return Points$1.fromNodeToPage(this.element, {x, y})
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

class PDFLoader extends CardLoader {
    constructor(src, {width = 1640, height = 800, scale = 1} = {}) {
        super(src, {width, height, scale});
        if (typeof PDFJS == 'undefined') {
            alert('PDF.js needed');
        }
    }

    load(domNode) {
        return new Promise((resolve, reject) => {
            PDFJS.getDocument(this.src).then(pdf => {
                pdf.getPage(1).then(page => {
                    let scale = this.scale * app.renderer.resolution;
                    let invScale = 1 / scale;
                    let viewport = page.getViewport(scale);

                    // Prepare canvas using PDF page dimensions.
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context.
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                    domNode.appendChild(canvas);
                    this.wantedWidth = canvas.width;
                    this.wantedHeight = canvas.height;
                    this.scale = invScale;
                    this.addedNode = canvas;
                    resolve(this);
                });
            });
        })
    }
}

class ImageLoader extends CardLoader {
    load(domNode) {
        return new Promise((resolve, reject) => {
            let isImage = domNode instanceof HTMLImageElement;
            let image = isImage ? domNode : document.createElement('img');
            image.onload = e => {
                if (!isImage) {
                    domNode.appendChild(image);
                    this.addedNode = image;
                }
                this.wantedWidth = image.naturalWidth;
                this.wantedHeight = image.naturalHeight;

                let scaleW = this.maxWidth / image.naturalWidth;
                let scaleH = this.maxHeight / image.naturalHeight;
                this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH));
                image.setAttribute('draggable', false);
                image.width = image.naturalWidth;
                image.height = image.naturalHeight;
                resolve(this);
            };
            image.onerror = e => {
                reject(this);
            };
            image.src = this.src;
        })
    }
}

class FrameLoader extends CardLoader {
    load(domNode) {
        return new Promise((resolve, reject) => {
            let iframe = document.createElement('iframe');
            iframe.frameBorder = 0;
            iframe.style.scrolling = false;
            iframe.width = this.wantedWidth;
            iframe.height = this.wantedHeight;
            domNode.appendChild(iframe);
            this.addedNode = iframe;
            iframe.onload = e => {
                resolve(this);
            };
            iframe.onerror = e => {
                reject(this);
            };
            iframe.src = this.src;
        })
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
        this.id = getId$1();
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

class Index {

    constructor(template, pages, notfound="thumbnails/notfound.png") {
        this.template = template;
        this.pages = pages;
        this.notfound = notfound;
    }

    setup() {
        for(let pair of this.pages) {
            let [title, src] = pair;
            let id = getId();
            pair.push(id);
            let t = this.template;
            let wrapper = t.content.querySelector('.wrapper');
            wrapper.id = id;
            let clone = document.importNode(t.content, true);
            container.appendChild(clone);
            wrapper = container.querySelector('#'+id);

            let icon = wrapper.querySelector('.icon');

            icon.onerror = (e) => {
                if (this.notfound)
                    icon.src = this.notfound;
            };
            let iconSrc = src.replace('.html', '.png');
            console.log("iconSrc", iconSrc);
            if (iconSrc.endsWith('index.png')) {
                icon.src = iconSrc.replace('index.png', 'thumbnail.png');
            }
            else {
                icon.src = "thumbnails/" + iconSrc;
            }
            wrapper.href = src;
            let titleDiv = wrapper.querySelector('.title');
            titleDiv.innerText = title;
        }
    }

    frames() {
        if (this.pages.length == 0)
            return
        let [title, src, id] = this.pages.shift();
        let iframe = document.createElement('iframe');
        iframe.frameborder = 0;
        let wrapper = document.getElementById(id);
        let icon = wrapper.querySelector('.icon');

        icon.parentNode.replaceChild(iframe, icon);
        iframe.onload = (e) => {
            this.frames();
        };
        iframe.src = src + window.location.search;
    }

    load() {
        this.setup();
        if (window.location.search.startsWith('?test'))
            this.frames();
    }

    loadAndTest() {
        this.setup();
        if (!Capabilities.isMobile)
            this.frames();
    }
}

/** A Popup that shows text labels, images, or html
 */
class Popup {
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
        this.padding = padding;
        this.notchPosition = notchPosition;
        this.notchSize = notchSize;
        this.switchPos = switchPos;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.maxWidth = maxWidth;
        this.normalColor = normalColor;
        this.backgroundColor = backgroundColor;
        this.autoClose = autoClose;
        this.parent = parent || document.body;
        if (content) {
            this.show(content);
        }
    }

    /** Setup menu with a dictionary of content types and contents.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
    *                            and corresponding values.
     * @return {Popup} this
     */
    setup(content) {
        this.content = content;
        this.items = {};
        this.element = document.createElement('div');
        Elements$1.addClass(this.element, 'unselectable');
        this.notch = document.createElement('div');
        Elements$1.setStyle(this.notch, this.notchStyle());
        for(let key in content) {
            switch(key) {
                case 'text':
                    let text = document.createElement('span');
                    this.element.appendChild(text);
                    text.innerHTML = content[key];
                    Elements$1.setStyle(text, {color: this.normalColor});
                    Elements$1.addClass(text, 'unselectable');
                    Elements$1.addClass(text, 'PopupContent');
                    break
                case 'img':
                    alert("img to be implemented");
                    break
                case 'html':
                    let div = document.createElement('div');
                    this.element.appendChild(div);
                    div.innerHTML = content[key];
                    Elements$1.addClass(div, 'PopupContent');
                    break
                default:
                    alert("Unexpected content type: " + key);
                    break
            }
        }
        this.element.appendChild(this.notch);
        this.parent.appendChild(this.element);
        Elements$1.setStyle(this.element, this.defaultStyle());
        console.log("Popup.setup", this.defaultStyle());
        this.layout();
        return this
    }

    /** Layout the menu items
     */
    layout() {

    }

    /** Close and remove the Popup from the DOM tree.
    */
    close() {
        this.parent.removeChild(this.element);
        if (Popup.openPopup == this) {
            Popup.openPopup = null;
        }
    }

    /** Shows the Popup with the given commands at the specified point.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
     *                            and corresponding values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @return {Popup} this
    */
    showAt(content, point) {
        this.show(content);
        this.placeAt(point);
        return this
    }

    placeAt(point) {
        let x = point.x;
        let y = point.y;
        let rect = this.element.getBoundingClientRect();
        let h = rect.bottom-rect.top;
        /* TODO: Implement different notchPositions */
        switch(this.notchPosition) {
            case "bottomLeft":
                x -= this.padding;
                x -= this.notchSize;
                y -= (this.notchSize+h);
                Elements$1.setStyle(this.element,
                     { left: x + 'px', top: y + 'px'} );
                break

            case "topLeft":
                x -= this.padding;
                x -= this.notchSize;
                y += this.notchSize;
                Elements$1.setStyle(this.element,
                    { left: x + 'px', top: y + 'px'} );
                break
            default:
                Elements$1.setStyle(this.element,
                    { left: x + 'px', top: y + 'px'} );
                break
        }
    }

    /** Shows the Popup with the given commands at the current position.
     * @param {Object} content - A dict object with type strings (text, img, html) as keys
     *                            and corresponding values.
     * @return {Popup} this
     */
    show(content) {
        this.setup(content);
        return this
    }

    /** Configuration object. Return default styles as CSS values.
    */
    defaultStyle() {
        let padding = this.padding;
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
            this.closePopup();
            return
        }
        if (parent !== null) {
            point = convertPointFromPageToNode(parent, point.x, point.y);
        }
        let notchPosition = 'bottomLeft';
        if (point.y < 50) {
            if(switchPos)notchPosition = 'topLeft';
        }
        let popup = new Popup({parent, fontSize, padding, notchSize, switchPos,
                                maxWidth, backgroundColor, normalColor,
                                notchPosition, autoClose});
        popup.showAt(content, point);
        Popup.openPopup = popup;
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
        return !Elements$1.hasClass(e.target, 'PopupContent')
    }

    /** Convenient static methods to close the Popup implemented
     * as a class variable.
     */
    static closePopup(e) {
        if (Popup.openPopup) {
            Popup.openPopup.close();
        }
    }
}

/* Class variable */
Popup.openPopup = null;

/** A Popup Menu that shows text labels in a vertical row.
 */
class PopupMenu$1 extends Popup {
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
        super({parent, fontSize, fontFamily, padding, notchSize, notchPosition, backgroundColor, normalColor, autoClose});
        this.commands = commands;
        this.zIndex = zIndex;
        this.switchPos = switchPos;
        this.spacing = spacing;
        this.highlightColor = highlightColor;

    }

    /** Setup menu with a dictionary of command labels and command functions.
     * @param {Object} commands - A dict object with command label strings as keys
     *                            and command functions as values.
     * @return {PopupMenu} this
     */
    setup(commands) {

        this.commands = commands;
        this.items = {};
        this.element = document.createElement('div');
        this.element.style.zIndex = this.zIndex;
        Elements$1.addClass(this.element, 'unselectable');
        this.notch = document.createElement('div');
        Elements$1.setStyle(this.notch, this.notchStyle());
        for(let key in commands) {
            let item = document.createElement('div');
            this.element.appendChild(item);
            item.innerHTML = key;
            item.style.paddingBottom = item.style.paddingTop = this.spacing;
            Elements$1.setStyle(item, {color: this.normalColor});
            Elements$1.addClass(item, 'unselectable');
            Elements$1.addClass(item, 'popupMenuItem');
            this.items[key] = item;
            item.onclick = (event) => { this.perform(key); };
            item.ontap = (event) => { this.perform(key); };
            item.onmouseover = (event) => { this.over(event, key); };
            item.onmouseout = (event) => { this.out(event, key); };
        }
        this.element.appendChild(this.notch);
        this.parent.appendChild(this.element);
        Elements$1.setStyle(this.element, this.defaultStyle());
        this.layout();
        return this
    }

    /** Execute a menu command.
     * @param {string} key - The selected key.
     */
    perform(key) {
        let func = this.commands[key];
        if (this.autoClose) {
            this.close();
            console.log('close');
        }
        setTimeout(() => {
            func.call();
            }, 20);
    }

    /** Update the menu item denoted by key.
     * @param {string} key - The selected key.
     * @param {boolean} highlight - Show the item highlighted.
     */
    update(key, highlight=false) {
        let text = this.items[key];
        text.style.color = (highlight) ? this.highlightColor : this.normalColor;
    }

    /** Mouse over handöer.
     * @param {Event} event - The mouse event.
     * @param {boolean} key - The selected key.
     */
    over(event, key) {
        for(let k in this.items) {
            this.update(k, k == key);
        }
    }

    /** Mouse out handöer.
     * @param {Event} event - The mouse event.
     * @param {boolean} key - The selected key.
     */
    out(event, key) {
        this.update(key);
    }

    /** Shows the PopupMenu with the given commands at the specified point.
     * @param {Object} commands - A dict object with command label strings as keys
     *                            and command functions as values.
     * @param {Point} point - The position as x, y coordinates {px}.
     * @return {PopupMenu} this
    */
    showAt(commands, point) {
        this.show(commands);
        this.placeAt(point);
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
            this.closePopup();
            return
        }
        if (parent !== null) {
            point = convertPointFromPageToNode(parent, point.x, point.y);
        }
        let notchPosition = 'bottomLeft';
        if (point.y < 50) {
            if(switchPos)notchPosition = 'topLeft';
        }
        let popup = new PopupMenu$1({parent, fontSize, padding, zIndex, spacing, switchPos, notchSize,
                                notchPosition,
                                maxWidth, backgroundColor, normalColor,
                                notchPosition, autoClose});
        popup.showAt(commands, point);
        Popup.openPopup = popup;
        Popup.closeEventListener = (e) => { if (this.eventOutside(e))
                                                        this.closePopup(e);};
        if (autoClose) {
            window.addEventListener('mousedown', Popup.closeEventListener, true);
            window.addEventListener('touchstart', Popup.closeEventListener, true);
            window.addEventListener('pointerdown', Popup.closeEventListener, true);
        }
    }

    static eventOutside(e) {
        return !Elements$1.hasClass(e.target, 'popupMenuItem')
    }

    /** Convenient static methods to close the PopupMenu implemented
     * as a class variable.
     */
    static closePopup(e) {
        if (Popup.openPopup) {
            Popup.openPopup.close();
            window.removeEventListener('mousedown', Popup.closeEventListener);
            window.removeEventListener('touchstart', Popup.closeEventListener);
            window.removeEventListener('pointerdown', Popup.closeEventListener);
        }
    }
}

class FrameContainer {

    constructor(element) {
        this.element = element;
        this.delegate = new InteractionMapper(element, this,
                                        { mouseWheelElement: window});
    }

    capture(event) {
        return true
    }

    findTarget(event, local, global) {
        let found = document.elementFromPoint(global.x, global.y);
        let iframe = found.querySelector('iframe');
        if (iframe) {
            let p = Points.fromPageToNode(found, global);
            let doc = iframe.contentWindow.document;
            let target = doc.elementFromPoint(p.x, p.y);
            if (target != null) {
                console.log('iframe element', target);
                return new FrameTarget(iframe, target)
            }
        }
        return null
    }
}

class FrameTarget {

    constructor(frame, target) {
        this.frame = frame;
        this.target = target;
    }

    capture(event) {
        return true
    }

    simulateMouseEvent(type, point) {
        let p = Points.fromPageToNode(this.frame, point);
        let event = new MouseEvent(type, {
            view: this.frame.contentWindow,
            bubbles: true,
            cancelable: true,
            clientX: p.x,
            clientY: p.y});
        this.target.dispatchEvent(event);
    }

    createTouchList(pointMap) {
        let touches = [];
        let doc = this.frame.contentWindow.document;
        for(let key of pointMap.keys()) {
            let point = pointMap.get(key);
            let p = Points.fromPageToNode(this.frame, point);
            let touchTarget = doc.elementFromPoint(p.x, p.y);
            let touch = new Touch(undefined, touchTarget, key,
                                    p.x, p.y, p.x, p.y);
            touches.push(touch);
        }
        return new TouchList(...touches)
    }

    simulateTouchEvent(type, point, pointMap, touchEventKey='targetTouches') {
        let p = Points.fromPageToNode(this.frame, point);
        let data = { view: this.frame.contentWindow,
            bubbles: true,
            cancelable: true,
            clientX: p.x,
            clientY: p.y};
        data[touchEventKey] = this.createTouchList(pointMap);
        let event = new TouchEvent(type, data);
        this.target.dispatchEvent(event);
    }

    onStart(event, interaction) {
        console.log('onStart', this.frame.parentNode);
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mousedown', point);
            }
            else {
                this.simulateTouchEvent('touchstart', point,
                    interaction.current);
                return
            }
        }
    }

    onMove(event, interaction) {
        console.log('onMove');
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mousemove', point);
            }
            else {
                this.simulateTouchEvent('touchmove', point,
                    interaction.current);
                return
            }
        }
    }

    onEnd(event, interaction) {
        console.log('onEnd');
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mouseend', point);
            }
            else {
                this.simulateTouchEvent('touchend', point,
                    interaction.ended, 'changedTouches');
                return
            }
        }
    }
}

class Inspect {
    // Code inspection functions

    static allScriptSources()
    {
        let sources = [];
        let scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            console.dir(scripts[i]);
            sources.push(scripts[i]);
        }
        return sources
    }
}

/* Needed to ensure that rollup.js includes class definitions and the classes
are visible inside doctests.
*/

window.AbstractScatter = AbstractScatter;
window.Angle = Angle;
window.App = App;
window.BaseEvent = BaseEvent;
window.Capabilities = Capabilities;
window.CapabilitiesTests = CapabilitiesTests;
window.Colors = Colors;
window.Cycle = Cycle;

window.DOMFlip = DOMFlip;
window.DOMFlippable = DOMFlippable;
window.CardLoader = CardLoader;
window.PDFLoader = PDFLoader;
window.ImageLoader = ImageLoader;
window.FrameLoader = FrameLoader;

window.DOMScatter = DOMScatter;
window.DOMScatterContainer = DOMScatterContainer;
window.Dates = Dates;
window.Doctest = Doctest;
window.Elements = Elements$1;
window.Errors = Errors;
window.EventRecorder = EventRecorder;
window.Events = Events;
window.FrameContainer = FrameContainer;
window.FrameTarget = FrameTarget;
window.IApp = IApp;
window.IInteractionMapperTarget = IInteractionMapperTarget;
window.IInteractionTarget = IInteractionTarget;
window.Index = Index;
window.Inspect = Inspect;
window.Interaction = Interaction;
window.InteractionDelegate = InteractionDelegate;
window.InteractionDelta = InteractionDelta;
window.InteractionMapper = InteractionMapper$1;
window.InteractionPoints = InteractionPoints;
window.Interface = Interface;
window.PointMap = PointMap;
window.Points = Points$1;
window.Polygon = Polygon;
window.Popup = Popup;
window.PopupMenu = PopupMenu$1;
window.ResizeEvent = ResizeEvent;
window.ScatterEvent = ScatterEvent;
window.getId = getId$1;
window.isEmpty = isEmpty;
window.lerp = lerp;
window.debounce = debounce;

}());
//# sourceMappingURL=all.js.map
