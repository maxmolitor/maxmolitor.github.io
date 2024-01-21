import {Points, Polygon, Angle, Elements} from './utils.js'
import Events from './events.js'
import {InteractionMapper} from './interaction.js'
import {Capabilities} from './capabilities.js'

/**
 * A base class for scatter specific events.
 *
 * @constructor
 * @param {name} String - The name of the event
 * @param {target} Object - The target of the event
 */
export class BaseEvent {
    constructor(name, target) {
        this.name = name
        this.target = target
    }
}

// Event types
const START = 'onStart'
const UPDATE = 'onUpdate'
const END = 'onEnd'
const ZOOM = 'onZoom'
const MOVE = 'onMove'

/**
 * A scatter event that describes how the scatter has changed.
 *
 * @constructor
 * @param {target} Object - The target scatter of the event
 * @param {optional} Object - Optional parameter
 */
export class ScatterEvent extends BaseEvent {
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
        super('scatterTransformed', {target: target})
        this.translate = translate
        this.scale = scale
        this.rotate = rotate
        this.about = about
        this.fast = fast
        this.type = type
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
export class ResizeEvent extends BaseEvent {
    constructor(target, {width = 0, height = 0} = {}) {
        super('scatterResized', {width: width, height: height})
        this.width = width
        this.height = height
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
        this.movableX = movableX
        this.movableY = movableY
        this.throwVisibility = throwVisibility
        this.throwDamping = throwDamping
        this.autoThrow = autoThrow
        this.velocities = []
        this.velocity = null
        this.timestamp = null
    }

    observeVelocity() {
        this.lastframe = performance.now()
    }

    addVelocity(delta, buffer = 5) {
        let t = performance.now()
        let dt = t - this.lastframe
        this.lastframe = t
        let velocity = {t: t, dt: dt, dx: delta.x, dy: delta.y}
        this.velocities.push(velocity)
        while (this.velocities.length > buffer) {
            this.velocities.shift()
        }
    }

    meanVelocity(milliseconds = 30) {
        this.addVelocity({x: 0, y: 0})
        let sum = {x: 0, y: 0}
        let count = 0
        let t = 0
        for (let i = this.velocities.length - 1; i > 0; i--) {
            let v = this.velocities[i]
            t += v.dt
            let nv = {x: v.dx / v.dt, y: v.dy / v.dt}
            sum = Points.add(sum, nv)
            count += 1
            if (t > milliseconds) {
                break
            }
        }
        if (count === 0) return sum // empty vector
        return Points.multiplyScalar(sum, 1 / count)
    }

    killAnimation() {
        this.velocity = null
        this.velocities = []
    }

    startThrow() {
        this.velocity = this.meanVelocity()
        if (this.velocity != null) {
            // Call next velocity to ansure that specializations
            // that use keepOnStage are called
            this.velocity = this.nextVelocity(this.velocity)
            if (this.autoThrow) this.animateThrow(performance.now())
        } else {
            this.onDragComplete()
        }
    }

    animateThrow(time) {
        if (this.velocity != null) {
            let t = performance.now()
            let dt = t - this.lastframe
            this.lastframe = t
            // console.log("animateThrow", dt)
            let next = this.nextVelocity(this.velocity)
            let prevLength = Points.length(this.velocity)
            let nextLength = Points.length(next)
            if (nextLength > prevLength) {
                let factor = nextLength / prevLength
                next = Points.multiplyScalar(next, 1 / factor)
                console.log('Prevent acceleration', factor, this.velocity, next)
            }
            this.velocity = next
            let d = Points.multiplyScalar(this.velocity, dt)
            this._move(d)
            this.onDragUpdate(d)
            if (dt == 0 || this.needsAnimation()) {
                requestAnimationFrame(this.animateThrow.bind(this))
                return
            } else {
                if (this.isOutside()) {
                    requestAnimationFrame(this.animateThrow.bind(this))
                }
            }
        }
        this.onDragComplete()
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

export class AbstractScatter extends Throwable {
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
            rotationDegrees = Angle.radian2degree(rotation)
        } else if (rotationDegrees == null) {
            rotationDegrees = 0
        }
        super({
            movableX,
            movableY,
            throwVisibility,
            throwDamping,
            autoThrow
        })
        this.startRotationDegrees = rotationDegrees
        this.startScale = startScale // Needed to reset object
        this.minScale = minScale
        this.maxScale = maxScale
        this.overdoScaling = overdoScaling
        this.translatable = translatable
        this.scalable = scalable
        this.rotatable = rotatable
        this.resizable = resizable
        this.mouseZoomFactor = mouseZoomFactor
        this.autoBringToFront = autoBringToFront
        this.dragging = false
        this.onTransform = onTransform != null ? [onTransform] : null
    }

