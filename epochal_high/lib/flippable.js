import {getId} from './utils.js'
import {DOMScatter} from './scatter.js'

export class CardLoader {
    constructor(
        src,
        {
            x = 0,
            y = 0,
            width = 1000,
            height = 800,
            maxWidth = null,
            maxHeight = null,
            scale = 1,
            minScale = 0.5,
            maxScale = 1.5,
            rotation = 0
        } = {}
    ) {
        this.src = src
        this.x = x
        this.y = y
        this.scale = scale
        this.rotation = 0
        this.maxScale = maxScale
        this.minScale = minScale
        this.wantedWidth = width
        this.wantedHeight = height
        this.maxWidth = maxWidth != null ? maxWidth : window.innerWidth
        this.maxHeight = maxHeight != null ? maxHeight : window.innerHeight
        this.addedNode = null
    }

    unload() {
        if (this.addedNode) {
            this.addedNode.remove()
            this.addedNode = null
        }
    }
}

export class PDFLoader extends CardLoader {
    constructor(src, {width = 1640, height = 800, scale = 1} = {}) {
        super(src, {width, height, scale})
        if (typeof PDFJS == 'undefined') {
            alert('PDF.js needed')
        }
    }

    load(domNode) {
        return new Promise((resolve, reject) => {
            PDFJS.getDocument(this.src).then(pdf => {
                pdf.getPage(1).then(page => {
                    let scale = this.scale * app.renderer.resolution
                    let invScale = 1 / scale
                    let viewport = page.getViewport(scale)

                    // Prepare canvas using PDF page dimensions.
                    let canvas = document.createElement('canvas')
                    let context = canvas.getContext('2d')
                    canvas.height = viewport.height
                    canvas.width = viewport.width

                    // Render PDF page into canvas context.
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    }
                    page.render(renderContext)
                    domNode.appendChild(canvas)
                    this.wantedWidth = canvas.width
                    this.wantedHeight = canvas.height
                    this.scale = invScale
                    this.addedNode = canvas
                    resolve(this)
                })
            })
        })
    }
}

export class ImageLoader extends CardLoader {
    load(domNode) {
        return new Promise((resolve, reject) => {
            let isImage = domNode instanceof HTMLImageElement
            let image = isImage ? domNode : document.createElement('img')
            image.onload = e => {
                if (!isImage) {
                    domNode.appendChild(image)
                    this.addedNode = image
                }
                this.wantedWidth = image.naturalWidth
                this.wantedHeight = image.naturalHeight

                let scaleW = this.maxWidth / image.naturalWidth
                let scaleH = this.maxHeight / image.naturalHeight
                this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))
                image.setAttribute('draggable', false)
                image.width = image.naturalWidth
                image.height = image.naturalHeight
                resolve(this)
            }
            image.onerror = e => {
                reject(this)
            }
            image.src = this.src
        })
    }
}

export class FrameLoader extends CardLoader {
    load(domNode) {
        return new Promise((resolve, reject) => {
            let iframe = document.createElement('iframe')
            iframe.frameBorder = 0
            iframe.style.scrolling = false
            iframe.width = this.wantedWidth
            iframe.height = this.wantedHeight
            domNode.appendChild(iframe)
            this.addedNode = iframe
            iframe.onload = e => {
                resolve(this)
            }
            iframe.onerror = e => {
                reject(this)
            }
            iframe.src = this.src
        })
    }
}

export class DOMFlip {
    constructor(
        domScatterContainer,
        flipTemplate,
        frontLoader,
        backLoader,
        {
            autoLoad = false,
            center = null,
            preloadBack = false,
            translatable = true,
            scalable = true,
            rotatable = true,
            onFront = null,
            onBack = null,
            onClose = null,
            onUpdate = null,
            onRemoved = null
        } = {}
    ) {
        this.domScatterContainer = domScatterContainer
        this.id = getId()
        this.flipTemplate = flipTemplate
        this.frontLoader = frontLoader
        this.backLoader = backLoader
        this.translatable = translatable
        this.scalable = scalable
        this.rotatable = rotatable
        this.onFrontFlipped = onFront
        this.onBackFlipped = onBack
        this.onClose = onClose
        this.onRemoved = onRemoved
        this.onUpdate = onUpdate
        this.center = center
        this.preloadBack = preloadBack
        if (autoLoad) {
            this.load()
        }
    }

    load() {
        return new Promise((resolve, reject) => {
            let t = this.flipTemplate
            let dom = this.domScatterContainer.element
            let wrapper = t.content.querySelector('.flipWrapper')
            wrapper.id = this.id
            let clone = document.importNode(t.content, true)
            dom.appendChild(clone)
            // We cannot use the document fragment itself because it
            // is not part of the main dom tree. After the appendChild
            // call we can access the new dom element by id
            this.cardWrapper = dom.querySelector('#' + this.id)
            let front = this.cardWrapper.querySelector('.front')
            this.frontLoader.load(front).then(loader => {
                this.frontLoaded(loader).then(resolve)
            })
        })
    }

