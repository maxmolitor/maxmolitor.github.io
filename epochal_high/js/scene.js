import LabeledGraphics from './labeledgraphics.js'
import {DisplayObjectScatter, ScatterContainer} from '../lib/pixi/scatter.js'
import {InteractionMapper} from '../lib/interaction.js'
import {isEmpty} from '../lib/utils.js'

class SceneScatter extends DisplayObjectScatter {

    constructor(scene, renderer) {
        super(scene, renderer, { rotatable: false})
        this.scene = scene
    }

    set movableX(value) {

    }

    set movableY(value) {

    }

    get movableX() {
        return app.currentView.movableX
    }

    get movableY() {
        return app.currentView.movableY
    }

    set scalable(value) {

    }

    get scalable() {
        return app.currentView === app.mapview
    }

    bringToFront() {

    }

    mapPositionToContainerPoint(point) {
        let interactionManager = this.renderer.plugins.interaction
        let local = new PIXI.Point()
        interactionManager.mapPositionToPoint(local, point.x, point.y)
        return local
    }

    set throwVisibility(value) {
        this._throwVisibility = value
    }

    get throwVisibility() {
        if (app.currentView === app.timeline)
            return window.innerWidth
        return this._throwVisibility
    }

    set throwDamping(value) {
        this._throwDamping = value
    }

    get throwDamping() {
        if (app.currentView === app.timeline)
            return 0.975
        return this._throwDamping
    }

    get containerBounds() {
        return app.renderer.view.getBoundingClientRect()
    }
}

/*** Root of the PIXI display tree. Uses a single SceneScatter as
main display object. Delegates events to this SceneScatter with one
exception: If the Timeline view is selected, the events are
processed by the scene itself because the Greensock throw behavior
seems more appropriate for the timeline than the standard Scatter throw
animation.
This switch is handled by the findTarget method (see below).
***/
export default class Scene extends LabeledGraphics {

    setup(app) {
        this.scatter = new SceneScatter(this, app.renderer)
        this.delegate = new InteractionMapper(app.renderer.view, this,
                                        { mouseWheelElement: window})
    }

    capture(event) {
        return true
    }

    findTarget(event, local, global) {
        if (event.claimedByScatter)
            return null
        if (app.currentView === app.timeline)
            return this
        return this.scatter
    }

    reset(x, y, scale) {
        this.scatter.x = x
        this.scatter.y = y
        this.scatter.zoom(scale)
    }

    onStart(event, interaction) {
        this.dragging = true
        ThrowPropsPlugin.track(this.position, 'x,y')
        TweenMax.killAll()
    }

    onMove(event, interaction) {
        let currentView = app.currentView
        if (this.dragging) {
            let delta = interaction.delta()
            let dx = delta.x
            let dy = delta.y
            if (currentView.movableX) {
                this.scatter.x += dx
                currentView.x = this.scatter.x
            }
            if (currentView.movableY) {
                this.scatter.y += dy
                currentView.y = this.scatter.y
            }
        }
    }

    onEnd(event, interaction) {
        this.dragging = false
        let currentView = app.currentView
        let props = {}
        if (currentView.movableX) {
            let dx = ThrowPropsPlugin.getVelocity(this.position, 'x')
            if (dx) {
                let maxX = 0
                let minX = -currentView.w + window.innerWidth
                props['x'] = {velocity: dx, max:maxX, min:minX, resistance:1000}
            }
        }
        if (currentView.moveableY) {
            let dy = ThrowPropsPlugin.getVelocity(this.position, 'y')
            if (dy) {
                let maxY = 0
                let minY = -currentView.h + window.innerHeight
                props['y'] = {velocity: dy, max:maxY, min:minY, resistance:1000}
            }
        }
        if (!isEmpty(props)) {
            TweenMax.to(this.scatter, 1.0, {throwProps: props,
                onUpdate: this.onThrow.bind(this)})
        }
        ThrowPropsPlugin.untrack(this.position)
    }

    onThrow(event) {
        if (app.timebar) {
            app.timebar.sceneMoved(this.scatter.x)
        }
    }
}