    addTransformEventCallback(callback) {
        if (this.onTransform == null) {
            this.onTransform = []
        }
        this.onTransform.push(callback)
    }

    startGesture(interaction) {
        this.bringToFront()
        this.killAnimation()
        this.observeVelocity()
        return true
    }

    gesture(interaction) {
        let delta = interaction.delta()
        if (delta != null) {
            this.addVelocity(delta)
            this.transform(delta, delta.zoom, delta.rotate, delta.about)
            if (delta.zoom != 1) this.interactionAnchor = delta.about
        }
    }

    get polygon() {
        let w2 = this.width * this.scale / 2
        let h2 = this.height * this.scale / 2
        let center = this.center
        let polygon = new Polygon(center)
        polygon.addPoint({x: -w2, y: -h2})
        polygon.addPoint({x: w2, y: -h2})
        polygon.addPoint({x: w2, y: h2})
        polygon.addPoint({x: -w2, y: h2})
        polygon.rotate(this.rotation)
        return polygon
    }

    isOutside() {
        let stagePolygon = this.containerPolygon
        let polygon = this.polygon
        let result = stagePolygon.intersectsWith(polygon)
        return result === false || result.overlap < this.throwVisibility
    }

    recenter() {
        // Return a small vector that guarantees that the scatter is moving
        // towards the center of the stage
        let center = this.center
        let target = this.container.center
        let delta = Points.subtract(target, center)
        return Points.normalize(delta)
    }

    nextVelocity(velocity) {
        return this.keepOnStage(velocity)
    }

    bouncing() {
        // Implements the bouncing behavior of the scatter. Moves the scatter
        // to the center of the stage if the scatter is outside the stage or
        // not within the limits of the throwVisibility.

        let stagePolygon = this.containerPolygon
        let polygon = this.polygon
        let result = stagePolygon.intersectsWith(polygon)
        if (result === false || result.overlap < this.throwVisibility) {
            let cv = this.recenter()
            let recentered = false
            while (result === false || result.overlap < this.throwVisibility) {
                polygon.center.x += cv.x
                polygon.center.y += cv.y
                this._move(cv)
                result = stagePolygon.intersectsWith(polygon)
                recentered = true
            }
            return recentered
        }
        return false
    }

    keepOnStage(velocity, collision = 0.5) {
        let stagePolygon = this.containerPolygon
        if (!stagePolygon) return
        let polygon = this.polygon
        let bounced = this.bouncing()
        if (bounced) {
            let stage = this.containerBounds
            let x = this.center.x
            let y = this.center.y
            let dx = this.movableX ? velocity.x : 0
            let dy = this.movableY ? velocity.y : 0
            let factor = this.throwDamping
            // if (recentered) {
            if (x < 0) {
                dx = -dx
                factor = collision
            }
            if (x > stage.width) {
                dx = -dx
                factor = collision
            }
            if (y < 0) {
                dy = -dy
                factor = collision
            }
            if (y > stage.height) {
                dy = -dy
                factor = collision
            }
            // }
            return Points.multiplyScalar({x: dx, y: dy}, factor)
        }
        return super.nextVelocity(velocity)
    }