    frontLoaded(loader) {
        return new Promise((resolve, reject) => {
            let scatter = new DOMScatter(
                this.cardWrapper,
                this.domScatterContainer,
                {
                    x: loader.x,
                    y: loader.y,
                    startScale: loader.scale,
                    scale: loader.scale,
                    maxScale: loader.maxScale,
                    minScale: loader.minScale,
                    width: loader.wantedWidth,
                    height: loader.wantedHeight,
                    rotation: loader.rotation,
                    translatable: this.translatable,
                    scalable: this.scalable,
                    rotatable: this.rotatable
                }
            )
            if (this.center) {
                scatter.centerAt(this.center)
            }

            let flippable = new DOMFlippable(this.cardWrapper, scatter, this)
            let back = this.cardWrapper.querySelector('.back')

            if (this.preloadBack) {
                this.backLoader.load(back).then(loader => {
                    this.setupFlippable(flippable, loader)
                })
            }
            this.flippable = flippable
            resolve(this)
        })
    }

    centerAt(p) {
        this.center = p
        this.flippable.centerAt(p)
    }

    zoom(scale) {
        this.flippable.zoom(scale)
    }

    setupFlippable(flippable, loader) {
        flippable.wantedWidth = loader.wantedWidth
        flippable.wantedHeight = loader.wantedHeight
        flippable.wantedScale = loader.scale
        flippable.minScale = loader.minScale
        flippable.maxScale = loader.maxScale
        flippable.scaleButtons()
    }

    start({duration = 1.0, targetCenter = null} = {}) {
        console.log('DOMFlip.start', targetCenter)
        if (this.preloadBack) this.flippable.start({duration, targetCenter})
        else {
            let back = this.cardWrapper.querySelector('.back')
            let flippable = this.flippable
            this.backLoader.load(back).then(loader => {
                this.setupFlippable(flippable, loader)
                flippable.start({duration, targetCenter})
            })
        }
    }

    fadeOutAndRemove() {
        TweenLite.to(this.cardWrapper, 0.2, {
            opacity: 0,
            onComplete: () => {
                this.cardWrapper.remove()
            }
        })
    }

    closed() {
        if (!this.preloadBack) {
            this.backLoader.unload()
        }
    }
}

export class DOMFlippable {
    constructor(element, scatter, flip) {
        // Set log to console.log or a custom log function
        // define data structures to store our touchpoints in

        this.element = element
        this.flip = flip
        this.card = element.querySelector('.flipCard')
        this.front = element.querySelector('.front')
        this.back = element.querySelector('.back')
        this.flipped = false
        this.scatter = scatter
        this.onFrontFlipped = flip.onFrontFlipped
        this.onBackFlipped = flip.onBackFlipped
        this.onClose = flip.onClose
        this.onRemoved = flip.onRemoved
        this.onUpdate = flip.onUpdate
        scatter.addTransformEventCallback(this.scatterTransformed.bind(this))
        console.log('lib.DOMFlippable', 5000)
        TweenLite.set(this.element, {perspective: 5000})
        TweenLite.set(this.card, {transformStyle: 'preserve-3d'})
        TweenLite.set(this.back, {rotationY: -180})
        TweenLite.set([this.back, this.front], {backfaceVisibility: 'hidden', perspective: 5000})
        TweenLite.set(this.front, {visibility: 'visible'})
        this.infoBtn = element.querySelector('.infoBtn')
        this.backBtn = element.querySelector('.backBtn')
        this.closeBtn = element.querySelector('.closeBtn')
        /* Buttons are not guaranteed to exist. */
        if (this.infoBtn) {
            this.infoBtn.onclick = () => {
                this.flip.start()
            }
            this.show(this.infoBtn)
        }
        if (this.backBtn) {
            this.backBtn.onclick = () => {
                this.start()
            }
        }
        if (this.closeBtn) {
            this.closeBtn.onclick = () => {
                this.close()
            }
            this.show(this.closeBtn)
        }
        this.scaleButtons()
        this.bringToFront()
    }

    close() {
        this.hide(this.infoBtn)
        this.hide(this.closeBtn)
        if (this.onClose) {
            this.onClose(this)
            this.flip.closed()
        } else {
            this.scatter.zoom(0.1, {
                animate: 0.5,
                onComplete: () => {
                    this.element.remove()
                    this.flip.closed()
                    if (this.onRemoved) {
                        this.onRemoved.call(this)
                    }
                }
            })
        }
    }

    showFront() {
        TweenLite.set(this.front, {visibility: 'visible'})
    }

    centerAt(p) {
        this.scatter.centerAt(p)
    }

    zoom(scale) {
        this.scatter.zoom(scale)
    }

    get buttonScale() {
        let iscale = 1.0
        if (this.scatter != null) {
            iscale = 1.0 / this.scatter.scale
        }
        return iscale
    }

