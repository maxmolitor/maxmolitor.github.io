import EpochalApp from './epochal.js'
import {DOMScatterContainer} from '../lib/scatter.js'

const domScatterContainer = new DOMScatterContainer(document.body)
const app = new EpochalApp({ view: canvas, monkeyPatchMapping: false})

app.setup(data, domScatterContainer)
app.run()


