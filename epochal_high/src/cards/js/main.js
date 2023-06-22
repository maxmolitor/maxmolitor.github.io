import {XMLCardLoader} from "./xmlcardloader.js"
import {DOMScatterContainer} from "../../../lib/scatter.js"
import {DOMFlip, ImageLoader} from "../../../lib/flippable.js"
import {Capabilities} from "../../../lib/capabilities.js"

let data = []
let existing = [41, 1, 3, 19, 69, 20, 24, 27, 28, 29, 31]

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function setupData() {
    let dir = "../../var/eyevisit/cards/"
    for(let i=0; i<3; i++) {
        let cardIndex = existing[i]
        let key = pad(cardIndex, 3)
        let img = dir + key + "/" + key + ".jpg"
        let xml = dir + key + "/" + key + ".xml"
        data.push({front: img,
                    back: xml})
    }
}

function run() {
    setupData()
    let scatterContainer = new DOMScatterContainer(main)
    if (Capabilities.supportsTemplate()) {
        data.forEach((d) => {
            let flip = new DOMFlip(scatterContainer,
                            flipTemplate,
                            new ImageLoader(d.front, { minScale: 0.1, maxScale: 3, maxWidth: main.clientWidth / 4}),
                            new XMLCardLoader(d.back)) // ImageLoader(d.back)) //
            flip.load().then((flip) => {
                let bounds = flip.flippable.scatter.bounds
                let w = bounds.width
                let h = bounds.height
                let x = w/2 + Math.random()*(main.clientWidth - w)
                let y = h/2 + Math.random()*(main.clientHeight - h)
                let angle = 0 //Math.random()*360
                flip.flippable.scatter.rotationDegrees = angle
                flip.centerAt({x, y})
            })
        })
    }
    else {
        alert("Templates not supported, use Edge, Chrome, Safari or Firefox.")
    }
}

run()