    endGesture(interaction) {
        //this.startThrow()
    }

    rotateDegrees(degrees, anchor) {
        let rad = Angle.degree2radian(degrees)
        this.rotate(rad, anchor)
    }

    rotate(rad, anchor) {
        this.transform({x: 0, y: 0}, 1.0, rad, anchor)
    }

    move(d, {animate = 0} = {}) {
        if (this.translatable) {
            if (animate > 0) {
                let startPos = this.position
                TweenLite.to(this, animate, {
                    x: '+=' + d.x,
                    y: '+=' + d.y,
                    /* scale: scale, uo: not defined, why was this here? */
                    onUpdate: e => {
                        let p = this.position
                        let dx = p.x - startPos.x
                        let dy = p.x - startPos.y
                        this.onMoved(dx, dy)
                    }
                })
            } else {
                this._move(d)
                this.onMoved(d.x, d.y)
            }
        }
    }

    moveTo(p, {animate = 0} = {}) {
        let c = this.origin
        let delta = Points.subtract(p, c)
        this.move(delta, {animate: animate})
    }

    centerAt(p, {animate = 0} = {}) {
        let c = this.center
        let delta = Points.subtract(p, c)
        this.move(delta, {animate: animate})
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
        let anchor = about || this.center
        if (scale != this.scale) {
            if (animate > 0) {
                TweenLite.to(this, animate, {
                    scale: scale,
                    delay: delay,
                    onComplete: onComplete,
                    onUpdate: this.onZoomed.bind(this)
                })
            } else {
                this.scale = scale
                this.onZoomed(anchor)
            }
        }
    }

    _move(delta) {
        this.x += this.movableX ? delta.x : 0
        this.y += this.movableX ? delta.y : 0
    }

    transform(translate, zoom, rotate, anchor) {
        let delta = {
            x: this.movableX ? translate.x : 0,
            y: this.movableY ? translate.y : 0
        }
        if (this.resizable) var vzoom = zoom
        if (!this.translatable) delta = {x: 0, y: 0}
        if (!this.rotatable) rotate = 0
        if (!this.scalable) zoom = 1.0
        if (zoom == 1.0 && rotate == 0) {
            this._move(delta)
            if (this.onTransform != null) {
                let event = new ScatterEvent(this, {
                    translate: delta,
                    scale: this.scale,
                    rotate: 0,
                    about: anchor,
                    fast: false,
                    type: UPDATE
                })
                this.onTransform.forEach(function(f) {
                    f(event)
                })
            }
            return
        }
        let origin = this.rotationOrigin
        let beta = Points.angle(origin, anchor)
        let distance = Points.distance(origin, anchor)
        let newScale = this.scale * zoom

        let minScale = this.minScale / this.overdoScaling
        let maxScale = this.maxScale * this.overdoScaling
        if (newScale < minScale) {
            newScale = minScale
            zoom = newScale / this.scale
        }
        if (newScale > maxScale) {
            newScale = maxScale
            zoom = newScale / this.scale
        }

        let newOrigin = Points.arc(anchor, beta + rotate, distance * zoom)
        let extra = Points.subtract(newOrigin, origin)
        let offset = Points.subtract(anchor, origin)
        this._move(offset)
        this.scale = newScale
        this.rotation += rotate
        offset = Points.negate(offset)
        offset = Points.add(offset, extra)
        offset = Points.add(offset, translate)
        this._move(offset)

        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: delta,
                scale: newScale,
                rotate: rotate,
                about: anchor
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
        if (this.resizable) {
            this.resizeAfterTransform(vzoom)
        }
    }

    resizeAfterTransform(zoom) {
        // Overwrite this in subclasses.
    }

    validScale(scale) {
        scale = Math.max(scale, this.minScale)
        scale = Math.min(scale, this.maxScale)
        return scale
    }

