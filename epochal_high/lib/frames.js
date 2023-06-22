
export class FrameContainer {

    constructor(element) {
        this.element = element
        this.delegate = new InteractionMapper(element, this,
                                        { mouseWheelElement: window})
    }

    capture(event) {
        return true
    }

    findTarget(event, local, global) {
        let found = document.elementFromPoint(global.x, global.y)
        let iframe = found.querySelector('iframe')
        if (iframe) {
            let p = Points.fromPageToNode(found, global)
            let doc = iframe.contentWindow.document
            let target = doc.elementFromPoint(p.x, p.y)
            if (target != null) {
                console.log('iframe element', target)
                return new FrameTarget(iframe, target)
            }
        }
        return null
    }
}

export class FrameTarget {

    constructor(frame, target) {
        this.frame = frame
        this.target = target
    }

    capture(event) {
        return true
    }

    simulateMouseEvent(type, point) {
        let p = Points.fromPageToNode(this.frame, point)
        let event = new MouseEvent(type, {
            view: this.frame.contentWindow,
            bubbles: true,
            cancelable: true,
            clientX: p.x,
            clientY: p.y})
        this.target.dispatchEvent(event)
    }

    createTouchList(pointMap) {
        let touches = []
        let doc = this.frame.contentWindow.document
        for(let key of pointMap.keys()) {
            let point = pointMap.get(key)
            let p = Points.fromPageToNode(this.frame, point)
            let touchTarget = doc.elementFromPoint(p.x, p.y)
            let touch = new Touch(undefined, touchTarget, key,
                                    p.x, p.y, p.x, p.y)
            touches.push(touch)
        }
        return new TouchList(...touches)
    }

    simulateTouchEvent(type, point, pointMap, touchEventKey='targetTouches') {
        let p = Points.fromPageToNode(this.frame, point)
        let data = { view: this.frame.contentWindow,
            bubbles: true,
            cancelable: true,
            clientX: p.x,
            clientY: p.y}
        data[touchEventKey] = this.createTouchList(pointMap)
        let event = new TouchEvent(type, data)
        this.target.dispatchEvent(event)
    }

    onStart(event, interaction) {
        console.log('onStart', this.frame.parentNode)
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mousedown', point)
            }
            else {
                this.simulateTouchEvent('touchstart', point,
                    interaction.current)
                return
            }
        }
    }

    onMove(event, interaction) {
        console.log('onMove')
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mousemove', point)
            }
            else {
                this.simulateTouchEvent('touchmove', point,
                    interaction.current)
                return
            }
        }
    }

    onEnd(event, interaction) {
        console.log('onEnd')
        for(let [key, point] of interaction.current.entries()) {
            if (key == 'mouse') {
                this.simulateMouseEvent('mouseend', point)
            }
            else {
                this.simulateTouchEvent('touchend', point,
                    interaction.ended, 'changedTouches')
                return
            }
        }
    }
}
