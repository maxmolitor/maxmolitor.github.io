import {Frame, View} from './views.js'
import LabeledGraphics from './labeledgraphics.js'

function lerp(start, stop, amt) {
    return amt * (stop-start) + start
}

export class TimeScrollbar extends LabeledGraphics {

    constructor() {
        super()
        this.inset = 32
        this.years = [-300, 0, 500, 1000, 1500, 1600, 1700, 1800, 1900, 2000]
        this.dot = new PIXI.Graphics()
        this.dot.beginFill(0xFFFFFF, 1)
        this.dot.drawCircle(0, 0, 4)
        this.addChild(this.dot)
        this.setup()
    }

    clear() {
        super.clear()
        this.dot.visible = false
    }

    setup() {
        let start = this.onDragStart.bind(this)
        let move = this.onDragMove.bind(this)
        let end = this.onDragEnd.bind(this)
        this.interactive = true
        this.on('mousedown', start)
            .on('touchstart', start)
            .on('mouseup', end)
            .on('mouseupoutside', end)
            .on('touchend', end)
            .on('touchendoutside', end)
            .on('mousemove', move)
            .on('touchmove', move)
    }

    onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data
        this.dragging = true
        let p = this.data.getLocalPosition(this.parent)
        this.moveDot(p.x)
    }

    onDragEnd(event) {
        this.dragging = false
        this.data = null
    }

    onDragMove(event) {
        if (this.dragging) {
            let p = this.data.getLocalPosition(this.parent)
            this.moveDot(p.x)
        }
    }

    yearToX(t, start, end, w, inset) {
        let value = t / (end - start)
        return lerp(inset, w-inset, value)
    }

    moveDot(x) {
        let inset = this.inset
        let timeline = app.currentView
        let start = timeline.yearToX(-320)
        let end = timeline.yearToX(2010)
        if (x < inset)
            x = inset
        if (x > this.wantedWidth-inset)
            x = this.wantedWidth-inset
        this.dot.x = x
        x = x - inset
        let w = this.wantedWidth - (2*inset)
        let ratio = x / w
        let sceneX = ratio * ((end - start) - this.wantedWidth)
        app.scene.x = -sceneX
    }

    timelineToDotX(xPos) {
        let inset = this.inset
        let timeline = app.timeline
        let start = timeline.yearToX(this.years[0])
        let end = timeline.yearToX(this.years[9])
        let w = this.wantedWidth
        let x = inset + (-xPos - start) / (end - start) * (w - (2*inset))
        if (x < inset)
            x = inset
        if (x > this.wantedWidth-inset)
            x = this.wantedWidth-inset
        return x
    }

    sceneMoved(x) {
        this.dot.x = this.timelineToDotX(x)
    }

    layout(timeline, w, h, bottom) {
        let inset = this.inset
        this.clear()
        this.beginFill(0x000000)
        this.drawRect(0, bottom-22, w, 44)

        this.lineStyle(1, 0xFFFFFF)
        this.moveTo(inset, bottom)
        this.lineTo(w-inset, bottom)
        let start = timeline.yearToX(this.years[0])
        let end = timeline.yearToX(this.years[9])
        for(let year of this.years) {
            let t = timeline.yearToX(year)
            let x = this.yearToX(t, start, end, w, inset)
            let label = this.ensureLabel('key'+year, year.toString(), {align: 'center'})
            label.x = x
            label.y = bottom - 12
        }
        this.dot.visible = true
        this.dot.y = bottom
        this.wantedWidth = w
        let xx = this.timelineToDotX(app.timeline.x)
        this.dot.x = xx
    }
}

export  class Timeline extends View {

    constructor() {
        super()
        this.startYear = -320

        this.epochLabels = ['ANTIKE',
            'MITTELALTER',
            'RENAISSANCE',
            'EUROPÄISCHER BAROCK',
            'BAROCK IM NORDEN EUROPAS',
            '18. JAHRHUNDERT',
            'ROMANTIK & MODERNE']

        this.extraLabels = [
            [0, '• Christi Geburt'],
            [780, '• Christianisierung Nordwestdeutschlands'],
            [1130, '• Heinrich der Löwe'],
            [1492, '• Entdeckung Amerikas'],

            [1517, '• Beginn der Reformation'],
            [1618, '• Beginn des Dreißigjährigen Krieges'],
            [1648, '• Ende des Dreißigjährigen Krieges'],

            [1633, '• Geburt Herzog Anton Ulrichs'],
            [1694, '• Einweihung des Schlosses Salzdahlum'],
            [1714, '• Tod Herzog Anton Ulrichs'],
            [1754, '• Eröffnung des Herzog Anton Ulrich-Museums'],
            [1789, '• Französische Revolution'],
            [1806, '• Napoleonische Besetzung, Zeitweise Überführung der Bestände in den Louvre'],
            [1887, '• Eröffnung des Neubaus des HAUM'],
            [1914, '• Erster Weltkrieg'],
            [1939, '• Zweiter Weltkrieg']]

        this.epochColors = [[0xFFFFFF, 'black'],  // [ background color, font color ]
            [0x3333CC, 'white' ],
            [0xF76B00, 'white' ],
            [0xCE1018, 'white' ],
            [0xA5B531, 'white'],
            [0x639CAD, 'white'],
            [0xFFFFFF, 'black' ]]

        this.renaissanceStarts = 1450
        this.modernStarts = 1800

        this.epochStarts = [-320, 600, 1450, 1600, 1608, 1700, 1800]
        this.epochEnds = [600, 1450, 1600, 1680, 1700, 1800, 2010]
        this.epochNumLabels = [3, 2, 4, 3, 3, 3, 3]
        this.epochTimeResolution = [100, 100, 10, 10, 10, 10, 10]
    }