    animateZoomBounce(dt = 1) {
        if (this.zoomAnchor != null) {
            let zoom = 1
            let amount = Math.min(0.01, 0.3 * dt / 100000.0)
            if (this.scale < this.minScale) zoom = 1 + amount
            if (this.scale > this.maxScale) zoom = 1 - amount
            if (zoom != 1) {
                this.transform({x: 0, y: 0}, zoom, 0, this.zoomAnchor)
                requestAnimationFrame(dt => {
                    this.animateZoomBounce(dt)
                })
                return
            }
            this.zoomAnchor = null
        }
    }

    checkScaling(about, delay = 0) {
        this.zoomAnchor = about
        clearTimeout(this.animateZoomBounce.bind(this))
        setTimeout(this.animateZoomBounce.bind(this), delay)
    }

    onMouseWheel(event) {
        if (event.claimedByScatter) {
            if (event.claimedByScatter != this) return
        }
        this.killAnimation()
        this.targetScale = null
        let direction = event.detail < 0 || event.wheelDelta > 0
        let globalPoint = {x: event.clientX, y: event.clientY}
        let centerPoint = this.mapPositionToContainerPoint(globalPoint)
        if (event.shiftKey) {
            let degrees = direction ? 5 : -5
            let rad = Angle.degree2radian(degrees)
            return this.transform({x: 0, y: 0}, 1.0, rad, centerPoint)
        }
        const zoomFactor = this.mouseZoomFactor
        let zoom = direction ? zoomFactor : 1 / zoomFactor
        this.transform({x: 0, y: 0}, zoom, 0, centerPoint)
        this.checkScaling(centerPoint, 200)

        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: 0, y: 0},
                scale: this.scale,
                rotate: 0,
                about: null,
                fast: false,
                type: ZOOM
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }

