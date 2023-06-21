export class Frame {

    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.scale = 1
    }
}

export class View extends Frame {
    /* Base class for virtual views which arrange thumbnails. */

    clear() {
        app.scene.clear()
    }

    adjust() {
        let xx= (this.movableX) ? this.x : 0
        let yy = (this.movableY) ? this.y : 0
        let scale = this.scale
        app.scene.reset(xx, yy, scale)
    }
//
//     save(x, y, scale) {
//         console.log("save")
//         this.scale = scale
//         this.x = x
//         this.y = y
//     }

    get movableX() {
        return false
    }

    get movableY() {
        return false
    }

    resize(w, h) {
        this.w = w
        this.h = h
        app.resizeStage(w, h)
    }
}
