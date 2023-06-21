class FontInfo {

    static get small() {
        return {fontFamily : 'Arial',
            fontSize: 14,
            stroke: 'black',
            fill : 'white'}
    }

    static get normal() {
        return {fontFamily : 'Arial',
            fontSize: 24,
            stroke: 'black',
            fill : 'white'}
    }

    static get centered()  {
        return { fontFamily : 'Arial',
            fontSize: 24,
            stroke: 'black',
            align : 'center',
            fill : 'white'}
    }
}

export default class LabeledGraphics extends PIXI.Graphics {

    constructor() {
        super()
        this.labels = new Map()
    }

    ensureLabel(key, label, attrs, fontInfo=FontInfo.small) {
        if (!this.labels.has(key)) {
            let text = new PIXI.Text(label, fontInfo)
            this.labels.set(key, text)
            this.addChild(text)
        }
        let text = this.labels.get(key)
        for(let k in attrs) {
            text[k] = attrs[k]
        }
        if (label != text.text)
            text.text = label
        text.anchor.y = 0.5
        switch(attrs.align) {
            case 'right':
                text.anchor.x = 1
                break
            case 'center':
                text.anchor.x = 0.5
                break
            default:
                text.anchor.x = 0
                break
        }
        text.visible = true
        return text
    }

    clear() {
        super.clear()
        for(let key of this.labels.keys()) {
            let label = this.labels.get(key)
            label.visible = false
        }
    }
}