    scaleButtons() {
        TweenLite.set([this.infoBtn, this.backBtn, this.closeBtn], {
            scale: this.buttonScale
        })
    }

    bringToFront() {
        this.scatter.bringToFront()
        TweenLite.set(this.element, {zIndex: DOMFlippable.zIndex++})
    }

    clickInfo() {
        this.bringToFront()
        this.infoBtn.click()
    }

    scatterTransformed(event) {
        this.scaleButtons()
    }

    targetRotation(alpha) {
        let ortho = 90
        let rest = alpha % ortho
        let delta = 0.0
        if (rest > ortho / 2.0) {
            delta = ortho - rest
        } else {
            delta = -rest
        }
        return delta
    }

    infoValues(info) {
        let startX = this.element._gsTransform.x
        let startY = this.element._gsTransform.y
        let startAngle = this.element._gsTransform.rotation
        let startScale = this.element._gsTransform.scaleX
        let w = this.element.style.width
        let h = this.element.style.height
        console.log(info, startX, startY, startAngle, startScale, w, h)
    }

    show(element) {
        if (element) {
            TweenLite.set(element, {visibility: 'visible', display: 'initial'})
        }
    }

    hide(element) {
        if (element) {
            TweenLite.set(element, {visibility: 'hidden', display: 'none'})
        }
    }

    start({duration = 1.0, targetCenter = null} = {}) {
        this.bringToFront()
        if (!this.flipped) {
            this.startX = this.element._gsTransform.x
            this.startY = this.element._gsTransform.y
            this.startAngle = this.element._gsTransform.rotation
            this.startScale = this.element._gsTransform.scaleX
            this.startWidth = this.element.style.width
            this.startHeight = this.element.style.height
            this.scatterStartWidth = this.scatter.width
            this.scatterStartHeight = this.scatter.height
            this.show(this.back)
            this.hide(this.infoBtn)
            this.hide(this.closeBtn)
        } else {
            this.show(this.front)
            this.hide(this.backBtn)
        }
        let {scalable, translatable, rotatable} = this.scatter
        this.saved = {scalable, translatable, rotatable}
        this.scatter.scalable = false
        this.scatter.translatable = false
        this.scatter.rotatable = false

        this.flipped = !this.flipped
        let targetY = this.flipped ? 180 : 0
        let targetZ = this.flipped
            ? this.startAngle + this.targetRotation(this.startAngle)
            : this.startAngle
        let targetScale = this.flipped ? this.wantedScale : this.startScale
        let w = this.flipped ? this.wantedWidth : this.startWidth
        let h = this.flipped ? this.wantedHeight : this.startHeight
        let dw = this.wantedWidth - this.scatter.width
        let dh = this.wantedHeight - this.scatter.height

        let xx =
            targetCenter != null ? targetCenter.x - w / 2 : this.startX - dw / 2
        let yy =
            targetCenter != null ? targetCenter.y - h / 2 : this.startY - dh / 2
        let x = this.flipped ? xx : this.startX
        let y = this.flipped ? yy : this.startY

        //console.log("DOMFlippable.start", this.flipped, targetCenter, x, y, this.saved)
        // targetZ = Angle.normalizeDegree(targetZ)
        let onUpdate = this.onUpdate !== null ? () => this.onUpdate(this) : null
        TweenLite.to(this.card, duration, {
            rotationY: targetY + 0.1,
            transformOrigin: '50% 50%',
            onUpdate,
            onComplete: e => {
                if (this.flipped) {
                    //this.hide(this.front)
                    this.show(this.backBtn)
                    if (this.onFrontFlipped) {
                        this.onFrontFlipped(this)
                    }
                } else {
                    //this.hide(this.back)
                    if (this.onBackFlipped == null) {
                        this.show(this.infoBtn)
                        this.show(this.closeBtn)
                    } else {
                        this.onBackFlipped(this)
                    }
                    this.flip.closed()
                }
                this.scatter.scale = targetScale
                this.scaleButtons()
                this.scatter.rotationDegrees = targetZ
                this.scatter.width = this.flipped ? w : this.scatterStartWidth
                this.scatter.height = this.flipped ? h : this.scatterStartHeight

                let {scalable, translatable, rotatable} = this.saved
                this.scatter.scalable = scalable
                this.scatter.translatable = translatable
                this.scatter.rotatable = rotatable

                this.bringToFront()
            },
            force3D: true
        })

        TweenLite.to(this.element, duration / 2, {
            scale: targetScale,
            rotationZ: targetZ  + 0.1,
            transformOrigin: '50% 50%',
            width: w,
            height: h,
            x: x,
            y: y,
            onComplete: e => {
                if (this.flipped) {
                    this.hide(this.front)
                } else {
                    this.hide(this.back)
                }
            }
        })
    }
}

DOMFlippable.zIndex = 0
