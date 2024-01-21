import {
    DisplayObjectScatter,
    ScatterContainer
} from '../lib/pixi/scatter.js'
import {DOMScatter} from '../lib/scatter.js'
import FlipEffect from '../lib/pixi/flipeffect.js'
//import {DOMFlip, ImageLoader, PDFLoader} from '../lib/flippable.js'
import {DOMFlip, ImageLoader, PDFLoader} from './flippable.js'
import {Points} from '../lib/utils.js'
import {XMLCardLoader} from './xmlcardloader.js'
import EpochalApp from './epochal.js'

class CloseButton extends PIXI.Graphics {
    constructor() {
        super()
        this.beginFill(0x000000, 0.5)
        this.drawCircle(0, 0, 22)
        this.lineStyle(4, 0xffffff)
        this.moveTo(-11, -11)
        this.lineTo(11, 11)

        this.moveTo(-11, 11)
        this.lineTo(11, -11)
    }
}

export default class Pictures {
    constructor() {
        this.pictures = []
        this.closeButton = null
        this.opened = 0
    }

    get maxPictures() {
        return app.isMobile ? 1 : 1
    }

    pictureRemoved(d) {
        //console.log('picture removed', d.scatter, d)
        if (d.scatter) {
            let element = d.scatter.element

            d.scatter.element.remove()
            d.scatter = null
        }

        //reset thumbnail selection
        app.resetActiveThumbID()

        /*TweenLite.to(element, 0.2, {
            opacity: 0,
            onComplete: () => {
                d.scatter.element.remove()
                d.scatter = null
                let index = this.pictures.indexOf(d)
                if (index > -1) {
                    this.pictures.splice(index, 1)
                }
                console.log('tween finished')
            }
        })*/
    }

    pictureTransformed(event, d) {
        //console.log("pictureTransformed", d)

        if(d == null || d.ref == null || d.scatter == null || event == null)
            return

        //logging
        if (event.type == 'onStart') {
            app.log('image transform start', {
                id: d.ref,
                x: d.scatter.origin.x,
                y: d.scatter.origin.y,
                scale: event.scale
            })
            //console.log(d.scatter, d.ref, d.scatter.origin.x, d.scatter.y, event.scale)
        }

        if (event.type == 'onEnd') {
            app.log('image transform end', {
                id: d.ref,
                x: d.scatter.origin.x,
                y: d.scatter.origin.y,
                scale: event.scale
            })
            //console.log(d.ref, d.scatter.bounds.x, d.scatter.bounds.y, event.scale)
        }

        if (event.type == 'onZoom') {
            app.log('image zoomed', {
                id: d.ref,
                x: d.scatter.origin.x,
                y: d.scatter.origin.y,
                scale: event.scale
            })
            //console.log(d.ref, d.scatter.bounds.x, d.scatter.bounds.y, event.scale)
        }
    }

    removeAll(animated = false) {
        //console.log('clearing open pictures',this.pictures.length)
        
        while (this.pictures.length > 0) {
            let first = this.pictures.shift()
            this.remove(first, animated)
        }
    }

    remove(d, animate = true) {
        //console.log('removing picture',d,animate)
        if (animate) {
            let bounds = main.getBoundingClientRect()
            let origin = app.scene.position
            let sceneScale = app.scene.scale.x
            let p = d.thumbnail.position
            let w = d.thumbnail.width
            let h = d.thumbnail.height
            let element = d.scatter.element
            let tc = {
                x: origin.x + (p.x + w / 2) * sceneScale,
                y: origin.y + bounds.top + (p.y + h / 2) * sceneScale
            }
            let sc = d.scatter.center
            let delta = Points.subtract(tc, sc)
            let x = element._gsTransform.x
            let y = element._gsTransform.y
            let ww = d.scatter.width
            let hh = d.scatter.height
            TweenLite.to(element, 0.5, {
                x: x + delta.x,
                y: y + delta.y,
                scaleX: w / ww,
                scaleY: h / hh,
                transformOrigin: 'center center',
                onComplete: () => {
                    this.pictureRemoved(d)
                }
            })
        } else {
            this.pictureRemoved(d)
        }

        //logging
        app.log('image closed', {id: d.ref})
    }

    show(event, d) {
        //console.log('showing picture',d)
        let x = event.data.global.x
        let y = event.data.global.y

        /*if (this.pictures.length >= this.maxPictures) {
            let first = this.pictures.shift()
            this.remove(first, false)
        }*/

        //this.removeAll(false)

        let center = {x: window.innerWidth / 2, y: window.innerHeight / 2}
        let zoom = new ZoomPicture(d.pictureURL, {
            startX: x,
            startY: y,
            endX: center.x,
            endY: center.y,
            maxWidth: window.innerWidth * 0.8,
            maxHeight: window.innerHeight * 0.8
        })
        this.flipCards = new DOMFlip(
            app.domScatterContainer,
            flipTemplate,
            zoom,
            new XMLCardLoader(d.infoURL),
            {
                autoLoad: false,
                preloadBack: false,
                rotatable: false,
                center: center,
                onClose: this.onClose.bind(this)
            }
        )
        this.flipCards.load().then(flip => {
            console.log("Flip loaded, setting scatter")
            d.scatter = flip.flippable.scatter
            d.scatter.centerAt(center)
            flip.flippable.data = d

            app.imageLoaded()

            if (d.picture) {
                return this.remove(d)
            }
            this.pictures.push(d)

            d.scatter.addTransformEventCallback(event => {
                this.pictureTransformed(event, d)
            })
        })
    }

    onClose(flippable) {
        this.remove(flippable.data)
    }
}

class ZoomPicture extends ImageLoader {
    constructor(
        src,
        {
            startX = 0,
            startY = 0,
            endX = 0,
            endY = 0,
            width = 1000,
            height = 800,
            maxWidth = null,
            maxHeight = null,
            scale = 1,
            maxScale = 1
        } = {}
    ) {
        super(src, {width, height, maxWidth, maxHeight, scale, maxScale})
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
        this.startScale = 0.125
        this.minScale = 0.125
    }

    load(domNode) {
        return new Promise((resolve, reject) => {
            let isImage = domNode instanceof HTMLImageElement
            let image = document.createElement('img')
            image.classList.add('epochal')
            image.style.position = 'absolute'
            image.style.left = 0
            image.style.top = 0
            image.onload = e => {
                app.domScatterContainer.element.appendChild(image)
                TweenMax.set(image, {
                    scale: this.startScale,
                    transformOrigin: 'center center'
                })
                this.wantedWidth = image.naturalWidth
                this.wantedHeight = image.naturalHeight
                let scaleW = this.maxWidth / image.naturalWidth
                let scaleH = this.maxHeight / image.naturalHeight
                this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))
                TweenMax.set(image, {
                    x: this.startX - image.naturalWidth / 2,
                    y: this.startY - image.naturalHeight / 2
                })
                image.width = image.naturalWidth
                image.height = image.naturalHeight
                TweenMax.to(image, 0.5, {
                    x: this.endX - image.naturalWidth / 2,
                    y: this.endY - image.naturalHeight / 2,
                    scale: this.scale,
                    transformOrigin: 'center center',
                    onComplete: () => {
                        if (isImage) {
                            TweenMax.set(image, {scale: 1, x: 0, y: 0})
                            image.classList.add('flipFace')
                            image.classList.add('front')
                            domNode.parentNode.replaceChild(image, domNode)
                        } else {
                            domNode.appendChild(image)
                        }
                        resolve(this)
                    }
                })
            }
            image.onerror = e => {
                reject(this)
            }
            image.src = this.src
        })
    }
}
