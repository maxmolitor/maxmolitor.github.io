import App from './app.js'
import Doctest from './doctest.js'
import Errors from './errors.js'
import Events from './events.js'
import {DOMFlip, DOMFlippable, CardLoader, PDFLoader, ImageLoader, FrameLoader} from './flippable.js'
import Index from './index.js'
import Interface from './interface.js'
import PopupMenu from './popupmenu.js'
import Popup from './popup.js'
import {IApp} from './app.js'
import {Capabilities, CapabilitiesTests} from './capabilities.js'
import {EventRecorder} from './events.js'
import {FrameContainer, FrameTarget} from './frames.js'
import {Inspect} from './inspect.js'
import {PointMap, InteractionPoints, Interaction, IInteractionTarget, InteractionDelta, InteractionMapper, InteractionDelegate, IInteractionMapperTarget} from './interaction.js'
import {ResizeEvent, DOMScatterContainer, AbstractScatter, DOMScatter, ScatterEvent, BaseEvent} from './scatter.js'
import {Cycle, Colors, Elements, Angle, Dates, Points, Polygon, isEmpty, getId, lerp, debounce} from './utils.js'

/* Needed to ensure that rollup.js includes class definitions and the classes
are visible inside doctests.
*/

window.AbstractScatter = AbstractScatter
window.Angle = Angle
window.App = App
window.BaseEvent = BaseEvent
window.Capabilities = Capabilities
window.CapabilitiesTests = CapabilitiesTests
window.Colors = Colors
window.Cycle = Cycle

window.DOMFlip = DOMFlip
window.DOMFlippable = DOMFlippable
window.CardLoader = CardLoader
window.PDFLoader = PDFLoader
window.ImageLoader = ImageLoader
window.FrameLoader = FrameLoader

window.DOMScatter = DOMScatter
window.DOMScatterContainer = DOMScatterContainer
window.Dates = Dates
window.Doctest = Doctest
window.Elements = Elements
window.Errors = Errors
window.EventRecorder = EventRecorder
window.Events = Events
window.FrameContainer = FrameContainer
window.FrameTarget = FrameTarget
window.IApp = IApp
window.IInteractionMapperTarget = IInteractionMapperTarget
window.IInteractionTarget = IInteractionTarget
window.Index = Index
window.Inspect = Inspect
window.Interaction = Interaction
window.InteractionDelegate = InteractionDelegate
window.InteractionDelta = InteractionDelta
window.InteractionMapper = InteractionMapper
window.InteractionPoints = InteractionPoints
window.Interface = Interface
window.PointMap = PointMap
window.Points = Points
window.Polygon = Polygon
window.Popup = Popup
window.PopupMenu = PopupMenu
window.ResizeEvent = ResizeEvent
window.ScatterEvent = ScatterEvent
window.getId = getId
window.isEmpty = isEmpty
window.lerp = lerp
window.debounce = debounce