    get movableX() {
        return true
    }

    yearToX(year) {
        year -= this.startYear
        let newness = this.renaissanceStarts - this.startYear
        let modern = this.modernStarts  - this.startYear

        const oldSize = 1.0
        const newSize = 17.5
        const modernSize = 10.0

        let startNew = newness * oldSize
        if (year < newness)
            return year * oldSize

        if (year > modern)
            return startNew + (modern-newness) * newSize + (year - modern) * modernSize

        return startNew + (year-newness) * newSize
    }


    smallFont(color) {
        return {fontFamily : 'Arial',
            fontSize: 14,
            stroke: color,
            fill : color}
    }


    layoutEpochs(w, h, bottom) {
        let graphics = app.scene
        let last = this.yearToX(2010)
        let y = bottom - 32
        let i = 0
        let lastEnd = 0
        for(let epoch of this.epochLabels) {
            let offsetY = 0
            let [color, fontColor] = this.epochColors[i]
            let start = this.yearToX(this.epochStarts[i])
            let end = this.yearToX(this.epochEnds[i])
            if (start < lastEnd)
                offsetY = -14
            graphics.lineStyle(14, color)
            graphics.moveTo(start, y+offsetY)
            graphics.lineTo(end, y+offsetY)
            let numLabels = this.epochNumLabels[i]
            let xx = start
            let delta = (end - start) / (numLabels-1)

            let key = this.epochLabels[i]
            for(let j=0; j<numLabels; j++) {
                let align = 'center'
                let offsetX = 0
                if (j == 0) {
                    align = 'left'
                    offsetX = 4
                }
                if (j == numLabels-1) {
                    align = 'right'
                    offsetX = -4
                }
                let label = graphics.ensureLabel('epoch'+key+j, key,
                                                    {align: align},
                                                    this.smallFont(fontColor))
                label.x = xx + offsetX
                label.y = y + offsetY
                xx += delta
            }

            graphics.lineStyle(1, color, 0.2)
            let resolution = this.epochTimeResolution[i]
            let t1 = this.epochStarts[i]
            let first = t1 - (t1 % 100)

            for(let t=first; t<this.epochEnds[i]; t+=resolution) {
                if (t < t1)
                    continue
                let x = this.yearToX(t)
                graphics.moveTo(x, y+offsetY)
                graphics.lineTo(x, 0)
                let label = graphics.ensureLabel('year'+t, t.toString(),
                                                    {align: 'left'},
                                                    this.smallFont('gray'))
                label.x = x + 4
                label.y = 7
            }

            i++
            lastEnd = end
        }
        for(let [year, key] of this.extraLabels) {
            let x = this.yearToX(year)
            let label = graphics.ensureLabel('extra'+year, key,
                                                    {align: 'left'},
                                                    this.smallFont('gray'))
            label.x = x
            label.y = 44
        }
    }

    layout(w, h) {
        const margin = 4
        let maxX = 0
        let self = this
        let baseY = h - 160
        let yy = baseY - 100
        let r = new Frame()
        // Layout thumbnails
        app.allData.forEach((d) => {
            let ww = d.scaledWidth
            let hh = d.scaledHeight
            let year = d.year
            let x = this.yearToX(year)
            let y = yy
            if ((x < r.x + r.w) && (y > r.y - r.h)) {
                y = r.y - r.h - margin
            }
            if (y < 100) {
                y = yy
            }
            r = new Frame(x, y, ww, hh)
            d.x = x
            d.y = y
            d.width = ww
            d.height = hh
            maxX = Math.max(x + ww, maxX)
        })
        let bottom = baseY + 32
        app.timebar.layout(this, w, h, bottom)
        this.layoutEpochs(w, h, bottom)
        this.resize(maxX, bottom)
    }
}
