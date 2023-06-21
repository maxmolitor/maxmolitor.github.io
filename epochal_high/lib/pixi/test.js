import PIXIApp from './app.js'
/**
 *
 */
export class Command extends PIXI.Graphics {
    /*** Abstract base class for record, play, and stop commands. ***/
    constructor(tools, selectedColor, shape) {
        super()
        this.tools = tools
        this.shape = shape
        this.selected = false
        this.disabled = false
        this.selectedColor = selectedColor
        this.draw()
        this.setup()
    }

    setup() {
    }

    draw() {
        this.clear()
        var color = (this.selected) ? this.selectedColor : 0xFFFFFF
        this.lineStyle(0)
        this.beginFill(color, 1)
        this.drawShape(this.shape)
        this.endFill()
    }

    select() {
        this.selected = true
        this.draw()
    }

    deselect() {
        this.selected = false
        this.draw()
    }

    toggle() {
        this.selected = !this.selected
        this.draw()
    }

    stop() {
        this.selected = false
        this.draw()
    }
}

export class RecordCommand extends Command {
    /*** Records events for later replay. ***/
    setup() {
        this.recorder = new EventRecorder()
    }

    toggle() {
        super.toggle()
        if (!this.selected) {
            this.recorder.stopRecording()
        }
    }

    recordEvent(event) {
    	this.recorder.record(event)
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
        let whileCondition = this.whileNotStopped.bind(this)
        this.recorder.startReplay(whileCondition, () => this.tools.play.stop())
    }
}

export class PlayCommand extends Command {
    /*** Plays recorded events. ***/
    toggle() {
        super.toggle()
        if (this.selected && this.tools.record.recorder.recorded.length > 0) {
            this.tools.startReplay()
        }
    }
}

export class StopCommand extends Command {
    /*** Stops recording and playing. ***/
    toggle() {
        super.toggle()
        this.tools.record.stop()
        this.tools.play.stop()
        setTimeout(this.deselect.bind(this), 500)
    }
}

export class RecorderTools extends PIXI.Container {

    constructor(renderer) {
        super(renderer)
        this.renderer = renderer
        this.setupToolbar()
        this.replayRate = 100.0
        this.onReset = null
        this.touchGraphics = new PIXI.Graphics()
        this.showTouches()
    }

    setup(container) {
        this.delegate = new InteractionMapper(container, this)
    }

    findTarget(event, local, global) {
        return this
    }

    setupToolbar() {
        this.toolbar = new PIXI.Graphics()
        this.record = new RecordCommand(this, 0xCC0000, new PIXI.Circle(0, 0, 16))
        this.play = new PlayCommand(this, 0x0000CC, new PIXI.Polygon(0, 16,
                                               32, 16+16,
                                               0, 16+32,
                                               0, 16))
        this.stop = new StopCommand(this, 0x0000CC,
                                        new PIXI.Rectangle(0, 0, 32, 32))
        this.toolbar.addChild(this.record).position.set(44, 48)
        this.toolbar.addChild(this.play).position.set(44+44, 16)
        this.toolbar.addChild(this.stop).position.set(44+44+44+16, 32)
        this.updateToolbar()
        this.addChild(this.toolbar)
    }

    updateToolbar() {
        var graphics = this.toolbar
        graphics.clear()
        graphics.beginFill(0x000000, 0.5)
        graphics.lineStyle(2, 0xFFFFFF,  1)
        graphics.drawRoundedRect(16, 16, 44*4+8, 64, 8)
        graphics.endFill()
    }

    onMouseWheel(event) {
        console.log('onMouseWheel missing')
    }

    onMouseDown(point) {
        if (this.record.containsPoint(point)) {
            this.record.toggle()
        }
        if (this.play.containsPoint(point)) {
            this.play.toggle()
        }
        if (this.stop.containsPoint(point)) {
            this.stop.toggle()
            if (this.onReset) {
                this.onReset()
            }
        }
    }

    onTap(point) {
        console.log('onTap')
        if (this.record.getBounds().contains(point.x, point.y)) {
            this.record.toggle()
        }
        if (this.play.getBounds().contains(point.x, point.y)) {
            this.play.toggle()
        }
        if (this.stop.getBounds().contains(point.x, point.y)) {
            this.stop.toggle()
        }
    }

    mapPositionToPoint(point) {
        let local = new PIXI.Point()
        this.renderer.plugins.interaction.mapPositionToPoint(local, point.x, point.y)
        return local
    }

    extractLocal(event) {
        return this.mapPositionToPoint(Events.extractPoint(event))
    }

    capture(event) {
        let local = this.extractLocal(event)
        if (this.toolbar.containsPoint(local)) {
            switch(event.type) {
                case 'mousedown':
                    this.onMouseDown(local)
                    break
                case 'touchstart':
                case 'pointerdown':
                    this.onTap(local)
            }
            event.preventDefault()
            event.stopPropagation()
            console.log('stopPropagation')
            return false
        }
        if (this.record.selected) {
            this.record.recordEvent(event)
        }
        return true
    }

    startReplay() {
        if (this.onReset) {
            this.onReset()
        }
        this.record.startReplay()
    }

    showTouches() {
        this.addChild(this.touchGraphics)
    }

    onStart(event, interaction) {
        this.updateTouchGraphics(interaction)
    }

    onMove(event, interaction) {
        this.updateTouchGraphics(interaction)
    }

    onEnd(event, interaction) {
        this.updateTouchGraphics(interaction)
    }

    updateTouchGraphics(interaction) {
	    let current = interaction.current
        let graphics = this.touchGraphics
        if (graphics != null) {
            graphics.clear()
            for(let key of current.keys()) {
                if (interaction.ended.has(key)) {
                    continue
                }
                let p = current.get(key)
                if (key == 'mouse') {
                    graphics.beginFill(0xCC0000, 0.5)
                } else {
                    graphics.beginFill(0xCCCCCC, 0.5)
                }
                graphics.drawCircle(p.x, p.y, 20)
            }
            graphics.endFill()
        }
    }
}


export class AppTest extends PIXIApp {

    constructor(canvas, container) {
        super({view: canvas, backgroundColor: 0x000000})
        this.container = container
    }

    sceneFactory() {
        return new RecorderTools(this.renderer)
    }

    setup() {
        super.setup()
        this.scene.setup(this.container)
    }

    run(reset=null) {
        this.scene.onReset = reset
        console.log('Running AppTest')
        return this
    }

}




