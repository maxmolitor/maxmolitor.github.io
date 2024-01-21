import Interface from './interface.js'
import {Points, Angle, MapProxy} from './utils.js'
import Events from './events.js'

/** Interaction patterns

    See interaction.html for explanation
*/

export class IInteractionTarget extends Interface {
    capture(event) {
        return typeof true
    }

    onStart(event, interaction) {}
    onMove(event, interaction) {}
    onEnd(event, interaction) {}

    onMouseWheel(event) {}
}

export class IInteractionMapperTarget extends Interface {
    capture(event) {
        return typeof true
    }

    findTarget(event, local, global) {
        return IInteractionTarget
    }
}

export class PointMap extends MapProxy {
    // Collects touch points, mouse coordinates, etc. as key value pairs.
    // Keys are pointer and touch ids, the special "mouse" key.
    // Values are points, i.e. all objects with numeric x and y properties.
    constructor(points = {}) {
        super()
        for (let key in points) {
            this.set(key, points[key])
        }
    }

    toString() {
        let points = []
        for (let key of this.keys()) {
            let value = this.get(key)
            points.push(`${key}:{x:${value.x}, y:${value.y}}`)
        }
        let attrs = points.join(', ')
        return `[PointMap ${attrs}]`
    }

    clone() {
        let result = new PointMap()
        for (let key of this.keys()) {
            let value = this.get(key)
            result.set(key, {x: value.x, y: value.y})
        }
        return result
    }

    farthests() {
        if (this.size == 0) {
            return null
        }
        let pairs = []
        for (let p of this.values()) {
            for (let q of this.values()) {
                pairs.push([p, q])
            }
        }
        let sorted = pairs.sort((a, b) => {
            return Points.distance(b[0], b[1]) - Points.distance(a[0], a[1])
        })
        return sorted[0]
    }

    mean() {
        if (this.size == 0) {
            return null
        }
        let x = 0.0,
            y = 0.0
        for (let p of this.values()) {
            x += p.x
            y += p.y
        }
        return {x: x / this.size, y: y / this.size}
    }
}

export class InteractionDelta {
    constructor(x, y, zoom, rotate, about) {
        this.x = x
        this.y = y
        this.zoom = zoom
        this.rotate = rotate
        this.about = about
    }

    toString() {
        let values = []
        for (let key of Object.keys(this)) {
            let value = this[key]
            if (key == 'about') {
                values.push(`${key}:{x:${value.x}, y:${value.y}}`)
            } else {
                values.push(`${key}:${value}`)
            }
        }
        let attrs = values.join(', ')
        return `[InteractionDelta ${attrs}]`
    }
}

export class InteractionPoints {
    constructor(parent = null) {
        this.parent = parent
        this.current = new PointMap()
        this.previous = new PointMap()
        this.start = new PointMap()
        this.ended = new PointMap()
        this.timestamps = new Map()
    }

    moved(key) {
        let current = this.current.get(key)
        let previous = this.previous.get(key)
        return Points.subtract(current, previous)
    }

    move() {
        let current = this.current.mean()
        let previous = this.previous.mean()
        return Points.subtract(current, previous)
    }

    delta() {
        var current = []
        var previous = []
        for (let key of this.current.keys()) {
            let c = this.current.get(key)
            if (this.previous.has(key)) {
                let p = this.previous.get(key)
                current.push(c)
                previous.push(p)
            }
        }
        if (current.length >= 2) {
            if (current.length > 2) {
                current = this.current.farthests()
                previous = this.previous.farthests()
            }
            let c1 = current[0]
            let c2 = current[1]

            let p1 = previous[0]
            let p2 = previous[1]

            let cm = Points.mean(c1, c2)
            let pm = Points.mean(p1, p2)

            let delta = Points.subtract(cm, pm)
            let zoom = 1.0
            let distance1 = Points.distance(p1, p2)
            let distance2 = Points.distance(c1, c2)
            if (distance1 != 0 && distance2 != 0) {
                zoom = distance2 / distance1
            }
            let angle1 = Points.angle(c2, c1)
            let angle2 = Points.angle(p2, p1)
            let alpha = Angle.diff(angle1, angle2)
            return new InteractionDelta(delta.x, delta.y, zoom, alpha, cm)
        } else if (current.length == 1) {
            let delta = Points.subtract(current[0], previous[0])
            return new InteractionDelta(delta.x, delta.y, 1.0, 0.0, current[0])
        }
        return null
    }

