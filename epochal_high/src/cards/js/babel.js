'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    /* globals WebKitPoint */

    /** Returns an id that is guaranteed to be unique within the livetime of the
     * application
     * @return {string}
     */

    var _idGenerator = 0;
    function getId() {
        return 'id' + _idGenerator++;
    }

    /** Static methods to compute 2D points with x and y coordinates.
     */

    var Points = function () {
        function Points() {
            _classCallCheck(this, Points);
        }

        _createClass(Points, null, [{
            key: 'length',
            value: function length(a) {
                return Math.sqrt(a.x * a.x + a.y * a.y);
            }
        }, {
            key: 'normalize',
            value: function normalize(p) {
                var len = this.length(p);
                return this.multiplyScalar(p, 1 / len);
            }
        }, {
            key: 'mean',
            value: function mean(a, b) {
                return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            }
        }, {
            key: 'subtract',
            value: function subtract(a, b) {
                return { x: a.x - b.x, y: a.y - b.y };
            }
        }, {
            key: 'multiply',
            value: function multiply(a, b) {
                return { x: a.x * b.x, y: a.y * b.y };
            }
        }, {
            key: 'multiplyScalar',
            value: function multiplyScalar(a, b) {
                return { x: a.x * b, y: a.y * b };
            }
        }, {
            key: 'add',
            value: function add(a, b) {
                return { x: a.x + b.x, y: a.y + b.y };
            }
        }, {
            key: 'negate',
            value: function negate(p) {
                return { x: -p.x, y: -p.y };
            }
        }, {
            key: 'angle',
            value: function angle(p1, p2) {
                return Math.atan2(p1.y - p2.y, p1.x - p2.x);
            }
        }, {
            key: 'arc',
            value: function arc(p, alpha, radius) {
                return {
                    x: p.x + radius * Math.cos(alpha),
                    y: p.y + radius * Math.sin(alpha)
                };
            }
        }, {
            key: 'distance',
            value: function distance(a, b) {
                var dx = a.x - b.x;
                var dy = a.y - b.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
        }, {
            key: 'fromPageToNode',
            value: function fromPageToNode(element, p) {
                //    if (window.webkitConvertPointFromPageToNode) {
                //             return window.webkitConvertPointFromPageToNode(element,
                //                                                     new WebKitPoint(p.x, p.y))
                //         }
                return window.convertPointFromPageToNode(element, p.x, p.y);
            }
        }, {
            key: 'fromNodeToPage',
            value: function fromNodeToPage(element, p) {
                //  if (window.webkitConvertPointFromNodeToPage) {
                //             return window.webkitConvertPointFromNodeToPage(element,
                //                                                     new WebKitPoint(p.x, p.y))
                //         }
                return window.convertPointFromNodeToPage(element, p.x, p.y);
            }
        }]);

        return Points;
    }();

    /** Static methods to compute angles.
     */


    var Angle = function () {
        function Angle() {
            _classCallCheck(this, Angle);
        }

        _createClass(Angle, null, [{
            key: 'normalize',
            value: function normalize(angle) {
                var twoPI = Math.PI * 2.0;
                while (angle > Math.PI) {
                    angle -= twoPI;
                }
                while (angle < -Math.PI) {
                    angle += twoPI;
                }
                return angle;
            }
        }, {
            key: 'normalizeDegree',
            value: function normalizeDegree(angle) {
                var full = 360.0;
                while (angle > 180.0) {
                    angle -= full;
                }
                while (angle < -180.0) {
                    angle += full;
                }
                return angle;
            }
        }, {
            key: 'diff',
            value: function diff(a, b) {
                return Angle.normalize(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
            }
        }, {
            key: 'degree2radian',
            value: function degree2radian(degree) {
                return Math.PI * degree / 180.0;
            }
        }, {
            key: 'radian2degree',
            value: function radian2degree(rad) {
                return 180.0 / Math.PI * rad;
            }
        }]);

        return Angle;
    }();

    var Elements$1 = function () {
        function Elements$1() {
            _classCallCheck(this, Elements$1);
        }

        _createClass(Elements$1, null, [{
            key: 'setStyle',
            value: function setStyle(element, styles) {
                for (var key in styles) {
                    element.style[key] = styles[key];
                }
            }
        }, {
            key: 'addClass',
            value: function addClass(element, cssClass) {
                element.classList.add(cssClass);
            }
        }, {
            key: 'removeClass',
            value: function removeClass(element, cssClass) {
                element.classList.remove(cssClass);
            }
        }, {
            key: 'toggleClass',
            value: function toggleClass(element, cssClass) {
                element.classList.toggle(cssClass);
            }
        }, {
            key: 'hasClass',
            value: function hasClass(element, cssClass) {
                return element.classList.contains(cssClass);
            }
        }]);

        return Elements$1;
    }();

    var MapProxy = function () {
        /* This class is needed if we want to use the interaction classes
        in Firefox 45.8 and modern Browsers.
         A workaround for https://github.com/babel/babel/issues/2334
        */
        function MapProxy() {
            _classCallCheck(this, MapProxy);

            this.map = new Map();
        }

        _createClass(MapProxy, [{
            key: 'get',
            value: function get(key) {
                return this.map.get(key);
            }
        }, {
            key: 'set',
            value: function set(key, value) {
                return this.map.set(key, value);
            }
        }, {
            key: 'delete',
            value: function _delete(key) {
                return this.map.delete(key);
            }
        }, {
            key: 'clear',
            value: function clear() {
                return this.map.clear();
            }
        }, {
            key: 'has',
            value: function has(key) {
                return this.map.has(key);
            }
        }, {
            key: 'keys',
            value: function keys() {
                return this.map.keys();
            }
        }, {
            key: 'values',
            value: function values() {
                return this.map.values();
            }
        }, {
            key: 'entries',
            value: function entries() {
                return this.map.entries();
            }
        }, {
            key: 'forEach',
            value: function forEach(func) {
                this.map.forEach(func);
            }
        }, {
            key: 'size',
            get: function get() {
                return this.map.size;
            }
        }]);

        return MapProxy;
    }();

    /* Based om https://gist.github.com/cwleonard/e124d63238bda7a3cbfa */


    var Polygon = function () {
        /*
         *  This is the Polygon constructor. All points are center-relative.
         */
        function Polygon(center) {
            _classCallCheck(this, Polygon);

            this.points = new Array();
            this.center = center;
        }

        /*
         *  Point x and y values should be relative to the center.
         */


        _createClass(Polygon, [{
            key: 'addPoint',
            value: function addPoint(p) {
                this.points.push(p);
            }

            /*
             *  Point x and y values should be absolute coordinates.
             */

        }, {
            key: 'addAbsolutePoint',
            value: function addAbsolutePoint(p) {
                this.points.push({ x: p.x - this.center.x, y: p.y - this.center.y });
            }

            /*
             * Returns the number of sides. Equal to the number of vertices.
             */

        }, {
            key: 'getNumberOfSides',
            value: function getNumberOfSides() {
                return this.points.length;
            }

            /*
             * rotate the polygon by a number of radians
             */

        }, {
            key: 'rotate',
            value: function rotate(rads) {
                for (var i = 0; i < this.points.length; i++) {
                    var _x = this.points[i].x;
                    var _y = this.points[i].y;
                    this.points[i].x = Math.cos(rads) * _x - Math.sin(rads) * _y;
                    this.points[i].y = Math.sin(rads) * _x + Math.cos(rads) * _y;
                }
            }

            /*
             *  The draw function takes as a parameter a Context object from
             *  a Canvas element and draws the polygon on it.
             */

        }, {
            key: 'draw',
            value: function draw(context) {
                var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref$lineWidth = _ref.lineWidth,
                    lineWidth = _ref$lineWidth === undefined ? 2 : _ref$lineWidth,
                    _ref$stroke = _ref.stroke,
                    stroke = _ref$stroke === undefined ? '#000000' : _ref$stroke,
                    _ref$fill = _ref.fill,
                    fill = _ref$fill === undefined ? null : _ref$fill;

                context.beginPath();
                context.moveTo(this.points[0].x + this.center.x, this.points[0].y + this.center.y);
                for (var i = 1; i < this.points.length; i++) {
                    context.lineTo(this.points[i].x + this.center.x, this.points[i].y + this.center.y);
                }
                context.closePath();
                context.lineWidth = lineWidth;
                if (stroke) {
                    context.strokeStyle = stroke;
                    context.stroke();
                }
                if (fill) {
                    context.fillStyle = fill;
                    context.fill();
                }
            }
        }, {
            key: 'absolutePoints',
            value: function absolutePoints() {
                var result = new Array();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var p = _step.value;

                        result.push(Points.add(p, this.center));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return result;
            }
        }, {
            key: 'flatAbsolutePoints',
            value: function flatAbsolutePoints() {
                var result = new Array();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var p = _step2.value;

                        var a = Points.add(p, this.center);
                        result.push(a.x);
                        result.push(a.y);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return result;
            }

            /*
             *  This function returns true if the given point is inside the polygon,
             *  and false otherwise.
             */

        }, {
            key: 'containsPoint',
            value: function containsPoint(pnt) {
                var nvert = this.points.length;
                var testx = pnt.x;
                var testy = pnt.y;

                var vertx = new Array();
                for (var q = 0; q < this.points.length; q++) {
                    vertx.push(this.points[q].x + this.center.x);
                }

                var verty = new Array();
                for (var w = 0; w < this.points.length; w++) {
                    verty.push(this.points[w].y + this.center.y);
                }

                var i = void 0,
                    j = 0;
                var c = false;
                for (i = 0, j = nvert - 1; i < nvert; j = i++) {
                    if (verty[i] > testy != verty[j] > testy && testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]) c = !c;
                }
                return c;
            }
        }, {
            key: 'multiplyScalar',
            value: function multiplyScalar(scale) {
                var center = Points.multiplyScalar(this.center, scale);
                var clone = new Polygon(center);
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.points[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var p = _step3.value;

                        clone.addPoint(Points.multiplyScalar(p, scale));
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return clone;
            }

            /*
             *  To detect intersection with another Polygon object, this
             *  function uses the Separating Axis Theorem. It returns false
             *  if there is no intersection, or an object if there is. The object
             *  contains 2 fields, overlap and axis. Moving the polygon by overlap
             *  on axis will get the polygons out of intersection.
             */

        }, {
            key: 'intersectsWith',
            value: function intersectsWith(other) {
                var axis = { x: 0, y: 0 };
                var tmp = void 0,
                    minA = void 0,
                    maxA = void 0,
                    minB = void 0,
                    maxB = void 0;
                var side = void 0,
                    i = void 0;
                var smallest = null;
                var overlap = 99999999;

                /* test polygon A's sides */
                for (side = 0; side < this.getNumberOfSides(); side++) {
                    /* get the axis that we will project onto */
                    if (side == 0) {
                        axis.x = this.points[this.getNumberOfSides() - 1].y - this.points[0].y;
                        axis.y = this.points[0].x - this.points[this.getNumberOfSides() - 1].x;
                    } else {
                        axis.x = this.points[side - 1].y - this.points[side].y;
                        axis.y = this.points[side].x - this.points[side - 1].x;
                    }

                    /* normalize the axis */
                    tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
                    axis.x /= tmp;
                    axis.y /= tmp;

                    /* project polygon A onto axis to determine the min/max */
                    minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
                    for (i = 1; i < this.getNumberOfSides(); i++) {
                        tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                        if (tmp > maxA) maxA = tmp;else if (tmp < minA) minA = tmp;
                    }
                    /* correct for offset */
                    tmp = this.center.x * axis.x + this.center.y * axis.y;
                    minA += tmp;
                    maxA += tmp;

                    /* project polygon B onto axis to determine the min/max */
                    minB = maxB = other.points[0].x * axis.x + other.points[0].y * axis.y;
                    for (i = 1; i < other.getNumberOfSides(); i++) {
                        tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                        if (tmp > maxB) maxB = tmp;else if (tmp < minB) minB = tmp;
                    }
                    /* correct for offset */
                    tmp = other.center.x * axis.x + other.center.y * axis.y;
                    minB += tmp;
                    maxB += tmp;

                    /* test if lines intersect, if not, return false */
                    if (maxA < minB || minA > maxB) {
                        return false;
                    } else {
                        var o = maxA > maxB ? maxB - minA : maxA - minB;
                        if (o < overlap) {
                            overlap = o;
                            smallest = { x: axis.x, y: axis.y };
                        }
                    }
                }

                /* test polygon B's sides */
                for (side = 0; side < other.getNumberOfSides(); side++) {
                    /* get the axis that we will project onto */
                    if (side == 0) {
                        axis.x = other.points[other.getNumberOfSides() - 1].y - other.points[0].y;
                        axis.y = other.points[0].x - other.points[other.getNumberOfSides() - 1].x;
                    } else {
                        axis.x = other.points[side - 1].y - other.points[side].y;
                        axis.y = other.points[side].x - other.points[side - 1].x;
                    }

                    /* normalize the axis */
                    tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
                    axis.x /= tmp;
                    axis.y /= tmp;

                    /* project polygon A onto axis to determine the min/max */
                    minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
                    for (i = 1; i < this.getNumberOfSides(); i++) {
                        tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                        if (tmp > maxA) maxA = tmp;else if (tmp < minA) minA = tmp;
                    }
                    /* correct for offset */
                    tmp = this.center.x * axis.x + this.center.y * axis.y;
                    minA += tmp;
                    maxA += tmp;

                    /* project polygon B onto axis to determine the min/max */
                    minB = maxB = other.points[0].x * axis.x + other.points[0].y * axis.y;
                    for (i = 1; i < other.getNumberOfSides(); i++) {
                        tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                        if (tmp > maxB) maxB = tmp;else if (tmp < minB) minB = tmp;
                    }
                    /* correct for offset */
                    tmp = other.center.x * axis.x + other.center.y * axis.y;
                    minB += tmp;
                    maxB += tmp;

                    /* test if lines intersect, if not, return false */
                    if (maxA < minB || minA > maxB) {
                        return false;
                    } else {
                        var _o = maxA > maxB ? maxB - minA : maxA - minB;
                        if (_o < overlap) {
                            overlap = _o;
                            smallest = { x: axis.x, y: axis.y };
                        }
                    }
                }
                return { overlap: overlap + 0.001, axis: smallest };
            }
        }], [{
            key: 'fromPoints',
            value: function fromPoints(points) {
                var min = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
                var max = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var p = _step4.value;

                        min.x = Math.min(p.x, min.x);
                        max.x = Math.max(p.x, max.x);
                        min.y = Math.min(p.y, min.y);
                        max.y = Math.max(p.y, max.y);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var center = Points.mean(min, max);
                var polygon = new Polygon(center);
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = points[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _p = _step5.value;

                        polygon.addAbsolutePoint(_p);
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                return polygon;
            }
        }]);

        return Polygon;
    }();

    var Events = function () {
        function Events() {
            _classCallCheck(this, Events);
        }

        _createClass(Events, null, [{
            key: 'stop',
            value: function stop(event) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, {
            key: 'extractPoint',
            value: function extractPoint(event) {
                switch (event.constructor.name) {
                    case 'TouchEvent':
                        for (var i = 0; i < event.targetTouches.length; i++) {
                            var t = event.targetTouches[i];
                            return { x: t.clientX, y: t.clientY };
                        }
                        break;
                    default:
                        return { x: event.clientX, y: event.clientY };
                }
            }
        }, {
            key: 'isMouseDown',
            value: function isMouseDown(event) {
                // Attempts to clone the which attribute of events failed in WebKit. May
                // be this is a bug or a security feature. Workaround: we introduce
                // a mouseDownSubstitute attribute that can be assigned to cloned
                // events after instantiation.
                if (Reflect.has(event, 'mouseDownSubstitute')) return event.mouseDownSubstitute;
                return event.buttons || event.which;
            }
        }, {
            key: 'extractTouches',
            value: function extractTouches(targets) {
                var touches = [];
                for (var i = 0; i < targets.length; i++) {
                    var t = targets[i];
                    touches.push({
                        targetSelector: this.selector(t.target),
                        identifier: t.identifier,
                        screenX: t.screenX,
                        screenY: t.screenY,
                        clientX: t.clientX,
                        clientY: t.clientY,
                        pageX: t.pageX,
                        pageY: t.pageY
                    });
                }
                return touches;
            }
        }, {
            key: 'createTouchList',
            value: function createTouchList(targets) {
                var touches = [];
                for (var i = 0; i < targets.length; i++) {
                    var t = targets[i];
                    var touchTarget = document.elementFromPoint(t.pageX, t.pageY);
                    var touch = new Touch(undefined, touchTarget, t.identifier, t.pageX, t.pageY, t.screenX, t.screenY);
                    touches.push(touch);
                }
                return new (Function.prototype.bind.apply(TouchList, [null].concat(touches)))();
            }
        }, {
            key: 'extractEvent',
            value: function extractEvent(timestamp, event) {
                var targetSelector = this.selector(event.target);
                var infos = { type: event.type,
                    time: timestamp,
                    constructor: event.constructor,
                    data: {
                        targetSelector: targetSelector,
                        view: event.view,
                        mouseDownSubstitute: event.buttons || event.which, // which cannot be cloned directly
                        bubbles: event.bubbles,
                        cancelable: event.cancelable,
                        screenX: event.screenX,
                        screenY: event.screenY,
                        clientX: event.clientX,
                        clientY: event.clientY,
                        layerX: event.layerX,
                        layerY: event.layerY,
                        pageX: event.pageX,
                        pageY: event.pageY,
                        ctrlKey: event.ctrlKey,
                        altKey: event.altKey,
                        shiftKey: event.shiftKey,
                        metaKey: event.metaKey }
                };
                if (event.type.startsWith('touch')) {
                    // On Safari-WebKit the TouchEvent has layerX, layerY coordinates
                    var _data = infos.data;
                    _data.targetTouches = this.extractTouches(event.targetTouches);
                    _data.changedTouches = this.extractTouches(event.changedTouches);
                    _data.touches = this.extractTouches(event.touches);
                }
                if (Events.debug) {
                    Events.extracted.push(this.toLine(event));
                }
                return infos;
            }
        }, {
            key: 'cloneEvent',
            value: function cloneEvent(type, constructor, data) {
                if (type.startsWith('touch')) {
                    // We need to find target from layerX, layerY
                    //var target = document.querySelector(data.targetSelector)
                    // elementFromPoint(data.layerX, data.layerY)
                    //data.target = target
                    data.targetTouches = this.createTouchList(data.targetTouches);
                    data.changedTouches = this.createTouchList(data.changedTouches);
                    data.touches = this.createTouchList(data.touches);
                }
                // We need to find target from pageX, pageY which are only
                // available after construction. They seem to getter items.

                var clone = Reflect.construct(constructor, [type, data]);
                clone.mouseDownSubstitute = data.mouseDownSubstitute;
                return clone;
            }
        }, {
            key: 'simulateEvent',
            value: function simulateEvent(type, constructor, data) {
                data.target = document.querySelector(data.targetSelector);
                var clone = this.cloneEvent(type, constructor, data);
                if (data.target != null) {
                    data.target.dispatchEvent(clone);
                }
                if (Events.debug) {
                    Events.simulated.push(this.toLine(clone));
                }
            }
        }, {
            key: 'toLine',
            value: function toLine(event) {
                return event.type + ' #' + event.target.id + ' ' + event.clientX + ' ' + event.clientY;
                var result = event.type;
                var selector = this.selector(event.target);
                result += ' selector: ' + selector;
                if (event.target != document.querySelector(selector)) console.log('Cannot resolve', selector);
                var keys = ['layerX', 'layerY', 'pageX', 'pageY', 'clientX', 'clientY'];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = keys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var key = _step6.value;

                        try {
                            result += ' ' + key + ':' + event[key];
                        } catch (e) {
                            console.log('Invalid key: ' + key);
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                return result;
            }
        }, {
            key: 'compareExtractedWithSimulated',
            value: function compareExtractedWithSimulated() {
                if (this.extracted.length != this.simulated.length) {
                    alert('Unequal length of extracted [' + this.extracted.length + '] and simulated events [' + this.simulated.length + '].');
                } else {
                    for (var i = 0; i < this.extracted.length; i++) {
                        var extracted = this.extracted[i];
                        var simulated = this.simulated[i];
                        if (extracted != simulated) {
                            console.log('Events differ:' + extracted + '|' + simulated);
                        }
                    }
                }
            }
        }, {
            key: 'selector',
            value: function selector(context) {
                return OptimalSelect.select(context);
            }
        }, {
            key: 'reset',
            value: function reset() {
                this.extracted = [];
                this.simulated = [];
            }
        }, {
            key: 'resetSimulated',
            value: function resetSimulated() {
                this.simulated = [];
            }
        }, {
            key: 'showExtractedEvents',
            value: function showExtractedEvents(event) {
                if (!event.shiftKey) {
                    return;
                }
                if (this.popup == null) {
                    var element = document.createElement('div');
                    Elements.setStyle(element, { position: 'absolute',
                        width: '480px',
                        height: '640px',
                        overflow: 'auto',
                        backgroundColor: 'lightgray' });
                    document.body.appendChild(element);
                    this.popup = element;
                }
                this.popup.innerHTML = '';
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.extracted[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var line = _step7.value;

                        var _div = document.createElement('div');
                        _div.innerHTML = line;
                        this.popup.appendChild(_div);
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                var div = document.createElement('div');
                div.innerHTML = '------------ Simulated -----------';
                this.popup.appendChild(div);
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.simulated[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var _line = _step8.value;

                        var _div2 = document.createElement('div');
                        _div2.innerHTML = _line;
                        this.popup.appendChild(_div2);
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                Elements.setStyle(this.popup, { left: event.clientX + 'px', top: event.clientY + 'px' });
            }
        }]);

        return Events;
    }();

    Events.popup = null;

    Events.debug = true;
    Events.extracted = [];
    Events.simulated = [];

    // In order to test this interface implementation run jsc interface.js

    var Interface = function () {
        function Interface() {
            _classCallCheck(this, Interface);
        }

        _createClass(Interface, null, [{
            key: 'implementationError',

            // Abstract interface that should be extended in interface subclasses.
            // By convention all interfaces should start with an upper 'I'

            value: function implementationError(klass) {
                var interfaceKeys = Reflect.ownKeys(this.prototype);
                var classKeys = Reflect.ownKeys(klass.prototype);
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = interfaceKeys[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var key = _step9.value;

                        var interfaceDesc = this.prototype[key];
                        var classDesc = klass.prototype[key];
                        if (typeof classDesc == 'undefined') return 'Missing ' + key;
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                return null;
            }
        }, {
            key: 'implementedBy',
            value: function implementedBy(klass) {
                // In the first step only checks whether the methods of this
                // interface are all implemented by the given class
                var error = this.implementationError(klass);
                return error == null;
            }

            // TODO: Specify optional methods
            //     static optionalMethods() {
            //         return [this.onMouseWheel]
            //     }

        }]);

        return Interface;
    }();

    /** Interaction patterns
         See interaction.html for explanation
    */

    var IInteractionTarget = function (_Interface) {
        _inherits(IInteractionTarget, _Interface);

        function IInteractionTarget() {
            _classCallCheck(this, IInteractionTarget);

            return _possibleConstructorReturn(this, (IInteractionTarget.__proto__ || Object.getPrototypeOf(IInteractionTarget)).apply(this, arguments));
        }

        _createClass(IInteractionTarget, [{
            key: 'capture',
            value: function capture(event) {
                return _typeof(true);
            }
        }, {
            key: 'onStart',
            value: function onStart(event, interaction) {}
        }, {
            key: 'onMove',
            value: function onMove(event, interaction) {}
        }, {
            key: 'onEnd',
            value: function onEnd(event, interaction) {}
        }, {
            key: 'onMouseWheel',
            value: function onMouseWheel(event) {}
        }]);

        return IInteractionTarget;
    }(Interface);

    var IInteractionMapperTarget = function (_Interface2) {
        _inherits(IInteractionMapperTarget, _Interface2);

        function IInteractionMapperTarget() {
            _classCallCheck(this, IInteractionMapperTarget);

            return _possibleConstructorReturn(this, (IInteractionMapperTarget.__proto__ || Object.getPrototypeOf(IInteractionMapperTarget)).apply(this, arguments));
        }

        _createClass(IInteractionMapperTarget, [{
            key: 'capture',
            value: function capture(event) {
                return _typeof(true);
            }
        }, {
            key: 'findTarget',
            value: function findTarget(event, local, global) {
                return IInteractionTarget;
            }
        }]);

        return IInteractionMapperTarget;
    }(Interface);

    var PointMap = function (_MapProxy) {
        _inherits(PointMap, _MapProxy);

        // Collects touch points, mouse coordinates, etc. as key value pairs.
        // Keys are pointer and touch ids, the special "mouse" key.
        // Values are points, i.e. all objects with numeric x and y properties.
        function PointMap() {
            var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, PointMap);

            var _this3 = _possibleConstructorReturn(this, (PointMap.__proto__ || Object.getPrototypeOf(PointMap)).call(this));

            for (var key in points) {
                _this3.set(key, points[key]);
            }
            return _this3;
        }

        _createClass(PointMap, [{
            key: 'toString',
            value: function toString() {
                var points = [];
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = this.keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var key = _step10.value;

                        var value = this.get(key);
                        points.push(key + ':{x:' + value.x + ', y:' + value.y + '}');
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                var attrs = points.join(', ');
                return '[PointMap ' + attrs + ']';
            }
        }, {
            key: 'clone',
            value: function clone() {
                var result = new PointMap();
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = this.keys()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var key = _step11.value;

                        var value = this.get(key);
                        result.set(key, { x: value.x, y: value.y });
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                return result;
            }
        }, {
            key: 'farthests',
            value: function farthests() {
                if (this.size == 0) {
                    return null;
                }
                var pairs = [];
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = this.values()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var p = _step12.value;
                        var _iteratorNormalCompletion13 = true;
                        var _didIteratorError13 = false;
                        var _iteratorError13 = undefined;

                        try {
                            for (var _iterator13 = this.values()[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                                var q = _step13.value;

                                pairs.push([p, q]);
                            }
                        } catch (err) {
                            _didIteratorError13 = true;
                            _iteratorError13 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                    _iterator13.return();
                                }
                            } finally {
                                if (_didIteratorError13) {
                                    throw _iteratorError13;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }
                    } finally {
                        if (_didIteratorError12) {
                            throw _iteratorError12;
                        }
                    }
                }

                var sorted = pairs.sort(function (a, b) {
                    return Points.distance(b[0], b[1]) - Points.distance(a[0], a[1]);
                });
                return sorted[0];
            }
        }, {
            key: 'mean',
            value: function mean() {
                if (this.size == 0) {
                    return null;
                }
                var x = 0.0,
                    y = 0.0;
                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = this.values()[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var p = _step14.value;

                        x += p.x;
                        y += p.y;
                    }
                } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }
                    } finally {
                        if (_didIteratorError14) {
                            throw _iteratorError14;
                        }
                    }
                }

                return { x: x / this.size, y: y / this.size };
            }
        }]);

        return PointMap;
    }(MapProxy);

    var InteractionDelta = function () {
        function InteractionDelta(x, y, zoom, rotate, about) {
            _classCallCheck(this, InteractionDelta);

            this.x = x;
            this.y = y;
            this.zoom = zoom;
            this.rotate = rotate;
            this.about = about;
        }

        _createClass(InteractionDelta, [{
            key: 'toString',
            value: function toString() {
                var values = [];
                var _iteratorNormalCompletion15 = true;
                var _didIteratorError15 = false;
                var _iteratorError15 = undefined;

                try {
                    for (var _iterator15 = Object.keys(this)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                        var key = _step15.value;

                        var value = this[key];
                        if (key == 'about') {
                            values.push(key + ':{x:' + value.x + ', y:' + value.y + '}');
                        } else {
                            values.push(key + ':' + value);
                        }
                    }
                } catch (err) {
                    _didIteratorError15 = true;
                    _iteratorError15 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion15 && _iterator15.return) {
                            _iterator15.return();
                        }
                    } finally {
                        if (_didIteratorError15) {
                            throw _iteratorError15;
                        }
                    }
                }

                var attrs = values.join(', ');
                return '[InteractionDelta ' + attrs + ']';
            }
        }]);

        return InteractionDelta;
    }();

    var InteractionPoints = function () {
        function InteractionPoints() {
            var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            _classCallCheck(this, InteractionPoints);

            this.parent = parent;
            this.current = new PointMap();
            this.previous = new PointMap();
            this.start = new PointMap();
            this.ended = new PointMap();
            this.timestamps = new Map();
        }

        _createClass(InteractionPoints, [{
            key: 'moved',
            value: function moved(key) {
                var current = this.current.get(key);
                var previous = this.previous.get(key);
                return Points.subtract(current, previous);
            }
        }, {
            key: 'move',
            value: function move() {
                var current = this.current.mean();
                var previous = this.previous.mean();
                return Points.subtract(current, previous);
            }
        }, {
            key: 'delta',
            value: function delta() {
                var current = [];
                var previous = [];
                var _iteratorNormalCompletion16 = true;
                var _didIteratorError16 = false;
                var _iteratorError16 = undefined;

                try {
                    for (var _iterator16 = this.current.keys()[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                        var key = _step16.value;

                        var c = this.current.get(key);
                        if (this.previous.has(key)) {
                            var p = this.previous.get(key);
                            current.push(c);
                            previous.push(p);
                        }
                    }
                } catch (err) {
                    _didIteratorError16 = true;
                    _iteratorError16 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion16 && _iterator16.return) {
                            _iterator16.return();
                        }
                    } finally {
                        if (_didIteratorError16) {
                            throw _iteratorError16;
                        }
                    }
                }

                if (current.length >= 2) {
                    if (current.length > 2) {
                        current = this.current.farthests();
                        previous = this.previous.farthests();
                    }
                    var c1 = current[0];
                    var c2 = current[1];

                    var p1 = previous[0];
                    var p2 = previous[1];

                    var cm = Points.mean(c1, c2);
                    var pm = Points.mean(p1, p2);

                    var delta = Points.subtract(cm, pm);
                    var zoom = 1.0;
                    var distance1 = Points.distance(p1, p2);
                    var distance2 = Points.distance(c1, c2);
                    if (distance1 != 0 && distance2 != 0) {
                        zoom = distance2 / distance1;
                    }
                    var angle1 = Points.angle(c2, c1);
                    var angle2 = Points.angle(p2, p1);
                    var alpha = Angle.diff(angle1, angle2);
                    return new InteractionDelta(delta.x, delta.y, zoom, alpha, cm);
                } else if (current.length == 1) {
                    var _delta = Points.subtract(current[0], previous[0]);
                    return new InteractionDelta(_delta.x, _delta.y, 1.0, 0.0, current[0]);
                }
                return null;
            }
        }, {
            key: 'update',
            value: function update(key, point) {
                // Returns true iff the key is new
                this.current.set(key, point);
                if (!this.start.has(key)) {
                    this.start.set(key, point);
                    this.previous.set(key, point);
                    this.timestamps.set(key, performance.now());
                    return true;
                }
                return false;
            }
        }, {
            key: 'updatePrevious',
            value: function updatePrevious() {
                var _iteratorNormalCompletion17 = true;
                var _didIteratorError17 = false;
                var _iteratorError17 = undefined;

                try {
                    for (var _iterator17 = this.current.keys()[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                        var key = _step17.value;

                        this.previous.set(key, this.current.get(key));
                    }
                } catch (err) {
                    _didIteratorError17 = true;
                    _iteratorError17 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion17 && _iterator17.return) {
                            _iterator17.return();
                        }
                    } finally {
                        if (_didIteratorError17) {
                            throw _iteratorError17;
                        }
                    }
                }
            }
        }, {
            key: 'stop',
            value: function stop(key, point) {
                if (this.current.has(key)) {
                    this.current.delete(key);
                    this.previous.delete(key);
                    this.ended.set(key, point);
                }
            }
        }, {
            key: 'finish',
            value: function finish(key, point) {
                this.current.delete(key);
                this.previous.delete(key);
                this.start.delete(key);
                this.timestamps.delete(key);
                this.ended.delete(key);
            }
        }, {
            key: 'isFinished',
            value: function isFinished() {
                return this.current.size == 0;
            }
        }, {
            key: 'isNoLongerTwoFinger',
            value: function isNoLongerTwoFinger() {
                return this.previous.size > 1 && this.current.size < 2;
            }
        }, {
            key: 'isTap',
            value: function isTap(key) {
                return this.parent.isTap(key);
            }
        }, {
            key: 'isLongPress',
            value: function isLongPress(key) {
                return this.parent.isLongPress(key);
            }
        }]);

        return InteractionPoints;
    }();

    var Interaction = function (_InteractionPoints) {
        _inherits(Interaction, _InteractionPoints);

        function Interaction() {
            var tapDistance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
            var longPressTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500.0;

            _classCallCheck(this, Interaction);

            var _this4 = _possibleConstructorReturn(this, (Interaction.__proto__ || Object.getPrototypeOf(Interaction)).call(this));

            _this4.tapDistance = tapDistance;
            _this4.longPressTime = longPressTime;
            _this4.targets = new Map();
            _this4.subInteractions = new Map(); // target:Object : InteractionPoints
            return _this4;
        }

        _createClass(Interaction, [{
            key: 'stop',
            value: function stop(key, point) {
                _get(Interaction.prototype.__proto__ || Object.getPrototypeOf(Interaction.prototype), 'stop', this).call(this, key, point);
                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                    for (var _iterator18 = this.subInteractions.values()[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                        var points = _step18.value;

                        points.stop(key, point);
                    }
                } catch (err) {
                    _didIteratorError18 = true;
                    _iteratorError18 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
                            _iterator18.return();
                        }
                    } finally {
                        if (_didIteratorError18) {
                            throw _iteratorError18;
                        }
                    }
                }
            }
        }, {
            key: 'addTarget',
            value: function addTarget(key, target) {
                this.targets.set(key, target);
                this.subInteractions.set(target, new InteractionPoints(this));
            }
        }, {
            key: 'removeTarget',
            value: function removeTarget(key) {
                var target = this.targets.get(key);
                this.targets.delete(key);
                // Only remove target if no keys are refering to the target
                var remove = true;
                var _iteratorNormalCompletion19 = true;
                var _didIteratorError19 = false;
                var _iteratorError19 = undefined;

                try {
                    for (var _iterator19 = this.targets.values()[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                        var t = _step19.value;

                        if (target === t) {
                            remove = false;
                        }
                    }
                } catch (err) {
                    _didIteratorError19 = true;
                    _iteratorError19 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
                            _iterator19.return();
                        }
                    } finally {
                        if (_didIteratorError19) {
                            throw _iteratorError19;
                        }
                    }
                }

                if (remove) {
                    this.subInteractions.delete(target);
                }
            }
        }, {
            key: 'finish',
            value: function finish(key, point) {
                _get(Interaction.prototype.__proto__ || Object.getPrototypeOf(Interaction.prototype), 'finish', this).call(this, key, point);
                this.removeTarget(key);
            }
        }, {
            key: 'mapInteraction',
            value: function mapInteraction(points, aspects, mappingFunc) {
                // Map centrally registered points to target interactions
                // Returns an array of [target, updated subInteraction] pairs
                var result = new Map();
                for (var key in points) {
                    if (this.targets.has(key)) {
                        var target = this.targets.get(key);
                        if (this.subInteractions.has(target)) {
                            var interaction = this.subInteractions.get(target);
                            var _iteratorNormalCompletion20 = true;
                            var _didIteratorError20 = false;
                            var _iteratorError20 = undefined;

                            try {
                                for (var _iterator20 = aspects[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                                    var aspect = _step20.value;

                                    var pointMap = this[aspect];
                                    var point = pointMap.get(key);
                                    var mapped = mappingFunc(point);
                                    interaction[aspect].set(key, mapped);
                                }
                            } catch (err) {
                                _didIteratorError20 = true;
                                _iteratorError20 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion20 && _iterator20.return) {
                                        _iterator20.return();
                                    }
                                } finally {
                                    if (_didIteratorError20) {
                                        throw _iteratorError20;
                                    }
                                }
                            }

                            result.set(target, interaction);
                        }
                    }
                }
                return result;
            }
        }, {
            key: 'isTap',
            value: function isTap(key) {
                var ended = this.ended.get(key);
                var start = this.start.get(key);
                if (start && ended && Points.distance(ended, start) < this.tapDistance) {
                    var t1 = this.timestamps.get(key);
                    var tookLong = performance.now() > t1 + this.longPressTime;
                    if (tookLong) {
                        return false;
                    }
                    return true;
                }
                return false;
            }
        }, {
            key: 'isAnyTap',
            value: function isAnyTap() {
                var _iteratorNormalCompletion21 = true;
                var _didIteratorError21 = false;
                var _iteratorError21 = undefined;

                try {
                    for (var _iterator21 = this.ended.keys()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                        var key = _step21.value;

                        if (this.isTap(key)) return true;
                    }
                } catch (err) {
                    _didIteratorError21 = true;
                    _iteratorError21 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion21 && _iterator21.return) {
                            _iterator21.return();
                        }
                    } finally {
                        if (_didIteratorError21) {
                            throw _iteratorError21;
                        }
                    }
                }

                return false;
            }
        }, {
            key: 'isLongPress',
            value: function isLongPress(key) {
                var ended = this.ended.get(key);
                var start = this.start.get(key);
                if (start && ended && Points.distance(ended, start) < this.tapDistance) {
                    var t1 = this.timestamps.get(key);
                    var tookLong = performance.now() > t1 + this.longPressTime;
                    if (tookLong) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }, {
            key: 'isAnyLongPress',
            value: function isAnyLongPress() {
                var _iteratorNormalCompletion22 = true;
                var _didIteratorError22 = false;
                var _iteratorError22 = undefined;

                try {
                    for (var _iterator22 = this.ended.keys()[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                        var key = _step22.value;

                        if (this.isLongPress(key)) return true;
                    }
                } catch (err) {
                    _didIteratorError22 = true;
                    _iteratorError22 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion22 && _iterator22.return) {
                            _iterator22.return();
                        }
                    } finally {
                        if (_didIteratorError22) {
                            throw _iteratorError22;
                        }
                    }
                }

                return false;
            }
        }, {
            key: 'isStylus',
            value: function isStylus(key) {
                return key === 'stylus';
            }
        }]);

        return Interaction;
    }(InteractionPoints);

    var InteractionDelegate = function () {
        // Long press: http://stackoverflow.com/questions/1930895/how-long-is-the-event-onlongpress-in-the-android
        // Stylus support: https://w3c.github.io/touch-events/

        function InteractionDelegate(element, target) {
            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$mouseWheelEleme = _ref2.mouseWheelElement,
                mouseWheelElement = _ref2$mouseWheelEleme === undefined ? null : _ref2$mouseWheelEleme,
                _ref2$debug = _ref2.debug,
                debug = _ref2$debug === undefined ? false : _ref2$debug;

            _classCallCheck(this, InteractionDelegate);

            this.debug = debug;
            this.interaction = new Interaction();
            this.element = element;
            this.mouseWheelElement = mouseWheelElement || element;
            this.target = target;
            this.setupInteraction();
        }

        _createClass(InteractionDelegate, [{
            key: 'setupInteraction',
            value: function setupInteraction() {
                if (this.debug) {
                    var error = this.targetInterface.implementationError(this.target.constructor);
                    if (error != null) {
                        throw new Error('Expected IInteractionTarget: ' + error);
                    }
                }
                this.setupTouchInteraction();
                this.setupMouseWheelInteraction();
            }
        }, {
            key: 'setupTouchInteraction',
            value: function setupTouchInteraction() {
                var _this5 = this;

                var element = this.element;
                var useCapture = true;
                if (window.PointerEvent) {
                    if (this.debug) console.log('Pointer API' + window.PointerEvent);
                    element.addEventListener('pointerdown', function (e) {
                        if (_this5.debug) console.log('pointerdown', e.pointerId);
                        if (_this5.capture(e)) {
                            element.setPointerCapture(e.pointerId);
                            _this5.onStart(e);
                        }
                    }, useCapture);
                    element.addEventListener('pointermove', function (e) {
                        if (_this5.debug) console.log('pointermove', e.pointerId);
                        if (e.pointerType == 'touch' || e.pointerType == 'mouse' && Events.isMouseDown(e)) {
                            // this.capture(e) &&
                            if (_this5.debug) console.log('pointermove captured', e.pointerId);
                            _this5.onMove(e);
                        }
                    }, useCapture);
                    element.addEventListener('pointerup', function (e) {
                        if (_this5.debug) console.log('pointerup');
                        _this5.onEnd(e);
                        element.releasePointerCapture(e.pointerId);
                    }, useCapture);
                    element.addEventListener('pointercancel', function (e) {
                        if (_this5.debug) console.log('pointercancel');
                        _this5.onEnd(e);
                        element.releasePointerCapture(e.pointerId);
                    }, useCapture);
                    element.addEventListener('pointerleave', function (e) {
                        if (_this5.debug) console.log('pointerleave');
                        if (e.target == element) _this5.onEnd(e);
                    }, useCapture);
                } else if (window.TouchEvent) {
                    if (this.debug) console.log('Touch API');
                    element.addEventListener('touchstart', function (e) {
                        if (_this5.debug) console.log('touchstart', _this5.touchPoints(e));
                        if (_this5.capture(e)) {
                            var _iteratorNormalCompletion23 = true;
                            var _didIteratorError23 = false;
                            var _iteratorError23 = undefined;

                            try {
                                for (var _iterator23 = e.changedTouches[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                                    var touch = _step23.value;

                                    _this5.onStart(touch);
                                }
                            } catch (err) {
                                _didIteratorError23 = true;
                                _iteratorError23 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion23 && _iterator23.return) {
                                        _iterator23.return();
                                    }
                                } finally {
                                    if (_didIteratorError23) {
                                        throw _iteratorError23;
                                    }
                                }
                            }
                        }
                    }, useCapture);
                    element.addEventListener('touchmove', function (e) {
                        if (_this5.debug) console.log('touchmove', _this5.touchPoints(e), e);
                        var _iteratorNormalCompletion24 = true;
                        var _didIteratorError24 = false;
                        var _iteratorError24 = undefined;

                        try {
                            for (var _iterator24 = e.changedTouches[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                                var touch = _step24.value;

                                _this5.onMove(touch);
                            }
                        } catch (err) {
                            _didIteratorError24 = true;
                            _iteratorError24 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion24 && _iterator24.return) {
                                    _iterator24.return();
                                }
                            } finally {
                                if (_didIteratorError24) {
                                    throw _iteratorError24;
                                }
                            }
                        }

                        var _iteratorNormalCompletion25 = true;
                        var _didIteratorError25 = false;
                        var _iteratorError25 = undefined;

                        try {
                            for (var _iterator25 = e.targetTouches[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                                var _touch = _step25.value;

                                _this5.onMove(_touch);
                            }
                        } catch (err) {
                            _didIteratorError25 = true;
                            _iteratorError25 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion25 && _iterator25.return) {
                                    _iterator25.return();
                                }
                            } finally {
                                if (_didIteratorError25) {
                                    throw _iteratorError25;
                                }
                            }
                        }
                    }, useCapture);
                    element.addEventListener('touchend', function (e) {
                        if (_this5.debug) console.log('touchend', _this5.touchPoints(e));
                        var _iteratorNormalCompletion26 = true;
                        var _didIteratorError26 = false;
                        var _iteratorError26 = undefined;

                        try {
                            for (var _iterator26 = e.changedTouches[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                                var touch = _step26.value;

                                _this5.onEnd(touch);
                            }
                        } catch (err) {
                            _didIteratorError26 = true;
                            _iteratorError26 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion26 && _iterator26.return) {
                                    _iterator26.return();
                                }
                            } finally {
                                if (_didIteratorError26) {
                                    throw _iteratorError26;
                                }
                            }
                        }
                    }, useCapture);
                    element.addEventListener('touchcancel', function (e) {
                        if (_this5.debug) console.log('touchcancel', e.targetTouches.length, e.changedTouches.length);
                        var _iteratorNormalCompletion27 = true;
                        var _didIteratorError27 = false;
                        var _iteratorError27 = undefined;

                        try {
                            for (var _iterator27 = e.changedTouches[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                                var touch = _step27.value;

                                _this5.onEnd(touch);
                            }
                        } catch (err) {
                            _didIteratorError27 = true;
                            _iteratorError27 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion27 && _iterator27.return) {
                                    _iterator27.return();
                                }
                            } finally {
                                if (_didIteratorError27) {
                                    throw _iteratorError27;
                                }
                            }
                        }
                    }, useCapture);
                } else {
                    if (this.debug) console.log('Mouse API');

                    element.addEventListener('mousedown', function (e) {
                        if (_this5.debug) console.log('mousedown', e);
                        if (_this5.capture(e)) _this5.onStart(e);
                    }, useCapture);
                    element.addEventListener('mousemove', function (e) {
                        // Dow we only use move events if the mouse is down?
                        // HOver effects have to be implemented by other means
                        // && Events.isMouseDown(e))

                        if (Events.isMouseDown(e)) if (_this5.debug)
                            // this.capture(e) &&
                            console.log('mousemove', e);
                        _this5.onMove(e);
                    }, useCapture);
                    element.addEventListener('mouseup', function (e) {
                        if (_this5.debug) console.log('mouseup', e);
                        _this5.onEnd(e);
                    }, true);
                    element.addEventListener('mouseout', function (e) {
                        if (e.target == element) _this5.onEnd(e);
                    }, useCapture);
                }
            }
        }, {
            key: 'touchPoints',
            value: function touchPoints(event) {
                var result = [];
                var _iteratorNormalCompletion28 = true;
                var _didIteratorError28 = false;
                var _iteratorError28 = undefined;

                try {
                    for (var _iterator28 = event.changedTouches[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                        var touch = _step28.value;

                        result.push(this.extractPoint(touch));
                    }
                } catch (err) {
                    _didIteratorError28 = true;
                    _iteratorError28 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion28 && _iterator28.return) {
                            _iterator28.return();
                        }
                    } finally {
                        if (_didIteratorError28) {
                            throw _iteratorError28;
                        }
                    }
                }

                return result;
            }
        }, {
            key: 'setupMouseWheelInteraction',
            value: function setupMouseWheelInteraction() {
                this.mouseWheelElement.addEventListener('mousewheel', this.onMouseWheel.bind(this), true);
                this.mouseWheelElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), true);
            }
        }, {
            key: 'onMouseWheel',
            value: function onMouseWheel(event) {
                if (this.capture(event) && this.target.onMouseWheel) {
                    this.target.onMouseWheel(event);
                }
            }
        }, {
            key: 'onStart',
            value: function onStart(event) {
                var extracted = this.extractPoint(event);
                this.updateInteraction(event, extracted);
                this.target.onStart(event, this.interaction);
            }
        }, {
            key: 'onMove',
            value: function onMove(event) {
                var extracted = this.extractPoint(event, 'all');
                this.updateInteraction(event, extracted);
                this.target.onMove(event, this.interaction);
                this.interaction.updatePrevious();
            }
        }, {
            key: 'onEnd',
            value: function onEnd(event) {
                var extracted = this.extractPoint(event, 'changedTouches');
                this.endInteraction(event, extracted);
                this.target.onEnd(event, this.interaction);
                this.finishInteraction(event, extracted);
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                var captured = this.target.capture(event);
                return captured;
            }
        }, {
            key: 'getPosition',
            value: function getPosition(event) {
                return { x: event.clientX, y: event.clientY };
            }
        }, {
            key: 'extractPoint',
            value: function extractPoint(event) {
                var touchEventKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';

                // 'targetTouches'
                var result = {};
                switch (event.constructor.name) {
                    case 'MouseEvent':
                        var buttons = event.buttons || event.which;
                        if (buttons) result['mouse'] = this.getPosition(event);
                        break;
                    case 'PointerEvent':
                        result[event.pointerId.toString()] = this.getPosition(event);
                        break;
                    case 'Touch':
                        var id = event.touchType === 'stylus' ? 'stylus' : event.identifier.toString();
                        result[id] = this.getPosition(event);
                        break;
                    //             case 'TouchEvent':
                    //                 // Needs to be observed: Perhaps changedTouches are all we need. If so
                    //                 // we can remove the touchEventKey default parameter
                    //                 if (touchEventKey == 'all') {
                    //                     for(let t of event.targetTouches) {
                    //                         result[t.identifier.toString()] = this.getPosition(t)
                    //                     }
                    //                     for(let t of event.changedTouches) {
                    //                         result[t.identifier.toString()] = this.getPosition(t)
                    //                     }
                    //                 }
                    //                 else {
                    //                     for(let t of event.changedTouches) {
                    //                         result[t.identifier.toString()] = this.getPosition(t)
                    //                     }
                    //                 }
                    //                 break
                    default:
                        break;
                }
                return result;
            }
        }, {
            key: 'interactionStarted',
            value: function interactionStarted(event, key, point) {
                // Callback: can be overwritten
            }
        }, {
            key: 'interactionEnded',
            value: function interactionEnded(event, key, point) {
                // Callback: can be overwritten
            }
        }, {
            key: 'interactionFinished',
            value: function interactionFinished(event, key, point) {}
        }, {
            key: 'updateInteraction',
            value: function updateInteraction(event, extracted) {
                for (var key in extracted) {
                    var point = extracted[key];
                    if (this.interaction.update(key, point)) {
                        this.interactionStarted(event, key, point);
                    }
                }
            }
        }, {
            key: 'endInteraction',
            value: function endInteraction(event, ended) {
                for (var key in ended) {
                    var point = ended[key];
                    this.interaction.stop(key, point);
                    this.interactionEnded(event, key, point);
                }
            }
        }, {
            key: 'finishInteraction',
            value: function finishInteraction(event, ended) {
                for (var key in ended) {
                    var point = ended[key];
                    this.interaction.finish(key, point);
                    this.interactionFinished(event, key, point);
                }
            }
        }, {
            key: 'targetInterface',
            get: function get() {
                return IInteractionTarget;
            }
        }]);

        return InteractionDelegate;
    }();

    var InteractionMapper = function (_InteractionDelegate) {
        _inherits(InteractionMapper, _InteractionDelegate);

        /* A special InteractionDelegate that maps events to specific parts of
        the interaction target. The InteractionTarget must implement a findTarget
        method that returns an object implementing the IInteractionTarget interface.
         If the InteractionTarget also implements a mapPositionToPoint method this
        is used to map the points to the local coordinate space of the the target.
         This makes it easier to lookup elements and relate events to local
        positions.
        */

        function InteractionMapper(element, target) {
            var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref3$tapDistance = _ref3.tapDistance,
                tapDistance = _ref3$tapDistance === undefined ? 10 : _ref3$tapDistance,
                _ref3$longPressTime = _ref3.longPressTime,
                longPressTime = _ref3$longPressTime === undefined ? 500.0 : _ref3$longPressTime,
                _ref3$mouseWheelEleme = _ref3.mouseWheelElement,
                mouseWheelElement = _ref3$mouseWheelEleme === undefined ? null : _ref3$mouseWheelEleme;

            _classCallCheck(this, InteractionMapper);

            return _possibleConstructorReturn(this, (InteractionMapper.__proto__ || Object.getPrototypeOf(InteractionMapper)).call(this, element, target, { tapDistance: tapDistance, longPressTime: longPressTime, mouseWheelElement: mouseWheelElement }));
        }

        _createClass(InteractionMapper, [{
            key: 'mapPositionToPoint',
            value: function mapPositionToPoint(point) {
                if (this.target.mapPositionToPoint) {
                    return this.target.mapPositionToPoint(point);
                }
                return point;
            }
        }, {
            key: 'interactionStarted',
            value: function interactionStarted(event, key, point) {
                if (this.target.findTarget) {
                    var local = this.mapPositionToPoint(point);
                    var found = this.target.findTarget(event, local, point);
                    if (found != null) {
                        this.interaction.addTarget(key, found);
                    }
                }
            }
        }, {
            key: 'onMouseWheel',
            value: function onMouseWheel(event) {
                if (this.capture(event)) {
                    if (this.target.findTarget) {
                        var point = this.getPosition(event);
                        var local = this.mapPositionToPoint(point);
                        var found = this.target.findTarget(event, local, point);
                        if (found != null && found.onMouseWheel) {
                            found.onMouseWheel(event);
                            return;
                        }
                    }
                    if (this.target.onMouseWheel) {
                        this.target.onMouseWheel(event);
                    }
                }
            }
        }, {
            key: 'onStart',
            value: function onStart(event) {
                var extracted = this.extractPoint(event);
                this.updateInteraction(event, extracted);
                var mapped = this.interaction.mapInteraction(extracted, ['current', 'start'], this.mapPositionToPoint.bind(this));
                var _iteratorNormalCompletion29 = true;
                var _didIteratorError29 = false;
                var _iteratorError29 = undefined;

                try {
                    for (var _iterator29 = mapped.entries()[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
                        var _step29$value = _slicedToArray(_step29.value, 2),
                            target = _step29$value[0],
                            interaction = _step29$value[1];

                        target.onStart(event, interaction);
                    }
                } catch (err) {
                    _didIteratorError29 = true;
                    _iteratorError29 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion29 && _iterator29.return) {
                            _iterator29.return();
                        }
                    } finally {
                        if (_didIteratorError29) {
                            throw _iteratorError29;
                        }
                    }
                }
            }
        }, {
            key: 'onMove',
            value: function onMove(event) {
                var extracted = this.extractPoint(event, 'all');

                this.updateInteraction(event, extracted);
                var mapped = this.interaction.mapInteraction(extracted, ['current', 'previous'], this.mapPositionToPoint.bind(this));
                var _iteratorNormalCompletion30 = true;
                var _didIteratorError30 = false;
                var _iteratorError30 = undefined;

                try {
                    for (var _iterator30 = mapped.entries()[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
                        var _step30$value = _slicedToArray(_step30.value, 2),
                            target = _step30$value[0],
                            interaction = _step30$value[1];

                        target.onMove(event, interaction);
                        interaction.updatePrevious();
                    }
                } catch (err) {
                    _didIteratorError30 = true;
                    _iteratorError30 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion30 && _iterator30.return) {
                            _iterator30.return();
                        }
                    } finally {
                        if (_didIteratorError30) {
                            throw _iteratorError30;
                        }
                    }
                }

                this.interaction.updatePrevious();
            }
        }, {
            key: 'onEnd',
            value: function onEnd(event) {
                var extracted = this.extractPoint(event, 'changedTouches');
                this.endInteraction(event, extracted);
                var mapped = this.interaction.mapInteraction(extracted, ['ended'], this.mapPositionToPoint.bind(this));
                var _iteratorNormalCompletion31 = true;
                var _didIteratorError31 = false;
                var _iteratorError31 = undefined;

                try {
                    for (var _iterator31 = mapped.entries()[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
                        var _step31$value = _slicedToArray(_step31.value, 2),
                            target = _step31$value[0],
                            interaction = _step31$value[1];

                        target.onEnd(event, interaction);
                    }
                } catch (err) {
                    _didIteratorError31 = true;
                    _iteratorError31 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion31 && _iterator31.return) {
                            _iterator31.return();
                        }
                    } finally {
                        if (_didIteratorError31) {
                            throw _iteratorError31;
                        }
                    }
                }

                this.finishInteraction(event, extracted);
            }
        }, {
            key: 'targetInterface',
            get: function get() {
                return IInteractionMapperTarget;
            }
        }]);

        return InteractionMapper;
    }(InteractionDelegate);

    window.InteractionMapper = InteractionMapper;

    /** Report capabilities with guaranteed values.
     */

    var Capabilities = function () {
        function Capabilities() {
            _classCallCheck(this, Capabilities);
        }

        _createClass(Capabilities, null, [{
            key: 'supportsMouseEvents',


            /** Returns true if mouse events are supported
            @return {boolean}
            */
            value: function supportsMouseEvents() {
                return typeof window.MouseEvent != 'undefined';
            }

            /** Returns true if touch events are supported
            @return {boolean}
            */

        }, {
            key: 'supportsTouchEvents',
            value: function supportsTouchEvents() {
                return typeof window.TouchEvent != 'undefined';
            }

            /** Returns true if pointer events are supported
            @return {boolean}
            */

        }, {
            key: 'supportsPointerEvents',
            value: function supportsPointerEvents() {
                return typeof window.PointerEvent != 'undefined';
            }

            /** Returns true if DOM templates are supported
            @return {boolean}
            */

        }, {
            key: 'supportsTemplate',
            value: function supportsTemplate() {
                return 'content' in document.createElement('template');
            }
        }, {
            key: 'userAgent',


            /** Returns the browser userAgent.
            @return {string}
            */
            get: function get() {
                return navigator.userAgent || 'Unknown Agent';
            }

            /** Tests whether the app is running on a mobile device.
            Implemented as a readonly attribute.
            @return {boolean}
            */

        }, {
            key: 'isMobile',
            get: function get() {
                return (/Mobi/.test(navigator.userAgent)
                );
            }

            /** Tests whether the app is running on a iOS device.
            Implemented as a readonly attribute.
            @return {boolean}
            */

        }, {
            key: 'isIOS',
            get: function get() {
                return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
                );
            }

            /** Tests whether the app is running in a Safari environment.
            See https://stackoverflow.com/questions/7944460/detect-safari-browser
            Implemented as a readonly attribute.
            @return {boolean}
            */

        }, {
            key: 'isSafari',
            get: function get() {
                return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');
            }

            /** Returns the display resolution. Necessary for retina displays.
            @return {number}
            */

        }, {
            key: 'devicePixelRatio',
            get: function get() {
                return window.devicePixelRatio || 1;
            }

            /** Returns true if the device is a multi-touch table. This method is currently not universal usable and not sure!
            @return {boolean}
            */

        }, {
            key: 'isMultiTouchTable',
            get: function get() {
                return Capabilities.devicePixelRatio > 2 && Capabilities.isMobile === false && /Windows/i.test(Capabilities.userAgent);
            }
        }]);

        return Capabilities;
    }();

    /** Basic tests for Capabilities.
     */


    var CapabilitiesTests = function () {
        function CapabilitiesTests() {
            _classCallCheck(this, CapabilitiesTests);
        }

        _createClass(CapabilitiesTests, null, [{
            key: 'testConfirm',
            value: function testConfirm() {
                var bool = confirm('Please confirm');
                document.getElementById('demo').innerHTML = bool ? 'Confirmed' : 'Not confirmed';
            }
        }, {
            key: 'testPrompt',
            value: function testPrompt() {
                var person = prompt('Please enter your name', 'Harry Potter');
                if (person != null) {
                    demo.innerHTML = 'Hello ' + person + '! How are you today?';
                }
            }
        }, {
            key: 'testUserAgent',
            value: function testUserAgent() {
                var agent = 'User-agent: ' + Capabilities.userAgent;
                user_agent.innerHTML = agent;
            }
        }, {
            key: 'testDevicePixelRatio',
            value: function testDevicePixelRatio() {
                var value = 'Device Pixel Ratio: ' + Capabilities.devicePixelRatio;
                device_pixel_ratio.innerHTML = value;
            }
        }, {
            key: 'testMultiTouchTable',
            value: function testMultiTouchTable() {
                var value = 'Is the device a multi-touch table? ' + Capabilities.isMultiTouchTable;
                multi_touch_table.innerHTML = value;
            }
        }, {
            key: 'testSupportedEvents',
            value: function testSupportedEvents() {
                var events = [];
                if (Capabilities.supportsMouseEvents()) {
                    events.push('MouseEvents');
                }
                if (Capabilities.supportsTouchEvents()) {
                    events.push('TouchEvents');
                }
                if (Capabilities.supportsPointerEvents()) {
                    events.push('PointerEvents');
                }
                supported_events.innerHTML = 'Supported Events: ' + events.join(', ');
            }
        }, {
            key: 'testAll',
            value: function testAll() {
                this.testUserAgent();
                this.testDevicePixelRatio();
                this.testMultiTouchTable();
                this.testSupportedEvents();
            }
        }]);

        return CapabilitiesTests;
    }();

    /* Optional global variables, needed in DocTests. */


    window.Capabilities = Capabilities;
    window.CapabilitiesTests = CapabilitiesTests;

    /**
     * A base class for scatter specific events.
     *
     * @constructor
     * @param {name} String - The name of the event
     * @param {target} Object - The target of the event
     */

    var BaseEvent = function BaseEvent(name, target) {
        _classCallCheck(this, BaseEvent);

        this.name = name;
        this.target = target;
    };

    // Event types


    var START = 'onStart';
    var UPDATE = 'onUpdate';
    var END = 'onEnd';
    var ZOOM = 'onZoom';

    /**
     * A scatter event that describes how the scatter has changed.
     *
     * @constructor
     * @param {target} Object - The target scatter of the event
     * @param {optional} Object - Optional parameter
     */

    var ScatterEvent = function (_BaseEvent) {
        _inherits(ScatterEvent, _BaseEvent);

        function ScatterEvent(target) {
            var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref4$translate = _ref4.translate,
                translate = _ref4$translate === undefined ? { x: 0, y: 0 } : _ref4$translate,
                _ref4$scale = _ref4.scale,
                scale = _ref4$scale === undefined ? null : _ref4$scale,
                _ref4$rotate = _ref4.rotate,
                rotate = _ref4$rotate === undefined ? 0 : _ref4$rotate,
                _ref4$about = _ref4.about,
                about = _ref4$about === undefined ? null : _ref4$about,
                _ref4$fast = _ref4.fast,
                fast = _ref4$fast === undefined ? false : _ref4$fast,
                _ref4$type = _ref4.type,
                type = _ref4$type === undefined ? null : _ref4$type;

            _classCallCheck(this, ScatterEvent);

            var _this7 = _possibleConstructorReturn(this, (ScatterEvent.__proto__ || Object.getPrototypeOf(ScatterEvent)).call(this, 'scatterTransformed', { target: target }));

            _this7.translate = translate;
            _this7.scale = scale;
            _this7.rotate = rotate;
            _this7.about = about;
            _this7.fast = fast;
            _this7.type = type;
            return _this7;
        }

        _createClass(ScatterEvent, [{
            key: 'toString',
            value: function toString() {
                return "Event('scatterTransformed', scale: " + this.scale + ' about: ' + this.about.x + ', ' + this.about.y + ')';
            }
        }]);

        return ScatterEvent;
    }(BaseEvent);

    /**
     * A scatter resize event that describes how the scatter has changed.
     *
     * @constructor
     * @param {target} Object - The target scatter of the event
     * @param {optional} Object - Optional parameter
     */


    var ResizeEvent = function (_BaseEvent2) {
        _inherits(ResizeEvent, _BaseEvent2);

        function ResizeEvent(target) {
            var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref5$width = _ref5.width,
                width = _ref5$width === undefined ? 0 : _ref5$width,
                _ref5$height = _ref5.height,
                height = _ref5$height === undefined ? 0 : _ref5$height;

            _classCallCheck(this, ResizeEvent);

            var _this8 = _possibleConstructorReturn(this, (ResizeEvent.__proto__ || Object.getPrototypeOf(ResizeEvent)).call(this, 'scatterResized', { width: width, height: height }));

            _this8.width = width;
            _this8.height = height;
            return _this8;
        }

        _createClass(ResizeEvent, [{
            key: 'toString',
            value: function toString() {
                return 'Event(scatterResized width: ' + this.width + 'height: ' + this.height + ')';
            }
        }]);

        return ResizeEvent;
    }(BaseEvent);

    /**
     * A abstract base class that implements the throwable behavior of a scatter
     * object.
     *
     * @constructor
     */


    var Throwable = function () {
        function Throwable() {
            var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref6$movableX = _ref6.movableX,
                movableX = _ref6$movableX === undefined ? true : _ref6$movableX,
                _ref6$movableY = _ref6.movableY,
                movableY = _ref6$movableY === undefined ? true : _ref6$movableY,
                _ref6$throwVisibility = _ref6.throwVisibility,
                throwVisibility = _ref6$throwVisibility === undefined ? 44 : _ref6$throwVisibility,
                _ref6$throwDamping = _ref6.throwDamping,
                throwDamping = _ref6$throwDamping === undefined ? 0.95 : _ref6$throwDamping,
                _ref6$autoThrow = _ref6.autoThrow,
                autoThrow = _ref6$autoThrow === undefined ? true : _ref6$autoThrow;

            _classCallCheck(this, Throwable);

            this.movableX = movableX;
            this.movableY = movableY;
            this.throwVisibility = throwVisibility;
            this.throwDamping = throwDamping;
            this.autoThrow = autoThrow;
            this.velocities = [];
            this.velocity = null;
            this.timestamp = null;
        }

        _createClass(Throwable, [{
            key: 'observeVelocity',
            value: function observeVelocity() {
                this.lastframe = performance.now();
            }
        }, {
            key: 'addVelocity',
            value: function addVelocity(delta) {
                var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

                var t = performance.now();
                var dt = t - this.lastframe;
                this.lastframe = t;
                var velocity = { t: t, dt: dt, dx: delta.x, dy: delta.y };
                this.velocities.push(velocity);
                while (this.velocities.length > buffer) {
                    this.velocities.shift();
                }
            }
        }, {
            key: 'meanVelocity',
            value: function meanVelocity() {
                var milliseconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;

                this.addVelocity({ x: 0, y: 0 });
                var sum = { x: 0, y: 0 };
                var count = 0;
                var t = 0;
                for (var i = this.velocities.length - 1; i > 0; i--) {
                    var v = this.velocities[i];
                    t += v.dt;
                    var nv = { x: v.dx / v.dt, y: v.dy / v.dt };
                    sum = Points.add(sum, nv);
                    count += 1;
                    if (t > milliseconds) {
                        break;
                    }
                }
                if (count === 0) return sum; // empty vector
                return Points.multiplyScalar(sum, 1 / count);
            }
        }, {
            key: 'killAnimation',
            value: function killAnimation() {
                this.velocity = null;
                this.velocities = [];
            }
        }, {
            key: 'startThrow',
            value: function startThrow() {
                this.velocity = this.meanVelocity();
                if (this.velocity != null) {
                    // Call next velocity to ansure that specializations
                    // that use keepOnStage are called
                    this.velocity = this.nextVelocity(this.velocity);
                    if (this.autoThrow) this.animateThrow(performance.now());
                } else {
                    this.onDragComplete();
                }
            }
        }, {
            key: 'animateThrow',
            value: function animateThrow(time) {
                if (this.velocity != null) {
                    var t = performance.now();
                    var dt = t - this.lastframe;
                    this.lastframe = t;
                    // console.log("animateThrow", dt)
                    var next = this.nextVelocity(this.velocity);
                    var prevLength = Points.length(this.velocity);
                    var nextLength = Points.length(next);
                    if (nextLength > prevLength) {
                        var factor = nextLength / prevLength;
                        next = Points.multiplyScalar(next, 1 / factor);
                        console.log('Prevent acceleration', factor, this.velocity, next);
                    }
                    this.velocity = next;
                    var d = Points.multiplyScalar(this.velocity, dt);
                    this._move(d);
                    this.onDragUpdate(d);
                    if (dt == 0 || this.needsAnimation()) {
                        requestAnimationFrame(this.animateThrow.bind(this));
                        return;
                    } else {
                        if (this.isOutside()) {
                            requestAnimationFrame(this.animateThrow.bind(this));
                        }
                    }
                }
                this.onDragComplete();
            }
        }, {
            key: 'needsAnimation',
            value: function needsAnimation() {
                return Points.length(this.velocity) > 0.01;
            }
        }, {
            key: 'nextVelocity',
            value: function nextVelocity(velocity) {
                // Must be overwritten: computes the changed velocity. Implement
                // damping, collison detection, etc. here
                return Points.multiplyScalar(velocity, this.throwDamping);
            }
        }, {
            key: '_move',
            value: function _move(delta) {}
        }, {
            key: 'onDragComplete',
            value: function onDragComplete() {}
        }, {
            key: 'onDragUpdate',
            value: function onDragUpdate(delta) {}
        }]);

        return Throwable;
    }();

    var AbstractScatter = function (_Throwable) {
        _inherits(AbstractScatter, _Throwable);

        function AbstractScatter() {
            var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref7$minScale = _ref7.minScale,
                minScale = _ref7$minScale === undefined ? 0.1 : _ref7$minScale,
                _ref7$maxScale = _ref7.maxScale,
                maxScale = _ref7$maxScale === undefined ? 1.0 : _ref7$maxScale,
                _ref7$startScale = _ref7.startScale,
                startScale = _ref7$startScale === undefined ? 1.0 : _ref7$startScale,
                _ref7$autoBringToFron = _ref7.autoBringToFront,
                autoBringToFront = _ref7$autoBringToFron === undefined ? true : _ref7$autoBringToFron,
                _ref7$autoThrow = _ref7.autoThrow,
                autoThrow = _ref7$autoThrow === undefined ? true : _ref7$autoThrow,
                _ref7$translatable = _ref7.translatable,
                translatable = _ref7$translatable === undefined ? true : _ref7$translatable,
                _ref7$scalable = _ref7.scalable,
                scalable = _ref7$scalable === undefined ? true : _ref7$scalable,
                _ref7$rotatable = _ref7.rotatable,
                rotatable = _ref7$rotatable === undefined ? true : _ref7$rotatable,
                _ref7$resizable = _ref7.resizable,
                resizable = _ref7$resizable === undefined ? false : _ref7$resizable,
                _ref7$movableX = _ref7.movableX,
                movableX = _ref7$movableX === undefined ? true : _ref7$movableX,
                _ref7$movableY = _ref7.movableY,
                movableY = _ref7$movableY === undefined ? true : _ref7$movableY,
                _ref7$throwVisibility = _ref7.throwVisibility,
                throwVisibility = _ref7$throwVisibility === undefined ? 44 : _ref7$throwVisibility,
                _ref7$throwDamping = _ref7.throwDamping,
                throwDamping = _ref7$throwDamping === undefined ? 0.95 : _ref7$throwDamping,
                _ref7$overdoScaling = _ref7.overdoScaling,
                overdoScaling = _ref7$overdoScaling === undefined ? 1 : _ref7$overdoScaling,
                _ref7$mouseZoomFactor = _ref7.mouseZoomFactor,
                mouseZoomFactor = _ref7$mouseZoomFactor === undefined ? 1.1 : _ref7$mouseZoomFactor,
                _ref7$rotationDegrees = _ref7.rotationDegrees,
                rotationDegrees = _ref7$rotationDegrees === undefined ? null : _ref7$rotationDegrees,
                _ref7$rotation = _ref7.rotation,
                rotation = _ref7$rotation === undefined ? null : _ref7$rotation,
                _ref7$onTransform = _ref7.onTransform,
                onTransform = _ref7$onTransform === undefined ? null : _ref7$onTransform;

            _classCallCheck(this, AbstractScatter);

            if (rotationDegrees != null && rotation != null) {
                throw new Error('Use rotationDegrees or rotation but not both');
            } else if (rotation != null) {
                rotationDegrees = Angle.radian2degree(rotation);
            } else if (rotationDegrees == null) {
                rotationDegrees = 0;
            }

            var _this9 = _possibleConstructorReturn(this, (AbstractScatter.__proto__ || Object.getPrototypeOf(AbstractScatter)).call(this, {
                movableX: movableX,
                movableY: movableY,
                throwVisibility: throwVisibility,
                throwDamping: throwDamping,
                autoThrow: autoThrow
            }));

            _this9.startRotationDegrees = rotationDegrees;
            _this9.startScale = startScale; // Needed to reset object
            _this9.minScale = minScale;
            _this9.maxScale = maxScale;
            _this9.overdoScaling = overdoScaling;
            _this9.translatable = translatable;
            _this9.scalable = scalable;
            _this9.rotatable = rotatable;
            _this9.resizable = resizable;
            _this9.mouseZoomFactor = mouseZoomFactor;
            _this9.autoBringToFront = autoBringToFront;
            _this9.dragging = false;
            _this9.onTransform = onTransform != null ? [onTransform] : null;
            return _this9;
        }

        _createClass(AbstractScatter, [{
            key: 'addTransformEventCallback',
            value: function addTransformEventCallback(callback) {
                if (this.onTransform == null) {
                    this.onTransform = [];
                }
                this.onTransform.push(callback);
            }
        }, {
            key: 'startGesture',
            value: function startGesture(interaction) {
                this.bringToFront();
                this.killAnimation();
                this.observeVelocity();
                return true;
            }
        }, {
            key: 'gesture',
            value: function gesture(interaction) {
                var delta = interaction.delta();
                if (delta != null) {
                    this.addVelocity(delta);
                    this.transform(delta, delta.zoom, delta.rotate, delta.about);
                    if (delta.zoom != 1) this.interactionAnchor = delta.about;
                }
            }
        }, {
            key: 'isOutside',
            value: function isOutside() {
                var stagePolygon = this.containerPolygon;
                var polygon = this.polygon;
                var result = stagePolygon.intersectsWith(polygon);
                return result === false || result.overlap < this.throwVisibility;
            }
        }, {
            key: 'recenter',
            value: function recenter() {
                // Return a small vector that guarantees that the scatter is moving
                // towards the center of the stage
                var center = this.center;
                var target = this.container.center;
                var delta = Points.subtract(target, center);
                return Points.normalize(delta);
            }
        }, {
            key: 'nextVelocity',
            value: function nextVelocity(velocity) {
                return this.keepOnStage(velocity);
            }
        }, {
            key: 'bouncing',
            value: function bouncing() {
                // Implements the bouncing behavior of the scatter. Moves the scatter
                // to the center of the stage if the scatter is outside the stage or
                // not within the limits of the throwVisibility.

                var stagePolygon = this.containerPolygon;
                var polygon = this.polygon;
                var result = stagePolygon.intersectsWith(polygon);
                if (result === false || result.overlap < this.throwVisibility) {
                    var cv = this.recenter();
                    var recentered = false;
                    while (result === false || result.overlap < this.throwVisibility) {
                        polygon.center.x += cv.x;
                        polygon.center.y += cv.y;
                        this._move(cv);
                        result = stagePolygon.intersectsWith(polygon);
                        recentered = true;
                    }
                    return recentered;
                }
                return false;
            }
        }, {
            key: 'keepOnStage',
            value: function keepOnStage(velocity) {
                var collision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

                var stagePolygon = this.containerPolygon;
                if (!stagePolygon) return;
                var polygon = this.polygon;
                var bounced = this.bouncing();
                if (bounced) {
                    var stage = this.containerBounds;
                    var _x17 = this.center.x;
                    var _y2 = this.center.y;
                    var dx = this.movableX ? velocity.x : 0;
                    var dy = this.movableY ? velocity.y : 0;
                    var factor = this.throwDamping;
                    // if (recentered) {
                    if (_x17 < 0) {
                        dx = -dx;
                        factor = collision;
                    }
                    if (_x17 > stage.width) {
                        dx = -dx;
                        factor = collision;
                    }
                    if (_y2 < 0) {
                        dy = -dy;
                        factor = collision;
                    }
                    if (_y2 > stage.height) {
                        dy = -dy;
                        factor = collision;
                    }
                    // }
                    return Points.multiplyScalar({ x: dx, y: dy }, factor);
                }
                return _get(AbstractScatter.prototype.__proto__ || Object.getPrototypeOf(AbstractScatter.prototype), 'nextVelocity', this).call(this, velocity);
            }
        }, {
            key: 'endGesture',
            value: function endGesture(interaction) {
                //this.startThrow()
            }
        }, {
            key: 'rotateDegrees',
            value: function rotateDegrees(degrees, anchor) {
                var rad = Angle.degree2radian(degrees);
                this.rotate(rad, anchor);
            }
        }, {
            key: 'rotate',
            value: function rotate(rad, anchor) {
                this.transform({ x: 0, y: 0 }, 1.0, rad, anchor);
            }
        }, {
            key: 'move',
            value: function move(d) {
                var _this10 = this;

                var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref8$animate = _ref8.animate,
                    animate = _ref8$animate === undefined ? 0 : _ref8$animate;

                if (this.translatable) {
                    if (animate > 0) {
                        var startPos = this.position;
                        TweenLite.to(this, animate, {
                            x: '+=' + d.x,
                            y: '+=' + d.y,
                            /* scale: scale, uo: not defined, why was this here? */
                            onUpdate: function onUpdate(e) {
                                var p = _this10.position;
                                var dx = p.x - startPos.x;
                                var dy = p.x - startPos.y;
                                _this10.onMoved(dx, dy);
                            }
                        });
                    } else {
                        this._move(d);
                        this.onMoved(d.x, d.y);
                    }
                }
            }
        }, {
            key: 'moveTo',
            value: function moveTo(p) {
                var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref9$animate = _ref9.animate,
                    animate = _ref9$animate === undefined ? 0 : _ref9$animate;

                var c = this.origin;
                var delta = Points.subtract(p, c);
                this.move(delta, { animate: animate });
            }
        }, {
            key: 'centerAt',
            value: function centerAt(p) {
                var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref10$animate = _ref10.animate,
                    animate = _ref10$animate === undefined ? 0 : _ref10$animate;

                var c = this.center;
                var delta = Points.subtract(p, c);
                this.move(delta, { animate: animate });
            }
        }, {
            key: 'zoom',
            value: function zoom(scale) {
                var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref11$animate = _ref11.animate,
                    animate = _ref11$animate === undefined ? 0 : _ref11$animate,
                    _ref11$about = _ref11.about,
                    about = _ref11$about === undefined ? null : _ref11$about,
                    _ref11$delay = _ref11.delay,
                    delay = _ref11$delay === undefined ? 0 : _ref11$delay,
                    _ref11$x = _ref11.x,
                    x = _ref11$x === undefined ? null : _ref11$x,
                    _ref11$y = _ref11.y,
                    y = _ref11$y === undefined ? null : _ref11$y,
                    _ref11$onComplete = _ref11.onComplete,
                    onComplete = _ref11$onComplete === undefined ? null : _ref11$onComplete;

                var anchor = about || this.center;
                if (scale != this.scale) {
                    if (animate > 0) {
                        TweenLite.to(this, animate, {
                            scale: scale,
                            delay: delay,
                            onComplete: onComplete,
                            onUpdate: this.onZoomed.bind(this)
                        });
                    } else {
                        this.scale = scale;
                        this.onZoomed(anchor);
                    }
                }
            }
        }, {
            key: '_move',
            value: function _move(delta) {
                this.x += this.movableX ? delta.x : 0;
                this.y += this.movableX ? delta.y : 0;
            }
        }, {
            key: 'transform',
            value: function transform(translate, zoom, rotate, anchor) {
                var delta = {
                    x: this.movableX ? translate.x : 0,
                    y: this.movableY ? translate.y : 0
                };
                if (this.resizable) var vzoom = zoom;
                if (!this.translatable) delta = { x: 0, y: 0 };
                if (!this.rotatable) rotate = 0;
                if (!this.scalable) zoom = 1.0;
                if (zoom == 1.0 && rotate == 0) {
                    this._move(delta);
                    if (this.onTransform != null) {
                        var event = new ScatterEvent(this, {
                            translate: delta,
                            scale: this.scale,
                            rotate: 0,
                            about: anchor,
                            fast: false,
                            type: UPDATE
                        });
                        this.onTransform.forEach(function (f) {
                            f(event);
                        });
                    }
                    return;
                }
                var origin = this.rotationOrigin;
                var beta = Points.angle(origin, anchor);
                var distance = Points.distance(origin, anchor);
                var newScale = this.scale * zoom;

                var minScale = this.minScale / this.overdoScaling;
                var maxScale = this.maxScale * this.overdoScaling;
                if (newScale < minScale) {
                    newScale = minScale;
                    zoom = newScale / this.scale;
                }
                if (newScale > maxScale) {
                    newScale = maxScale;
                    zoom = newScale / this.scale;
                }

                var newOrigin = Points.arc(anchor, beta + rotate, distance * zoom);
                var extra = Points.subtract(newOrigin, origin);
                var offset = Points.subtract(anchor, origin);
                this._move(offset);
                this.scale = newScale;
                this.rotation += rotate;
                offset = Points.negate(offset);
                offset = Points.add(offset, extra);
                offset = Points.add(offset, translate);
                this._move(offset);

                if (this.onTransform != null) {
                    var _event = new ScatterEvent(this, {
                        translate: delta,
                        scale: newScale,
                        rotate: rotate,
                        about: anchor
                    });
                    this.onTransform.forEach(function (f) {
                        f(_event);
                    });
                }
                if (this.resizable) {
                    this.resizeAfterTransform(vzoom);
                }
            }
        }, {
            key: 'resizeAfterTransform',
            value: function resizeAfterTransform(zoom) {
                // Overwrite this in subclasses.
            }
        }, {
            key: 'validScale',
            value: function validScale(scale) {
                scale = Math.max(scale, this.minScale);
                scale = Math.min(scale, this.maxScale);
                return scale;
            }
        }, {
            key: 'animateZoomBounce',
            value: function animateZoomBounce() {
                var _this11 = this;

                var dt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                if (this.zoomAnchor != null) {
                    var zoom = 1;
                    var amount = Math.min(0.01, 0.3 * dt / 100000.0);
                    if (this.scale < this.minScale) zoom = 1 + amount;
                    if (this.scale > this.maxScale) zoom = 1 - amount;
                    if (zoom != 1) {
                        this.transform({ x: 0, y: 0 }, zoom, 0, this.zoomAnchor);
                        requestAnimationFrame(function (dt) {
                            _this11.animateZoomBounce(dt);
                        });
                        return;
                    }
                    this.zoomAnchor = null;
                }
            }
        }, {
            key: 'checkScaling',
            value: function checkScaling(about) {
                var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                this.zoomAnchor = about;
                clearTimeout(this.animateZoomBounce.bind(this));
                setTimeout(this.animateZoomBounce.bind(this), delay);
            }
        }, {
            key: 'onMouseWheel',
            value: function onMouseWheel(event) {
                if (event.claimedByScatter) {
                    if (event.claimedByScatter != this) return;
                }
                this.killAnimation();
                this.targetScale = null;
                var direction = event.detail < 0 || event.wheelDelta > 0;
                var globalPoint = { x: event.clientX, y: event.clientY };
                var centerPoint = this.mapPositionToContainerPoint(globalPoint);
                if (event.shiftKey) {
                    var degrees = direction ? 5 : -5;
                    var rad = Angle.degree2radian(degrees);
                    return this.transform({ x: 0, y: 0 }, 1.0, rad, centerPoint);
                }
                var zoomFactor = this.mouseZoomFactor;
                var zoom = direction ? zoomFactor : 1 / zoomFactor;
                this.transform({ x: 0, y: 0 }, zoom, 0, centerPoint);
                this.checkScaling(centerPoint, 200);

                if (this.onTransform != null) {
                    var _event2 = new ScatterEvent(this, {
                        translate: { x: 0, y: 0 },
                        scale: this.scale,
                        rotate: 0,
                        about: null,
                        fast: false,
                        type: ZOOM
                    });
                    this.onTransform.forEach(function (f) {
                        f(_event2);
                    });
                }
            }
        }, {
            key: 'onStart',
            value: function onStart(event, interaction) {
                if (this.startGesture(interaction)) {
                    this.dragging = true;
                    this.interactionAnchor = null;
                }
                if (this.onTransform != null) {
                    var _event3 = new ScatterEvent(this, {
                        translate: { x: 0, y: 0 },
                        scale: this.scale,
                        rotate: 0,
                        about: null,
                        fast: false,
                        type: START
                    });
                    this.onTransform.forEach(function (f) {
                        f(_event3);
                    });
                }
            }
        }, {
            key: 'onMove',
            value: function onMove(event, interaction) {
                if (this.dragging) {
                    this.gesture(interaction);
                }
            }
        }, {
            key: 'onEnd',
            value: function onEnd(event, interaction) {
                if (interaction.isFinished()) {
                    this.endGesture(interaction);
                    this.dragging = false;
                    var _iteratorNormalCompletion32 = true;
                    var _didIteratorError32 = false;
                    var _iteratorError32 = undefined;

                    try {
                        for (var _iterator32 = interaction.ended.keys()[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
                            var key = _step32.value;

                            if (interaction.isTap(key)) {
                                var point = interaction.ended.get(key);
                                this.onTap(event, interaction, point);
                            }
                        }
                    } catch (err) {
                        _didIteratorError32 = true;
                        _iteratorError32 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion32 && _iterator32.return) {
                                _iterator32.return();
                            }
                        } finally {
                            if (_didIteratorError32) {
                                throw _iteratorError32;
                            }
                        }
                    }

                    if (this.onTransform != null) {
                        var _event4 = new ScatterEvent(this, {
                            translate: { x: 0, y: 0 },
                            scale: this.scale,
                            rotate: 0,
                            about: null,
                            fast: false,
                            type: END
                        });
                        this.onTransform.forEach(function (f) {
                            f(_event4);
                        });
                    }
                }
                var about = this.interactionAnchor;
                if (about != null) {
                    this.checkScaling(about, 100);
                }
            }
        }, {
            key: 'onTap',
            value: function onTap(event, interaction, point) {}
        }, {
            key: 'onDragUpdate',
            value: function onDragUpdate(delta) {
                if (this.onTransform != null) {
                    var event = new ScatterEvent(this, {
                        fast: true,
                        translate: delta,
                        scale: this.scale,
                        about: this.currentAbout,
                        type: null
                    });
                    this.onTransform.forEach(function (f) {
                        f(event);
                    });
                }
            }
        }, {
            key: 'onDragComplete',
            value: function onDragComplete() {
                if (this.onTransform) {
                    var event = new ScatterEvent(this, {
                        scale: this.scale,
                        about: this.currentAbout,
                        fast: false,
                        type: null
                    });
                    this.onTransform.forEach(function (f) {
                        f(event);
                    });
                }
            }
        }, {
            key: 'onMoved',
            value: function onMoved(dx, dy, about) {
                if (this.onTransform != null) {
                    var event = new ScatterEvent(this, {
                        translate: { x: dx, y: dy },
                        about: about,
                        fast: true,
                        type: null
                    });
                    this.onTransform.forEach(function (f) {
                        f(event);
                    });
                }
            }
        }, {
            key: 'onZoomed',
            value: function onZoomed(about) {
                if (this.onTransform != null) {
                    var event = new ScatterEvent(this, {
                        scale: this.scale,
                        about: about,
                        fast: false,
                        type: null
                    });
                    this.onTransform.forEach(function (f) {
                        f(event);
                    });
                }
            }
        }, {
            key: 'polygon',
            get: function get() {
                var w2 = this.width * this.scale / 2;
                var h2 = this.height * this.scale / 2;
                var center = this.center;
                var polygon = new Polygon(center);
                polygon.addPoint({ x: -w2, y: -h2 });
                polygon.addPoint({ x: w2, y: -h2 });
                polygon.addPoint({ x: w2, y: h2 });
                polygon.addPoint({ x: -w2, y: h2 });
                polygon.rotate(this.rotation);
                return polygon;
            }
        }]);

        return AbstractScatter;
    }(Throwable);

    /** A container for scatter objects, which uses a single InteractionMapper
     * for all children. This reduces the number of registered event handlers
     * and covers the common use case that multiple objects are scattered
     * on the same level.
     */


    var DOMScatterContainer = function () {
        /**
         * @constructor
         * @param {DOM node} element - DOM element that receives events
         * @param {Bool} stopEvents -  Whether events should be stopped or propagated
         * @param {Bool} claimEvents - Whether events should be marked as claimed
         *                             if findTarget return as non-null value.
         * @param {Bool} touchAction - CSS to set touch action style, needed to prevent
         *                              pointer cancel events. Use null if the
         *                              the touch action should not be set.
         */
        function DOMScatterContainer(element) {
            var _this12 = this;

            var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref12$stopEvents = _ref12.stopEvents,
                stopEvents = _ref12$stopEvents === undefined ? 'auto' : _ref12$stopEvents,
                _ref12$claimEvents = _ref12.claimEvents,
                claimEvents = _ref12$claimEvents === undefined ? true : _ref12$claimEvents,
                _ref12$touchAction = _ref12.touchAction,
                touchAction = _ref12$touchAction === undefined ? 'none' : _ref12$touchAction;

            _classCallCheck(this, DOMScatterContainer);

            this.element = element;
            if (stopEvents === 'auto') {
                if (Capabilities.isSafari) {
                    document.addEventListener('touchmove', function (event) {
                        return _this12.preventPinch(event);
                    }, false);
                    stopEvents = false;
                } else {
                    stopEvents = true;
                }
            }
            this.stopEvents = stopEvents;
            this.claimEvents = claimEvents;
            if (touchAction !== null) {
                Elements$1.setStyle(element, { touchAction: touchAction });
            }
            this.scatter = new Map();
            this.delegate = new InteractionMapper(element, this, {
                mouseWheelElement: window
            });

            if (typeof debugCanvas !== 'undefined') {
                requestAnimationFrame(function (dt) {
                    _this12.showTouches(dt);
                });
            }
        }

        _createClass(DOMScatterContainer, [{
            key: 'showTouches',
            value: function showTouches(dt) {
                var _this13 = this;

                var resolution = window.devicePixelRatio;
                var canvas = debugCanvas;
                var current = this.delegate.interaction.current;
                var context = canvas.getContext('2d');
                var radius = 20 * resolution;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = 'rgba(0, 0, 0, 0.3)';
                context.lineWidth = 2;
                context.strokeStyle = '#003300';
                var _iteratorNormalCompletion33 = true;
                var _didIteratorError33 = false;
                var _iteratorError33 = undefined;

                try {
                    for (var _iterator33 = current.entries()[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
                        var _step33$value = _slicedToArray(_step33.value, 2),
                            key = _step33$value[0],
                            point = _step33$value[1];

                        var local = point;
                        context.beginPath();
                        context.arc(local.x * resolution, local.y * resolution, radius, 0, 2 * Math.PI, false);
                        context.fill();
                        context.stroke();
                    }
                } catch (err) {
                    _didIteratorError33 = true;
                    _iteratorError33 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion33 && _iterator33.return) {
                            _iterator33.return();
                        }
                    } finally {
                        if (_didIteratorError33) {
                            throw _iteratorError33;
                        }
                    }
                }

                requestAnimationFrame(function (dt) {
                    _this13.showTouches(dt);
                });
            }
        }, {
            key: 'preventPinch',
            value: function preventPinch(event) {
                event = event.originalEvent || event;
                if (event.scale !== 1) {
                    event.preventDefault();
                }
            }
        }, {
            key: 'add',
            value: function add(scatter) {
                this.scatter.set(scatter.element, scatter);
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                if (event.target == this.element && this.stopEvents) Events.stop(event);
                return true;
            }
        }, {
            key: 'mapPositionToPoint',
            value: function mapPositionToPoint(point) {
                return Points.fromPageToNode(this.element, point);
            }
        }, {
            key: 'isDescendant',
            value: function isDescendant(parent, child) {
                var clickable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                if (parent == child) return true;
                var node = child.parentNode;
                while (node != null) {
                    if (!clickable && node.onclick) {
                        return false;
                    }
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            }
        }, {
            key: 'findTarget',
            value: function findTarget(event, local, global) {
                /*** Note that elementFromPoint works with clientX, clientY, not pageX, pageY
                The important point is that event should not be used, since the TouchEvent
                points are hidden in sub objects.
                ***/
                var found = document.elementFromPoint(global.x, global.y);
                var _iteratorNormalCompletion34 = true;
                var _didIteratorError34 = false;
                var _iteratorError34 = undefined;

                try {
                    for (var _iterator34 = this.scatter.values()[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
                        var target = _step34.value;

                        if (this.isDescendant(target.element, found)) {
                            if (this.stopEvents) Events.stop(event);
                            if (this.claimEvents) event.claimedByScatter = target;
                            return target;
                        }
                    }
                } catch (err) {
                    _didIteratorError34 = true;
                    _iteratorError34 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion34 && _iterator34.return) {
                            _iterator34.return();
                        }
                    } finally {
                        if (_didIteratorError34) {
                            throw _iteratorError34;
                        }
                    }
                }

                return null;
            }
        }, {
            key: 'center',
            get: function get() {
                var r = this.bounds;
                var w2 = r.width / 2;
                var h2 = r.height / 2;
                return { x: w2, y: h2 };
            }
        }, {
            key: 'bounds',
            get: function get() {
                return this.element.getBoundingClientRect();
            }
        }, {
            key: 'polygon',
            get: function get() {
                var r = this.bounds;
                var w2 = r.width / 2;
                var h2 = r.height / 2;
                var center = { x: w2, y: h2 };
                var polygon = new Polygon(center);
                polygon.addPoint({ x: -w2, y: -h2 });
                polygon.addPoint({ x: w2, y: -h2 });
                polygon.addPoint({ x: w2, y: h2 });
                polygon.addPoint({ x: -w2, y: h2 });
                return polygon;
            }
        }]);

        return DOMScatterContainer;
    }();

    var zIndex = 1000;

    var DOMScatter = function (_AbstractScatter) {
        _inherits(DOMScatter, _AbstractScatter);

        function DOMScatter(element, container) {
            var _ref13 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref13$startScale = _ref13.startScale,
                startScale = _ref13$startScale === undefined ? 1.0 : _ref13$startScale,
                _ref13$minScale = _ref13.minScale,
                minScale = _ref13$minScale === undefined ? 0.1 : _ref13$minScale,
                _ref13$maxScale = _ref13.maxScale,
                maxScale = _ref13$maxScale === undefined ? 1.0 : _ref13$maxScale,
                _ref13$overdoScaling = _ref13.overdoScaling,
                overdoScaling = _ref13$overdoScaling === undefined ? 1.5 : _ref13$overdoScaling,
                _ref13$autoBringToFro = _ref13.autoBringToFront,
                autoBringToFront = _ref13$autoBringToFro === undefined ? true : _ref13$autoBringToFro,
                _ref13$translatable = _ref13.translatable,
                translatable = _ref13$translatable === undefined ? true : _ref13$translatable,
                _ref13$scalable = _ref13.scalable,
                scalable = _ref13$scalable === undefined ? true : _ref13$scalable,
                _ref13$rotatable = _ref13.rotatable,
                rotatable = _ref13$rotatable === undefined ? true : _ref13$rotatable,
                _ref13$movableX = _ref13.movableX,
                movableX = _ref13$movableX === undefined ? true : _ref13$movableX,
                _ref13$movableY = _ref13.movableY,
                movableY = _ref13$movableY === undefined ? true : _ref13$movableY,
                _ref13$rotationDegree = _ref13.rotationDegrees,
                rotationDegrees = _ref13$rotationDegree === undefined ? null : _ref13$rotationDegree,
                _ref13$rotation = _ref13.rotation,
                rotation = _ref13$rotation === undefined ? null : _ref13$rotation,
                _ref13$onTransform = _ref13.onTransform,
                onTransform = _ref13$onTransform === undefined ? null : _ref13$onTransform,
                _ref13$transformOrigi = _ref13.transformOrigin,
                transformOrigin = _ref13$transformOrigi === undefined ? 'center center' : _ref13$transformOrigi,
                _ref13$x = _ref13.x,
                x = _ref13$x === undefined ? 0 : _ref13$x,
                _ref13$y = _ref13.y,
                y = _ref13$y === undefined ? 0 : _ref13$y,
                _ref13$width = _ref13.width,
                width = _ref13$width === undefined ? null : _ref13$width,
                _ref13$height = _ref13.height,
                height = _ref13$height === undefined ? null : _ref13$height,
                _ref13$resizable = _ref13.resizable,
                resizable = _ref13$resizable === undefined ? false : _ref13$resizable,
                _ref13$simulateClick = _ref13.simulateClick,
                simulateClick = _ref13$simulateClick === undefined ? false : _ref13$simulateClick,
                _ref13$verbose = _ref13.verbose,
                verbose = _ref13$verbose === undefined ? true : _ref13$verbose,
                _ref13$onResize = _ref13.onResize,
                onResize = _ref13$onResize === undefined ? null : _ref13$onResize,
                _ref13$touchAction = _ref13.touchAction,
                touchAction = _ref13$touchAction === undefined ? 'none' : _ref13$touchAction,
                _ref13$throwVisibilit = _ref13.throwVisibility,
                throwVisibility = _ref13$throwVisibilit === undefined ? 44 : _ref13$throwVisibilit,
                _ref13$throwDamping = _ref13.throwDamping,
                throwDamping = _ref13$throwDamping === undefined ? 0.95 : _ref13$throwDamping,
                _ref13$autoThrow = _ref13.autoThrow,
                autoThrow = _ref13$autoThrow === undefined ? true : _ref13$autoThrow;

            _classCallCheck(this, DOMScatter);

            var _this14 = _possibleConstructorReturn(this, (DOMScatter.__proto__ || Object.getPrototypeOf(DOMScatter)).call(this, {
                minScale: minScale,
                maxScale: maxScale,
                startScale: startScale,
                overdoScaling: overdoScaling,
                autoBringToFront: autoBringToFront,
                translatable: translatable,
                scalable: scalable,
                rotatable: rotatable,
                movableX: movableX,
                movableY: movableY,
                resizable: resizable,
                rotationDegrees: rotationDegrees,
                rotation: rotation,
                onTransform: onTransform,
                throwVisibility: throwVisibility,
                throwDamping: throwDamping,
                autoThrow: autoThrow
            }));

            if (container == null || width == null || height == null) {
                throw new Error('Invalid value: null');
            }
            _this14.element = element;
            _this14.x = x;
            _this14.y = y;
            _this14.meanX = x;
            _this14.meanY = y;
            _this14.width = width;
            _this14.height = height;
            _this14.throwVisibility = Math.min(width, height, throwVisibility);
            _this14.container = container;
            _this14.simulateClick = simulateClick;
            _this14.scale = startScale;
            _this14.rotationDegrees = _this14.startRotationDegrees;
            _this14.transformOrigin = transformOrigin;
            _this14.initialValues = {
                x: x,
                y: y,
                width: width,
                height: height,
                scale: startScale,
                rotation: _this14.startRotationDegrees,
                transformOrigin: transformOrigin
            };
            // For tweenlite we need initial values in _gsTransform
            TweenLite.set(element, _this14.initialValues);
            _this14.onResize = onResize;
            _this14.verbose = verbose;
            if (touchAction !== null) {
                Elements$1.setStyle(element, { touchAction: touchAction });
            }
            container.add(_this14);
            return _this14;
        }

        /** Returns geometry data as object. **/


        _createClass(DOMScatter, [{
            key: 'getState',
            value: function getState() {
                return {
                    scale: this.scale,
                    x: this.x,
                    y: this.y,
                    rotation: this.rotation
                };
            }
        }, {
            key: 'mapPositionToContainerPoint',
            value: function mapPositionToContainerPoint(point) {
                return this.container.mapPositionToPoint(point);
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                return true;
            }
        }, {
            key: 'reset',
            value: function reset() {
                TweenLite.set(this.element, this.initialValues);
            }
        }, {
            key: 'hide',
            value: function hide() {
                var _this15 = this;

                TweenLite.to(this.element, 0.1, {
                    display: 'none',
                    onComplete: function onComplete(e) {
                        _this15.element.parentNode.removeChild(_this15.element);
                    }
                });
            }
        }, {
            key: 'show',
            value: function show() {
                TweenLite.set(this.element, { display: 'block' });
            }
        }, {
            key: 'showAt',
            value: function showAt(p, rotationDegrees) {
                TweenLite.set(this.element, {
                    display: 'block',
                    x: p.x,
                    y: p.y,
                    rotation: rotationDegrees,
                    transformOrigin: this.transformOrigin
                });
            }
        }, {
            key: 'bringToFront',
            value: function bringToFront() {
                // this.element.parentNode.appendChild(this.element)
                // uo: On Chome and Electon appendChild leads to flicker
                TweenLite.set(this.element, { zIndex: zIndex++ });
            }
        }, {
            key: 'toggleVideo',
            value: function toggleVideo(element) {
                if (element.paused) {
                    element.play();
                } else {
                    element.pause();
                }
            }
        }, {
            key: 'onTap',
            value: function onTap(event, interaction, point) {
                if (this.simulateClick) {
                    var p = Points.fromPageToNode(this.element, point);
                    var iframe = this.element.querySelector('iframe');
                    if (iframe) {
                        var doc = iframe.contentWindow.document;
                        var element = doc.elementFromPoint(p.x, p.y);
                        if (element == null) {
                            return;
                        }
                        switch (element.tagName) {
                            case 'VIDEO':
                                console.log(element.currentSrc);
                                if (PopupMenu) {
                                    PopupMenu.open({
                                        Fullscreen: function Fullscreen() {
                                            return window.open(element.currentSrc);
                                        },
                                        Play: function Play() {
                                            return element.play();
                                        }
                                    }, { x: x, y: y });
                                } else {
                                    this.toggleVideo(element);
                                }
                                break;
                            default:
                                element.click();
                        }
                    }
                }
            }
        }, {
            key: 'isDescendant',
            value: function isDescendant(parent, child) {
                var node = child.parentNode;
                while (node != null) {
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            }
        }, {
            key: 'fromPageToNode',
            value: function fromPageToNode(x, y) {
                return Points.fromPageToNode(this.element, { x: x, y: y });
            }
        }, {
            key: 'fromNodeToPage',
            value: function fromNodeToPage(x, y) {
                return Points.fromNodeToPage(this.element, { x: x, y: y });
            }
        }, {
            key: '_move',
            value: function _move(delta) {
                // UO: We need to keep TweenLite's _gsTransform and the private
                // _x and _y attributes aligned
                var x = this.element._gsTransform.x;
                var y = this.element._gsTransform.y;
                if (this.movableX) {
                    x += delta.x;
                }
                if (this.movableY) {
                    y += delta.y;
                }
                this._x = x;
                this._y = y;
                TweenLite.set(this.element, { x: x, y: y });
            }
        }, {
            key: 'resizeAfterTransform',
            value: function resizeAfterTransform(zoom) {
                var w = this.width * this.scale;
                var h = this.height * this.scale;
                TweenLite.set(this.element, { width: w, height: h });
                if (this.onResize) {
                    var event = new ResizeEvent(this, { width: w, height: h });
                    this.onResize(event);
                }
            }
        }, {
            key: 'rotationOrigin',
            get: function get() {
                return this.center;
            }
        }, {
            key: 'x',
            get: function get() {
                return this._x;
            },
            set: function set(value) {
                this._x = value;
                TweenLite.set(this.element, { x: value });
            }
        }, {
            key: 'y',
            get: function get() {
                return this._y;
            },
            set: function set(value) {
                this._y = value;
                TweenLite.set(this.element, { y: value });
            }
        }, {
            key: 'position',
            get: function get() {
                var transform = this.element._gsTransform;
                var x = transform.x;
                var y = transform.y;
                return { x: x, y: y };
            }
        }, {
            key: 'origin',
            get: function get() {
                var p = this.fromNodeToPage(0, 0);
                return Points.fromPageToNode(this.container.element, p);
            }
        }, {
            key: 'bounds',
            get: function get() {
                var stage = this.container.element.getBoundingClientRect();
                var rect = this.element.getBoundingClientRect();
                return {
                    top: rect.top - stage.top,
                    left: rect.left - stage.left,
                    width: rect.width,
                    height: rect.height
                };
            }
        }, {
            key: 'center',
            get: function get() {
                var r = this.bounds;
                var w2 = r.width / 2;
                var h2 = r.height / 2;
                if (this.resizable) {
                    w2 *= this.scale;
                    h2 *= this.scale;
                }
                var x = r.left + w2;
                var y = r.top + h2;
                return { x: x, y: y };
            }
        }, {
            key: 'rotation',
            set: function set(radians) {
                var rad = radians; // Angle.normalize(radians)
                var degrees = Angle.radian2degree(rad);
                TweenLite.set(this.element, { rotation: degrees });
                this._rotation = rad;
            },
            get: function get() {
                return this._rotation;
            }
        }, {
            key: 'rotationDegrees',
            set: function set(degrees) {
                var deg = degrees; // Angle.normalizeDegree(degrees)
                TweenLite.set(this.element, { rotation: deg });
                this._rotation = Angle.degree2radian(deg);
            },
            get: function get() {
                return this._rotation;
            }
        }, {
            key: 'scale',
            set: function set(scale) {
                TweenLite.set(this.element, {
                    scale: scale,
                    transformOrigin: this.transformOrigin
                });
                this._scale = scale;
            },
            get: function get() {
                return this._scale;
            }
        }, {
            key: 'containerBounds',
            get: function get() {
                return this.container.bounds;
            }
        }, {
            key: 'containerPolygon',
            get: function get() {
                return this.container.polygon;
            }
        }]);

        return DOMScatter;
    }(AbstractScatter);

    var CardLoader = function () {
        function CardLoader(src) {
            var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref14$x = _ref14.x,
                x = _ref14$x === undefined ? 0 : _ref14$x,
                _ref14$y = _ref14.y,
                y = _ref14$y === undefined ? 0 : _ref14$y,
                _ref14$width = _ref14.width,
                width = _ref14$width === undefined ? 1000 : _ref14$width,
                _ref14$height = _ref14.height,
                height = _ref14$height === undefined ? 800 : _ref14$height,
                _ref14$maxWidth = _ref14.maxWidth,
                maxWidth = _ref14$maxWidth === undefined ? null : _ref14$maxWidth,
                _ref14$maxHeight = _ref14.maxHeight,
                maxHeight = _ref14$maxHeight === undefined ? null : _ref14$maxHeight,
                _ref14$scale = _ref14.scale,
                scale = _ref14$scale === undefined ? 1 : _ref14$scale,
                _ref14$minScale = _ref14.minScale,
                minScale = _ref14$minScale === undefined ? 0.5 : _ref14$minScale,
                _ref14$maxScale = _ref14.maxScale,
                maxScale = _ref14$maxScale === undefined ? 1.5 : _ref14$maxScale,
                _ref14$rotation = _ref14.rotation,
                rotation = _ref14$rotation === undefined ? 0 : _ref14$rotation;

            _classCallCheck(this, CardLoader);

            this.src = src;
            this.x = x;
            this.y = y;
            this.scale = scale;
            this.rotation = 0;
            this.maxScale = maxScale;
            this.minScale = minScale;
            this.wantedWidth = width;
            this.wantedHeight = height;
            this.maxWidth = maxWidth != null ? maxWidth : window.innerWidth;
            this.maxHeight = maxHeight != null ? maxHeight : window.innerHeight;
            this.addedNode = null;
        }

        _createClass(CardLoader, [{
            key: 'unload',
            value: function unload() {
                if (this.addedNode) {
                    this.addedNode.remove();
                    this.addedNode = null;
                }
            }
        }]);

        return CardLoader;
    }();

    var ImageLoader = function (_CardLoader) {
        _inherits(ImageLoader, _CardLoader);

        function ImageLoader() {
            _classCallCheck(this, ImageLoader);

            return _possibleConstructorReturn(this, (ImageLoader.__proto__ || Object.getPrototypeOf(ImageLoader)).apply(this, arguments));
        }

        _createClass(ImageLoader, [{
            key: 'load',
            value: function load(domNode) {
                var _this17 = this;

                return new Promise(function (resolve, reject) {
                    var isImage = domNode instanceof HTMLImageElement;
                    var image = isImage ? domNode : document.createElement('img');
                    image.onload = function (e) {
                        if (!isImage) {
                            domNode.appendChild(image);
                            _this17.addedNode = image;
                        }
                        _this17.wantedWidth = image.naturalWidth;
                        _this17.wantedHeight = image.naturalHeight;

                        var scaleW = _this17.maxWidth / image.naturalWidth;
                        var scaleH = _this17.maxHeight / image.naturalHeight;
                        _this17.scale = Math.min(_this17.maxScale, Math.min(scaleW, scaleH));
                        image.setAttribute('draggable', false);
                        image.width = image.naturalWidth;
                        image.height = image.naturalHeight;
                        resolve(_this17);
                    };
                    image.onerror = function (e) {
                        reject(_this17);
                    };
                    image.src = _this17.src;
                });
            }
        }]);

        return ImageLoader;
    }(CardLoader);

    var DOMFlip = function () {
        function DOMFlip(domScatterContainer, flipTemplate, frontLoader, backLoader) {
            var _ref15 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref15$autoLoad = _ref15.autoLoad,
                autoLoad = _ref15$autoLoad === undefined ? false : _ref15$autoLoad,
                _ref15$center = _ref15.center,
                center = _ref15$center === undefined ? null : _ref15$center,
                _ref15$preloadBack = _ref15.preloadBack,
                preloadBack = _ref15$preloadBack === undefined ? false : _ref15$preloadBack,
                _ref15$translatable = _ref15.translatable,
                translatable = _ref15$translatable === undefined ? true : _ref15$translatable,
                _ref15$scalable = _ref15.scalable,
                scalable = _ref15$scalable === undefined ? true : _ref15$scalable,
                _ref15$rotatable = _ref15.rotatable,
                rotatable = _ref15$rotatable === undefined ? true : _ref15$rotatable,
                _ref15$onFront = _ref15.onFront,
                onFront = _ref15$onFront === undefined ? null : _ref15$onFront,
                _ref15$onBack = _ref15.onBack,
                onBack = _ref15$onBack === undefined ? null : _ref15$onBack,
                _ref15$onClose = _ref15.onClose,
                onClose = _ref15$onClose === undefined ? null : _ref15$onClose,
                _ref15$onUpdate = _ref15.onUpdate,
                onUpdate = _ref15$onUpdate === undefined ? null : _ref15$onUpdate,
                _ref15$onRemoved = _ref15.onRemoved,
                onRemoved = _ref15$onRemoved === undefined ? null : _ref15$onRemoved;

            _classCallCheck(this, DOMFlip);

            this.domScatterContainer = domScatterContainer;
            this.id = getId();
            this.flipTemplate = flipTemplate;
            this.frontLoader = frontLoader;
            this.backLoader = backLoader;
            this.translatable = translatable;
            this.scalable = scalable;
            this.rotatable = rotatable;
            this.onFrontFlipped = onFront;
            this.onBackFlipped = onBack;
            this.onClose = onClose;
            this.onRemoved = onRemoved;
            this.onUpdate = onUpdate;
            this.center = center;
            this.preloadBack = preloadBack;
            if (autoLoad) {
                this.load();
            }
        }

        _createClass(DOMFlip, [{
            key: 'load',
            value: function load() {
                var _this18 = this;

                return new Promise(function (resolve, reject) {
                    var t = _this18.flipTemplate;
                    var dom = _this18.domScatterContainer.element;
                    var wrapper = t.content.querySelector('.flipWrapper');
                    wrapper.id = _this18.id;
                    var clone = document.importNode(t.content, true);
                    dom.appendChild(clone);
                    // We cannot use the document fragment itself because it
                    // is not part of the main dom tree. After the appendChild
                    // call we can access the new dom element by id
                    _this18.cardWrapper = dom.querySelector('#' + _this18.id);
                    var front = _this18.cardWrapper.querySelector('.front');
                    _this18.frontLoader.load(front).then(function (loader) {
                        _this18.frontLoaded(loader).then(resolve);
                    });
                });
            }
        }, {
            key: 'frontLoaded',
            value: function frontLoaded(loader) {
                var _this19 = this;

                return new Promise(function (resolve, reject) {
                    var scatter = new DOMScatter(_this19.cardWrapper, _this19.domScatterContainer, {
                        x: loader.x,
                        y: loader.y,
                        startScale: loader.scale,
                        scale: loader.scale,
                        maxScale: loader.maxScale,
                        minScale: loader.minScale,
                        width: loader.wantedWidth,
                        height: loader.wantedHeight,
                        rotation: loader.rotation,
                        translatable: _this19.translatable,
                        scalable: _this19.scalable,
                        rotatable: _this19.rotatable
                    });
                    if (_this19.center) {
                        scatter.centerAt(_this19.center);
                    }

                    var flippable = new DOMFlippable(_this19.cardWrapper, scatter, _this19);
                    var back = _this19.cardWrapper.querySelector('.back');

                    if (_this19.preloadBack) {
                        _this19.backLoader.load(back).then(function (loader) {
                            _this19.setupFlippable(flippable, loader);
                        });
                    }
                    _this19.flippable = flippable;
                    resolve(_this19);
                });
            }
        }, {
            key: 'centerAt',
            value: function centerAt(p) {
                this.center = p;
                this.flippable.centerAt(p);
            }
        }, {
            key: 'zoom',
            value: function zoom(scale) {
                this.flippable.zoom(scale);
            }
        }, {
            key: 'setupFlippable',
            value: function setupFlippable(flippable, loader) {
                flippable.wantedWidth = loader.wantedWidth;
                flippable.wantedHeight = loader.wantedHeight;
                flippable.wantedScale = loader.scale;
                flippable.minScale = loader.minScale;
                flippable.maxScale = loader.maxScale;
                flippable.scaleButtons();
            }
        }, {
            key: 'start',
            value: function start() {
                var _this20 = this;

                var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref16$duration = _ref16.duration,
                    duration = _ref16$duration === undefined ? 1.0 : _ref16$duration,
                    _ref16$targetCenter = _ref16.targetCenter,
                    targetCenter = _ref16$targetCenter === undefined ? null : _ref16$targetCenter;

                console.log('DOMFlip.start', targetCenter);
                if (this.preloadBack) this.flippable.start({ duration: duration, targetCenter: targetCenter });else {
                    var back = this.cardWrapper.querySelector('.back');
                    var flippable = this.flippable;
                    this.backLoader.load(back).then(function (loader) {
                        _this20.setupFlippable(flippable, loader);
                        flippable.start({ duration: duration, targetCenter: targetCenter });
                    });
                }
            }
        }, {
            key: 'fadeOutAndRemove',
            value: function fadeOutAndRemove() {
                var _this21 = this;

                TweenLite.to(this.cardWrapper, 0.2, {
                    opacity: 0,
                    onComplete: function onComplete() {
                        _this21.cardWrapper.remove();
                    }
                });
            }
        }, {
            key: 'closed',
            value: function closed() {
                if (!this.preloadBack) {
                    this.backLoader.unload();
                }
            }
        }]);

        return DOMFlip;
    }();

    var DOMFlippable = function () {
        function DOMFlippable(element, scatter, flip) {
            var _this22 = this;

            _classCallCheck(this, DOMFlippable);

            // Set log to console.log or a custom log function
            // define data structures to store our touchpoints in

            this.element = element;
            this.flip = flip;
            this.card = element.querySelector('.flipCard');
            this.front = element.querySelector('.front');
            this.back = element.querySelector('.back');
            this.flipped = false;
            this.scatter = scatter;
            this.onFrontFlipped = flip.onFrontFlipped;
            this.onBackFlipped = flip.onBackFlipped;
            this.onClose = flip.onClose;
            this.onRemoved = flip.onRemoved;
            this.onUpdate = flip.onUpdate;
            scatter.addTransformEventCallback(this.scatterTransformed.bind(this));
            console.log('lib.DOMFlippable', 5000);
            TweenLite.set(this.element, { perspective: 5000 });
            TweenLite.set(this.card, { transformStyle: 'preserve-3d' });
            TweenLite.set(this.back, { rotationY: -180 });
            TweenLite.set([this.back, this.front], { backfaceVisibility: 'hidden', perspective: 5000 });
            TweenLite.set(this.front, { visibility: 'visible' });
            this.infoBtn = element.querySelector('.infoBtn');
            this.backBtn = element.querySelector('.backBtn');
            this.closeBtn = element.querySelector('.closeBtn');
            /* Buttons are not guaranteed to exist. */
            if (this.infoBtn) {
                this.infoBtn.onclick = function () {
                    _this22.flip.start();
                };
                this.show(this.infoBtn);
            }
            if (this.backBtn) {
                this.backBtn.onclick = function () {
                    _this22.start();
                };
            }
            if (this.closeBtn) {
                this.closeBtn.onclick = function () {
                    _this22.close();
                };
                this.show(this.closeBtn);
            }
            this.scaleButtons();
            this.bringToFront();
        }

        _createClass(DOMFlippable, [{
            key: 'close',
            value: function close() {
                var _this23 = this;

                this.hide(this.infoBtn);
                this.hide(this.closeBtn);
                if (this.onClose) {
                    this.onClose(this);
                    this.flip.closed();
                } else {
                    this.scatter.zoom(0.1, {
                        animate: 0.5,
                        onComplete: function onComplete() {
                            _this23.element.remove();
                            _this23.flip.closed();
                            if (_this23.onRemoved) {
                                _this23.onRemoved.call(_this23);
                            }
                        }
                    });
                }
            }
        }, {
            key: 'showFront',
            value: function showFront() {
                TweenLite.set(this.front, { visibility: 'visible' });
            }
        }, {
            key: 'centerAt',
            value: function centerAt(p) {
                this.scatter.centerAt(p);
            }
        }, {
            key: 'zoom',
            value: function zoom(scale) {
                this.scatter.zoom(scale);
            }
        }, {
            key: 'scaleButtons',
            value: function scaleButtons() {
                TweenLite.set([this.infoBtn, this.backBtn, this.closeBtn], {
                    scale: this.buttonScale
                });
            }
        }, {
            key: 'bringToFront',
            value: function bringToFront() {
                this.scatter.bringToFront();
                TweenLite.set(this.element, { zIndex: DOMFlippable.zIndex++ });
            }
        }, {
            key: 'clickInfo',
            value: function clickInfo() {
                this.bringToFront();
                this.infoBtn.click();
            }
        }, {
            key: 'scatterTransformed',
            value: function scatterTransformed(event) {
                this.scaleButtons();
            }
        }, {
            key: 'targetRotation',
            value: function targetRotation(alpha) {
                var ortho = 90;
                var rest = alpha % ortho;
                var delta = 0.0;
                if (rest > ortho / 2.0) {
                    delta = ortho - rest;
                } else {
                    delta = -rest;
                }
                return delta;
            }
        }, {
            key: 'infoValues',
            value: function infoValues(info) {
                var startX = this.element._gsTransform.x;
                var startY = this.element._gsTransform.y;
                var startAngle = this.element._gsTransform.rotation;
                var startScale = this.element._gsTransform.scaleX;
                var w = this.element.style.width;
                var h = this.element.style.height;
                console.log(info, startX, startY, startAngle, startScale, w, h);
            }
        }, {
            key: 'show',
            value: function show(element) {
                if (element) {
                    TweenLite.set(element, { visibility: 'visible', display: 'initial' });
                }
            }
        }, {
            key: 'hide',
            value: function hide(element) {
                if (element) {
                    TweenLite.set(element, { visibility: 'hidden', display: 'none' });
                }
            }
        }, {
            key: 'start',
            value: function start() {
                var _this24 = this;

                var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref17$duration = _ref17.duration,
                    duration = _ref17$duration === undefined ? 1.0 : _ref17$duration,
                    _ref17$targetCenter = _ref17.targetCenter,
                    targetCenter = _ref17$targetCenter === undefined ? null : _ref17$targetCenter;

                this.bringToFront();
                if (!this.flipped) {
                    this.startX = this.element._gsTransform.x;
                    this.startY = this.element._gsTransform.y;
                    this.startAngle = this.element._gsTransform.rotation;
                    this.startScale = this.element._gsTransform.scaleX;
                    this.startWidth = this.element.style.width;
                    this.startHeight = this.element.style.height;
                    this.scatterStartWidth = this.scatter.width;
                    this.scatterStartHeight = this.scatter.height;
                    this.show(this.back);
                    this.hide(this.infoBtn);
                    this.hide(this.closeBtn);
                } else {
                    this.show(this.front);
                    this.hide(this.backBtn);
                }
                var _scatter = this.scatter,
                    scalable = _scatter.scalable,
                    translatable = _scatter.translatable,
                    rotatable = _scatter.rotatable;

                this.saved = { scalable: scalable, translatable: translatable, rotatable: rotatable };
                this.scatter.scalable = false;
                this.scatter.translatable = false;
                this.scatter.rotatable = false;

                this.flipped = !this.flipped;
                var targetY = this.flipped ? 180 : 0;
                var targetZ = this.flipped ? this.startAngle + this.targetRotation(this.startAngle) : this.startAngle;
                var targetScale = this.flipped ? this.wantedScale : this.startScale;
                var w = this.flipped ? this.wantedWidth : this.startWidth;
                var h = this.flipped ? this.wantedHeight : this.startHeight;
                var dw = this.wantedWidth - this.scatter.width;
                var dh = this.wantedHeight - this.scatter.height;

                var xx = targetCenter != null ? targetCenter.x - w / 2 : this.startX - dw / 2;
                var yy = targetCenter != null ? targetCenter.y - h / 2 : this.startY - dh / 2;
                var x = this.flipped ? xx : this.startX;
                var y = this.flipped ? yy : this.startY;

                //console.log("DOMFlippable.start", this.flipped, targetCenter, x, y, this.saved)
                // targetZ = Angle.normalizeDegree(targetZ)
                var onUpdate = this.onUpdate !== null ? function () {
                    return _this24.onUpdate(_this24);
                } : null;
                TweenLite.to(this.card, duration, {
                    rotationY: targetY + 0.1,
                    transformOrigin: '50% 50%',
                    onUpdate: onUpdate,
                    onComplete: function onComplete(e) {
                        if (_this24.flipped) {
                            //this.hide(this.front)
                            _this24.show(_this24.backBtn);
                            if (_this24.onFrontFlipped) {
                                _this24.onFrontFlipped(_this24);
                            }
                        } else {
                            //this.hide(this.back)
                            if (_this24.onBackFlipped == null) {
                                _this24.show(_this24.infoBtn);
                                _this24.show(_this24.closeBtn);
                            } else {
                                _this24.onBackFlipped(_this24);
                            }
                            _this24.flip.closed();
                        }
                        _this24.scatter.scale = targetScale;
                        _this24.scaleButtons();
                        _this24.scatter.rotationDegrees = targetZ;
                        _this24.scatter.width = _this24.flipped ? w : _this24.scatterStartWidth;
                        _this24.scatter.height = _this24.flipped ? h : _this24.scatterStartHeight;

                        var _saved = _this24.saved,
                            scalable = _saved.scalable,
                            translatable = _saved.translatable,
                            rotatable = _saved.rotatable;

                        _this24.scatter.scalable = scalable;
                        _this24.scatter.translatable = translatable;
                        _this24.scatter.rotatable = rotatable;

                        _this24.bringToFront();
                    },
                    force3D: true
                });

                TweenLite.to(this.element, duration / 2, {
                    scale: targetScale,
                    rotationZ: targetZ + 0.1,
                    transformOrigin: '50% 50%',
                    width: w,
                    height: h,
                    x: x,
                    y: y,
                    onComplete: function onComplete(e) {
                        if (_this24.flipped) {
                            _this24.hide(_this24.front);
                        } else {
                            _this24.hide(_this24.back);
                        }
                    }
                });
            }
        }, {
            key: 'buttonScale',
            get: function get() {
                var iscale = 1.0;
                if (this.scatter != null) {
                    iscale = 1.0 / this.scatter.scale;
                }
                return iscale;
            }
        }]);

        return DOMFlippable;
    }();

    DOMFlippable.zIndex = 0;

    /** A Popup that shows text labels, images, or html
     */

    var Popup = function () {
        /**
        * The constructor.
        * @constructor
        * @param {DOM Element} parent - The DOM parent element.
        * @param {Object} content - A dict object with type strings (text, img, html) as keys
        *                            and corresponding values.
        * @param {string} fontSize - Describes the font size as CSS value
        * @param {string} fontFamily - Describes the font family as CSS value
        * @param {number || string} padding - Describes the padding as CSS value
        * @param {number || string} notchSize - Describes the size of the notch (callout) as CSS value
        * @param {string} backgroundColor  - The color of the background as CSS value
        * @param {string} normalColor  - The color of textitems as CSS value
        * @param {boolean} autoClose  - Autoclose the Popup on tap
        */
        function Popup() {
            var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref18$parent = _ref18.parent,
                parent = _ref18$parent === undefined ? null : _ref18$parent,
                _ref18$content = _ref18.content,
                content = _ref18$content === undefined ? null : _ref18$content,
                _ref18$fontSize = _ref18.fontSize,
                fontSize = _ref18$fontSize === undefined ? '1em' : _ref18$fontSize,
                _ref18$fontFamily = _ref18.fontFamily,
                fontFamily = _ref18$fontFamily === undefined ? 'Arial' : _ref18$fontFamily,
                _ref18$padding = _ref18.padding,
                padding = _ref18$padding === undefined ? 16 : _ref18$padding,
                _ref18$notchSize = _ref18.notchSize,
                notchSize = _ref18$notchSize === undefined ? 10 : _ref18$notchSize,
                _ref18$switchPos = _ref18.switchPos,
                switchPos = _ref18$switchPos === undefined ? false : _ref18$switchPos,
                _ref18$maxWidth = _ref18.maxWidth,
                maxWidth = _ref18$maxWidth === undefined ? 800 : _ref18$maxWidth,
                _ref18$backgroundColo = _ref18.backgroundColor,
                backgroundColor = _ref18$backgroundColo === undefined ? '#EEE' : _ref18$backgroundColo,
                _ref18$normalColor = _ref18.normalColor,
                normalColor = _ref18$normalColor === undefined ? '#444' : _ref18$normalColor,
                _ref18$notchPosition = _ref18.notchPosition,
                notchPosition = _ref18$notchPosition === undefined ? 'bottomLeft' : _ref18$notchPosition,
                _ref18$autoClose = _ref18.autoClose,
                autoClose = _ref18$autoClose === undefined ? true : _ref18$autoClose;

            _classCallCheck(this, Popup);

            this.padding = padding;
            this.notchPosition = notchPosition;
            this.notchSize = notchSize;
            this.switchPos = switchPos;
            this.fontSize = fontSize;
            this.fontFamily = fontFamily;
            this.maxWidth = maxWidth;
            this.normalColor = normalColor;
            this.backgroundColor = backgroundColor;
            this.autoClose = autoClose;
            this.parent = parent || document.body;
            if (content) {
                this.show(content);
            }
        }

        /** Setup menu with a dictionary of content types and contents.
         * @param {Object} content - A dict object with type strings (text, img, html) as keys
        *                            and corresponding values.
         * @return {Popup} this
         */


        _createClass(Popup, [{
            key: 'setup',
            value: function setup(content) {
                this.content = content;
                this.items = {};
                this.element = document.createElement('div');
                Elements$1.addClass(this.element, 'unselectable');
                this.notch = document.createElement('div');
                Elements$1.setStyle(this.notch, this.notchStyle());
                for (var key in content) {
                    switch (key) {
                        case 'text':
                            var text = document.createElement('span');
                            this.element.appendChild(text);
                            text.innerHTML = content[key];
                            Elements$1.setStyle(text, { color: this.normalColor });
                            Elements$1.addClass(text, 'unselectable');
                            Elements$1.addClass(text, 'PopupContent');
                            break;
                        case 'img':
                            alert("img to be implemented");
                            break;
                        case 'html':
                            var div = document.createElement('div');
                            this.element.appendChild(div);
                            div.innerHTML = content[key];
                            Elements$1.addClass(div, 'PopupContent');
                            break;
                        default:
                            alert("Unexpected content type: " + key);
                            break;
                    }
                }
                this.element.appendChild(this.notch);
                this.parent.appendChild(this.element);
                Elements$1.setStyle(this.element, this.defaultStyle());
                console.log("Popup.setup", this.defaultStyle());
                this.layout();
                return this;
            }

            /** Layout the menu items
             */

        }, {
            key: 'layout',
            value: function layout() {}

            /** Close and remove the Popup from the DOM tree.
            */

        }, {
            key: 'close',
            value: function close() {
                this.parent.removeChild(this.element);
                if (Popup.openPopup == this) {
                    Popup.openPopup = null;
                }
            }

            /** Shows the Popup with the given commands at the specified point.
             * @param {Object} content - A dict object with type strings (text, img, html) as keys
             *                            and corresponding values.
             * @param {Point} point - The position as x, y coordinates {px}.
             * @return {Popup} this
            */

        }, {
            key: 'showAt',
            value: function showAt(content, point) {
                this.show(content);
                this.placeAt(point);
                return this;
            }
        }, {
            key: 'placeAt',
            value: function placeAt(point) {
                var x = point.x;
                var y = point.y;
                var rect = this.element.getBoundingClientRect();
                var h = rect.bottom - rect.top;
                /* TODO: Implement different notchPositions */
                switch (this.notchPosition) {
                    case "bottomLeft":
                        x -= this.padding;
                        x -= this.notchSize;
                        y -= this.notchSize + h;
                        Elements$1.setStyle(this.element, { left: x + 'px', top: y + 'px' });
                        break;

                    case "topLeft":
                        x -= this.padding;
                        x -= this.notchSize;
                        y += this.notchSize;
                        Elements$1.setStyle(this.element, { left: x + 'px', top: y + 'px' });
                        break;
                    default:
                        Elements$1.setStyle(this.element, { left: x + 'px', top: y + 'px' });
                        break;
                }
            }

            /** Shows the Popup with the given commands at the current position.
             * @param {Object} content - A dict object with type strings (text, img, html) as keys
             *                            and corresponding values.
             * @return {Popup} this
             */

        }, {
            key: 'show',
            value: function show(content) {
                this.setup(content);
                return this;
            }

            /** Configuration object. Return default styles as CSS values.
            */

        }, {
            key: 'defaultStyle',
            value: function defaultStyle() {
                var padding = this.padding;
                return {
                    borderRadius: Math.round(this.padding / 2) + 'px',
                    backgroundColor: this.backgroundColor,
                    padding: this.padding + 'px',
                    maxWidth: this.maxWidth + 'px',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
                    position: 'absolute',
                    fontFamily: this.fontFamily,
                    fontSize: this.fontSize,
                    stroke: 'black',
                    fill: 'white' };
            }

            /** Configuration object. Return notch styles as CSS values.
            */

        }, {
            key: 'notchStyle',
            value: function notchStyle() {
                switch (this.notchPosition) {
                    case "bottomLeft":
                        return {
                            width: 0,
                            height: 0,
                            boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                            bottom: -this.notchSize + 'px', // '-10px',
                            position: 'absolute',
                            borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                            borderRight: this.notchSize + 'px solid transparent',
                            borderLeft: this.notchSize + 'px solid transparent',
                            borderBottom: 0
                        };
                    case "topLeft":
                        return {
                            width: 0,
                            height: 0,
                            top: -this.notchSize + 'px',
                            position: 'absolute',
                            borderBottom: this.notchSize + 'px solid ' + this.backgroundColor,
                            borderRight: this.notchSize + 'px solid transparent',
                            borderLeft: this.notchSize + 'px solid transparent',
                            borderTop: 0
                        };
                    default:
                        return {
                            width: 0,
                            height: 0,
                            boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                            bottom: -this.notchSize + 'px', // '-10px',
                            position: 'absolute',
                            borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                            borderRight: this.notchSize + 'px solid transparent',
                            borderLeft: this.notchSize + 'px solid transparent',
                            borderBottom: 0
                        };
                }
            }

            /** Convenient static methods to show and reuse a Popup implemented
             * as a class variable.
             * @param {Object} content - A dict object with type strings (text, img, html) as keys
             *                            and corresponding values.
             * @param {Point} point - The position as x, y coordinates {px}.
             * @param {boolean} autoClose - Autoclose the menu after selecting an item.
             */

        }], [{
            key: 'open',
            value: function open(content, point) {
                var _this25 = this;

                var _ref19 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref19$parent = _ref19.parent,
                    parent = _ref19$parent === undefined ? null : _ref19$parent,
                    _ref19$fontSize = _ref19.fontSize,
                    fontSize = _ref19$fontSize === undefined ? '1em' : _ref19$fontSize,
                    _ref19$fontFamily = _ref19.fontFamily,
                    fontFamily = _ref19$fontFamily === undefined ? 'Arial' : _ref19$fontFamily,
                    _ref19$padding = _ref19.padding,
                    padding = _ref19$padding === undefined ? 16 : _ref19$padding,
                    _ref19$notchSize = _ref19.notchSize,
                    notchSize = _ref19$notchSize === undefined ? 10 : _ref19$notchSize,
                    _ref19$switchPos = _ref19.switchPos,
                    switchPos = _ref19$switchPos === undefined ? false : _ref19$switchPos,
                    _ref19$maxWidth = _ref19.maxWidth,
                    maxWidth = _ref19$maxWidth === undefined ? 800 : _ref19$maxWidth,
                    _ref19$backgroundColo = _ref19.backgroundColor,
                    backgroundColor = _ref19$backgroundColo === undefined ? '#EEE' : _ref19$backgroundColo,
                    _ref19$normalColor = _ref19.normalColor,
                    normalColor = _ref19$normalColor === undefined ? '#444' : _ref19$normalColor,
                    _ref19$autoClose = _ref19.autoClose,
                    autoClose = _ref19$autoClose === undefined ? true : _ref19$autoClose;

                if (Popup.openPopup) {
                    this.closePopup();
                    return;
                }
                if (parent !== null) {
                    point = convertPointFromPageToNode(parent, point.x, point.y);
                }
                var notchPosition = 'bottomLeft';
                if (point.y < 50) {
                    if (switchPos) notchPosition = 'topLeft';
                }
                var popup = new Popup({ parent: parent, fontSize: fontSize, padding: padding, notchSize: notchSize, switchPos: switchPos,
                    maxWidth: maxWidth, backgroundColor: backgroundColor, normalColor: normalColor,
                    notchPosition: notchPosition, autoClose: autoClose });
                popup.showAt(content, point);
                Popup.openPopup = popup;
                /*if (autoClose) {
                    window.addEventListener('mousedown', (e) => this.closePopup(e), true)
                    window.addEventListener('touchstart', (e) => this.closePopup(e), true)
                    window.addEventListener('pointerdown', (e) => this.closePopup(e), true)
                }*/
                Popup.closeEventListener = function (e) {
                    if (_this25.eventOutside(e)) _this25.closePopup(e);
                };
                if (autoClose) {
                    window.addEventListener('mousedown', Popup.closeEventListener, true);
                    window.addEventListener('touchstart', Popup.closeEventListener, true);
                    window.addEventListener('pointerdown', Popup.closeEventListener, true);
                }
            }
        }, {
            key: 'eventOutside',
            value: function eventOutside(e) {
                return !Elements$1.hasClass(e.target, 'PopupContent');
            }

            /** Convenient static methods to close the Popup implemented
             * as a class variable.
             */

        }, {
            key: 'closePopup',
            value: function closePopup(e) {
                if (Popup.openPopup) {
                    Popup.openPopup.close();
                }
            }
        }]);

        return Popup;
    }();

    /* Class variable */


    Popup.openPopup = null;

    /*** Base parser for loading EyeVisit-style XML. Converts the XML into
     * an internal JSON format that in turn is converted into a HTML 5 representation
     * of EyeVisit cards.
     *
     * Defines the base API for processing the XML.
    ***/

    var XMLParser = function () {
        function XMLParser(path) {
            _classCallCheck(this, XMLParser);

            this.path = path;
            var basePath = this.removeLastSegment(this.path);
            this.basePath = this.removeLastSegment(basePath);
        }

        _createClass(XMLParser, [{
            key: 'removeLastSegment',
            value: function removeLastSegment(path) {
                var to = path.lastIndexOf('/');
                return path.substring(0, to);
            }
        }, {
            key: 'extractLastSegment',
            value: function extractLastSegment(path) {
                var to = path.lastIndexOf('/');
                return path.substring(to + 1, path.length);
            }

            /*** Loads the XML from the given path. ***/

        }, {
            key: 'loadXML',
            value: function loadXML() {
                var _this26 = this;

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: "GET",
                        url: _this26.path,
                        dataType: "xml",
                        success: function success(xml) {
                            resolve(xml);
                        },
                        error: function error(e) {
                            console.warn("Error loading " + _this26.path, e);
                            reject();
                        }
                    });
                });
            }

            /*** Entry point, loads and parses the XML. Returns a promise that
              completes if all sub objects are loaded and converted into a single
              DOM tree and to add.***/

        }, {
            key: 'loadParseAndCreateDOM',
            value: function loadParseAndCreateDOM() {
                var _this27 = this;

                return new Promise(function (resolve, reject) {
                    _this27.loadXML().then(function (xml) {
                        _this27.parseXML(xml).then(function (json) {
                            var domTree = _this27.createDOM(json);
                            resolve(domTree);
                        }).catch(function (reason) {
                            console.warn("parseXML failed", reason);
                            reject(reason);
                        });
                    }).catch(function (reason) {
                        console.warn("loadXML failed", reason);
                        reject(reason);
                    });
                });
            }
        }, {
            key: 'loadAndParseXML',
            value: function loadAndParseXML() {
                var _this28 = this;

                return new Promise(function (resolve, reject) {
                    _this28.loadXML().then(function (xml) {
                        _this28.parseXML(xml).then(function (json) {
                            resolve(json);
                        }).catch(function (reason) {
                            console.warn("parseXML in loadAndParseXML failed", reason);
                            reject(reason);
                        });
                    }).catch(function (reason) {
                        console.warn("loadXML in loadAndParseXML failed", reason);
                        reject(reason);
                    });
                });
            }

            /*** Parse the received XML into a JSON structure. Returns a promise. ***/

        }, {
            key: 'parseXML',
            value: function parseXML(xmldat) {
                console.warn("Needs to be overwritten");
            }

            /*** Create DOM nodes from JSON structure. Returns a promise. ***/

        }, {
            key: 'createDOM',
            value: function createDOM(json) {
                console.warn("Needs to be overwritten");
            }
        }]);

        return XMLParser;
    }();

    var XMLIndexParser = function (_XMLParser) {
        _inherits(XMLIndexParser, _XMLParser);

        function XMLIndexParser(path) {
            var _ref20 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref20$width = _ref20.width,
                width = _ref20$width === undefined ? window.innerWidth : _ref20$width,
                _ref20$height = _ref20.height,
                height = _ref20$height === undefined ? window.innerHeight : _ref20$height,
                _ref20$assetsPath = _ref20.assetsPath,
                assetsPath = _ref20$assetsPath === undefined ? '../../var/eyevisit/cards/' : _ref20$assetsPath,
                _ref20$colors = _ref20.colors,
                colors = _ref20$colors === undefined ? { artist: '#b0c6b2',
                thema: '#c3c0d1',
                details: '#dec1b2',
                leben_des_kunstwerks: '#e1dea7',
                komposition: '#bebebe',
                licht_und_farbe: '#90a2ab',
                extra_info: '#c8d9d7',
                extra: '#c8d9d7',
                extrainfo: '#c8d9d7',
                artwork: '#e1dea7',
                technik: '#d9b3bd'
            } : _ref20$colors;

            _classCallCheck(this, XMLIndexParser);

            var _this29 = _possibleConstructorReturn(this, (XMLIndexParser.__proto__ || Object.getPrototypeOf(XMLIndexParser)).call(this, path));

            _this29.width = width;
            _this29.height = height;
            _this29.assetsPath = assetsPath;
            _this29.colors = colors;
            return _this29;
        }

        _createClass(XMLIndexParser, [{
            key: 'parseXML',
            value: function parseXML(xmldat) {
                var _this30 = this;

                return new Promise(function (resolve, reject) {
                    var indexdat = {
                        cards: [],
                        cardsources: []
                    };
                    var data = $(xmldat).find('data');
                    var _arr = ['thumbnail', 'artist', 'title', 'misc', 'description', 'year', 'nr', 'annotation'];
                    for (var _i = 0; _i < _arr.length; _i++) {
                        var key = _arr[_i];
                        indexdat[key] = data.find(key).html();
                    }
                    var promises = [];
                    data.find('card').each(function (i, card) {
                        var src = $(card).attr('src');
                        indexdat.cardsources.push(src);
                        var parser = new XMLCardParser(_this30.basePath + '/' + src);
                        var subCard = parser.loadAndParseXML().then(function (json) {
                            indexdat.cards.push(json);
                        });
                        promises.push(subCard);
                    });
                    Promise.all(promises).then(function (result) {
                        resolve(indexdat);
                    });
                });
            }
        }, {
            key: 'createDOM',
            value: function createDOM(tree) {

                var targetnode = document.createElement('div');
                $(targetnode).attr('id', tree.nr);

                var clone = $("#BACK").html();
                $(targetnode).append(clone);
                clone = $(targetnode).children().last();

                $($(clone).find('header img')).attr('src', this.assetsPath + tree.thumbnail);
                $($(clone).find('.artist')).append(tree.artist);
                $($(clone).find('.title')).append(tree.title);
                $($(clone).find('.misc')).append(tree.misc);
                $($(clone).find('.description')).append(tree.description);

                if (tree.annotation != null) {
                    $($(clone)).find('.annotation').append(tree.annotation);
                }

                for (var i = 0; i < tree.cards.length; i++) {
                    var id = tree.cardsources[i].match(/[^/]*$/, '')[0].replace('.xml', '');
                    var cardclone = $("#CARD").html();
                    $(clone).find('main').append(cardclone);
                    cardclone = $(clone).find('main').children().last();
                    cardclone.attr('id', id);
                    this.createCardDOM(tree.cards[i], cardclone);
                }

                this.setupIndex(targetnode);
                return targetnode;
            }
        }, {
            key: 'createCardDOM',
            value: function createCardDOM(tree, targetnode) {

                if (tree.template == 2) {
                    targetnode.find('#leftcol').addClass('wide');
                    targetnode.find('#rightcol').addClass('narrow');
                }

                var colct = 2;

                if (tree.template == 3) {
                    targetnode.find('.wrapper').append("<div id='bottomcol'></div>");
                    // set leftcol/rightcol height
                    // set bottom col styles
                    colct = 3;
                }

                targetnode.find('.titlebar').append('<p>' + tree.header + '</p>');
                targetnode.find('.titlebar').css({ 'background': this.colors[tree.type] });
                targetnode.find('.preview').append('<p>' + tree.preview + '</p>');
                for (var index = 1; index < colct + 1; index++) {

                    var targetcol = targetnode.find('.wrapper').children()[index];
                    var sourcecol = targetnode.find('.wrapper').children()[index].id;
                    //console.log(sourcecol)

                    while (tree[sourcecol].length > 0) {

                        var node = tree[sourcecol].pop();

                        if (node.type == "text") {
                            var clone = $("#TEXT").html();
                            $(targetcol).append(clone).find(".text").last().append(node.html);
                        }

                        if (node.type == "singleimage") {

                            var _clone = $("#SINGLEIMAGE").html();
                            $(targetcol).append(_clone);
                            _clone = $(targetcol).children().last();

                            /*let ratio = this.getRatio(this.assetsPath + node.source)
                            let h = (node.maxheight / 670) * this.height
                            let w = h * ratio*/

                            /*$(clone).css({
                              'height': h,
                              'width': w
                            })*/

                            var curMainImg = $($(_clone).children('.mainimg'));
                            var curFigure = $(_clone);

                            curMainImg.on('load', this.mainImgLoaded.bind(this, curFigure, node)); /* function(){
                                                                                                   console.log("LOADED", clone, curMainImg.width(), curMainImg.height() )
                                                                                                   console.log(curMainImg.get().naturalWidth, curFigure.get().naturalWidth)
                                                                                                   })*/

                            $($(_clone).children('.mainimg')).attr('src', this.assetsPath + node.source);
                            $(_clone).attr('id', node.id);
                            $($(_clone).children('.zoomicon')).attr('id', node.iconid);

                            $(_clone).children('figcaption.cap').append(node.cap); // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">")
                            $(_clone).children('figcaption.zoomcap').append(node.zoomcap);
                        }

                        if (node.type == "video") {

                            var targetsrc = node.source.replace('f4v', 'mp4');

                            var _clone2 = $("#VIDEO").html();
                            $(targetcol).append(_clone2);
                            _clone2 = $(targetcol).children().last();

                            $(_clone2).css({
                                'max-height': node.maxheight / 670 * this.height
                            });
                            $($(_clone2).children('video').children('source')).attr('src', this.assetsPath + targetsrc);

                            $(_clone2).attr('id', node.id);
                            $($(_clone2).children('.zoomicon')).attr('id', node.iconid);
                            $(_clone2).children('figcaption.cap').append(node.cap); // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">"))
                            $(_clone2).children('figcaption.zoomcap').append(node.zoomcap);

                            $(_clone2).append(node);
                        }

                        if (node.type == "space") {
                            $(targetcol).append($("#SPACE").html());
                            var _clone3 = $(targetcol).children().last();
                            $(_clone3).css({ height: node.height });
                        }

                        if (node.type == "groupimage") {

                            var _clone4 = $("#GROUPIMAGE").html();
                            $(targetcol).append(_clone4);
                            _clone4 = $(targetcol).children().last();

                            $(_clone4).css({
                                'height': node.maxheight / 670 * this.height
                            });

                            var len = Object.keys(node.figures).length;
                            if (len > 2) {
                                var diff = len - 2;
                                while (diff > 0) {
                                    var gr_figure = $("#GROUPIMAGE_FIGURE").html();
                                    $(_clone4).append(gr_figure);
                                    diff -= 1;
                                }
                            }

                            for (var j = 0; j < len; j++) {
                                var figure = $($(_clone4).children('figure')[j]);
                                figure.children('.mainimghalf').attr('src', this.assetsPath + node.figures[j + 1].source);
                                figure.attr('id', node.figures[j + 1].id);
                                figure.children('.zoomicon').attr('id', node.figures[j + 1].iconid);

                                figure.children('figcaption.cap').append(node.figures[j + 1].cap);
                                figure.children('figcaption.zoomcap').append(node.figures[j + 1].zoomcap);
                            }
                        }
                    }
                }

                targetnode.find('a').each(function () {
                    var value = tree.tooltipdata[$(this).attr('data-target')];
                    $(this).attr('data-tooltip', value);
                });
            }
        }, {
            key: 'mainImgLoaded',
            value: function mainImgLoaded(fig, node) {
                //layout which depends on the actual main img size goes here
                var curMainImg = $(fig.children('.mainimg'));
                var ratio = curMainImg.width() / curMainImg.height();

                // show image highlights
                var highlights = node.highlights;
                node = "";

                while (highlights.length > 0) {
                    var highlight = highlights.pop();

                    //change height of the highlight according to ratio of the corresponding main img
                    var tmpStyle1 = highlight.style.split("height:");
                    var tmpStyle2 = tmpStyle1[1].split("%;width:");
                    var newStyle = tmpStyle1[0] + "height:" + parseFloat(tmpStyle2[0]) * ratio + "%;width:" + tmpStyle2[1];
                    highlight.style = newStyle;

                    node += "<a id='" + highlight.id.replace(/\./g, "_") + "' class='detail' href='#' data-target='" + highlight.target + "' data-radius = '" + highlight.radius + "' style='" + highlight.style + "' ></a>";
                    //console.log('highlight with radius: ', highlight.radius, highlight.target, highlight.style)
                }

                //fig.children('mainimgContainer').append(node)
                fig.append(node);
            }
        }, {
            key: 'completed',
            value: function completed(domNode) {
                var _this31 = this;

                /*** Called after the domNode has been added.
                 At this point we can register a click handler for the
                flip wrapper which allows us to add a popup that can extend over the back
                and front card bounds. Note that popups have to be closed on click events
                outside the popups.
                 TODO: On mobile devices we have to
                stay within the card bounds. That's much more complicated.
                ***/
                var wrapper = $(domNode).closest('.flipWrapper');
                wrapper.on('click', function (e) {

                    var domContainer = wrapper[0];
                    if (domContainer.popup) {
                        domContainer.popup.close();
                        domContainer.popup = null;
                    }
                    _this31.removeZoomable();
                    _this31.removeImageHighlight();
                    var target = $(e.target);
                    var tooltip = target.attr('data-tooltip');
                    if (tooltip) {
                        var globalPos = { x: e.pageX, y: e.pageY };
                        var localPos = Points.fromPageToNode(domContainer, globalPos);

                        var popup = new Popup({ parent: domContainer, backgroundColor: '#222' });
                        // localPos.y = this.height - localPos.y
                        popup.showAt({ html: tooltip }, localPos);
                        domContainer.popup = popup;

                        /*if(target.attr('class') == 'detail'){
                          this.currentHighlight = target
                          this.openImageHighlight();
                          console.log('open image highlight with id:', target.attr('id'))
                        }*/

                        if (target.attr('imagehighlightid')) {
                            //console.log(target.attr('imagehighlightid'))
                            //console.log((target.attr('id') + "Detail").replace(/\./g, "_"))
                            var detailId = (target.attr('id') + "Detail").replace(/\./g, "_");
                            _this31.currentHighlight = document.getElementById(detailId);
                            _this31.openImageHighlight();
                            console.log('open image highlight with id:', target.attr('id'), target);
                        }

                        //console.log('tooltip found:',target, target.attr('data-tooltip'), target.scale, this.currentHighlight)
                    }
                    var zoomable = target.closest('.zoomable');
                    if (zoomable.length > 0 && !tooltip) {
                        // let wrapper = $(e.target).closest('.flipWrapper')
                        //             let div = wrapper.find('.ZoomedFigure')
                        //             if (div.length > 0) {
                        //                 this.closeZoomable(wrapper, div)
                        //                 return
                        //             }

                        if (target.attr('class') == 'detail') {
                            var _globalPos = { x: e.pageX, y: e.pageY };
                            var _localPos = Points.fromPageToNode(domContainer, _globalPos);

                            var searchId = target.attr('id').split('Detail');
                            var tooltipElement = document.getElementById(searchId[0]);
                            var _tooltip = tooltipElement.attributes.getNamedItem('data-tooltip').value;

                            var _popup = new Popup({ parent: domContainer, backgroundColor: '#222' });
                            _localPos.y = _this31.height - _localPos.y;
                            _popup.showAt({ html: _tooltip }, _localPos);
                            domContainer.popup = _popup;

                            _this31.currentHighlight = target;
                            _this31.openImageHighlight();
                            console.log('open image highlight with id:', target.attr('id'), target);
                        } else {
                            _this31.openZoomable(wrapper, zoomable);
                        }
                    }
                });
                this.domNode = domNode;

                var highlights = document.getElementsByClassName('detail');
                for (var i = 0; i < highlights.length; i++) {
                    //console.log(highlights[i])
                    var highlight = highlights[i];
                    var parent = highlight.parentNode;
                    for (var j = 0; j < parent.childNodes.length; j++) {
                        if (parent.childNodes[j].className == 'mainimg') {
                            //console.log("mainimg found")
                            var mainimg = parent.childNodes[j];
                            //console.log(mainimg.naturalWidth, mainimg.width)
                        }
                    }
                }
            }
        }, {
            key: 'openImageHighlight',
            value: function openImageHighlight() {
                /*
                TweenMax.to(this.currentHighlight, 0.4, {
                          scale: 1.15,
                          ease: Back.easeOut,
                          alpha: 1,
                          onComplete: () => {
                            //...
                        }})
                        */
                TweenMax.set(this.currentHighlight, {
                    scale: 1.25,
                    alpha: 1,
                    onComplete: function onComplete() {
                        //...
                    } });
            }
        }, {
            key: 'removeImageHighlight',
            value: function removeImageHighlight() {
                if (this.currentHighlight) {
                    //TweenMax.to(this.currentHighlight, 0.4, {scale: 1})
                    TweenMax.set(this.currentHighlight, { scale: 1 });
                    this.currentHighlight = null;
                }
            }
        }, {
            key: 'closeZoomable',
            value: function closeZoomable(wrapper, div, zoomable, pos, scale) {
                var _this32 = this;

                var duration = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.4;

                //console.log("closeZoomable")
                this.zoomableTweenInProgress = true;
                if (zoomable.length > 0) {
                    TweenMax.to(zoomable[0], duration, {
                        autoAlpha: 1,
                        onComplete: function onComplete() {
                            //console.log("tween finished")
                        } });
                }
                TweenMax.to(div[0], duration, {
                    scale: scale,
                    x: pos.x,
                    y: pos.y,
                    onComplete: function onComplete() {
                        //console.log("closeZoomable tween finished")
                        div.remove();
                        var icon = wrapper.find('.ZoomedIcon');
                        icon.remove();
                        _this32.zoomableTweenInProgress = false;
                    } });
            }
        }, {
            key: 'removeZoomable',
            value: function removeZoomable() {
                var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                //console.log("checking for open zoomables (animated?: " + animated + " )")
                var wrapper = $(this.domNode).closest('.flipWrapper');
                var div = wrapper.find('.ZoomedFigure');
                if (div.length > 0) {
                    if (animated) {
                        var zoomable = div[0].zoomable;
                        var zoomablePos = div[0].zoomablePos;
                        var zoomableScale = div[0].zoomableScale;
                        if (zoomable) {
                            this.closeZoomable(wrapper, div, zoomable, zoomablePos, zoomableScale, 0.1);
                        }
                    } else {
                        //cleanup is not necessary if zoomable tween is in progress
                        if (!this.zoomableTweenInProgress) {
                            var _zoomable = div[0].zoomable;
                            if (_zoomable.length > 0) {
                                _zoomable[0].style.visibility = "visible";
                                _zoomable[0].style.opacity = 1;
                            }
                            var icon = wrapper.find('.ZoomedIcon');
                            div.remove();
                            icon.remove();
                        }
                    }
                }
            }
        }, {
            key: 'openZoomable',
            value: function openZoomable(wrapper, zoomable) {
                var _this33 = this;

                console.log("openZoomable", wrapper, zoomable);
                wrapper.append('<div class="ZoomedFigure" style="display:hidden;"><figure></figure></div>');
                var div = wrapper.find('.ZoomedFigure');

                var figure = div.find('figure');
                var img = zoomable.find('.mainimg');
                if (img.length == 0) {
                    img = zoomable.find('.mainimghalf');
                }
                figure.append('<img src="' + img.attr('src') + '">');
                var zoomCap = zoomable.find('.zoomcap');
                var zoomCapClone = zoomCap.clone();
                figure.append(zoomCapClone);
                zoomCapClone.show();

                var zoomIcon = zoomable.find('.zoomicon');
                console.log(this.assetsPath);
                wrapper.append('<img class="zoomicon ZoomedIcon" src="' + this.iconsPath + '/close.svg">');

                var globalIconPos = Points.fromNodeToPage(zoomIcon[0], { x: 0, y: 0 });
                var localIconPos = Points.fromPageToNode(wrapper[0], globalIconPos);

                var globalFigurePos = Points.fromNodeToPage(zoomable[0], { x: 0, y: 0 });
                var localFigurePos = Points.fromPageToNode(wrapper[0], globalFigurePos);
                var relativeIconPos = Points.fromPageToNode(zoomable[0], globalIconPos);

                var currentWidth = relativeIconPos.x;
                var currentHeight = relativeIconPos.y;
                var width = img[0].naturalWidth - 16;
                var height = img[0].naturalHeight - 16;
                var scale = currentWidth / width * 1.1;

                div[0].zoomable = zoomable;
                div[0].zoomablePos = localFigurePos;
                div[0].zoomableScale = scale;

                var icon = wrapper.find('.ZoomedIcon');
                icon.on('click', function (e) {
                    _this33.closeZoomable(wrapper, div, zoomable, localFigurePos, scale);
                });
                div.show();
                TweenMax.set(icon[0], { x: localIconPos.x, y: localIconPos.y });
                TweenMax.set(div[0], { x: localFigurePos.x,
                    y: localFigurePos.y,
                    scale: scale,
                    transformOrigin: "top left" });

                TweenMax.to(zoomable[0], 0.4, { autoAlpha: 0 });
                TweenMax.to(div[0], 0.4, { scale: 1,
                    x: "-=" + (width - currentWidth),
                    y: "-=" + (height - currentHeight) });
            }
        }, {
            key: 'getRatio',
            value: function getRatio(source) {
                var dummy = document.createElement("IMG");
                dummy.setAttribute("src", source);

                dummy.onload = function () {
                    console.log("get ratio - on dummy loaded:", source, dummy.width, dummy.height);
                };

                var ratio = dummy.naturalWidth / dummy.naturalHeight;
                console.log("get ratio - dummy width:", source, ratio, dummy.width, dummy.height, dummy);
                return ratio;
            }
        }, {
            key: 'setupIndex',
            value: function setupIndex(indexnode) {
                var useGreenSock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                var duration = 300;
                var that = this;
                $(indexnode).find('.card').each(function () {
                    $(this).on('click', function (event) {
                        if ($(this).attr("expanded") == "true") {
                            $(this).attr("expanded", "false");
                            $(this).css('flex-grow', '0');
                        }
                        that.removeZoomable(true);

                        var cardbox = $(this).parent();
                        var indexbox = $(this).parents('.mainview');

                        var el = $(this)[0];
                        var st = window.getComputedStyle(el, null);
                        var tr = st.getPropertyValue('transform');
                        var angle = 0;
                        if (tr !== "none") {
                            var values = tr.split('(')[1].split(')')[0].split(',');
                            var a = values[0];
                            var b = values[1];
                            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                        }

                        var target = $(this).clone();
                        var root = $(this);

                        $(target).attr('id', 'overlay');
                        $($(target).find('.cardicon')).attr('src', that.iconsPath + '/close.svg');
                        $(target).find('.titlebar').css({ height: '8%' });
                        console.log("Expand");
                        if (useGreenSock) {

                            var indexWidth = indexnode.getBoundingClientRect().width;
                            var indexHeight = indexnode.getBoundingClientRect().height;
                            var rootWidth = root[0].getBoundingClientRect().width;
                            var rootHeight = root[0].getBoundingClientRect().height;
                            var scale = useGreenSock ? rootWidth / indexWidth : 1;

                            var globalOrigin = Points.fromNodeToPage(root[0], { x: 0, y: 0 });
                            var localOrigin = Points.fromPageToNode(indexbox[0], globalOrigin);

                            TweenMax.set(target[0], { css: {
                                    position: 'absolute',
                                    width: '97.5%',
                                    height: '86.5%',
                                    margin: 0,
                                    zIndex: 101
                                } });
                            TweenMax.set(root[0], { alpha: 0 });
                            TweenMax.set(target[0], {
                                x: localOrigin.x,
                                y: localOrigin.y,
                                scale: scale,
                                transformOrigin: '0% 0%',
                                rotation: angle
                            });

                            $(target).prependTo(indexbox);

                            TweenMax.to(target[0], 0.2, {
                                x: indexWidth * 0.02,
                                y: 0,
                                scale: 1,
                                rotation: 0
                            });
                            var preview = $(target).find('.preview');
                            TweenMax.to(preview[0], 0.5, { autoAlpha: 0 });

                            $(target).find('.cardicon').on('click', function (event) {

                                that.removeZoomable(true);
                                TweenMax.set(root[0], { autoAlpha: 1 });
                                TweenMax.to(target[0], 0.2, {
                                    x: localOrigin.x,
                                    y: localOrigin.y,
                                    scale: scale,
                                    rotation: angle,
                                    onComplete: function onComplete() {
                                        TweenMax.to(target[0], 0.4, { delay: 0.2,
                                            alpha: 0,
                                            onComplete: function onComplete() {
                                                target[0].remove();
                                            }
                                        });
                                    }
                                });

                                // TweenMax.to(preview[0], 0.2, { alpha: 1 })
                            });
                        } else {
                            $(target).find('.cardicon').on('click', function (event) {
                                $(target).fadeOut(duration, function () {
                                    $(target).remove();
                                });
                            });

                            $(target).css({
                                'position': 'absolute',
                                'top': root.offset().top,
                                'left': root.offset().left,
                                'margin': 0,
                                'z-index': '101'
                            });
                            $(target).prependTo(indexbox);

                            $(target).animate({
                                top: '5%',
                                left: '2%',
                                width: '96%',
                                height: '90%',
                                margin: '0'
                            }, duration);
                            $(target).find('.preview').fadeOut(700);

                            $({ deg: 0 }).animate({
                                deg: angle
                            }, {
                                duration: duration,
                                step: function step(now) {
                                    $(target).css({ transform: 'rotate(0deg)' });
                                }
                            });
                        }

                        // this.setupZoomables($(target)) ??? is this this the this i want to this ???
                    });
                });
            }
        }, {
            key: 'setupZoomables',
            value: function setupZoomables(cardnode) {
                $(cardnode).find('figure.zoomable').each(function () {
                    // zoomfun()
                });
            }
        }, {
            key: 'iconsPath',
            get: function get() {
                return "icons";
            }
        }]);

        return XMLIndexParser;
    }(XMLParser);

    var XMLCardParser = function (_XMLParser2) {
        _inherits(XMLCardParser, _XMLParser2);

        function XMLCardParser() {
            _classCallCheck(this, XMLCardParser);

            return _possibleConstructorReturn(this, (XMLCardParser.__proto__ || Object.getPrototypeOf(XMLCardParser)).apply(this, arguments));
        }

        _createClass(XMLCardParser, [{
            key: 'parseXML',
            value: function parseXML(xmldat) {
                var _this35 = this;

                return new Promise(function (resolve, reject) {

                    var template = $($(xmldat).find('content')).attr('template');
                    var targetdat = void 0;

                    if (template == 3) {
                        targetdat = {
                            'leftcol': {},
                            'rightcol': {},
                            'bottomcol': {}
                        };
                    } else {
                        targetdat = {
                            'leftcol': {},
                            'rightcol': {}
                        };
                    }

                    targetdat.template = template;
                    targetdat.type = $($(xmldat).find('card')).attr('type').replace(/\s/g, '_');
                    var header = $(xmldat).find("h1");
                    if (header.length > 0) {
                        var title = _this35.preserveTags(header[0].innerHTML);
                        targetdat.header = title;
                    }

                    var preview = $(xmldat).find("preview");
                    var previewText = preview.find("text");
                    if (previewText.length > 0) {
                        preview = _this35.preserveTags(previewText[0].innerHTML);
                    } else {
                        var previewImage = preview.find("img");
                        if (previewImage.length > 0) {
                            var image = $(previewImage[0]);
                            var src = image.attr('src');
                            image.attr('src', _this35.createLinkURL(src));
                            preview = previewImage[0].outerHTML;
                        }
                    }

                    targetdat.preview = preview;
                    targetdat.tooltipdata = {};
                    var cols = $(xmldat).find("column");
                    var keydat = Object.keys(targetdat);
                    var imgindex = 0,
                        plaintext = '';

                    for (var index = 0; index < cols.length; index++) {
                        var sourcecol = $(cols[index]).children();
                        targetdat[keydat[index]] = {};
                        var newnodes = [];
                        for (var i = 0; i < sourcecol.length; i++) {
                            var type = sourcecol[i].nodeName;
                            var html = sourcecol[i].innerHTML;
                            var nodes = "";
                            var node = {};
                            // content type: PREVIEW, TEXT, VIDEO, GROUPIMAGE, SINGLEIMAGE, GLOSS_LINK, DETAIL_LINK, DETAIL_ZOOM, SPACE
                            if (type == "text") {
                                html = _this35.replaceCDATA(html);
                                html = html.replace(/-([a-z]) /gi, "$1");
                                // UO: The following line is in conflict with URL like tete-a-tete.xml
                                html = html.replace(/-([a-z])/gi, "$1");
                                nodes = $.parseHTML(html);
                                node.type = 'text';
                                node.html = '';
                                for (var j = 0; j < nodes.length; j++) {
                                    if (nodes[j].nodeName == "P") {
                                        var links = nodes[j].getElementsByTagName('a');
                                        for (var k = 0; k < links.length; k++) {
                                            var ref = _this35.createLinkURL(links[k].href);
                                            $(links[k]).attr('data-target', ref);
                                            targetdat.tooltipdata[ref] = "";
                                            links[k].href = "#";
                                            var linktype = "";
                                            if (links[k].href.indexOf("glossar") != -1) {
                                                linktype = "glossLink";
                                            } else if (links[k].hasAttribute("imagehighlightid")) {
                                                linktype = "detailLink";
                                                links[k].id = $(links[k]).attr('imagehighlightid').replace(/\./g, "_");
                                            } else {
                                                linktype = "glossLink";
                                            }
                                            $(links[k]).attr("class", linktype);
                                            /*** UO: This crashed on Firefox 48. Seems to be unnecessary.
                                             nodes[j].getElementsByTagName("a")[k] = links[k]
                                               ***/
                                        }
                                        node.html += '<p> ' + nodes[j].innerHTML + ' </p>';
                                        //UO: Enable the following line to remove all links from P tags
                                        // node.html += '<p> ' + nodes[j].innerText + ' </p>'
                                        plaintext += nodes[j].innerText;
                                    } else if (nodes[j].nodeName == "H2") {
                                        node.html += '<h2> ' + nodes[j].innerHTML + ' </h2>';
                                        plaintext += nodes[j].innerText;
                                    }
                                }
                            }

                            if (type == "img") {

                                imgindex = imgindex + 1;

                                if ($(sourcecol[i]).attr('src').indexOf(".f4v") >= 0) {

                                    node.type = 'video';
                                    node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                                    node.source = $(sourcecol[i]).attr('src').replace('f4v', 'mp4');
                                    node.id = 'zoomable' + imgindex;
                                    node.iconid = 'zoom' + imgindex;
                                    node.cap = _this35.caption(sourcecol[i]);
                                    node.zoomcap = _this35.zoomCaption(sourcecol[i]);
                                } else {

                                    node.type = 'singleimage';
                                    node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                                    node.source = $(sourcecol[i]).attr('src');
                                    node.id = 'zoomable' + imgindex;
                                    node.iconid = 'zoom' + imgindex;
                                    node.cap = _this35.caption(sourcecol[i]);
                                    node.zoomcap = _this35.zoomCaption(sourcecol[i]);

                                    //walk throungh highlights
                                    nodes = $.parseHTML(html);
                                    var highlights = [];

                                    for (var _j = 0; _j < nodes.length; _j++) {

                                        if (nodes[_j].nodeName == "HIGHLIGHT") {
                                            console.log('parsing highlight');

                                            var _ref21 = _this35.createLinkURL($(nodes[_j]).attr('href'));

                                            targetdat.tooltipdata[_ref21] = "";

                                            var subnode = {};

                                            subnode.id = ($(nodes[_j]).attr('id') + "Detail").replace(/\./g, "_");
                                            subnode.src = $(nodes[_j]).attr('id').replace(".jpg", "").replace(/.h\d+/, "").replace(".", "/") + ".jpg";

                                            var style = "";
                                            style = style + "left:" + $(nodes[_j]).attr('x') * 100 + "%;";
                                            style = style + "top:" + $(nodes[_j]).attr('y') * 100 + "%;";
                                            style = style + "height:" + $(nodes[_j]).attr('radius') * 200 + "%;";
                                            style = style + "width:" + $(nodes[_j]).attr('radius') * 200 + "%;";
                                            /*style = style + "position:" + "relative;"
                                            style = style + "left:" + $(nodes[j]).attr('x') + ";"
                                            style = style + "top:" + $(nodes[j]).attr('y') + ";"
                                            style = style + "height:" + $(nodes[j]).attr('radius') * 180 + "%;"
                                            style = style + "width:" + $(nodes[j]).attr('radius') * 180 + "%;"*/

                                            style = style + "background-image:url(" + _ref21.replace("xml", "jpg") + ");";

                                            subnode.style = style;
                                            subnode.target = _ref21;
                                            subnode.radius = $(nodes[_j]).attr('radius');

                                            console.log(subnode.src, subnode.target);

                                            highlights.push(subnode);
                                        }
                                    }
                                    node.highlights = highlights.reverse();
                                }
                            }

                            if (type == "space" & i == 0) {
                                node.type = 'space';
                                node.height = $(sourcecol[i]).attr('height') + "px";
                            }

                            if (type == "imggroup") {

                                node.type = 'groupimage';
                                node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                                node.figures = {};

                                for (var _j2 = 0; _j2 < $(sourcecol[i]).children('img').length; _j2++) {

                                    imgindex += 1;
                                    var srcimg = $(sourcecol[i]).children('img')[_j2];

                                    node.figures[_j2 + 1] = {};
                                    node.figures[_j2 + 1].source = $(srcimg).attr('src');
                                    node.figures[_j2 + 1].id = 'zoomable' + imgindex;
                                    node.figures[_j2 + 1].iconid = 'zoom' + imgindex;
                                    node.figures[_j2 + 1].cap = _this35.caption(srcimg);
                                    node.figures[_j2 + 1].zoomcap = _this35.zoomCaption(srcimg);
                                }
                            }
                            newnodes.push(node);
                        }
                        targetdat[keydat[index]] = newnodes.reverse();
                    }
                    targetdat.plaintext = plaintext;
                    var tooltipRefs = Object.keys(targetdat.tooltipdata);
                    //console.log(tooltipRefs)
                    var linkpromises = [];
                    var _iteratorNormalCompletion35 = true;
                    var _didIteratorError35 = false;
                    var _iteratorError35 = undefined;

                    try {
                        var _loop = function _loop() {
                            var i = _step35.value;

                            var url = i;
                            var parser = new XMLParser(url);
                            var promise = parser.loadXML().then(function (xml) {
                                var img = $(xml).find('img');
                                for (var _i2 = 0; _i2 < img.length; _i2++) {
                                    var _src = $(img[_i2]).attr('src');
                                    $(img[_i2]).attr('src', _this35.createLinkURL(_src));
                                }
                                var linkdat = $(xml).find('content').html();
                                linkdat = _this35.replaceCDATA(linkdat);
                                linkdat = _this35.replaceText(linkdat);
                                targetdat.tooltipdata[url] = linkdat;
                            }).catch(function (error) {
                                console.error("Could not load XML at: " + url, error);
                            });
                            linkpromises.push(promise);
                        };

                        for (var _iterator35 = tooltipRefs[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
                            _loop();
                        }
                    } catch (err) {
                        _didIteratorError35 = true;
                        _iteratorError35 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion35 && _iterator35.return) {
                                _iterator35.return();
                            }
                        } finally {
                            if (_didIteratorError35) {
                                throw _iteratorError35;
                            }
                        }
                    }

                    Promise.all(linkpromises).then(function (input) {
                        resolve(targetdat);
                    });
                });
            }
        }, {
            key: 'replaceText',
            value: function replaceText(html) {
                return html.replace(/<\/text>/g, "").replace(/<text>/g, "").replace(/\t/g, "").replace(/"/g, "'").replace(/\n/g, '').replace(/\r/g, '');
            }
        }, {
            key: 'replaceCDATA',
            value: function replaceCDATA(html) {
                if (html) return html.replace(/<\!\[CDATA\[/g, "").replace(/]]>/g, "");else {
                    console.error("Could not replace CDATA at '" + this.path + "': " + html);
                    return "CDATA-ERROR";
                }
            }
        }, {
            key: 'replaceEscapedAngleBrackets',
            value: function replaceEscapedAngleBrackets(html) {
                return html.replace(/\t/g, "").replace(/&lt;/, "<").replace(/&gt;/, ">");
            }
        }, {
            key: 'preserveTags',
            value: function preserveTags(html) {
                return this.replaceEscapedAngleBrackets(html);
            }
        }, {
            key: 'caption',
            value: function caption(element) {
                try {
                    return this.replaceEscapedAngleBrackets($(element).attr('caption'));
                } catch (e) {
                    return "Missing Caption";
                }
            }
        }, {
            key: 'zoomCaption',
            value: function zoomCaption(element) {
                try {
                    return this.replaceEscapedAngleBrackets($(element).attr('zoomCaption'));
                } catch (e) {
                    return "Missing ZoomCaption";
                }
            }

            /* Converts absolute URLs in href attributes created by the DOM builder
                into correct src url. */

        }, {
            key: 'createLinkURL',
            value: function createLinkURL(href) {
                var last = this.extractLastSegment(href);
                var rest = this.removeLastSegment(href);
                var first = this.extractLastSegment(rest);
                return this.basePath + '/' + first + '/' + last;
            }
        }]);

        return XMLCardParser;
    }(XMLParser);

    var XMLCardLoader = function (_CardLoader2) {
        _inherits(XMLCardLoader, _CardLoader2);

        function XMLCardLoader(src) {
            var _ref22 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref22$x = _ref22.x,
                x = _ref22$x === undefined ? 0 : _ref22$x,
                _ref22$y = _ref22.y,
                y = _ref22$y === undefined ? 0 : _ref22$y,
                _ref22$width = _ref22.width,
                width = _ref22$width === undefined ? 1400 : _ref22$width,
                _ref22$height = _ref22.height,
                height = _ref22$height === undefined ? 1200 : _ref22$height,
                _ref22$maxWidth = _ref22.maxWidth,
                maxWidth = _ref22$maxWidth === undefined ? null : _ref22$maxWidth,
                _ref22$maxHeight = _ref22.maxHeight,
                maxHeight = _ref22$maxHeight === undefined ? null : _ref22$maxHeight,
                _ref22$scale = _ref22.scale,
                scale = _ref22$scale === undefined ? 1 : _ref22$scale,
                _ref22$minScale = _ref22.minScale,
                minScale = _ref22$minScale === undefined ? 0.25 : _ref22$minScale,
                _ref22$maxScale = _ref22.maxScale,
                maxScale = _ref22$maxScale === undefined ? 2 : _ref22$maxScale,
                _ref22$rotation = _ref22.rotation,
                rotation = _ref22$rotation === undefined ? 0 : _ref22$rotation;

            _classCallCheck(this, XMLCardLoader);

            var _this36 = _possibleConstructorReturn(this, (XMLCardLoader.__proto__ || Object.getPrototypeOf(XMLCardLoader)).call(this, src, { x: x, y: y, width: width, height: height, maxWidth: maxWidth, maxHeight: maxHeight,
                scale: scale, minScale: minScale, maxScale: maxScale, rotation: rotation }));

            _this36.xmlParser = new XMLIndexParser(_this36.src, { width: width, height: height });
            return _this36;
        }

        _createClass(XMLCardLoader, [{
            key: 'load',
            value: function load(domNode) {
                var _this37 = this;

                console.log("domNode", domNode);
                return new Promise(function (resolve, reject) {
                    _this37.xmlParser.loadParseAndCreateDOM().then(function (domTree) {
                        domNode.appendChild(domTree);
                        //         let scaleW = this.maxWidth / this.wantedWidth
                        //                 let scaleH = this.maxHeight / this.wantedHeight
                        //                 this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))

                        _this37.scale = 1 / (window.devicePixelRatio || 1);
                        var w = _this37.wantedWidth;
                        var h = _this37.wantedHeight;
                        $(domNode).css({ 'width': w,
                            'maxWidth': w,
                            'minWidth': w,
                            'height': h });
                        _this37.addedNode = domTree;
                        _this37.xmlParser.completed(domNode);
                        resolve(_this37);
                    }).catch(function (reason) {
                        console.warn("loadParseAndCreateDOM error", reason);
                        reject(reason);
                    });
                });
            }
        }]);

        return XMLCardLoader;
    }(CardLoader);

    var data = [];
    var existing = [41, 1, 3, 19, 69, 20, 24, 27, 28, 29, 31];

    function pad(num, size) {
        var s = num + "";
        while (s.length < size) {
            s = "0" + s;
        }return s;
    }

    function setupData() {
        var dir = "../../var/eyevisit/cards/";
        for (var i = 0; i < 3; i++) {
            var cardIndex = existing[i];
            var key = pad(cardIndex, 3);
            var img = dir + key + "/" + key + ".jpg";
            var xml = dir + key + "/" + key + ".xml";
            data.push({ front: img,
                back: xml });
        }
    }

    function run() {
        setupData();
        var scatterContainer = new DOMScatterContainer(main);
        if (Capabilities.supportsTemplate()) {
            data.forEach(function (d) {
                var flip = new DOMFlip(scatterContainer, flipTemplate, new ImageLoader(d.front, { minScale: 0.1, maxScale: 3, maxWidth: main.clientWidth / 4 }), new XMLCardLoader(d.back)); // ImageLoader(d.back)) //
                flip.load().then(function (flip) {
                    var bounds = flip.flippable.scatter.bounds;
                    var w = bounds.width;
                    var h = bounds.height;
                    var x = w / 2 + Math.random() * (main.clientWidth - w);
                    var y = h / 2 + Math.random() * (main.clientHeight - h);
                    var angle = 0; //Math.random()*360
                    flip.flippable.scatter.rotationDegrees = angle;
                    flip.centerAt({ x: x, y: y });
                });
            });
        } else {
            alert("Templates not supported, use Edge, Chrome, Safari or Firefox.");
        }
    }

    run();
})();
