import {CardLoader} from '../../../lib/flippable.js'
import {XMLIndexParser, XMLCardParser} from './xmlparser.js'

export class XMLCardLoader extends CardLoader {

    constructor(src, {x=0, y=0,
                        width=1400, height=1200, maxWidth=null, maxHeight=null,
                        scale=1, minScale=0.25, maxScale=2, rotation=0} = {}) {
        super(src, {x, y, width, height, maxWidth, maxHeight,
                    scale, minScale, maxScale, rotation})
        this.xmlParser = new XMLIndexParser(this.src, {width: width, height: height})
    }

    load(domNode) {
        console.log("domNode", domNode)
        return new Promise((resolve, reject) => {
            this.xmlParser.loadParseAndCreateDOM().then((domTree) => {
                domNode.appendChild(domTree)
        //         let scaleW = this.maxWidth / this.wantedWidth
//                 let scaleH = this.maxHeight / this.wantedHeight
//                 this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))

                this.scale = 1 / (window.devicePixelRatio || 1)
                let w = this.wantedWidth
                let h = this.wantedHeight
                $(domNode).css({ 'width': w,
                                    'maxWidth': w,
                                    'minWidth': w,
                                    'height': h})
                this.addedNode = domTree
                this.xmlParser.completed(domNode)
                resolve(this)
            }).catch((reason) => {
                console.warn("loadParseAndCreateDOM error", reason)
                reject(reason)
            })
        })
    }
}