    update(key, point) {
        // Returns true iff the key is new
        this.current.set(key, point)
        if (!this.start.has(key)) {
            this.start.set(key, point)
            this.previous.set(key, point)
            this.timestamps.set(key, performance.now())
            return true
        }
        return false
    }

    updatePrevious() {
        for (let key of this.current.keys()) {
            this.previous.set(key, this.current.get(key))
        }
    }

    stop(key, point) {
        if (this.current.has(key)) {
            this.current.delete(key)
            this.previous.delete(key)
            this.ended.set(key, point)
        }
    }

    finish(key, point) {
        this.current.delete(key)
        this.previous.delete(key)
        this.start.delete(key)
        this.timestamps.delete(key)
        this.ended.delete(key)
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

export class Interaction extends InteractionPoints {
    constructor(tapDistance = 10, longPressTime = 500.0) {
        super()
        this.tapDistance = tapDistance
        this.longPressTime = longPressTime
        this.targets = new Map()
        this.subInteractions = new Map() // target:Object : InteractionPoints
    }

    stop(key, point) {
        super.stop(key, point)
        for (let points of this.subInteractions.values()) {
            points.stop(key, point)
        }
    }

    addTarget(key, target) {
        this.targets.set(key, target)
        this.subInteractions.set(target, new InteractionPoints(this))
    }

    removeTarget(key) {
        let target = this.targets.get(key)
        this.targets.delete(key)
        // Only remove target if no keys are refering to the target
        let remove = true
        for (let t of this.targets.values()) {
            if (target === t) {
                remove = false
            }
        }
        if (remove) {
            this.subInteractions.delete(target)
        }
    }

    finish(key, point) {
        super.finish(key, point)
        this.removeTarget(key)
    }

    mapInteraction(points, aspects, mappingFunc) {
        // Map centrally registered points to target interactions
        // Returns an array of [target, updated subInteraction] pairs
        let result = new Map()
        for (let key in points) {
            if (this.targets.has(key)) {
                let target = this.targets.get(key)
                if (this.subInteractions.has(target)) {
                    let interaction = this.subInteractions.get(target)
                    for (let aspect of aspects) {
                        let pointMap = this[aspect]
                        let point = pointMap.get(key)
                        let mapped = mappingFunc(point)
                        interaction[aspect].set(key, mapped)
                    }
                    result.set(target, interaction)
                }
            }
        }
        return result
    }

    isTap(key) {
        let ended = this.ended.get(key)
        let start = this.start.get(key)
        if (
            start &&
            ended &&
            Points.distance(ended, start) < this.tapDistance
        ) {
            let t1 = this.timestamps.get(key)
            let tookLong = performance.now() > t1 + this.longPressTime
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
        let ended = this.ended.get(key)
        let start = this.start.get(key)
        if (
            start &&
            ended &&
            Points.distance(ended, start) < this.tapDistance
        ) {
            let t1 = this.timestamps.get(key)
            let tookLong = performance.now() > t1 + this.longPressTime
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

export class InteractionDelegate {
    // Long press: http://stackoverflow.com/questions/1930895/how-long-is-the-event-onlongpress-in-the-android
    // Stylus support: https://w3c.github.io/touch-events/

    constructor(
        element,
        target,
        {mouseWheelElement = null, debug = false} = {}
    ) {
        this.debug = debug
        this.interaction = new Interaction()
        this.element = element
        this.mouseWheelElement = mouseWheelElement || element
        this.target = target
        this.setupInteraction()
    }

    setupInteraction() {
        if (this.debug) {
            let error = this.targetInterface.implementationError(
                this.target.constructor
            )
            if (error != null) {
                throw new Error('Expected IInteractionTarget: ' + error)
            }
        }
        this.setupTouchInteraction()
        this.setupMouseWheelInteraction()
    }

    get targetInterface() {
        return IInteractionTarget
    }

    setupTouchInteraction() {
        let element = this.element
        let useCapture = true
        if (window.PointerEvent) {
            if (this.debug) console.log('Pointer API' + window.PointerEvent)
            element.addEventListener(
                'pointerdown',
                e => {
                    if (this.debug) console.log('pointerdown', e.pointerId)
                    if (this.capture(e)) {
                        element.setPointerCapture(e.pointerId)
                        this.onStart(e)
                    }
                },
                useCapture
            )
            element.addEventListener(
                'pointermove',
                e => {
                    if (this.debug) console.log('pointermove', e.pointerId)
                    if (
                        e.pointerType == 'touch' ||
                        (e.pointerType == 'mouse' && Events.isMouseDown(e))
                    ) {
                        // this.capture(e) &&
                        if (this.debug)
                            console.log('pointermove captured', e.pointerId)
                        this.onMove(e)
                    }
                },
                useCapture
            )
            element.addEventListener(
                'pointerup',
                e => {
                    if (this.debug) console.log('pointerup')
                    this.onEnd(e)
                    element.releasePointerCapture(e.pointerId)
                },
                useCapture
            )
            element.addEventListener(
                'pointercancel',
                e => {
                    if (this.debug) console.log('pointercancel')
                    this.onEnd(e)
                    element.releasePointerCapture(e.pointerId)
                },
                useCapture
            )
            element.addEventListener(
                'pointerleave',
                e => {
                    if (this.debug) console.log('pointerleave')
                    if (e.target == element) this.onEnd(e)
                },
                useCapture
            )
        } else if (window.TouchEvent) {
            if (this.debug) console.log('Touch API')
            element.addEventListener(
                'touchstart',
                e => {
                    if (this.debug)
                        console.log('touchstart', this.touchPoints(e))
                    if (this.capture(e)) {
                        for (let touch of e.changedTouches) {
                            this.onStart(touch)
                        }
                    }
                },
                useCapture
            )
            element.addEventListener(
                'touchmove',
                e => {
                    if (this.debug)
                        console.log('touchmove', this.touchPoints(e), e)
                    for (let touch of e.changedTouches) {
                        this.onMove(touch)
                    }
                    for (let touch of e.targetTouches) {
                        this.onMove(touch)
                    }
                },
                useCapture
            )
            element.addEventListener(
                'touchend',
                e => {
                    if (this.debug) console.log('touchend', this.touchPoints(e))
                    for (let touch of e.changedTouches) {
                        this.onEnd(touch)
                    }
                },
                useCapture
            )
            element.addEventListener(
                'touchcancel',
                e => {
                    if (this.debug)
                        console.log(
                            'touchcancel',
                            e.targetTouches.length,
                            e.changedTouches.length
                        )
                    for (let touch of e.changedTouches) {
                        this.onEnd(touch)
                    }
                },
                useCapture
            )
        } else {
            if (this.debug) console.log('Mouse API')

            element.addEventListener(
                'mousedown',
                e => {
                    if (this.debug) console.log('mousedown', e)
                    if (this.capture(e)) this.onStart(e)
                },
                useCapture
            )
            element.addEventListener(
                'mousemove',
                e => {
                    // Dow we only use move events if the mouse is down?
                    // HOver effects have to be implemented by other means
                    // && Events.isMouseDown(e))

                    if (Events.isMouseDown(e))
                        if (this.debug)
                            // this.capture(e) &&
                            console.log('mousemove', e)
                    this.onMove(e)
                },
                useCapture
            )
            element.addEventListener(
                'mouseup',
                e => {
                    if (this.debug) console.log('mouseup', e)
                    this.onEnd(e)
                },
                true
            )
            element.addEventListener(
                'mouseout',
                e => {
                    if (e.target == element) this.onEnd(e)
                },
                useCapture
            )
        }
    }

    touchPoints(event) {
        let result = []
        for (let touch of event.changedTouches) {
            result.push(this.extractPoint(touch))
        }
        return result
    }

    setupMouseWheelInteraction() {
        this.mouseWheelElement.addEventListener(
            'mousewheel',
            this.onMouseWheel.bind(this),
            true
        )
        this.mouseWheelElement.addEventListener(
            'DOMMouseScroll',
            this.onMouseWheel.bind(this),
            true
        )
    }

    onMouseWheel(event) {
        if (this.capture(event) && this.target.onMouseWheel) {
            this.target.onMouseWheel(event)
        } else {
            //console.warn('Target has no onMouseWheel callback')
        }
    }

    onStart(event) {
        let extracted = this.extractPoint(event)
        this.updateInteraction(event, extracted)
        this.target.onStart(event, this.interaction)
    }

    onMove(event) {
        let extracted = this.extractPoint(event, 'all')
        this.updateInteraction(event, extracted)
        this.target.onMove(event, this.interaction)
        this.interaction.updatePrevious()
    }

    onEnd(event) {
        let extracted = this.extractPoint(event, 'changedTouches')
        this.endInteraction(event, extracted)
        this.target.onEnd(event, this.interaction)
        this.finishInteraction(event, extracted)
    }

    capture(event) {
        let captured = this.target.capture(event)
        return captured
    }

    getPosition(event) {
        return {x: event.clientX, y: event.clientY}
    }

    extractPoint(event, touchEventKey = 'all') {
        // 'targetTouches'
        let result = {}
        switch (event.constructor.name) {
            case 'MouseEvent':
                let buttons = event.buttons || event.which
                if (buttons) result['mouse'] = this.getPosition(event)
                break
            case 'PointerEvent':
                result[event.pointerId.toString()] = this.getPosition(event)
                break
            case 'Touch':
                let id =
                    event.touchType === 'stylus'
                        ? 'stylus'
                        : event.identifier.toString()
                result[id] = this.getPosition(event)
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
            let point = extracted[key]
            if (this.interaction.update(key, point)) {
                this.interactionStarted(event, key, point)
            }
        }
    }

    endInteraction(event, ended) {
        for (let key in ended) {
            let point = ended[key]
            this.interaction.stop(key, point)
            this.interactionEnded(event, key, point)
        }
    }

    finishInteraction(event, ended) {
        for (let key in ended) {
            let point = ended[key]
            this.interaction.finish(key, point)
            this.interactionFinished(event, key, point)
        }
    }
}

export class InteractionMapper extends InteractionDelegate {
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
        super(element, target, {tapDistance, longPressTime, mouseWheelElement})
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
            let local = this.mapPositionToPoint(point)
            let found = this.target.findTarget(event, local, point)
            if (found != null) {
                this.interaction.addTarget(key, found)
            }
        }
    }

    onMouseWheel(event) {
        if (this.capture(event)) {
            if (this.target.findTarget) {
                let point = this.getPosition(event)
                let local = this.mapPositionToPoint(point)
                let found = this.target.findTarget(event, local, point)
                if (found != null && found.onMouseWheel) {
                    found.onMouseWheel(event)
                    return
                }
            }
            if (this.target.onMouseWheel) {
                this.target.onMouseWheel(event)
            } else {
                //console.warn('Target has no onMouseWheel callback', this.target)
            }
        }
    }

    onStart(event) {
        let extracted = this.extractPoint(event)
        this.updateInteraction(event, extracted)
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['current', 'start'],
            this.mapPositionToPoint.bind(this)
        )
        for (let [target, interaction] of mapped.entries()) {
            target.onStart(event, interaction)
        }
    }

    onMove(event) {
        let extracted = this.extractPoint(event, 'all')

        this.updateInteraction(event, extracted)
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['current', 'previous'],
            this.mapPositionToPoint.bind(this)
        )
        for (let [target, interaction] of mapped.entries()) {
            target.onMove(event, interaction)
            interaction.updatePrevious()
        }
        this.interaction.updatePrevious()
    }

    onEnd(event) {
        let extracted = this.extractPoint(event, 'changedTouches')
        this.endInteraction(event, extracted)
        let mapped = this.interaction.mapInteraction(
            extracted,
            ['ended'],
            this.mapPositionToPoint.bind(this)
        )
        for (let [target, interaction] of mapped.entries()) {
            target.onEnd(event, interaction)
        }
        this.finishInteraction(event, extracted)
    }
}

window.InteractionMapper = InteractionMapper
