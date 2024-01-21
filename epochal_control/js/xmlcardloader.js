import {CardLoader} from '../lib/flippable.js' //pm: recent change
//import {CardLoader} from './flippable.js' //pm: recent change
import {XMLIndexParser, XMLCardParser} from './xmlparser.js'

export class XMLCardLoader extends CardLoader {

    constructor(src, {x=0, y=0,
                        width=1400, height=1200, maxWidth=null, maxHeight=null,
                        scale=1, maxScale=1, rotation=0} = {}) {
        super(src, {x, y, width, height, maxWidth, maxHeight,
                    scale, maxScale, rotation})
        this.xmlParser = new XMLIndexParser(this.src, {width: width, height: height})
        this.domTree = null
    }

    load(domNode) {
        return new Promise((resolve, reject) => {
            this.xmlParser.loadParseAndCreateDOM().then((domTree) => {
                domNode.appendChild(domTree)
                let scaleW = this.maxWidth / this.wantedWidth
                let scaleH = this.maxHeight / this.wantedHeight
                this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))

                let w = this.wantedWidth
                let h = this.wantedHeight
                $(domNode).css({ 'width': w,
                                    'maxWidth': w,
                                    'minWidth': w,
                                    'height': h})
                this.domTree = domTree
                this.xmlParser.completed(domNode) //pm: recent change
                resolve(this)
            }).catch((reason) => {
                console.warn("loadParseAndCreateDOM error", reason)
            })
        })
    }

    unload() {
        if (this.domTree) {
            this.domTree.remove()
            this.domTree = null
        }
    }
}
