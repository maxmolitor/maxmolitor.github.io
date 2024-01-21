import {View} from './views.js'

export default class Overview extends View {

    layout(w, h) {
        if (app.timebar)
            app.timebar.clear()
        let tx = 0, ty = 0
        let start = 0, index = 0
        let dx = 2, dy = 4
        let hh = app.wantedThumbHeight
        app.allData.forEach(function (d) {
            let scale = d.scaledWidth / d.width
            let ww = d.scaledWidth * (hh /  d.scaledHeight)
            let wwdx = ww + dx
            if (tx+wwdx > w) {
                let delta = (w - tx) / ((index - start) - 1)
                let j = 0
                for(let i=start; i<index; i++) {
                    app.allData[i].x += j*delta
                    j++
                }
                tx = 0
                ty += hh + dy
                start = index
            }
            d.x = tx
            d.y = ty
            d.width = ww
            d.height = hh
            tx += wwdx
            index++
        })
        this.resize(w-8, Math.min(h - 66, ty + hh))
    }
}