    onStart(event, interaction) {
        if (this.startGesture(interaction)) {
            this.dragging = true
            this.interactionAnchor = null
        }
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: 0, y: 0},
                scale: this.scale,
                rotate: 0,
                about: null,
                fast: false,
                type: START
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }

    onMove(event, interaction) {
        if (this.dragging) {
            this.gesture(interaction)
        }
    }

    onEnd(event, interaction) {
        if (interaction.isFinished()) {
            this.endGesture(interaction)
            this.dragging = false
            for (let key of interaction.ended.keys()) {
                if (interaction.isTap(key)) {
                    let point = interaction.ended.get(key)
                    this.onTap(event, interaction, point)
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
                })
                this.onTransform.forEach(function(f) {
                    f(event)
                })
            }
        }
        let about = this.interactionAnchor
        if (about != null) {
            this.checkScaling(about, 100)
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
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }

    onDragComplete() {
        if (this.onTransform) {
            let event = new ScatterEvent(this, {
                scale: this.scale,
                about: this.currentAbout,
                fast: false,
                type: null
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }

    onMoved(dx, dy, about) {
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                translate: {x: dx, y: dy},
                about: about,
                fast: true,
                type: null
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }

    onZoomed(about) {
        if (this.onTransform != null) {
            let event = new ScatterEvent(this, {
                scale: this.scale,
                about: about,
                fast: false,
                type: null
            })
            this.onTransform.forEach(function(f) {
                f(event)
            })
        }
    }
}

/** A container for scatter objects, which uses a single InteractionMapper
 * for all children. This reduces the number of registered event handlers
 * and covers the common use case that multiple objects are scattered
 * on the same level.
 */
export class DOMScatterContainer {
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
        this.element = element
        if (stopEvents === 'auto') {
            if (Capabilities.isSafari) {
                document.addEventListener(
                    'touchmove',
                    event => this.preventPinch(event),
                    false
                )
                stopEvents = false
            } else {
                stopEvents = true
            }
        }
        this.stopEvents = stopEvents
        this.claimEvents = claimEvents
        if (touchAction !== null) {
            Elements.setStyle(element, {touchAction})
        }
        this.scatter = new Map()
        this.delegate = new InteractionMapper(element, this, {
            mouseWheelElement: window
        })

        if (typeof debugCanvas !== 'undefined') {
            requestAnimationFrame(dt => {
                this.showTouches(dt)
            })
        }
    }

    showTouches(dt) {
        let resolution = window.devicePixelRatio
        let canvas = debugCanvas
        let current = this.delegate.interaction.current
        let context = canvas.getContext('2d')
        let radius = 20 * resolution
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = 'rgba(0, 0, 0, 0.3)'
        context.lineWidth = 2
        context.strokeStyle = '#003300'
        for (let [key, point] of current.entries()) {
            let local = point
            context.beginPath()
            context.arc(
                local.x * resolution,
                local.y * resolution,
                radius,
                0,
                2 * Math.PI,
                false
            )
            context.fill()
            context.stroke()
        }
        requestAnimationFrame(dt => {
            this.showTouches(dt)
        })
    }

    preventPinch(event) {
        event = event.originalEvent || event
        if (event.scale !== 1) {
            event.preventDefault()
        }
    }

    add(scatter) {
        this.scatter.set(scatter.element, scatter)
    }

    capture(event) {
        if (event.target == this.element && this.stopEvents) Events.stop(event)
        return true
    }

    mapPositionToPoint(point) {
        return Points.fromPageToNode(this.element, point)
    }

    isDescendant(parent, child, clickable = false) {
        if (parent == child) return true
        let node = child.parentNode
        while (node != null) {
            if (!clickable && node.onclick) {
                return false
            }
            if (node == parent) {
                return true
            }
            node = node.parentNode
        }
        return false
    }

    findTarget(event, local, global) {
        /*** Note that elementFromPoint works with clientX, clientY, not pageX, pageY
        The important point is that event should not be used, since the TouchEvent
        points are hidden in sub objects.
        ***/
        let found = document.elementFromPoint(global.x, global.y)
        for (let target of this.scatter.values()) {
            if (this.isDescendant(target.element, found)) {
                if (this.stopEvents) Events.stop(event)
                if (this.claimEvents) event.claimedByScatter = target
                return target
            }
        }
        return null
    }

    get center() {
        let r = this.bounds
        let w2 = r.width / 2
        let h2 = r.height / 2
        return {x: w2, y: h2}
    }

    get bounds() {
        return this.element.getBoundingClientRect()
    }

    get polygon() {
        let r = this.bounds
        let w2 = r.width / 2
        let h2 = r.height / 2
        let center = {x: w2, y: h2}
        let polygon = new Polygon(center)
        polygon.addPoint({x: -w2, y: -h2})
        polygon.addPoint({x: w2, y: -h2})
        polygon.addPoint({x: w2, y: h2})
        polygon.addPoint({x: -w2, y: h2})
        return polygon
    }
}

let zIndex = 1000

export class DOMScatter extends AbstractScatter {
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
        })
        if (container == null || width == null || height == null) {
            throw new Error('Invalid value: null')
        }
        this.element = element
        this.x = x
        this.y = y
        this.meanX = x
        this.meanY = y
        this.width = width
        this.height = height
        this.throwVisibility = Math.min(width, height, throwVisibility)
        this.container = container
        this.simulateClick = simulateClick
        this.scale = startScale
        this.rotationDegrees = this.startRotationDegrees
        this.transformOrigin = transformOrigin
        this.initialValues = {
            x: x,
            y: y,
            width: width,
            height: height,
            scale: startScale,
            rotation: this.startRotationDegrees,
            transformOrigin: transformOrigin
        }
        // For tweenlite we need initial values in _gsTransform
        TweenLite.set(element, this.initialValues)
        this.onResize = onResize
        this.verbose = verbose
        if (touchAction !== null) {
            Elements.setStyle(element, {touchAction})
        }
        container.add(this)
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
        this._x = value
        TweenLite.set(this.element, {x: value})
    }

    set y(value) {
        this._y = value
        TweenLite.set(this.element, {y: value})
    }

    get position() {
        let transform = this.element._gsTransform
        let x = transform.x
        let y = transform.y
        return {x, y}
    }

    get origin() {
        let p = this.fromNodeToPage(0, 0)
        return Points.fromPageToNode(this.container.element, p)
    }

    get bounds() {
        let stage = this.container.element.getBoundingClientRect()
        let rect = this.element.getBoundingClientRect()
        return {
            top: rect.top - stage.top,
            left: rect.left - stage.left,
            width: rect.width,
            height: rect.height
        }
    }

    get center() {
        let r = this.bounds
        let w2 = r.width / 2
        let h2 = r.height / 2
        if (this.resizable) {
            w2 *= this.scale
            h2 *= this.scale
        }
        var x = r.left + w2
        var y = r.top + h2
        return {x, y}
    }

    set rotation(radians) {
        let rad = radians // Angle.normalize(radians)
        let degrees = Angle.radian2degree(rad)
        TweenLite.set(this.element, {rotation: degrees})
        this._rotation = rad
    }

    set rotationDegrees(degrees) {
        let deg = degrees // Angle.normalizeDegree(degrees)
        TweenLite.set(this.element, {rotation: deg})
        this._rotation = Angle.degree2radian(deg)
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
        })
        this._scale = scale
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
        TweenLite.set(this.element, this.initialValues)
    }

    hide() {
        TweenLite.to(this.element, 0.1, {
            display: 'none',
            onComplete: e => {
                this.element.parentNode.removeChild(this.element)
            }
        })
    }

    show() {
        TweenLite.set(this.element, {display: 'block'})
    }

    showAt(p, rotationDegrees) {
        TweenLite.set(this.element, {
            display: 'block',
            x: p.x,
            y: p.y,
            rotation: rotationDegrees,
            transformOrigin: this.transformOrigin
        })
    }

    bringToFront() {
        // this.element.parentNode.appendChild(this.element)
        // uo: On Chome and Electon appendChild leads to flicker
        TweenLite.set(this.element, {zIndex: zIndex++})
    }

    toggleVideo(element) {
        if (element.paused) {
            element.play()
        } else {
            element.pause()
        }
    }

    onTap(event, interaction, point) {
        if (this.simulateClick) {
            let p = Points.fromPageToNode(this.element, point)
            let iframe = this.element.querySelector('iframe')
            if (iframe) {
                let doc = iframe.contentWindow.document
                let element = doc.elementFromPoint(p.x, p.y)
                if (element == null) {
                    return
                }
                switch (element.tagName) {
                    case 'VIDEO':
                        console.log(element.currentSrc)
                        if (PopupMenu) {
                            PopupMenu.open(
                                {
                                    Fullscreen: () =>
                                        window.open(element.currentSrc),
                                    Play: () => element.play()
                                },
                                {x, y}
                            )
                        } else {
                            this.toggleVideo(element)
                        }
                        break
                    default:
                        element.click()
                }
            }
        }
    }

    isDescendant(parent, child) {
        let node = child.parentNode
        while (node != null) {
            if (node == parent) {
                return true
            }
            node = node.parentNode
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
        let x = this.element._gsTransform.x
        let y = this.element._gsTransform.y
        if (this.movableX) {
            x += delta.x
        }
        if (this.movableY) {
            y += delta.y
        }
        this._x = x
        this._y = y
        TweenLite.set(this.element, {x: x, y: y})
    }

    resizeAfterTransform(zoom) {
        let w = this.width * this.scale
        let h = this.height * this.scale
        TweenLite.set(this.element, {width: w, height: h})
        if (this.onResize) {
            let event = new ResizeEvent(this, {width: w, height: h})
            this.onResize(event)
        }
    }
}
