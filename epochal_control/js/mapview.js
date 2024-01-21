import {View} from './views.js'

export default class MapView extends View   {

    constructor() {
        super()
        this.map = PIXI.Sprite.fromImage('./Lageplan2.png')
    }

    clear() {
        super.clear()
        this.map.visible = false
    }

    get movableX() {
        return true
    }

    get movableY() {
        return true
    }

    layout(w, h) {
        this.map.visible = true
        app.scene.addChildAt(this.map, 0)
        app.timebar.clear()
        let baseY = h - 32
        this.resize(2048, baseY + 32)

        app.allData.forEach(function (d) {
            let ww = d.scaledWidth * 0.75
            let hh = d.scaledHeight * 0.75
            d.x = d.mapX - ww /2
            d.y = d.mapY - hh /2
            d.width = ww
            d.height = hh
        })
    }
}
