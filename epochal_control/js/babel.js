'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var Frame = function Frame() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, Frame);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.scale = 1;
    };

    var View = function (_Frame) {
        _inherits(View, _Frame);

        function View() {
            _classCallCheck(this, View);

            return _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).apply(this, arguments));
        }

        _createClass(View, [{
            key: 'clear',

            /* Base class for virtual views which arrange thumbnails. */

            value: function clear() {
                app.scene.clear();
            }
        }, {
            key: 'adjust',
            value: function adjust() {
                var xx = this.movableX ? this.x : 0;
                var yy = this.movableY ? this.y : 0;
                var scale = this.scale;
                app.scene.reset(xx, yy, scale);
            }
            //
            //     save(x, y, scale) {
            //         console.log("save")
            //         this.scale = scale
            //         this.x = x
            //         this.y = y
            //     }

        }, {
            key: 'resize',
            value: function resize(w, h) {
                this.w = w;
                this.h = h;
                app.resizeStage(w, h);
            }
        }, {
            key: 'movableX',
            get: function get() {
                return false;
            }
        }, {
            key: 'movableY',
            get: function get() {
                return false;
            }
        }]);

        return View;
    }(Frame);

    var Overview = function (_View) {
        _inherits(Overview, _View);

        function Overview() {
            _classCallCheck(this, Overview);

            return _possibleConstructorReturn(this, (Overview.__proto__ || Object.getPrototypeOf(Overview)).apply(this, arguments));
        }

        _createClass(Overview, [{
            key: 'layout',
            value: function layout(w, h) {
                if (app.timebar) app.timebar.clear();
                var tx = 0,
                    ty = 0;
                var start = 0,
                    index = 0;
                var dx = 2,
                    dy = 4;
                var hh = app.wantedThumbHeight;
                app.allData.forEach(function (d) {
                    var scale = d.scaledWidth / d.width;
                    var ww = d.scaledWidth * (hh / d.scaledHeight);
                    var wwdx = ww + dx;
                    if (tx + wwdx > w) {
                        var delta = (w - tx) / (index - start - 1);
                        var j = 0;
                        for (var i = start; i < index; i++) {
                            app.allData[i].x += j * delta;
                            j++;
                        }
                        tx = 0;
                        ty += hh + dy;
                        start = index;
                    }
                    d.x = tx;
                    d.y = ty;
                    d.width = ww;
                    d.height = hh;
                    tx += wwdx;
                    index++;
                });
                this.resize(w - 8, Math.min(h - 66, ty + hh));
            }
        }]);

        return Overview;
    }(View);

    var FontInfo = function () {
        function FontInfo() {
            _classCallCheck(this, FontInfo);
        }

        _createClass(FontInfo, null, [{
            key: 'small',
            get: function get() {
                return { fontFamily: 'Arial',
                    fontSize: 14,
                    stroke: 'black',
                    fill: 'white' };
            }
        }, {
            key: 'normal',
            get: function get() {
                return { fontFamily: 'Arial',
                    fontSize: 24,
                    stroke: 'black',
                    fill: 'white' };
            }
        }, {
            key: 'centered',
            get: function get() {
                return { fontFamily: 'Arial',
                    fontSize: 24,
                    stroke: 'black',
                    align: 'center',
                    fill: 'white' };
            }
        }]);

        return FontInfo;
    }();

    var LabeledGraphics = function (_PIXI$Graphics) {
        _inherits(LabeledGraphics, _PIXI$Graphics);

        function LabeledGraphics() {
            _classCallCheck(this, LabeledGraphics);

            var _this3 = _possibleConstructorReturn(this, (LabeledGraphics.__proto__ || Object.getPrototypeOf(LabeledGraphics)).call(this));

            _this3.labels = new Map();
            return _this3;
        }

        _createClass(LabeledGraphics, [{
            key: 'ensureLabel',
            value: function ensureLabel(key, label, attrs) {
                var fontInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FontInfo.small;

                if (!this.labels.has(key)) {
                    var _text = new PIXI.Text(label, fontInfo);
                    this.labels.set(key, _text);
                    this.addChild(_text);
                }
                var text = this.labels.get(key);
                for (var k in attrs) {
                    text[k] = attrs[k];
                }
                if (label != text.text) text.text = label;
                text.anchor.y = 0.5;
                switch (attrs.align) {
                    case 'right':
                        text.anchor.x = 1;
                        break;
                    case 'center':
                        text.anchor.x = 0.5;
                        break;
                    default:
                        text.anchor.x = 0;
                        break;
                }
                text.visible = true;
                return text;
            }
        }, {
            key: 'clear',
            value: function clear() {
                _get(LabeledGraphics.prototype.__proto__ || Object.getPrototypeOf(LabeledGraphics.prototype), 'clear', this).call(this);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.labels.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        var label = this.labels.get(key);
                        label.visible = false;
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
            }
        }]);

        return LabeledGraphics;
    }(PIXI.Graphics);

    function lerp(start, stop, amt) {
        return amt * (stop - start) + start;
    }

    var TimeScrollbar = function (_LabeledGraphics) {
        _inherits(TimeScrollbar, _LabeledGraphics);

        function TimeScrollbar() {
            _classCallCheck(this, TimeScrollbar);

            var _this4 = _possibleConstructorReturn(this, (TimeScrollbar.__proto__ || Object.getPrototypeOf(TimeScrollbar)).call(this));

            _this4.inset = 32;
            _this4.years = [-300, 0, 500, 1000, 1500, 1600, 1700, 1800, 1900, 2000];
            _this4.dot = new PIXI.Graphics();
            _this4.dot.beginFill(0xFFFFFF, 1);
            _this4.dot.drawCircle(0, 0, 4);
            _this4.addChild(_this4.dot);
            _this4.setup();
            return _this4;
        }

        _createClass(TimeScrollbar, [{
            key: 'clear',
            value: function clear() {
                _get(TimeScrollbar.prototype.__proto__ || Object.getPrototypeOf(TimeScrollbar.prototype), 'clear', this).call(this);
                this.dot.visible = false;
            }
        }, {
            key: 'setup',
            value: function setup() {
                var start = this.onDragStart.bind(this);
                var move = this.onDragMove.bind(this);
                var end = this.onDragEnd.bind(this);
                this.interactive = true;
                this.on('mousedown', start).on('touchstart', start).on('mouseup', end).on('mouseupoutside', end).on('touchend', end).on('touchendoutside', end).on('mousemove', move).on('touchmove', move);
            }
        }, {
            key: 'onDragStart',
            value: function onDragStart(event) {
                // store a reference to the data
                // the reason for this is because of multitouch
                // we want to track the movement of this particular touch
                this.data = event.data;
                this.dragging = true;
                var p = this.data.getLocalPosition(this.parent);
                this.moveDot(p.x);
            }
        }, {
            key: 'onDragEnd',
            value: function onDragEnd(event) {
                this.dragging = false;
                this.data = null;
            }
        }, {
            key: 'onDragMove',
            value: function onDragMove(event) {
                if (this.dragging) {
                    var p = this.data.getLocalPosition(this.parent);
                    this.moveDot(p.x);
                }
            }
        }, {
            key: 'yearToX',
            value: function yearToX(t, start, end, w, inset) {
                var value = t / (end - start);
                return lerp(inset, w - inset, value);
            }
        }, {
            key: 'moveDot',
            value: function moveDot(x) {
                var inset = this.inset;
                var timeline = app.currentView;
                var start = timeline.yearToX(-320);
                var end = timeline.yearToX(2010);
                if (x < inset) x = inset;
                if (x > this.wantedWidth - inset) x = this.wantedWidth - inset;
                this.dot.x = x;
                x = x - inset;
                var w = this.wantedWidth - 2 * inset;
                var ratio = x / w;
                var sceneX = ratio * (end - start - this.wantedWidth);
                app.scene.x = -sceneX;
            }
        }, {
            key: 'timelineToDotX',
            value: function timelineToDotX(xPos) {
                var inset = this.inset;
                var timeline = app.timeline;
                var start = timeline.yearToX(this.years[0]);
                var end = timeline.yearToX(this.years[9]);
                var w = this.wantedWidth;
                var x = inset + (-xPos - start) / (end - start) * (w - 2 * inset);
                if (x < inset) x = inset;
                if (x > this.wantedWidth - inset) x = this.wantedWidth - inset;
                return x;
            }
        }, {
            key: 'sceneMoved',
            value: function sceneMoved(x) {
                this.dot.x = this.timelineToDotX(x);
            }
        }, {
            key: 'layout',
            value: function layout(timeline, w, h, bottom) {
                var inset = this.inset;
                this.clear();
                this.beginFill(0x000000);
                this.drawRect(0, bottom - 22, w, 44);

                this.lineStyle(1, 0xFFFFFF);
                this.moveTo(inset, bottom);
                this.lineTo(w - inset, bottom);
                var start = timeline.yearToX(this.years[0]);
                var end = timeline.yearToX(this.years[9]);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.years[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var year = _step2.value;

                        var t = timeline.yearToX(year);
                        var _x6 = this.yearToX(t, start, end, w, inset);
                        var label = this.ensureLabel('key' + year, year.toString(), { align: 'center' });
                        label.x = _x6;
                        label.y = bottom - 12;
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

                this.dot.visible = true;
                this.dot.y = bottom;
                this.wantedWidth = w;
                var xx = this.timelineToDotX(app.timeline.x);
                this.dot.x = xx;
            }
        }]);

        return TimeScrollbar;
    }(LabeledGraphics);

    var Timeline = function (_View2) {
        _inherits(Timeline, _View2);

        function Timeline() {
            _classCallCheck(this, Timeline);

            var _this5 = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this));

            _this5.startYear = -320;

            _this5.epochLabels = ['ANTIKE', 'MITTELALTER', 'RENAISSANCE', 'EUROPÄISCHER BAROCK', 'BAROCK IM NORDEN EUROPAS', '18. JAHRHUNDERT', 'ROMANTIK & MODERNE'];

            _this5.extraLabels = [[0, '• Christi Geburt'], [780, '• Christianisierung Nordwestdeutschlands'], [1130, '• Heinrich der Löwe'], [1492, '• Entdeckung Amerikas'], [1517, '• Beginn der Reformation'], [1618, '• Beginn des Dreißigjährigen Krieges'], [1648, '• Ende des Dreißigjährigen Krieges'], [1633, '• Geburt Herzog Anton Ulrichs'], [1694, '• Einweihung des Schlosses Salzdahlum'], [1714, '• Tod Herzog Anton Ulrichs'], [1754, '• Eröffnung des Herzog Anton Ulrich-Museums'], [1789, '• Französische Revolution'], [1806, '• Napoleonische Besetzung, Zeitweise Überführung der Bestände in den Louvre'], [1887, '• Eröffnung des Neubaus des HAUM'], [1914, '• Erster Weltkrieg'], [1939, '• Zweiter Weltkrieg']];

            _this5.epochColors = [[0xFFFFFF, 'black'], // [ background color, font color ]
            [0x3333CC, 'white'], [0xF76B00, 'white'], [0xCE1018, 'white'], [0xA5B531, 'white'], [0x639CAD, 'white'], [0xFFFFFF, 'black']];

            _this5.renaissanceStarts = 1450;
            _this5.modernStarts = 1800;

            _this5.epochStarts = [-320, 600, 1450, 1600, 1608, 1700, 1800];
            _this5.epochEnds = [600, 1450, 1600, 1680, 1700, 1800, 2010];
            _this5.epochNumLabels = [3, 2, 4, 3, 3, 3, 3];
            _this5.epochTimeResolution = [100, 100, 10, 10, 10, 10, 10];
            return _this5;
        }

        _createClass(Timeline, [{
            key: 'yearToX',
            value: function yearToX(year) {
                year -= this.startYear;
                var newness = this.renaissanceStarts - this.startYear;
                var modern = this.modernStarts - this.startYear;

                var oldSize = 1.0;
                var newSize = 17.5;
                var modernSize = 10.0;

                var startNew = newness * oldSize;
                if (year < newness) return year * oldSize;

                if (year > modern) return startNew + (modern - newness) * newSize + (year - modern) * modernSize;

                return startNew + (year - newness) * newSize;
            }
        }, {
            key: 'smallFont',
            value: function smallFont(color) {
                return { fontFamily: 'Arial',
                    fontSize: 14,
                    stroke: color,
                    fill: color };
            }
        }, {
            key: 'layoutEpochs',
            value: function layoutEpochs(w, h, bottom) {
                var graphics = app.scene;
                var last = this.yearToX(2010);
                var y = bottom - 32;
                var i = 0;
                var lastEnd = 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.epochLabels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var epoch = _step3.value;

                        var offsetY = 0;

                        var _epochColors$i = _slicedToArray(this.epochColors[i], 2),
                            color = _epochColors$i[0],
                            fontColor = _epochColors$i[1];

                        var start = this.yearToX(this.epochStarts[i]);
                        var end = this.yearToX(this.epochEnds[i]);
                        if (start < lastEnd) offsetY = -14;
                        graphics.lineStyle(14, color);
                        graphics.moveTo(start, y + offsetY);
                        graphics.lineTo(end, y + offsetY);
                        var numLabels = this.epochNumLabels[i];
                        var xx = start;
                        var delta = (end - start) / (numLabels - 1);

                        var key = this.epochLabels[i];
                        for (var j = 0; j < numLabels; j++) {
                            var align = 'center';
                            var offsetX = 0;
                            if (j == 0) {
                                align = 'left';
                                offsetX = 4;
                            }
                            if (j == numLabels - 1) {
                                align = 'right';
                                offsetX = -4;
                            }
                            var label = graphics.ensureLabel('epoch' + key + j, key, { align: align }, this.smallFont(fontColor));
                            label.x = xx + offsetX;
                            label.y = y + offsetY;
                            xx += delta;
                        }

                        graphics.lineStyle(1, color, 0.2);
                        var resolution = this.epochTimeResolution[i];
                        var t1 = this.epochStarts[i];
                        var first = t1 - t1 % 100;

                        for (var t = first; t < this.epochEnds[i]; t += resolution) {
                            if (t < t1) continue;
                            var _x7 = this.yearToX(t);
                            graphics.moveTo(_x7, y + offsetY);
                            graphics.lineTo(_x7, 0);
                            var _label = graphics.ensureLabel('year' + t, t.toString(), { align: 'left' }, this.smallFont('gray'));
                            _label.x = _x7 + 4;
                            _label.y = 7;
                        }

                        i++;
                        lastEnd = end;
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

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.extraLabels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _step4$value = _slicedToArray(_step4.value, 2),
                            year = _step4$value[0],
                            _key = _step4$value[1];

                        var _x8 = this.yearToX(year);
                        var _label2 = graphics.ensureLabel('extra' + year, _key, { align: 'left' }, this.smallFont('gray'));
                        _label2.x = _x8;
                        _label2.y = 44;
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
            }
        }, {
            key: 'layout',
            value: function layout(w, h) {
                var _this6 = this;

                var margin = 4;
                var maxX = 0;
                var baseY = h - 160;
                var yy = baseY - 100;
                var r = new Frame();
                // Layout thumbnails
                app.allData.forEach(function (d) {
                    var ww = d.scaledWidth;
                    var hh = d.scaledHeight;
                    var year = d.year;
                    var x = _this6.yearToX(year);
                    var y = yy;
                    if (x < r.x + r.w && y > r.y - r.h) {
                        y = r.y - r.h - margin;
                    }
                    if (y < 100) {
                        y = yy;
                    }
                    r = new Frame(x, y, ww, hh);
                    d.x = x;
                    d.y = y;
                    d.width = ww;
                    d.height = hh;
                    maxX = Math.max(x + ww, maxX);
                });
                var bottom = baseY + 32;
                app.timebar.layout(this, w, h, bottom);
                this.layoutEpochs(w, h, bottom);
                this.resize(maxX, bottom);
            }
        }, {
            key: 'movableX',
            get: function get() {
                return true;
            }
        }]);

        return Timeline;
    }(View);

    var MapView = function (_View3) {
        _inherits(MapView, _View3);

        function MapView() {
            _classCallCheck(this, MapView);

            var _this7 = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this));

            _this7.map = PIXI.Sprite.fromImage('./Lageplan2.png');
            return _this7;
        }

        _createClass(MapView, [{
            key: 'clear',
            value: function clear() {
                _get(MapView.prototype.__proto__ || Object.getPrototypeOf(MapView.prototype), 'clear', this).call(this);
                this.map.visible = false;
            }
        }, {
            key: 'layout',
            value: function layout(w, h) {
                this.map.visible = true;
                app.scene.addChildAt(this.map, 0);
                app.timebar.clear();
                var baseY = h - 32;
                this.resize(2048, baseY + 32);

                app.allData.forEach(function (d) {
                    var ww = d.scaledWidth * 0.75;
                    var hh = d.scaledHeight * 0.75;
                    d.x = d.mapX - ww / 2;
                    d.y = d.mapY - hh / 2;
                    d.width = ww;
                    d.height = hh;
                });
            }
        }, {
            key: 'movableX',
            get: function get() {
                return true;
            }
        }, {
            key: 'movableY',
            get: function get() {
                return true;
            }
        }]);

        return MapView;
    }(View);

    var CategoryView = function (_View4) {
        _inherits(CategoryView, _View4);

        function CategoryView() {
            _classCallCheck(this, CategoryView);

            return _possibleConstructorReturn(this, (CategoryView.__proto__ || Object.getPrototypeOf(CategoryView)).apply(this, arguments));
        }

        _createClass(CategoryView, [{
            key: 'layout',
            value: function layout(w, h) {
                if (app.timebar) app.timebar.clear();
                var baseY = h - 32;
                this.resize(w, baseY + 32);

                //rescale background image
                /*this.ratio = this.backgroundImg.width / app.width
                //console.log("rescaling bgImage (layout)",this.backgroundImg.width,app.width,this.ratio)
                this.backgroundImg.width = app.width
                this.backgroundImg.height = this.backgroundImg.height / this.ratio*/

                this.viewHeight = app.height * 0.85; //that's really a rough estimate...
                this.ratio = this.backgroundImg.height / this.viewHeight;
                this.backgroundImg.height = this.viewHeight;
                this.backgroundImg.width = this.backgroundImg.width / this.ratio;
                if (this.offsetX) this.oldOffsetX = this.offsetX;else this.oldOffsetX = 0;
                this.offsetX = (app.width - this.backgroundImg.width) / 2;
                this.backgroundImg.x = this.offsetX;

                //add background to stage
                app.stage.addChildAt(this.bgSprite, 0);
                var bgRectangle = new PIXI.Graphics();
                bgRectangle.beginFill(0x000000);
                bgRectangle.drawRect(0, 0, app.width, app.height);
                bgRectangle.endFill();
                this.bgSprite.addChildAt(bgRectangle, 0);
                //this.bgSprite.y = app.height * 0.05

                //resize thumbs
                app.allData.forEach(function (d) {
                    //this.thumbScaleFactor = 2048 / app.width
                    this.thumbScaleFactor = 1280 / this.viewHeight;
                    var thumbSizeScaled = 205 / this.thumbScaleFactor;
                    var scaleFactorToCurrentSize = thumbSizeScaled / d.scaledHeight;
                    var ww = d.scaledWidth * scaleFactorToCurrentSize;
                    var hh = d.scaledHeight * scaleFactorToCurrentSize;
                    d.width = ww;
                    d.height = hh;
                }, this);

                //position thumbs
                app.allData.forEach(function (d) {
                    var key = parseInt(d.ref);
                    //console.log("finding position for artwork:",key)
                    //console.log(this.positions[key])
                    var target = this.positions[key];
                    if (target == undefined) {
                        d.x = -d.width;
                        d.y = 0;
                    } else {
                        d.x = target.x / this.thumbScaleFactor + this.offsetX;
                        d.y = target.y / this.thumbScaleFactor;
                        //d.y += app.height * 0.05
                    }
                }, this);

                //position and scale info icons
                for (var i = 0; i < 3; i++) {
                    this.categoryInfoIcons[i].x -= this.oldOffsetX;
                    this.categoryInfoIcons[i].width /= this.ratio;
                    this.categoryInfoIcons[i].height /= this.ratio;
                    this.categoryInfoIcons[i].x /= this.ratio;
                    this.categoryInfoIcons[i].y /= this.ratio;
                    this.categoryInfoIcons[i].x += this.offsetX;
                }

                this.clearInfo();
            }
        }, {
            key: 'clear',
            value: function clear() {
                _get(CategoryView.prototype.__proto__ || Object.getPrototypeOf(CategoryView.prototype), 'clear', this).call(this);
                app.stage.removeChild(this.bgSprite);
            }
        }, {
            key: 'init',
            value: function init(backgroundUrl, positionsUrl, categoryUrl) {
                //init background image
                this.bgSprite = new PIXI.Sprite();
                this.backgroundImg = PIXI.Sprite.fromImage(backgroundUrl);
                this.bgSprite.addChildAt(this.backgroundImg, 0);

                //init artwork positions
                var positionsText = this.readTextFile(positionsUrl, false);
                var positionsLines = positionsText.split("\n");
                var positionsDict = {};

                positionsLines.forEach(function (entry) {
                    var curLine = entry.split("\t");
                    if (curLine[0] != "") positionsDict[curLine[0]] = new Point(curLine[1], curLine[2]);
                });

                this.positions = positionsDict;

                //init description texts and info icons
                var categoryXml = this.readTextFile(categoryUrl, true);

                var headers = categoryXml.getElementsByTagName("h1");
                var bodies = categoryXml.getElementsByTagName("body");
                var infoXPositions = categoryXml.getElementsByTagName("infoX");
                var infoYPositions = categoryXml.getElementsByTagName("infoY");

                this.categoryInfoIcons = [];
                this.categoryHeaders = [];
                this.categoryDescriptions = [];
                this.categoryInfoIconPositions = [];
                for (var i = 0; i < 3; i++) {
                    var tmpIcon = PIXI.Sprite.fromImage("./icon_info_1x.png");
                    tmpIcon.interactive = true;
                    this.categoryInfoIcons[i] = tmpIcon;
                    this.bgSprite.addChild(tmpIcon);
                    tmpIcon.click = this.infoSelected.bind(this);
                    tmpIcon.tap = this.infoSelected.bind(this);

                    var tmpPos = new Point(infoXPositions[i].childNodes[0].nodeValue, infoYPositions[i].childNodes[0].nodeValue);
                    this.categoryHeaders[i] = headers[i].childNodes[0].nodeValue;
                    this.categoryDescriptions[i] = bodies[i].childNodes[1].nodeValue;
                    this.categoryInfoIconPositions[i] = tmpPos;
                    this.categoryInfoIcons[i].x = tmpPos.x;
                    this.categoryInfoIcons[i].y = tmpPos.y;
                    this.categoryInfoIcons[i].id = 'catInfoIcon';
                }
                //console.log(this.categoryHeaders)
                //console.log(this.categoryDescriptions[0])

                this.currentInfoIdx = -1;
            }
        }, {
            key: 'infoSelected',
            value: function infoSelected(event) {
                //console.log("info selected",event)

                var d = event.target;
                var idx = this.categoryInfoIcons.indexOf(d);

                //category info views
                this.infoBg = new PIXI.Graphics();
                this.infoBg.beginFill(0x000000, 0.8);
                this.infoBg.drawRect(this.backgroundImg.width / 3 * idx, 0, this.backgroundImg.width / 3, this.backgroundImg.height * 1.1);
                this.infoBg.endFill();
                this.infoBg.x = this.offsetX;

                //text
                var h1style = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: this.backgroundImg.width / 50,
                    //fontWeight: 'bold',
                    fill: 'white',
                    align: 'left',
                    wordWrap: true,
                    wordWrapWidth: 440,
                    dropShadow: true,
                    dropShadowColor: '#000000',
                    dropShadowBlur: 4
                });
                var h1 = new PIXI.Text(this.categoryHeaders[idx], h1style);
                //let h1 = new PIXI.Text("hello", h1style)
                h1.x = this.backgroundImg.width / 3 * idx + this.backgroundImg.width / 24;
                //h1.y = this.backgroundImg.height / 11
                //this.infoBg.addChild(h1)

                var infoTextStyle = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: this.backgroundImg.width / 60,
                    //fontWeight: 'bold',
                    fill: 'white',
                    align: 'left',
                    wordWrap: true,
                    wordWrapWidth: this.backgroundImg.width / 3.75,
                    dropShadow: true,
                    dropShadowColor: '#000000',
                    dropShadowBlur: 4
                });
                var body = new PIXI.Text(this.categoryDescriptions[idx], infoTextStyle);
                //let h1 = new PIXI.Text("hello", h1style)
                body.x = this.backgroundImg.width / 3 * idx + this.backgroundImg.width / 24;
                //body.y = this.backgroundImg.height / 7
                body.y = this.backgroundImg.height / 10;
                this.infoBg.addChild(body);

                if (this.currentInfoIdx != idx) {
                    app.stage.addChild(this.infoBg);
                    this.currentInfoIdx = idx;

                    //logging
                    app.log("category info opened", { id: (idx + 1).toString() });

                    this.infoListener = this.clearInfo.bind(this);
                    window.document.addEventListener('mousedown', this.infoListener, false);
                    window.document.addEventListener('touchstart', this.infoListener, false);
                } else {
                    this.currentInfoIdx = -1;
                }
            }
        }, {
            key: 'clearInfo',
            value: function clearInfo(event) {

                if (app.stage.children.indexOf(this.infoBg) !== -1) {
                    window.document.removeEventListener('mousedown', this.infoListener);
                    window.document.removeEventListener('touchstart', this.infoListener);
                    app.stage.removeChild(this.infoBg);

                    //logging
                    app.log("category info closed", "");

                    //console.log(this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX,event.pageY)))
                    //console.log(event.pageX,event.pageY,this.categoryInfoIcons[this.currentInfoIdx].x,this.categoryInfoIcons[this.currentInfoIdx].y)
                    //console.log(this.categoryInfoIcons[this.currentInfoIdx].width,this.categoryInfoIcons[this.currentInfoIdx].height)
                    //console.log(this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX,event.pageY-64)))

                    if (!this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX, event.pageY - 64))) {
                        this.currentInfoIdx = -1;
                    }
                }
            }
        }, {
            key: 'readTextFile',
            value: function readTextFile(file, targetIsXml) {
                var rawFile = new XMLHttpRequest();
                var response = void 0;
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {
                            if (targetIsXml) response = rawFile.responseXML;else response = rawFile.responseText;
                        }
                    }
                };
                rawFile.send(null);
                return response;
            }
        }]);

        return CategoryView;
    }(View);

    var Point = function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    };

    //
    // description:		module offers local logging in indexedDB
    // author:			Leibniz-Institut für Wissensmedien Tübingen, Andre Klemke
    //

    var LocalLogger = function () {
        function LocalLogger() {
            _classCallCheck(this, LocalLogger);

            this.db = null;
            this.dbrequest = null;
            //window.iwmstudy.logger = this;
        }

        _createClass(LocalLogger, [{
            key: 'init',
            value: function init() {
                this.dbrequest = indexedDB.open('iwmstudy', 1);
                this.dbrequest.addEventListener('upgradeneeded', this.dbUpdateNeeded.bind(this));
                this.dbrequest.addEventListener('success', this.dbOpened.bind(this));
                this.dbrequest.addEventListener('error', console.log('error:', this.dbrequest.error));
            }
        }, {
            key: 'dbUpdateNeeded',
            value: function dbUpdateNeeded(event) {
                // event for db creation or modification
                console.log('local DB created or modified');
                this.db = this.dbrequest.result;
                if (!this.db.objectStoreNames.contains('pagevisit')) {
                    var store = this.db.createObjectStore('pagevisit', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                    store.createIndex('pagevisit_index1', ['studyid', 'runid', 'userid', 'pagecounter', 'pageid'], { unique: false });
                    store.createIndex('pagevisit_index2', ['studyid', 'runid', 'userid', 'dataavailable'], { unique: false });
                    store.createIndex('pagevisit_index3', ['studyid', 'dataavailable'], { unique: false });
                    store.createIndex('pagevisit_index4', ['studyid', 'runid', 'userid', 'pageid'], { unique: false });
                }
                if (!this.db.objectStoreNames.contains('run')) {
                    var _store = this.db.createObjectStore('run', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                    _store.createIndex('run_index1', 'studyid', { unique: false });
                }
                if (!this.db.objectStoreNames.contains('user')) {
                    var _store2 = this.db.createObjectStore('user', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                    _store2.createIndex('user_index1', 'userid', { unique: false });
                }
                if (!this.db.objectStoreNames.contains('message')) {
                    var _store3 = this.db.createObjectStore('message', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                }
                if (!this.db.objectStoreNames.contains('log')) {
                    var _store4 = this.db.createObjectStore('log', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                    _store4.createIndex('log_index1', 'studyid', { unique: false });
                    _store4.createIndex('log_index2', ['studyid', 'timestamp'], {
                        unique: false
                    });
                }
                if (!this.db.objectStoreNames.contains('loganonymous')) {
                    var _store5 = this.db.createObjectStore('loganonymous', {
                        keyPath: 'key',
                        autoIncrement: true
                    });
                }
            }
        }, {
            key: 'dbOpened',
            value: function dbOpened(event) {
                console.log('local DB openend');
                this.db = this.dbrequest.result;
            }
        }, {
            key: 'getPagevisitData',
            value: function getPagevisitData(studyid, runid, userid, pageid, formid, callback) {
                console.log('get pagevisit data ' + pageid + ' ' + formid);
                var trans = this.db.transaction(['pagevisit'], 'readonly');
                var store = trans.objectStore('pagevisit');
                var index = store.index('pagevisit_index4');
                var request = index.openCursor(IDBKeyRange.only([studyid, runid, userid, pageid]));
                var formvalue = void 0;
                var relatedpagecounter = 0;
                request.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        if (cursor.value.pagecounter > relatedpagecounter) {
                            relatedpagecounter = cursor.value.pagecounter;
                            formvalue = null;
                            if (cursor.value.dataavailable == 1) {
                                if (cursor.value.data.hasOwnProperty(formid)) {
                                    formvalue = cursor.value.data[formid];
                                }
                            }
                        }
                        cursor.continue();
                    } else {
                        //self only implemented
                        callback('self.' + pageid + '.' + formid, formvalue);
                    }
                };
            }
        }, {
            key: 'createRun',
            value: function createRun(studyid, conditionid, neededuser, userid, expversion) {
                console.log('creating run for user ' + userid + ' with condition ' + conditionid);
                var lastrunid = 0;
                var trans = this.db.transaction(['run'], 'readonly');
                var store = trans.objectStore('run');
                var index = store.index('run_index1');
                var request = index.openCursor(IDBKeyRange.only(studyid));
                request.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        if (cursor.value.runid > lastrunid) {
                            lastrunid = cursor.value.runid;
                        }
                        cursor.continue();
                    } else {
                        var dbitem = {
                            studyid: studyid,
                            runid: lastrunid + 1,
                            conditionid: conditionid,
                            expversion: expversion,
                            neededuser: neededuser,
                            currentuser: [userid],
                            currentpage: null,
                            pagehistory: null,
                            pagemetadata: null,
                            pagegroupmetadata: null,
                            runtimedata: null
                        };
                        var _trans = iwmstudy.logger.db.transaction(['run'], 'readwrite');
                        var _store6 = _trans.objectStore('run');
                        var _request = _store6.put(dbitem);
                        _request.onsuccess = function (evt) {
                            console.log('run created');
                            var event = new CustomEvent('runready', {
                                detail: { runid: lastrunid + 1 }
                            });
                            window.dispatchEvent(event);
                        };
                    }
                };
            }
        }, {
            key: 'createMessage',
            value: function createMessage(studyid, runid, target, source, mode, type, data) {}
        }, {
            key: 'notifyForAddedUser',
            value: function notifyForAddedUser(studyid, runid) {}
        }, {
            key: 'checkMessages',
            value: function checkMessages(studyid, runid, user) {}
        }, {
            key: 'getRun',
            value: function getRun(studyid, runid) {}
        }, {
            key: 'getRunUser',
            value: function getRunUser(studyid, runid) {}
        }, {
            key: 'getOpenRun',
            value: function getOpenRun(studyid) {
                console.log('check for open run');
                var event = new CustomEvent('openrunresult', {
                    detail: { runfound: false, runid: '0', condition: '', neededuser: 1 }
                });
                window.dispatchEvent(event);
            }
        }, {
            key: 'getExistingOwnRun',
            value: function getExistingOwnRun(studyid, userid) {}
        }, {
            key: 'addUserToRun',
            value: function addUserToRun(studyid, runid, userid) {
                console.log('adding user ' + userid + ' to run ' + runid);
                var event = new CustomEvent('runready', { detail: { runid: runid } });
                window.dispatchEvent(event);
            }
        }, {
            key: 'userSynced',
            value: function userSynced(studyid, runid, syncid) {}
        }, {
            key: 'getUserRole',
            value: function getUserRole(userid, password, study) {}
        }, {
            key: 'getHash',
            value: function getHash(datastring) {
                var bitArray = sjcl.hash.sha256.hash(datastring);
                var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
                return digest_sha256;
            }
        }, {
            key: 'registerUser',
            value: function registerUser(userid, password, email, study, role) {
                console.log('registerUser');
                var trans = this.db.transaction(['user'], 'readonly');
                var store = trans.objectStore('user');
                var index = store.index('user_index1');
                var request = index.openCursor(IDBKeyRange.only(userid));
                request.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        console.log('userid already exists');
                        var event = new CustomEvent('userregistrationfailed', {
                            detail: { cause: 'exists' }
                        });
                        window.dispatchEvent(event);
                    } else {
                        var roles = {};
                        roles[study] = role;
                        var dbitem = {
                            userid: userid,
                            passwordhash: iwmstudy.logger.getHash(password),
                            email: email,
                            roles: roles
                        };
                        var _trans2 = iwmstudy.logger.db.transaction(['user'], 'readwrite');
                        var _store7 = _trans2.objectStore('user');
                        var _request2 = _store7.put(dbitem);
                        _request2.onsuccess = function (evt) {
                            console.log('user created');
                            var event = new CustomEvent('userregistrationsucceeded', {
                                detail: null
                            });
                            window.dispatchEvent(event);
                        };
                    }
                };
            }
        }, {
            key: 'checkUserLogin',
            value: function checkUserLogin(userid, password, study) {}
        }, {
            key: 'addStudyToUser',
            value: function addStudyToUser(userid, study, role) {}
        }, {
            key: 'getLastPagecounter',
            value: function getLastPagecounter(studyid, runid, userid) {}
        }, {
            key: 'pageEntered',
            value: function pageEntered(studyid, runid, userid, pagecounter, pageid, syncid, timestamp, pagehistory) {
                var dbitem = {
                    studyid: studyid,
                    runid: runid,
                    userid: userid,
                    pagecounter: pagecounter,
                    pageid: pageid,
                    syncid: syncid,
                    starttime: timestamp,
                    endtime: null,
                    data: null,
                    dataavailable: 0
                };
                var trans = this.db.transaction(['pagevisit'], 'readwrite');
                var store = trans.objectStore('pagevisit');
                var request = store.put(dbitem);
                request.onsuccess = function (evt) {
                    console.log('logged page ' + pageid + ' entered');
                };
            }
        }, {
            key: 'pageLeft',
            value: function pageLeft(studyid, runid, userid, pagecounter, pageid, timestamp, data, pagemetadata, pagegroupmetadata, runtimedatachanged, runtimedata) {
                var trans = this.db.transaction(['pagevisit'], 'readwrite');
                var store = trans.objectStore('pagevisit');
                var index = store.index('pagevisit_index1');
                var request = index.openCursor(IDBKeyRange.only([studyid, runid, userid, pagecounter, pageid]));
                request.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        //fuer alle passenden Datensaetze (hier nur einer)
                        console.log('logging ' + pageid + ' pagedata');
                        var item = cursor.value;
                        item.endtime = timestamp;
                        item.data = data;
                        if (Object.keys(data).length > 0) {
                            item.dataavailable = 1;
                        }
                        var request2 = cursor.update(item);
                        request2.onsuccess = function () {
                            console.log('logging successfull ' + pageid + ' ' + data);
                        };
                        cursor.continue();
                    }
                };
            }
        }, {
            key: 'logAction',
            value: function logAction(studyid, runid, userid, pagecounter, pageid, timestamp, elapsedtime, action, data) {
                if (this.db === null) {
                    console.warn('logAction db is null: Fix this error');
                    return;
                }
                var dbitem = {
                    studyid: studyid,
                    runid: runid,
                    userid: userid,
                    pagecounter: pagecounter,
                    pageid: pageid,
                    timestamp: timestamp,
                    elapsedtime: elapsedtime,
                    action: action,
                    data: data
                };
                var trans = this.db.transaction(['log'], 'readwrite');
                var store = trans.objectStore('log');
                var request = store.put(dbitem);
                request.onsuccess = function (evt) {
                    console.log('logged action ' + action);
                };
                //console.log(dbitem)
            }
        }, {
            key: 'loganonymous',
            value: function loganonymous(studyid, anonymousrunid, pageid, type, value) {}
        }, {
            key: 'getAllRunData',
            value: function getAllRunData(studyid) {}
        }]);

        return LocalLogger;
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
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = keys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var key = _step5.value;

                        try {
                            result += ' ' + key + ':' + event[key];
                        } catch (e) {
                            console.log('Invalid key: ' + key);
                        }
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
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.extracted[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var line = _step6.value;

                        var _div = document.createElement('div');
                        _div.innerHTML = line;
                        this.popup.appendChild(_div);
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

                var div = document.createElement('div');
                div.innerHTML = '------------ Simulated -----------';
                this.popup.appendChild(div);
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.simulated[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var _line = _step7.value;

                        var _div2 = document.createElement('div');
                        _div2.innerHTML = _line;
                        this.popup.appendChild(_div2);
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

                Elements.setStyle(this.popup, { left: event.clientX + 'px', top: event.clientY + 'px' });
            }
        }]);

        return Events;
    }();

    Events.popup = null;

    Events.debug = true;
    Events.extracted = [];
    Events.simulated = [];

    /* globals WebKitPoint */

    /** Tests whether an object is empty
     * @param {Object} obj - the object to be tested
     * @return {boolean}
     */
    function isEmpty(obj) {
        // > isEmpty({})
        // true
        for (var i in obj) {
            return false;
        }
        return true;
    }

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
                    var _x9 = this.points[i].x;
                    var _y = this.points[i].y;
                    this.points[i].x = Math.cos(rads) * _x9 - Math.sin(rads) * _y;
                    this.points[i].y = Math.sin(rads) * _x9 + Math.cos(rads) * _y;
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
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.points[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var p = _step8.value;

                        result.push(Points.add(p, this.center));
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

                return result;
            }
        }, {
            key: 'flatAbsolutePoints',
            value: function flatAbsolutePoints() {
                var result = new Array();
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this.points[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var p = _step9.value;

                        var a = Points.add(p, this.center);
                        result.push(a.x);
                        result.push(a.y);
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
                for (var _w = 0; _w < this.points.length; _w++) {
                    verty.push(this.points[_w].y + this.center.y);
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
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = this.points[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var p = _step10.value;

                        clone.addPoint(Points.multiplyScalar(p, scale));
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
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = points[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var p = _step11.value;

                        min.x = Math.min(p.x, min.x);
                        max.x = Math.max(p.x, max.x);
                        min.y = Math.min(p.y, min.y);
                        max.y = Math.max(p.y, max.y);
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

                var center = Points.mean(min, max);
                var polygon = new Polygon(center);
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = points[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var _p = _step12.value;

                        polygon.addAbsolutePoint(_p);
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

                return polygon;
            }
        }]);

        return Polygon;
    }();

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
                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    for (var _iterator13 = interfaceKeys[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var key = _step13.value;

                        var interfaceDesc = this.prototype[key];
                        var classDesc = klass.prototype[key];
                        if (typeof classDesc == 'undefined') return 'Missing ' + key;
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

            var _this11 = _possibleConstructorReturn(this, (PointMap.__proto__ || Object.getPrototypeOf(PointMap)).call(this));

            for (var key in points) {
                _this11.set(key, points[key]);
            }
            return _this11;
        }

        _createClass(PointMap, [{
            key: 'toString',
            value: function toString() {
                var points = [];
                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = this.keys()[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var key = _step14.value;

                        var value = this.get(key);
                        points.push(key + ':{x:' + value.x + ', y:' + value.y + '}');
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

                var attrs = points.join(', ');
                return '[PointMap ' + attrs + ']';
            }
        }, {
            key: 'clone',
            value: function clone() {
                var result = new PointMap();
                var _iteratorNormalCompletion15 = true;
                var _didIteratorError15 = false;
                var _iteratorError15 = undefined;

                try {
                    for (var _iterator15 = this.keys()[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                        var key = _step15.value;

                        var value = this.get(key);
                        result.set(key, { x: value.x, y: value.y });
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

                return result;
            }
        }, {
            key: 'farthests',
            value: function farthests() {
                if (this.size == 0) {
                    return null;
                }
                var pairs = [];
                var _iteratorNormalCompletion16 = true;
                var _didIteratorError16 = false;
                var _iteratorError16 = undefined;

                try {
                    for (var _iterator16 = this.values()[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                        var p = _step16.value;
                        var _iteratorNormalCompletion17 = true;
                        var _didIteratorError17 = false;
                        var _iteratorError17 = undefined;

                        try {
                            for (var _iterator17 = this.values()[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                                var q = _step17.value;

                                pairs.push([p, q]);
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
                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                    for (var _iterator18 = this.values()[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                        var p = _step18.value;

                        x += p.x;
                        y += p.y;
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
                var _iteratorNormalCompletion19 = true;
                var _didIteratorError19 = false;
                var _iteratorError19 = undefined;

                try {
                    for (var _iterator19 = Object.keys(this)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                        var key = _step19.value;

                        var value = this[key];
                        if (key == 'about') {
                            values.push(key + ':{x:' + value.x + ', y:' + value.y + '}');
                        } else {
                            values.push(key + ':' + value);
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
                var _iteratorNormalCompletion20 = true;
                var _didIteratorError20 = false;
                var _iteratorError20 = undefined;

                try {
                    for (var _iterator20 = this.current.keys()[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                        var key = _step20.value;

                        var c = this.current.get(key);
                        if (this.previous.has(key)) {
                            var p = this.previous.get(key);
                            current.push(c);
                            previous.push(p);
                        }
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
                var _iteratorNormalCompletion21 = true;
                var _didIteratorError21 = false;
                var _iteratorError21 = undefined;

                try {
                    for (var _iterator21 = this.current.keys()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                        var key = _step21.value;

                        this.previous.set(key, this.current.get(key));
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

            var _this12 = _possibleConstructorReturn(this, (Interaction.__proto__ || Object.getPrototypeOf(Interaction)).call(this));

            _this12.tapDistance = tapDistance;
            _this12.longPressTime = longPressTime;
            _this12.targets = new Map();
            _this12.subInteractions = new Map(); // target:Object : InteractionPoints
            return _this12;
        }

        _createClass(Interaction, [{
            key: 'stop',
            value: function stop(key, point) {
                _get(Interaction.prototype.__proto__ || Object.getPrototypeOf(Interaction.prototype), 'stop', this).call(this, key, point);
                var _iteratorNormalCompletion22 = true;
                var _didIteratorError22 = false;
                var _iteratorError22 = undefined;

                try {
                    for (var _iterator22 = this.subInteractions.values()[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                        var points = _step22.value;

                        points.stop(key, point);
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
                var _iteratorNormalCompletion23 = true;
                var _didIteratorError23 = false;
                var _iteratorError23 = undefined;

                try {
                    for (var _iterator23 = this.targets.values()[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                        var t = _step23.value;

                        if (target === t) {
                            remove = false;
                        }
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
                            var _iteratorNormalCompletion24 = true;
                            var _didIteratorError24 = false;
                            var _iteratorError24 = undefined;

                            try {
                                for (var _iterator24 = aspects[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                                    var aspect = _step24.value;

                                    var pointMap = this[aspect];
                                    var point = pointMap.get(key);
                                    var mapped = mappingFunc(point);
                                    interaction[aspect].set(key, mapped);
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
                var _iteratorNormalCompletion25 = true;
                var _didIteratorError25 = false;
                var _iteratorError25 = undefined;

                try {
                    for (var _iterator25 = this.ended.keys()[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                        var key = _step25.value;

                        if (this.isTap(key)) return true;
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
                var _iteratorNormalCompletion26 = true;
                var _didIteratorError26 = false;
                var _iteratorError26 = undefined;

                try {
                    for (var _iterator26 = this.ended.keys()[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                        var key = _step26.value;

                        if (this.isLongPress(key)) return true;
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
                var _this13 = this;

                var element = this.element;
                var useCapture = true;
                if (window.PointerEvent) {
                    if (this.debug) console.log('Pointer API' + window.PointerEvent);
                    element.addEventListener('pointerdown', function (e) {
                        if (_this13.debug) console.log('pointerdown', e.pointerId);
                        if (_this13.capture(e)) {
                            element.setPointerCapture(e.pointerId);
                            _this13.onStart(e);
                        }
                    }, useCapture);
                    element.addEventListener('pointermove', function (e) {
                        if (_this13.debug) console.log('pointermove', e.pointerId);
                        if (e.pointerType == 'touch' || e.pointerType == 'mouse' && Events.isMouseDown(e)) {
                            // this.capture(e) &&
                            if (_this13.debug) console.log('pointermove captured', e.pointerId);
                            _this13.onMove(e);
                        }
                    }, useCapture);
                    element.addEventListener('pointerup', function (e) {
                        if (_this13.debug) console.log('pointerup');
                        _this13.onEnd(e);
                        element.releasePointerCapture(e.pointerId);
                    }, useCapture);
                    element.addEventListener('pointercancel', function (e) {
                        if (_this13.debug) console.log('pointercancel');
                        _this13.onEnd(e);
                        element.releasePointerCapture(e.pointerId);
                    }, useCapture);
                    element.addEventListener('pointerleave', function (e) {
                        if (_this13.debug) console.log('pointerleave');
                        if (e.target == element) _this13.onEnd(e);
                    }, useCapture);
                } else if (window.TouchEvent) {
                    if (this.debug) console.log('Touch API');
                    element.addEventListener('touchstart', function (e) {
                        if (_this13.debug) console.log('touchstart', _this13.touchPoints(e));
                        if (_this13.capture(e)) {
                            var _iteratorNormalCompletion27 = true;
                            var _didIteratorError27 = false;
                            var _iteratorError27 = undefined;

                            try {
                                for (var _iterator27 = e.changedTouches[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                                    var touch = _step27.value;

                                    _this13.onStart(touch);
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
                        }
                    }, useCapture);
                    element.addEventListener('touchmove', function (e) {
                        if (_this13.debug) console.log('touchmove', _this13.touchPoints(e), e);
                        var _iteratorNormalCompletion28 = true;
                        var _didIteratorError28 = false;
                        var _iteratorError28 = undefined;

                        try {
                            for (var _iterator28 = e.changedTouches[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                                var touch = _step28.value;

                                _this13.onMove(touch);
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

                        var _iteratorNormalCompletion29 = true;
                        var _didIteratorError29 = false;
                        var _iteratorError29 = undefined;

                        try {
                            for (var _iterator29 = e.targetTouches[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
                                var _touch = _step29.value;

                                _this13.onMove(_touch);
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
                    }, useCapture);
                    element.addEventListener('touchend', function (e) {
                        if (_this13.debug) console.log('touchend', _this13.touchPoints(e));
                        var _iteratorNormalCompletion30 = true;
                        var _didIteratorError30 = false;
                        var _iteratorError30 = undefined;

                        try {
                            for (var _iterator30 = e.changedTouches[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
                                var touch = _step30.value;

                                _this13.onEnd(touch);
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
                    }, useCapture);
                    element.addEventListener('touchcancel', function (e) {
                        if (_this13.debug) console.log('touchcancel', e.targetTouches.length, e.changedTouches.length);
                        var _iteratorNormalCompletion31 = true;
                        var _didIteratorError31 = false;
                        var _iteratorError31 = undefined;

                        try {
                            for (var _iterator31 = e.changedTouches[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
                                var touch = _step31.value;

                                _this13.onEnd(touch);
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
                    }, useCapture);
                } else {
                    if (this.debug) console.log('Mouse API');

                    element.addEventListener('mousedown', function (e) {
                        if (_this13.debug) console.log('mousedown', e);
                        if (_this13.capture(e)) _this13.onStart(e);
                    }, useCapture);
                    element.addEventListener('mousemove', function (e) {
                        // Dow we only use move events if the mouse is down?
                        // HOver effects have to be implemented by other means
                        // && Events.isMouseDown(e))

                        if (Events.isMouseDown(e)) if (_this13.debug)
                            // this.capture(e) &&
                            console.log('mousemove', e);
                        _this13.onMove(e);
                    }, useCapture);
                    element.addEventListener('mouseup', function (e) {
                        if (_this13.debug) console.log('mouseup', e);
                        _this13.onEnd(e);
                    }, true);
                    element.addEventListener('mouseout', function (e) {
                        if (e.target == element) _this13.onEnd(e);
                    }, useCapture);
                }
            }
        }, {
            key: 'touchPoints',
            value: function touchPoints(event) {
                var result = [];
                var _iteratorNormalCompletion32 = true;
                var _didIteratorError32 = false;
                var _iteratorError32 = undefined;

                try {
                    for (var _iterator32 = event.changedTouches[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
                        var touch = _step32.value;

                        result.push(this.extractPoint(touch));
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
                var _iteratorNormalCompletion33 = true;
                var _didIteratorError33 = false;
                var _iteratorError33 = undefined;

                try {
                    for (var _iterator33 = mapped.entries()[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
                        var _step33$value = _slicedToArray(_step33.value, 2),
                            target = _step33$value[0],
                            interaction = _step33$value[1];

                        target.onStart(event, interaction);
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
            }
        }, {
            key: 'onMove',
            value: function onMove(event) {
                var extracted = this.extractPoint(event, 'all');

                this.updateInteraction(event, extracted);
                var mapped = this.interaction.mapInteraction(extracted, ['current', 'previous'], this.mapPositionToPoint.bind(this));
                var _iteratorNormalCompletion34 = true;
                var _didIteratorError34 = false;
                var _iteratorError34 = undefined;

                try {
                    for (var _iterator34 = mapped.entries()[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
                        var _step34$value = _slicedToArray(_step34.value, 2),
                            target = _step34$value[0],
                            interaction = _step34$value[1];

                        target.onMove(event, interaction);
                        interaction.updatePrevious();
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

                this.interaction.updatePrevious();
            }
        }, {
            key: 'onEnd',
            value: function onEnd(event) {
                var extracted = this.extractPoint(event, 'changedTouches');
                this.endInteraction(event, extracted);
                var mapped = this.interaction.mapInteraction(extracted, ['ended'], this.mapPositionToPoint.bind(this));
                var _iteratorNormalCompletion35 = true;
                var _didIteratorError35 = false;
                var _iteratorError35 = undefined;

                try {
                    for (var _iterator35 = mapped.entries()[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
                        var _step35$value = _slicedToArray(_step35.value, 2),
                            target = _step35$value[0],
                            interaction = _step35$value[1];

                        target.onEnd(event, interaction);
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

            var _this15 = _possibleConstructorReturn(this, (ScatterEvent.__proto__ || Object.getPrototypeOf(ScatterEvent)).call(this, 'scatterTransformed', { target: target }));

            _this15.translate = translate;
            _this15.scale = scale;
            _this15.rotate = rotate;
            _this15.about = about;
            _this15.fast = fast;
            _this15.type = type;
            return _this15;
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

            var _this16 = _possibleConstructorReturn(this, (ResizeEvent.__proto__ || Object.getPrototypeOf(ResizeEvent)).call(this, 'scatterResized', { width: width, height: height }));

            _this16.width = width;
            _this16.height = height;
            return _this16;
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

            var _this17 = _possibleConstructorReturn(this, (AbstractScatter.__proto__ || Object.getPrototypeOf(AbstractScatter)).call(this, {
                movableX: movableX,
                movableY: movableY,
                throwVisibility: throwVisibility,
                throwDamping: throwDamping,
                autoThrow: autoThrow
            }));

            _this17.startRotationDegrees = rotationDegrees;
            _this17.startScale = startScale; // Needed to reset object
            _this17.minScale = minScale;
            _this17.maxScale = maxScale;
            _this17.overdoScaling = overdoScaling;
            _this17.translatable = translatable;
            _this17.scalable = scalable;
            _this17.rotatable = rotatable;
            _this17.resizable = resizable;
            _this17.mouseZoomFactor = mouseZoomFactor;
            _this17.autoBringToFront = autoBringToFront;
            _this17.dragging = false;
            _this17.onTransform = onTransform != null ? [onTransform] : null;
            return _this17;
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
                    var _x25 = this.center.x;
                    var _y2 = this.center.y;
                    var dx = this.movableX ? velocity.x : 0;
                    var dy = this.movableY ? velocity.y : 0;
                    var factor = this.throwDamping;
                    // if (recentered) {
                    if (_x25 < 0) {
                        dx = -dx;
                        factor = collision;
                    }
                    if (_x25 > stage.width) {
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
                var _this18 = this;

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
                                var p = _this18.position;
                                var dx = p.x - startPos.x;
                                var dy = p.x - startPos.y;
                                _this18.onMoved(dx, dy);
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
                var _this19 = this;

                var dt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                if (this.zoomAnchor != null) {
                    var zoom = 1;
                    var amount = Math.min(0.01, 0.3 * dt / 100000.0);
                    if (this.scale < this.minScale) zoom = 1 + amount;
                    if (this.scale > this.maxScale) zoom = 1 - amount;
                    if (zoom != 1) {
                        this.transform({ x: 0, y: 0 }, zoom, 0, this.zoomAnchor);
                        requestAnimationFrame(function (dt) {
                            _this19.animateZoomBounce(dt);
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
                    var _iteratorNormalCompletion36 = true;
                    var _didIteratorError36 = false;
                    var _iteratorError36 = undefined;

                    try {
                        for (var _iterator36 = interaction.ended.keys()[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
                            var key = _step36.value;

                            if (interaction.isTap(key)) {
                                var point = interaction.ended.get(key);
                                this.onTap(event, interaction, point);
                            }
                        }
                    } catch (err) {
                        _didIteratorError36 = true;
                        _iteratorError36 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion36 && _iterator36.return) {
                                _iterator36.return();
                            }
                        } finally {
                            if (_didIteratorError36) {
                                throw _iteratorError36;
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
            var _this20 = this;

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
                        return _this20.preventPinch(event);
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
                    _this20.showTouches(dt);
                });
            }
        }

        _createClass(DOMScatterContainer, [{
            key: 'showTouches',
            value: function showTouches(dt) {
                var _this21 = this;

                var resolution = window.devicePixelRatio;
                var canvas = debugCanvas;
                var current = this.delegate.interaction.current;
                var context = canvas.getContext('2d');
                var radius = 20 * resolution;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = 'rgba(0, 0, 0, 0.3)';
                context.lineWidth = 2;
                context.strokeStyle = '#003300';
                var _iteratorNormalCompletion37 = true;
                var _didIteratorError37 = false;
                var _iteratorError37 = undefined;

                try {
                    for (var _iterator37 = current.entries()[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
                        var _step37$value = _slicedToArray(_step37.value, 2),
                            key = _step37$value[0],
                            point = _step37$value[1];

                        var local = point;
                        context.beginPath();
                        context.arc(local.x * resolution, local.y * resolution, radius, 0, 2 * Math.PI, false);
                        context.fill();
                        context.stroke();
                    }
                } catch (err) {
                    _didIteratorError37 = true;
                    _iteratorError37 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion37 && _iterator37.return) {
                            _iterator37.return();
                        }
                    } finally {
                        if (_didIteratorError37) {
                            throw _iteratorError37;
                        }
                    }
                }

                requestAnimationFrame(function (dt) {
                    _this21.showTouches(dt);
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
                var _iteratorNormalCompletion38 = true;
                var _didIteratorError38 = false;
                var _iteratorError38 = undefined;

                try {
                    for (var _iterator38 = this.scatter.values()[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
                        var target = _step38.value;

                        if (this.isDescendant(target.element, found)) {
                            if (this.stopEvents) Events.stop(event);
                            if (this.claimEvents) event.claimedByScatter = target;
                            return target;
                        }
                    }
                } catch (err) {
                    _didIteratorError38 = true;
                    _iteratorError38 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion38 && _iterator38.return) {
                            _iterator38.return();
                        }
                    } finally {
                        if (_didIteratorError38) {
                            throw _iteratorError38;
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

            var _this22 = _possibleConstructorReturn(this, (DOMScatter.__proto__ || Object.getPrototypeOf(DOMScatter)).call(this, {
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
            _this22.element = element;
            _this22.x = x;
            _this22.y = y;
            _this22.meanX = x;
            _this22.meanY = y;
            _this22.width = width;
            _this22.height = height;
            _this22.throwVisibility = Math.min(width, height, throwVisibility);
            _this22.container = container;
            _this22.simulateClick = simulateClick;
            _this22.scale = startScale;
            _this22.rotationDegrees = _this22.startRotationDegrees;
            _this22.transformOrigin = transformOrigin;
            _this22.initialValues = {
                x: x,
                y: y,
                width: width,
                height: height,
                scale: startScale,
                rotation: _this22.startRotationDegrees,
                transformOrigin: transformOrigin
            };
            // For tweenlite we need initial values in _gsTransform
            TweenLite.set(element, _this22.initialValues);
            _this22.onResize = onResize;
            _this22.verbose = verbose;
            if (touchAction !== null) {
                Elements$1.setStyle(element, { touchAction: touchAction });
            }
            container.add(_this22);
            return _this22;
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
                var _this23 = this;

                TweenLite.to(this.element, 0.1, {
                    display: 'none',
                    onComplete: function onComplete(e) {
                        _this23.element.parentNode.removeChild(_this23.element);
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

    /** A container for scatter objects, which uses a single InteractionMapper
     * for all children. This reduces the number of registered event handlers
     * and covers the common use case that multiple objects are scattered
     * on the same level.
     */


    var ScatterContainer = function (_PIXI$Graphics2) {
        _inherits(ScatterContainer, _PIXI$Graphics2);

        /**
        * @constructor
        * @param {PIXI.Renderer} renderer - PIXI renderer, needed for hit testing
        * @param {Bool} stopEvents - Whether events should be stopped or propagated
        * @param {Bool} claimEvents - Whether events should be marked as claimed
        *                             if findTarget return as non-null value.
        * @param {Bool} showBounds - Show bounds for debugging purposes.
        * @param {Bool} showTouches - Show touches and pointer for debugging purposes.
        * @param {Color} backgroundColor - Set background color if specified.
        * @param {PIXIApp} application - Needed if showBounds is true to register
        *                                update handler.
        */
        function ScatterContainer(renderer) {
            var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref14$stopEvents = _ref14.stopEvents,
                stopEvents = _ref14$stopEvents === undefined ? true : _ref14$stopEvents,
                _ref14$claimEvents = _ref14.claimEvents,
                claimEvents = _ref14$claimEvents === undefined ? true : _ref14$claimEvents,
                _ref14$showBounds = _ref14.showBounds,
                showBounds = _ref14$showBounds === undefined ? false : _ref14$showBounds,
                _ref14$showPolygon = _ref14.showPolygon,
                showPolygon = _ref14$showPolygon === undefined ? false : _ref14$showPolygon,
                _ref14$showTouches = _ref14.showTouches,
                showTouches = _ref14$showTouches === undefined ? false : _ref14$showTouches,
                _ref14$backgroundColo = _ref14.backgroundColor,
                backgroundColor = _ref14$backgroundColo === undefined ? null : _ref14$backgroundColo,
                _ref14$application = _ref14.application,
                application = _ref14$application === undefined ? null : _ref14$application;

            _classCallCheck(this, ScatterContainer);

            var _this24 = _possibleConstructorReturn(this, (ScatterContainer.__proto__ || Object.getPrototypeOf(ScatterContainer)).call(this));

            _this24.renderer = renderer;
            _this24.stopEvents = stopEvents;
            _this24.claimEvents = claimEvents;
            _this24.delegate = new InteractionMapper(_this24.eventReceiver, _this24);
            _this24.showBounds = showBounds;
            _this24.showTouches = showTouches;
            _this24.showPolygon = showPolygon;
            _this24.backgroundColor = backgroundColor;
            if (application && (showBounds || showTouches || showPolygon)) {
                application.ticker.add(function (delta) {
                    return _this24.update(delta);
                }, _this24);
            }
            if (backgroundColor) {
                _this24.updateBackground();
            }
            return _this24;
        }

        _createClass(ScatterContainer, [{
            key: 'updateBackground',
            value: function updateBackground() {
                this.clear();
                this.beginFill(this.backgroundColor, 1);
                this.drawRect(0, 0, this.bounds.width, this.bounds.height);
                this.endFill();
            }
        }, {
            key: 'update',
            value: function update(dt) {
                this.clear();
                this.lineStyle(1, 0x0000FF);
                if (this.showBounds) {
                    var _iteratorNormalCompletion39 = true;
                    var _didIteratorError39 = false;
                    var _iteratorError39 = undefined;

                    try {
                        for (var _iterator39 = this.children[Symbol.iterator](), _step39; !(_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done); _iteratorNormalCompletion39 = true) {
                            var child = _step39.value;

                            if (child.scatter) {
                                //let {x, y, width, height} = child.scatter.throwBounds()
                                // new PIXI.Rectangle(x, y, width, height)
                                this.drawShape(child.scatter.bounds);
                                var center = child.scatter.center;
                                this.drawCircle(center.x, center.y, 4);
                                this.drawCircle(child.scatter.x, child.scatter.y, 4);
                            }
                        }
                    } catch (err) {
                        _didIteratorError39 = true;
                        _iteratorError39 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion39 && _iterator39.return) {
                                _iterator39.return();
                            }
                        } finally {
                            if (_didIteratorError39) {
                                throw _iteratorError39;
                            }
                        }
                    }

                    this.lineStyle(2, 0x0000FF);
                    this.drawShape(this.bounds);
                }
                if (this.showPolygon) {
                    this.lineStyle(2, 0xFF0000);
                    var _iteratorNormalCompletion40 = true;
                    var _didIteratorError40 = false;
                    var _iteratorError40 = undefined;

                    try {
                        for (var _iterator40 = this.children[Symbol.iterator](), _step40; !(_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done); _iteratorNormalCompletion40 = true) {
                            var _child = _step40.value;

                            if (_child.scatter) {
                                var polygon = _child.scatter.polygon;
                                var shape = new PIXI.Polygon(polygon.flatAbsolutePoints());
                                shape.close();
                                this.drawShape(shape);
                            }
                        }
                    } catch (err) {
                        _didIteratorError40 = true;
                        _iteratorError40 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion40 && _iterator40.return) {
                                _iterator40.return();
                            }
                        } finally {
                            if (_didIteratorError40) {
                                throw _iteratorError40;
                            }
                        }
                    }
                }
                if (this.showTouches) {
                    var current = this.delegate.interaction.current;
                    var _iteratorNormalCompletion41 = true;
                    var _didIteratorError41 = false;
                    var _iteratorError41 = undefined;

                    try {
                        for (var _iterator41 = current.entries()[Symbol.iterator](), _step41; !(_iteratorNormalCompletion41 = (_step41 = _iterator41.next()).done); _iteratorNormalCompletion41 = true) {
                            var _step41$value = _slicedToArray(_step41.value, 2),
                                key = _step41$value[0],
                                point = _step41$value[1];

                            var local = this.mapPositionToPoint(point);
                            this.drawCircle(local.x, local.y, 12);
                        }
                    } catch (err) {
                        _didIteratorError41 = true;
                        _iteratorError41 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion41 && _iterator41.return) {
                                _iterator41.return();
                            }
                        } finally {
                            if (_didIteratorError41) {
                                throw _iteratorError41;
                            }
                        }
                    }
                }
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                if (this.stopEvents) Events.stop(event);
                return true;
            }
        }, {
            key: 'fakeInteractionEvent',
            value: function fakeInteractionEvent(point, key) {
                return { data: { global: point, key: key } };
            }
        }, {
            key: 'findHitScatter',
            value: function findHitScatter(data, displayObject, hit) {
                //     if (hit) {
                //             console.log("findHitScatter", displayObject)
                //         }
                if (hit && this.hitScatter === null && (typeof displayObject === 'undefined' ? 'undefined' : _typeof(displayObject)) != undefined) {
                    this.hitScatter = displayObject.scatter ? displayObject.scatter : null;
                }
            }
        }, {
            key: 'mapPositionToPoint',
            value: function mapPositionToPoint(point) {
                var local = new PIXI.Point();
                var interactionManager = this.renderer.plugins.interaction;
                interactionManager.mapPositionToPoint(local, point.x, point.y);
                return local;
            }

            /**
             * New method hitTest implemented (in InteractionManager, since 4.5.0).
             * See https://github.com/pixijs/pixi.js/pull/3878
             */

        }, {
            key: 'findTarget',
            value: function findTarget(event, local, global) {
                if (event.claimedByScatter) {
                    return null;
                }
                this.hitScatter = null;
                var interactionManager = this.renderer.plugins.interaction;
                var fakeEvent = this.fakeInteractionEvent(local);
                interactionManager.processInteractive(fakeEvent, this, this.findHitScatter.bind(this), true);
                if (this.claimEvents) event.claimedByScatter = this.hitScatter;
                return this.hitScatter;
            }
        }, {
            key: 'findTargetNew',
            value: function findTargetNew(event, local, global) {
                // UO: still problematic. Does not find non interactive elements
                // which are needed for some stylus applications
                if (event.claimedByScatter) {
                    return null;
                }
                this.hitScatter = null;
                var interactionManager = this.renderer.plugins.interaction;
                var displayObject = interactionManager.hitTest(local, this);
                if (displayObject != null && displayObject.scatter != null) this.hitScatter = displayObject.scatter;
                if (this.claimEvents) event.claimedByScatter = this.hitScatter;
                return this.hitScatter;
            }
        }, {
            key: 'onStart',
            value: function onStart(event, interaction) {}
        }, {
            key: 'onMove',
            value: function onMove(event, interaction) {}
        }, {
            key: 'onEnd',
            value: function onEnd(event, interaction) {
                var _iteratorNormalCompletion42 = true;
                var _didIteratorError42 = false;
                var _iteratorError42 = undefined;

                try {
                    for (var _iterator42 = interaction.ended.keys()[Symbol.iterator](), _step42; !(_iteratorNormalCompletion42 = (_step42 = _iterator42.next()).done); _iteratorNormalCompletion42 = true) {
                        var key = _step42.value;

                        var point = interaction.ended.get(key);
                        if (interaction.isLongPress(key)) {
                            this.onLongPress(key, point);
                        }
                        if (interaction.isTap(key)) {
                            this.onTap(key, point);
                        }
                    }
                } catch (err) {
                    _didIteratorError42 = true;
                    _iteratorError42 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion42 && _iterator42.return) {
                            _iterator42.return();
                        }
                    } finally {
                        if (_didIteratorError42) {
                            throw _iteratorError42;
                        }
                    }
                }
            }
        }, {
            key: 'onTap',
            value: function onTap(key, point) {
                console.info('ScatterContainer.onTap');
            }
        }, {
            key: 'onLongPress',
            value: function onLongPress(key, point) {
                console.info('ScatterContainer.onLongPress');
            }
        }, {
            key: 'bringToFront',
            value: function bringToFront(displayObject) {
                this.addChild(displayObject);
            }
        }, {
            key: 'eventReceiver',
            get: function get() {
                return this.renderer.plugins.interaction.interactionDOMElement;
            }
        }, {
            key: 'bounds',
            get: function get() {
                // let r = this.eventReceiver.getBoundingClientRect()
                var x = 0; // r.left
                var y = 0; // r.top
                var w = app.width;
                var h = app.height;
                if (app.fullscreen && app.monkeyPatchMapping) {
                    var fixed = this.mapPositionToPoint({ x: w, y: 0 });
                    if (fixed.x < w) {
                        w = fixed.x;
                    }
                    if (fixed.y > 0) {
                        y += fixed.y;
                        h -= fixed.y;
                    }
                }
                return new PIXI.Rectangle(x, y, w, h);
            }
        }, {
            key: 'center',
            get: function get() {
                var r = this.bounds;
                return { x: r.width / 2, y: r.height / 2 };
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

        return ScatterContainer;
    }(PIXI.Graphics);

    /** A wrapper for child elements of a ScatterContainer. Can be used
     *  to combine scattered objects with non-scattered objects. Any
     *  PIXI.DisplayObject can be wrapped.
     */


    var DisplayObjectScatter = function (_AbstractScatter2) {
        _inherits(DisplayObjectScatter, _AbstractScatter2);

        function DisplayObjectScatter(displayObject, renderer) {
            var _ref15 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref15$x = _ref15.x,
                x = _ref15$x === undefined ? null : _ref15$x,
                _ref15$y = _ref15.y,
                y = _ref15$y === undefined ? null : _ref15$y,
                _ref15$minScale = _ref15.minScale,
                minScale = _ref15$minScale === undefined ? 0.1 : _ref15$minScale,
                _ref15$maxScale = _ref15.maxScale,
                maxScale = _ref15$maxScale === undefined ? 1.0 : _ref15$maxScale,
                _ref15$startScale = _ref15.startScale,
                startScale = _ref15$startScale === undefined ? 1.0 : _ref15$startScale,
                _ref15$autoBringToFro = _ref15.autoBringToFront,
                autoBringToFront = _ref15$autoBringToFro === undefined ? true : _ref15$autoBringToFro,
                _ref15$translatable = _ref15.translatable,
                translatable = _ref15$translatable === undefined ? true : _ref15$translatable,
                _ref15$scalable = _ref15.scalable,
                scalable = _ref15$scalable === undefined ? true : _ref15$scalable,
                _ref15$rotatable = _ref15.rotatable,
                rotatable = _ref15$rotatable === undefined ? true : _ref15$rotatable,
                _ref15$resizable = _ref15.resizable,
                resizable = _ref15$resizable === undefined ? false : _ref15$resizable,
                _ref15$movableX = _ref15.movableX,
                movableX = _ref15$movableX === undefined ? true : _ref15$movableX,
                _ref15$movableY = _ref15.movableY,
                movableY = _ref15$movableY === undefined ? true : _ref15$movableY,
                _ref15$throwVisibilit = _ref15.throwVisibility,
                throwVisibility = _ref15$throwVisibilit === undefined ? 44 : _ref15$throwVisibilit,
                _ref15$throwDamping = _ref15.throwDamping,
                throwDamping = _ref15$throwDamping === undefined ? 0.95 : _ref15$throwDamping,
                _ref15$autoThrow = _ref15.autoThrow,
                autoThrow = _ref15$autoThrow === undefined ? true : _ref15$autoThrow,
                _ref15$rotationDegree = _ref15.rotationDegrees,
                rotationDegrees = _ref15$rotationDegree === undefined ? null : _ref15$rotationDegree,
                _ref15$rotation = _ref15.rotation,
                rotation = _ref15$rotation === undefined ? null : _ref15$rotation,
                _ref15$onTransform = _ref15.onTransform,
                onTransform = _ref15$onTransform === undefined ? null : _ref15$onTransform;

            _classCallCheck(this, DisplayObjectScatter);

            var _this25 = _possibleConstructorReturn(this, (DisplayObjectScatter.__proto__ || Object.getPrototypeOf(DisplayObjectScatter)).call(this, { minScale: minScale, maxScale: maxScale,
                startScale: startScale,
                autoBringToFront: autoBringToFront,
                translatable: translatable, scalable: scalable, rotatable: rotatable, resizable: resizable,
                movableX: movableX, movableY: movableY, throwVisibility: throwVisibility, throwDamping: throwDamping,
                autoThrow: autoThrow,
                rotationDegrees: rotationDegrees, rotation: rotation,
                onTransform: onTransform }));
            // For the simulation of named parameters,
            // see: http://exploringjs.com/es6/ch_parameter-handling.html


            _this25.displayObject = displayObject;
            _this25.displayObject.scatter = _this25;
            _this25.renderer = renderer;
            _this25.scale = startScale;
            _this25.rotationDegrees = _this25.startRotationDegrees;
            _this25.x = x;
            _this25.y = y;
            return _this25;
        }

        /** Returns geometry data as object. **/


        _createClass(DisplayObjectScatter, [{
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
            key: 'setup',
            value: function setup() {
                this.setupMouseWheelInteraction();
            }
        }, {
            key: 'roundPixel',
            value: function roundPixel(value) {
                // UO: Should be obsolete because Renderer supports roundPixels by default
                return value;
                var res = this.renderer.resolution;
                return Math.round(value * res) / res;
            }
        }, {
            key: 'mapPositionToContainerPoint',
            value: function mapPositionToContainerPoint(point) {
                return this.displayObject.parent.mapPositionToPoint(point);
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                return true;
            }
        }, {
            key: 'bringToFront',
            value: function bringToFront() {
                if (this.autoBringToFront) {
                    var scatterContainer = this.displayObject.parent;
                    scatterContainer.bringToFront(this.displayObject);
                }
            }
        }, {
            key: 'validScale',
            value: function validScale(scale) {
                scale = Math.max(scale, this.minScale);
                scale = Math.min(scale, this.maxScale);
                return scale;
            }
        }, {
            key: 'container',
            get: function get() {
                return this.displayObject.parent;
            }
        }, {
            key: 'x',
            get: function get() {
                return this.position.x;
            },
            set: function set(value) {
                this.position.x = value;
            }
        }, {
            key: 'y',
            get: function get() {
                return this.position.y;
            },
            set: function set(value) {
                this.position.y = value;
            }
        }, {
            key: 'polygon',
            get: function get() {
                var polygon = new Polygon(this.center);
                var w2 = this.width / 2;
                var h2 = this.height / 2;
                polygon.addPoint({ x: -w2, y: -h2 });
                polygon.addPoint({ x: w2, y: -h2 });
                polygon.addPoint({ x: w2, y: h2 });
                polygon.addPoint({ x: -w2, y: h2 });
                polygon.rotate(this.rotation);
                return polygon;
            }
        }, {
            key: 'containerBounds',
            get: function get() {
                return this.displayObject.parent.bounds;
            }
        }, {
            key: 'containerPolygon',
            get: function get() {
                return this.displayObject.parent.polygon;
            }
        }, {
            key: 'position',
            get: function get() {
                return this.displayObject.position;
            },
            set: function set(value) {
                console.log("set position");
                this.displayObject.position = value;
            }
        }, {
            key: 'scale',
            get: function get() {
                return this.displayObject.scale.x;
            },
            set: function set(value) {
                this.displayObject.scale.x = value;
                this.displayObject.scale.y = value;
            }
        }, {
            key: 'width',
            get: function get() {
                return this.displayObject.width;
            }
        }, {
            key: 'height',
            get: function get() {
                return this.displayObject.height;
            }
        }, {
            key: 'bounds',
            get: function get() {
                return this.displayObject.getBounds();
            }
        }, {
            key: 'pivot',
            get: function get() {
                return this.displayObject.pivot;
            }
        }, {
            key: 'rotation',
            get: function get() {
                return this.displayObject.rotation;
            },
            set: function set(value) {
                this.displayObject.rotation = value;
            }
        }, {
            key: 'rotationDegrees',
            get: function get() {
                return Angle.radian2degree(this.displayObject.rotation);
            },
            set: function set(value) {
                this.displayObject.rotation = Angle.degree2radian(value);
            }
        }, {
            key: 'center',
            get: function get() {
                var w2 = this.width / 2;
                var h2 = this.height / 2;
                var dist = Math.sqrt(w2 * w2 + h2 * h2);
                var angle = Points.angle({ x: w2, y: h2 }, { x: 0, y: 0 });
                var p = this.displayObject.x;
                var c = Points.arc(this.position, this.rotation + angle, dist);
                return c; // Points.subtract(c, this.pivot)
            }
        }, {
            key: 'rotationOrigin',
            get: function get() {
                // In PIXI the default rotation and scale origin is the position
                return this.position; // Points.add(this.position, this.pivot)
            }
        }]);

        return DisplayObjectScatter;
    }(AbstractScatter);

    var CardLoader = function () {
        function CardLoader(src) {
            var _ref16 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref16$x = _ref16.x,
                x = _ref16$x === undefined ? 0 : _ref16$x,
                _ref16$y = _ref16.y,
                y = _ref16$y === undefined ? 0 : _ref16$y,
                _ref16$width = _ref16.width,
                width = _ref16$width === undefined ? 1000 : _ref16$width,
                _ref16$height = _ref16.height,
                height = _ref16$height === undefined ? 800 : _ref16$height,
                _ref16$maxWidth = _ref16.maxWidth,
                maxWidth = _ref16$maxWidth === undefined ? null : _ref16$maxWidth,
                _ref16$maxHeight = _ref16.maxHeight,
                maxHeight = _ref16$maxHeight === undefined ? null : _ref16$maxHeight,
                _ref16$scale = _ref16.scale,
                scale = _ref16$scale === undefined ? 1 : _ref16$scale,
                _ref16$minScale = _ref16.minScale,
                minScale = _ref16$minScale === undefined ? 0.5 : _ref16$minScale,
                _ref16$maxScale = _ref16.maxScale,
                maxScale = _ref16$maxScale === undefined ? 1.5 : _ref16$maxScale,
                _ref16$rotation = _ref16.rotation,
                rotation = _ref16$rotation === undefined ? 0 : _ref16$rotation;

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

    function isEven(n) {
        return n % 2 == 0;
    }

    /**
     * A utility class that describes a quad tree of tiles. Each tile on a given
     * level has up to four corresponding tiles on the next level. A TileQuadNode
     * uses the attributes nw (i.e. northwest), ne, sw, se to link to the
     * quad nodes on the next level. The previous attributes links to the quad
     * one level below that holds the given quad as nw, ne, sw, or se.
     * We use this node class because we need a representation of tiles that are
     * needed but not loaded yet to compute tiles which can be abandoned to reduce
     * the memory pressure.
     *
     * @constructor
     * @param {level} Number - The level the quad node belongs to
     * @param {col} Number - The col of the quad
     * @param {row} Number - The level the quad node belongs to
     * @param {url} String - The level the quad node belongs to
     */

    var TileQuadNode = function () {
        function TileQuadNode(level, col, row, url) {
            _classCallCheck(this, TileQuadNode);

            this.level = level;
            this.col = col;
            this.row = row;
            this.url = url;
            this.nw = null;
            this.ne = null;
            this.sw = null;
            this.se = null;
            this.previous = null;
        }

        /** Return True if this node has no successors and can be used as
        an indicator of tiles to free.
        **/


        _createClass(TileQuadNode, [{
            key: 'noQuads',
            value: function noQuads() {
                if (this.previous === null) return false;
                return this.nw === null && this.ne === null && this.sw === null && this.se === null;
            }

            /** Unlink the given quad node
             * @param {node} TileQuadNode - The TileQuadNode to remove
            **/

        }, {
            key: 'unlink',
            value: function unlink(node) {
                if (this.nw === node) this.nw = null;
                if (this.ne === node) this.ne = null;
                if (this.sw === node) this.sw = null;
                if (this.se === node) this.se = null;
            }

            /** Link this quad node to the given previous node. Use the north
            * and west flags to address nw, ne, sw, and se.
             * @param {node} TileQuadNode - The TileQuadNode to remove
            * @param {north} Boolean - Link to north (true) or south (false)
            * @param {west} Boolean - Link to west (true) or east (false)
            **/

        }, {
            key: 'link',
            value: function link(north, west, previous) {
                this.previous = previous;
                if (north) {
                    if (west) {
                        previous.nw = this;
                    } else {
                        previous.ne = this;
                    }
                } else {
                    if (west) {
                        previous.sw = this;
                    } else {
                        previous.se = this;
                    }
                }
            }
        }]);

        return TileQuadNode;
    }();

    /** The current Tile implementation simply uses PIXI.Sprites.
     *
     * BTW: PIXI.extras.TilingSprite is not appropriate. It should be used for
     * repeating patterns.
     **/


    var Tile = function (_PIXI$Sprite) {
        _inherits(Tile, _PIXI$Sprite);

        function Tile(texture) {
            _classCallCheck(this, Tile);

            return _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this, texture));
        }

        return Tile;
    }(PIXI.Sprite);

    /**
     * A Tile Loader component that can be plugged into a Tiles Layer.
     */


    var TileLoader = function () {
        function TileLoader(tiles) {
            _classCallCheck(this, TileLoader);

            this.debug = false;
            this.tiles = tiles;
            this.setup();
        }

        /** Setup collections and instance vars. */


        _createClass(TileLoader, [{
            key: 'setup',
            value: function setup() {
                this.map = new Map(); // Map {url : [ col, row]}
                this.loading = new Set(); // Set url
                this.loaded = new Map(); // Map {url : sprite }
                this.loadQueue = [];
            }

            /** Schedules a tile url for loading. The loading itself must be triggered
            by a call to loadOneTile or loadAll
             * @param {String} url - the url of the texture / tile
            * @param {Number} col - the tile col
            * @param {Number} row - the tile row
            **/

        }, {
            key: 'schedule',
            value: function schedule(url, col, row) {
                if (this.loaded.has(url)) return false;
                if (this.loading.has(url)) return false;
                this.map.set(url, [col, row]);
                this.loading.add(url);
                this.loadQueue.push(url);
                return true;
            }

            /** Cancels loading by clearing the load queue **/

        }, {
            key: 'cancel',
            value: function cancel() {
                this.loadQueue = [];
                this.loading.clear();
            }

            /** Destroys alls collections. **/

        }, {
            key: 'destroy',
            value: function destroy() {
                this.setup();
            }

            /** Private method. Informs the tile layer about a texture for a given url.
             * Creates the sprite for the loaded texture and informs the tile layer.
             * @param {String} url - the url
             * @param {Object} texture - the loaded resource
             **/

        }, {
            key: '_textureAvailable',
            value: function _textureAvailable(url, col, row, texture) {
                var tile = new Tile(texture);
                this.loaded.set(url, tile);
                this.tiles.tileAvailable(tile, col, row, url);
            }
        }]);

        return TileLoader;
    }();

    /**
     * A Tile Loader component that can be plugged into a Tiles Layer.
     * Uses the PIXI Loader but can be replaced with othe loaders implementing
     * the public methods without underscore.
     * Calls the Tiles.tileAvailable method if the sprite is available.
     **/


    var PIXITileLoader = function (_TileLoader) {
        _inherits(PIXITileLoader, _TileLoader);

        function PIXITileLoader(tiles, compression) {
            _classCallCheck(this, PIXITileLoader);

            var _this27 = _possibleConstructorReturn(this, (PIXITileLoader.__proto__ || Object.getPrototypeOf(PIXITileLoader)).call(this, tiles));

            _this27.loader = new PIXI.loaders.Loader();
            _this27.loader.on('load', _this27._onLoaded.bind(_this27));
            _this27.loader.on('error', _this27._onError.bind(_this27));
            if (compression) {
                _this27.loader.pre(PIXI.compressedTextures.imageParser());
            }
            return _this27;
        }

        _createClass(PIXITileLoader, [{
            key: 'schedule',
            value: function schedule(url, col, row) {
                // Overwritten schedule to avoid BaseTexture and Texture already loaded errors.
                var texture = PIXI.utils.TextureCache[url];
                if (texture) {
                    if (this.debug) console.log('Texture already loaded', texture);
                    this._textureAvailable(url, col, row, texture);
                    return false;
                }
                var base = PIXI.utils.BaseTextureCache[url];
                if (base) {
                    if (this.debug) console.log('BaseTexture already loaded', base);
                    var _texture = new PIXI.Texture(base);
                    this._textureAvailable(url, col, row, _texture);
                    return false;
                }
                return _get(PIXITileLoader.prototype.__proto__ || Object.getPrototypeOf(PIXITileLoader.prototype), 'schedule', this).call(this, url, col, row);
            }

            /** Load one and only one of the scheduled tiles **/

        }, {
            key: 'loadOneTile',
            value: function loadOneTile() {
                this._loadOneTile();
            }

            /** Load all scheduled tiles **/

        }, {
            key: 'loadAll',
            value: function loadAll() {
                this._loadAllTiles();
            }

            /** Destroys the loader completly **/

        }, {
            key: 'destroy',
            value: function destroy() {
                this.loader.reset();
                _get(PIXITileLoader.prototype.__proto__ || Object.getPrototypeOf(PIXITileLoader.prototype), 'destroy', this).call(this);
            }
        }, {
            key: '_onError',
            value: function _onError(loader, error) {
                console.warn('Cannot load', error);
            }

            /** Private method. Called by the PIXI loader after each successfull
             * loading of a single tile.
             * Creates the sprite for the loaded texture and informs the tile layer.
             * @param {Object} loader - the loader instance
             * @param {Object} resource - the loaded resource with url and texture attr
             **/

        }, {
            key: '_onLoaded',
            value: function _onLoaded(loader, resource) {
                try {
                    var _map$get = this.map.get(resource.url),
                        _map$get2 = _slicedToArray(_map$get, 2),
                        col = _map$get2[0],
                        row = _map$get2[1];

                    this._textureAvailable(resource.url, col, row, resource.texture);
                } catch (err) {
                    console.warn("Texture unavailable: " + err.message);
                }
            }

            /** Private method: loads one tile from the queue. **/

        }, {
            key: '_loadOneTile',
            value: function _loadOneTile() {
                var _this28 = this;

                var retry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                //console.log("_loadOneTile")
                if (this.loader.loading) {
                    setTimeout(function () {
                        _this28._loadOneTile();
                    }, retry);
                    return;
                }
                if (this.loadQueue.length > 0) {
                    var url = this.loadQueue.pop();
                    this.loader.add(url, url);
                    this.loader.load();
                }
            }

            /** Private method: loads all tiles from the queue in batches. Batches are
            helpfull to avoid loading tiles that are no longer needed because the
            user has already zoomed to a different level.**/

        }, {
            key: '_loadAllTiles',
            value: function _loadAllTiles() {
                var _this29 = this;

                var batchSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
                var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;

                if (this.loadQueue.length > 0) {
                    if (this.loader.loading) {
                        //console.log("Loader busy", this.loadQueue.length)
                        setTimeout(function () {
                            _this29._loadAllTiles();
                        }, retry);
                        return;
                    }
                    var i = 0;
                    var urls = [];
                    while (i < batchSize && this.loadQueue.length > 0) {
                        var url = this.loadQueue.pop();
                        if (!this.loaded.has(url)) {
                            urls.push(url);
                            i += 1;
                        }
                    }
                    this.loader.add(urls).load(function () {
                        return _this29._loadAllTiles();
                    });
                }
            }
        }]);

        return PIXITileLoader;
    }(TileLoader);

    var WorkerTileLoader = function (_TileLoader2) {
        _inherits(WorkerTileLoader, _TileLoader2);

        function WorkerTileLoader(tiles) {
            _classCallCheck(this, WorkerTileLoader);

            var _this30 = _possibleConstructorReturn(this, (WorkerTileLoader.__proto__ || Object.getPrototypeOf(WorkerTileLoader)).call(this, tiles));

            var worker = _this30.worker = new Worker("../../lib/pixi/tileloader.js");
            worker.onmessage = function (event) {
                if (event.data.success) {
                    var _event$data = event.data,
                        url = _event$data.url,
                        col = _event$data.col,
                        row = _event$data.row,
                        buffer = _event$data.buffer;
                    //console.log("WorkerTileLoader.loaded", url, buffer)

                    var CompressedImage = PIXI.compressedTextures.CompressedImage;
                    var compressed = CompressedImage.loadFromArrayBuffer(buffer, url);
                    var base = new PIXI.BaseTexture(compressed);
                    var texture = new PIXI.Texture(base);
                    _this30._textureAvailable(url, col, row, texture);
                }
            };
            return _this30;
        }

        _createClass(WorkerTileLoader, [{
            key: 'loadOne',
            value: function loadOne() {
                if (this.loadQueue.length > 0) {
                    var url = this.loadQueue.pop();

                    var _map$get3 = this.map.get(url),
                        _map$get4 = _slicedToArray(_map$get3, 2),
                        col = _map$get4[0],
                        row = _map$get4[1];

                    var tile = [col, row, url];
                    this.worker.postMessage({ command: "load", tiles: [tile] });
                }
            }
        }, {
            key: 'loadAll',
            value: function loadAll() {
                var tiles = [];
                while (this.loadQueue.length > 0) {
                    var url = this.loadQueue.pop();

                    var _map$get5 = this.map.get(url),
                        _map$get6 = _slicedToArray(_map$get5, 2),
                        col = _map$get6[0],
                        row = _map$get6[1];

                    tiles.push([col, row, url]);
                }
                this.worker.postMessage({ command: "load", tiles: tiles });
            }
        }, {
            key: 'cancel',
            value: function cancel() {
                _get(WorkerTileLoader.prototype.__proto__ || Object.getPrototypeOf(WorkerTileLoader.prototype), 'cancel', this).call(this);
                this.worker.postMessage({ command: "abort" });
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.worker.postMessage({ command: "abort" });
                this.worker.terminate();
                this.worker = null;
                _get(WorkerTileLoader.prototype.__proto__ || Object.getPrototypeOf(WorkerTileLoader.prototype), 'destroy', this).call(this);
            }
        }]);

        return WorkerTileLoader;
    }(TileLoader);
    /**
     * A layer of tiles that represents a zoom level of a DeepZoomImage as a grid
     * of sprites.
     * @constructor
     * @param {number} level - the zoom level of the tile layer
     * @param {DeepZoomImage} view - the zoomable image the layer belongs to
     * @param {number} scale - the scale of the tile layer
     * @param {number} cols - the number of columns of the layer
     * @param {number} rows - the number of rows of the layer
     * @param {number} width - the width of the layer in pixel
     * @param {number} height - the height of the layer in pixel
     * @param {number} tileSize - the size of a single tile in pixel
     * @param {number} overlap - the overlap of the tiles in pixel
     * @param {number} fadeInTime - time needed to fade in tiles if TweenLite is set
     **/


    var Tiles = function (_PIXI$Container) {
        _inherits(Tiles, _PIXI$Container);

        function Tiles(level, view, scale, cols, rows, width, height, tileSize, overlap) {
            var fadeInTime = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0.25;

            _classCallCheck(this, Tiles);

            var _this31 = _possibleConstructorReturn(this, (Tiles.__proto__ || Object.getPrototypeOf(Tiles)).call(this));

            _this31.debug = false;
            _this31.showGrid = false;
            _this31.view = view;
            _this31.level = level;
            _this31.cols = cols;
            _this31.rows = rows;
            _this31.pixelWidth = width;
            _this31.pixelHeight = height;
            _this31.tileSize = tileSize;
            _this31.overlap = overlap;
            _this31.needed = new Map(); // url as key, [col, row] as value
            _this31.requested = new Set();
            _this31.available = new Map();
            _this31.scale.set(scale, scale);
            _this31.tileScale = scale;
            _this31.fadeInTime = fadeInTime;
            _this31.keep = false;
            if (_this31.view.preferWorker && view.info.compression.length > 0) _this31.loader = new WorkerTileLoader(_this31);else _this31.loader = new PIXITileLoader(_this31, view.info.compression);
            _this31.interactive = false;
            _this31._highlight = null;
            _this31.pprint();
            return _this31;
        }

        /** Tests whether all tiles are loaded. **/


        _createClass(Tiles, [{
            key: 'isComplete',
            value: function isComplete() {
                return this.cols * this.rows === this.children.length;
            }

            /** Returns the highligh graphics layer for debugging purposes.
             **/

        }, {
            key: 'pprint',


            /** Helper method pretty printing debug information. **/
            value: function pprint() {
                console.log('Tiles level: ' + this.level + ' scale: ' + this.scale.x + ' cols: ' + this.cols + ' rows: ' + this.rows + ' w: ' + this.pixelWidth + ' h: ' + this.pixelHeight + ' tsize:' + this.tileSize);
            }

            /** Computes the tile position and obeys the overlap.
             * @param {number} col - The column of the tile
             * @param {number} row - The row of the tile
             * @returns {PIXI.Point} obj
             **/

        }, {
            key: 'tilePosition',
            value: function tilePosition(col, row) {
                var x = col * this.tileSize;
                var y = row * this.tileSize;
                var overlap = this.overlap;
                if (col != 0) {
                    x -= overlap;
                }
                if (row != 0) {
                    y -= overlap;
                }
                return new PIXI.Point(x, y);
            }

            /** Computes the tile size without overlap
             * @param {number} col - The column of the tile
             * @param {number} row - The row of the tile
             * @returns {PIXI.Point} obj
             **/

        }, {
            key: 'tileDimensions',
            value: function tileDimensions(col, row) {
                var w = this.tileSize;
                var h = this.tileSize;
                var pos = this.tilePosition(col, row);
                if (col == this.cols - 1) {
                    w = this.pixelWidth - pos.x;
                }
                if (row == this.rows - 1) {
                    h = this.pixelHeight - pos.y;
                }
                return new PIXI.Point(w, h);
            }

            /** Method to support debugging. Highlights the specified tile at col, row **/

        }, {
            key: 'highlightTile',
            value: function highlightTile(col, row) {
                if (col > -1 && row > -1 && col < this.cols && row < this.rows) {
                    var graphics = this.highlight;
                    var dim = this.tileDimensions(col, row);
                    graphics.position = this.tilePosition(col, row);
                    graphics.clear();
                    graphics.beginFill(0xff00ff, 0.1);
                    graphics.lineStyle(2, 0xffff00);
                    graphics.drawRect(1, 1, dim.x - 2, dim.y - 2);
                    graphics.endFill();
                    this.addChild(this.highlight);
                } else {
                    this.removeChild(this.highlight);
                }
            }

            /** Loads the tiles for the given urls and adds the tiles as sprites.
             * @param {array} urlpos - An array of URL, pos pairs
             * @param {boolean} onlyone - Loads only on tile at a time if true
             **/

        }, {
            key: 'loadTiles',
            value: function loadTiles(urlpos, onlyone, refCol, refRow) {
                var _this32 = this;

                if (this.showGrid) {
                    this.highlightTile(refCol, refRow);
                }
                urlpos.forEach(function (d) {
                    var _d = _slicedToArray(d, 3),
                        url = _d[0],
                        col = _d[1],
                        row = _d[2];

                    if (_this32.loader.schedule(url, col, row)) {
                        if (onlyone) {
                            return _this32.loader.loadOneTile();
                        }
                    }
                });
                this.loader.loadAll();
            }

            /** Private method: add a red border to a tile for debugging purposes. **/

        }, {
            key: '_addTileBorder',
            value: function _addTileBorder(tile, col, row) {
                var dim = this.tileDimensions(col, row);
                var graphics = new PIXI.Graphics();
                graphics.beginFill(0, 0);
                graphics.lineStyle(2, 0xff0000);
                graphics.drawRect(1, 1, dim.x - 2, dim.y - 2);
                graphics.endFill();
                tile.addChild(graphics);
            }

            /** Adds a tile. **/

        }, {
            key: 'addTile',
            value: function addTile(tile, col, row, url) {
                if (this.available.has(url)) return;
                this.addChild(tile);
                this.available.set(url, tile);
            }

            //    * Remove a tile. **/
            //     removeTile(col, row, url) {
            //         if (this.available.has(url)) {
            //             let tile = this.available.get(url)
            //             this.removeChild(tile)
            //             tile.destroy(true)
            //             if (this.debug) console.log("Destroyed tile", url)
            //             this.available.delete(url)
            //         }
            //     }

            /** Called by the loader after each successfull loading of a single tile.
             * Adds the sprite to the tile layer.
             * @param {Object} tile - the loaded tile sprite
             * @param {Number} col - the col position
             * @param {Number} row - the rowposition
             **/

        }, {
            key: 'tileAvailable',
            value: function tileAvailable(tile, col, row, url) {
                var pos = this.tilePosition(col, row);
                if (this.showGrid) {
                    this._addTileBorder(tile, col, row);
                }
                tile.position = pos;
                tile.interactive = false;
                if (TweenMax) {
                    tile.alpha = 0;
                    TweenMax.to(tile, this.fadeInTime, { alpha: this.alpha });
                }
                this.addTile(tile, col, row, url);
            }

            /** Destroys the tiles layer and    destroys the loader. Async load calls are
             * cancelled.
             **/

        }, {
            key: 'destroy',
            value: function destroy() {
                this.loader.destroy();
                app.renderer.textureGC.unload(this);
                _get(Tiles.prototype.__proto__ || Object.getPrototypeOf(Tiles.prototype), 'destroy', this).call(this, true); // Calls destroyChildren
                this.available.clear();
            }

            /* Destroys the tiles which are not with the bounds of the app to free
            * memory.
            **/

        }, {
            key: 'destroyTiles',
            value: function destroyTiles(quadTrees) {
                var count = 0;
                var _iteratorNormalCompletion43 = true;
                var _didIteratorError43 = false;
                var _iteratorError43 = undefined;

                try {
                    for (var _iterator43 = this.available.entries()[Symbol.iterator](), _step43; !(_iteratorNormalCompletion43 = (_step43 = _iterator43.next()).done); _iteratorNormalCompletion43 = true) {
                        var _step43$value = _slicedToArray(_step43.value, 2),
                            url = _step43$value[0],
                            tile = _step43$value[1];

                        if (!quadTrees.has(url)) {
                            this.removeChild(tile);
                            tile.destroy(true);
                            this.requested.delete(url);
                            this.available.delete(url);
                            count += 1;
                        }
                    }
                } catch (err) {
                    _didIteratorError43 = true;
                    _iteratorError43 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion43 && _iterator43.return) {
                            _iterator43.return();
                        }
                    } finally {
                        if (_didIteratorError43) {
                            throw _iteratorError43;
                        }
                    }
                }

                if (count && this.debug) console.log('destroyObsoleteTiles', this.level, count);
            }
        }, {
            key: 'tintTiles',
            value: function tintTiles(quadTrees) {
                var _iteratorNormalCompletion44 = true;
                var _didIteratorError44 = false;
                var _iteratorError44 = undefined;

                try {
                    for (var _iterator44 = this.available.entries()[Symbol.iterator](), _step44; !(_iteratorNormalCompletion44 = (_step44 = _iterator44.next()).done); _iteratorNormalCompletion44 = true) {
                        var _step44$value = _slicedToArray(_step44.value, 2),
                            url = _step44$value[0],
                            tile = _step44$value[1];

                        if (!quadTrees.has(url)) tile.tint = 0xff0000;
                    }
                } catch (err) {
                    _didIteratorError44 = true;
                    _iteratorError44 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion44 && _iterator44.return) {
                            _iterator44.return();
                        }
                    } finally {
                        if (_didIteratorError44) {
                            throw _iteratorError44;
                        }
                    }
                }
            }
        }, {
            key: 'untintTiles',
            value: function untintTiles() {
                var _iteratorNormalCompletion45 = true;
                var _didIteratorError45 = false;
                var _iteratorError45 = undefined;

                try {
                    for (var _iterator45 = this.available.entries()[Symbol.iterator](), _step45; !(_iteratorNormalCompletion45 = (_step45 = _iterator45.next()).done); _iteratorNormalCompletion45 = true) {
                        var _step45$value = _slicedToArray(_step45.value, 2),
                            url = _step45$value[0],
                            tile = _step45$value[1];

                        tile.tint = 0xffffff;
                    }
                } catch (err) {
                    _didIteratorError45 = true;
                    _iteratorError45 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion45 && _iterator45.return) {
                            _iterator45.return();
                        }
                    } finally {
                        if (_didIteratorError45) {
                            throw _iteratorError45;
                        }
                    }
                }
            }
        }, {
            key: 'highlight',
            get: function get() {
                if (this._highlight == null) {
                    var graphics = new PIXI.Graphics();
                    graphics.beginFill(0xffff00, 0.1);
                    graphics.lineStyle(2, 0xffff00);
                    graphics.drawRect(1, 1, tileSize - 2, tileSize - 2);
                    graphics.endFill();
                    graphics.interactive = false;
                    this._highlight = graphics;
                }
                return this._highlight;
            }
        }]);

        return Tiles;
    }(PIXI.Container);

    /**
    * The main class of a deeply zoomable image that is represented by a hierarchy
    * of tile layers for each zoom level. This gives the user the impression that
    * even huge pictures (up to gigapixel-images) can be zoomed instantaneously,
    * since the tiles at smaller levels are scaled immediately and overloaded by
    * more detailed tiles at the larger level as fast as possible.
     * @constructor
    * @param {DeepZoomInfo} deepZoomInfo - Information extracted from a JSON-Object
    */


    var DeepZoomImage = function (_PIXI$Container2) {
        _inherits(DeepZoomImage, _PIXI$Container2);

        function DeepZoomImage(deepZoomInfo) {
            var _ref17 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref17$debug = _ref17.debug,
                debug = _ref17$debug === undefined ? false : _ref17$debug,
                _ref17$shadow = _ref17.shadow,
                shadow = _ref17$shadow === undefined ? false : _ref17$shadow,
                _ref17$center = _ref17.center,
                center = _ref17$center === undefined ? false : _ref17$center,
                _ref17$highResolution = _ref17.highResolution,
                highResolution = _ref17$highResolution === undefined ? true : _ref17$highResolution,
                _ref17$autoLoadTiles = _ref17.autoLoadTiles,
                autoLoadTiles = _ref17$autoLoadTiles === undefined ? true : _ref17$autoLoadTiles,
                _ref17$preferWorker = _ref17.preferWorker,
                preferWorker = _ref17$preferWorker === undefined ? false : _ref17$preferWorker,
                _ref17$minimumLevel = _ref17.minimumLevel,
                minimumLevel = _ref17$minimumLevel === undefined ? 0 : _ref17$minimumLevel,
                _ref17$alpha = _ref17.alpha,
                alpha = _ref17$alpha === undefined ? 1 : _ref17$alpha;

            _classCallCheck(this, DeepZoomImage);

            var _this33 = _possibleConstructorReturn(this, (DeepZoomImage.__proto__ || Object.getPrototypeOf(DeepZoomImage)).call(this));

            _this33.debug = debug;
            _this33.shadow = shadow;
            _this33.preferWorker = preferWorker;
            _this33.resolution = highResolution ? Math.round(window.devicePixelRatio) : 1;
            _this33.alpha = alpha;
            _this33.fastLoads = 0;
            _this33.autoLoadTiles = autoLoadTiles;
            _this33.minimumLevel = minimumLevel;
            _this33.quadTrees = new Map(); // url as keys, TileQuadNodes as values
            _this33.setup(deepZoomInfo, center);
            if (debug) {
                console.log('DeepZoomImage.constructor', minimumLevel);
                console.log("   prefers worker loader");
            }
            return _this33;
        }

        /** Reads the DeepZoomInfo object and initializes all tile layers.
         * Called by the constructor.
         * Creates the sprite for the loaded texture and add the sprite to the tile
         * layer.
         * @param {Object} deepZoomInfo - the DeepZoomInfo instance
         * @param {boolean} center - If true ensures that the pivot is set to the center
         **/


        _createClass(DeepZoomImage, [{
            key: 'setup',
            value: function setup(deepZoomInfo, center) {
                this.info = deepZoomInfo;
                this.interactive = true;
                this.tileLayers = {};

                this._foreground = null;
                this.tileContainer = new PIXI.Container();
                this.tileContainer.interactive = false;

                var _baseSize = _slicedToArray(this.baseSize, 2),
                    w = _baseSize[0],
                    h = _baseSize[1];

                if (this.shadow) {
                    this.filters = [new PIXI.filters.DropShadowFilter(45, 3)];
                }
                this.addChild(this.tileContainer);

                if (deepZoomInfo.clip) {
                    var mask = new PIXI.Graphics();
                    mask.beginFill(1, 1);
                    mask.drawRect(0, 0, w, h);
                    mask.endFill();
                    this.mask = mask;
                    this.addChild(mask);
                    this.minimumLevel = deepZoomInfo.baseLevel;
                }
                this.currentLevel = Math.max(this.minimumLevel, deepZoomInfo.baseLevel);
                if (this.autoLoadTiles) {
                    this.setupTiles(center);
                }
            }

            /** Default setup method for tiles. Loads all tiles of the current level.
            Can be overwritten in subclasses.
            @param {boolean} center - If true ensures that the pivot is set to the center
            **/

        }, {
            key: 'setupTiles',
            value: function setupTiles() {
                var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                // First load background tile
                var tiles = this.ensureAllTiles(this.currentLevel);
                if (center) {
                    this.pivot.set(w / 2, h / 2);
                }
                var scaleLevel = this.levelForScale(1);
                this.ensureAllTiles(scaleLevel);
            }
        }, {
            key: 'removeTileQuadNode',
            value: function removeTileQuadNode(level, col, row, url) {
                if (this.quadTrees.has(url)) {
                    var quad = this.quadTrees.get(url);
                    this.tileQuadRemoved(quad);
                    this.quadTrees.delete(url);
                }
            }
        }, {
            key: 'addTileQuadNode',
            value: function addTileQuadNode(level, col, row, url) {
                if (this.quadTrees.has(url)) return this.quadTrees.get(url);
                var quad = new TileQuadNode(level, col, row, url);
                this.quadTrees.set(url, quad);
                this.tileQuadAdded(quad);
                return quad;
            }
        }, {
            key: 'tileQuadRemoved',
            value: function tileQuadRemoved(quad) {
                var below = quad.previous;
                // if (this.debug) console.log("tileQuadRemoved", quad)
                if (below) {
                    below.unlink(quad);
                    if (below.noQuads()) {
                        if (this.debug) console.log('Removed tile below');
                        var levelBelow = quad.level - 1;
                        if (levelBelow < this.minimumLevel) return;
                        var c = Math.floor(quad.col / 2);
                        var r = Math.floor(quad.row / 2);
                        var urlBelow = this.info.urlForTile(levelBelow, c, r);
                        if (this.quadTrees.has(urlBelow)) {
                            this.removeTileQuadNode(levelBelow, c, r, urlBelow);
                        }
                    }
                }
            }
        }, {
            key: 'tileQuadAdded',
            value: function tileQuadAdded(quad) {
                var levelBelow = quad.level - 1;
                if (levelBelow < this.minimumLevel) return;
                //if (this.debug) console.log("tileQuadAdded", quad)
                var c = Math.floor(quad.col / 2);
                var r = Math.floor(quad.row / 2);
                var urlBelow = this.info.urlForTile(levelBelow, c, r);
                var below = null;
                if (!this.quadTrees.has(urlBelow)) {
                    below = this.addTileQuadNode(levelBelow, c, r, urlBelow);
                    quad.link(isEven(quad.row), isEven(quad.col), below);
                }
            }

            /** Returns the tile layer level that corresponds to the given scale.
             * @param {number} scale - the scale factor
             **/

        }, {
            key: 'levelForScale',
            value: function levelForScale(scale) {
                var level = Math.round(Math.log2(scale * this.resolution)); // Math.floor(Math.log2(event.scale))+1
                var newLevel = this.info.baseLevel + Math.max(level, 0);
                return Math.min(newLevel, this.info.maxLoadableLevel);
            }

            /** Adds a tile layer to the DeepZoomImage.
             * @param {string} key - the access key
             * @param {Tiles} tiles - the tile layer object
             **/

        }, {
            key: 'addTiles',
            value: function addTiles(key, tiles) {
                this.tileContainer.addChild(tiles);
                this.tileLayers[key] = tiles;
            }

            /** Getter for PIXI.Container foreground layer.
             * Adds a PIXI.Container if necessary.
             **/

        }, {
            key: 'contains',


            /** Overrides PIXI.Container.contains()
             * Allows to optimize the hit testing.
             */
            value: function contains(x, y) {
                var _baseSize2 = _slicedToArray(this.baseSize, 2),
                    w = _baseSize2[0],
                    h = _baseSize2[1];

                return x >= 0 && x <= w && y >= 0 && y <= h;
            }

            /** Overrides PIXI.Container._calculateBounds()
             * Only considers the base size and reduces the calculation to a single
             * rect.
             */

        }, {
            key: '_calculateBounds',
            value: function _calculateBounds() {
                var _baseSize3 = _slicedToArray(this.baseSize, 2),
                    w = _baseSize3[0],
                    h = _baseSize3[1];

                this._bounds.addFrame(this.transform, 0, 0, w, h);
            }

            /** Overrides PIXI.Container.calculateBounds()
             * Skips the children and only considers the deep zoom base size. Calls
             * the also overwritten _calculateBounds method.
             */

        }, {
            key: 'calculateBounds',
            value: function calculateBounds() {
                this._bounds.clear();
                this._calculateBounds();
                this._lastBoundsID = this._boundsID;
            }

            /** Returns a single sprite that can be used a thumbnail representation of
             * large images.
             * @return {Sprite} sprite - A sprite with a single tile texture
             */

        }, {
            key: 'thumbnail',
            value: function thumbnail() {
                return new PIXI.Sprite.fromImage(this.info.baseURL);
            }

            /** Returns a list of all tiles of a given level.
             * @param {Tiles} tiles - the grid of tiles
             * @param {number} level - The zoom level of the grid
             * @return {Array[]} - An array of [url, col, row] arrays
             **/

        }, {
            key: 'allTiles',
            value: function allTiles(tiles, level) {
                var result = [];
                for (var col = 0; col < tiles.cols; col++) {
                    for (var row = 0; row < tiles.rows; row++) {
                        var url = this.info.urlForTile(level, col, row);
                        result.push([url, col, row]);
                    }
                }
                return result;
            }

            /** Loads all tiles that are needed to fill the app bounds.
             * @param {Tiles} tiles - the grid of tiles
             * @param {number} level - The zoom level of the grid
             * @param {boolean} debug
             * @return {Array[]} - An array of [url, col, row] arrays
             */

        }, {
            key: 'neededTiles',
            value: function neededTiles(tiles, level) {
                var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                var result = [];
                var tsize = tiles.tileSize;
                var domBounds = app.view.getBoundingClientRect();
                var maxWidth = domBounds.width;
                var maxHeight = domBounds.height;
                var offset = tsize;
                var bounds = new PIXI.Rectangle(-offset, -offset, maxWidth + 2 * offset, maxHeight + 2 * offset);
                var scaledTileSize = tsize * tiles.tileScale;
                var pointInWindow = new PIXI.Point();

                var worldTransform = this.worldTransform;
                var worldCenter = new PIXI.Point(maxWidth / 2, maxWidth / 2);

                var tilesCenter = this.toLocal(worldCenter);
                /* UO: we need a toLocal call here since the transform may need an update
                which is guaranteed by the toLocal method. */
                var centerCol = Math.round(tilesCenter.x / scaledTileSize);
                var centerRow = Math.round(tilesCenter.y / scaledTileSize);

                var maxTilesWidth = Math.ceil(maxWidth / tiles.tileSize / 2 + 6) * this.resolution;
                var maxTilesHeight = Math.ceil(maxHeight / tiles.tileSize / 2 + 4) * this.resolution;

                var startCol = Math.max(0, centerCol - maxTilesWidth);
                var endCol = Math.min(tiles.cols, centerCol + maxTilesWidth);

                var startRow = Math.max(0, centerRow - maxTilesHeight);
                var endRow = Math.min(tiles.rows, centerRow + maxTilesHeight);

                for (var col = startCol; col < endCol; col++) {
                    var cx = (col + 0.5) * scaledTileSize;
                    for (var row = startRow; row < endRow; row++) {
                        var cy = (row + 0.5) * scaledTileSize;
                        var tileCenter = new PIXI.Point(cx, cy);
                        // This replaces the more traditional this.toGlobal(center, pointInWindow, true)
                        worldTransform.apply(tileCenter, pointInWindow);
                        if (bounds.contains(pointInWindow.x, pointInWindow.y)) {
                            var url = this.info.urlForTile(level, col, row);
                            result.push([url, col, row]);
                        }
                    }
                }
                return result;
            }

            /** Returns all changed tiles for a given level.
             * @param {Tiles} tiles - the grid of tiles
             * @param {number} level - The zoom level of the grid
             * @return { added: Array[], removed: Array[]} - An object with added and removed [url, col, row] arrays
             */

        }, {
            key: 'changedTiles',
            value: function changedTiles(tiles, level) {
                if (this.debug) console.time('changedTiles');
                var changed = { added: [], removed: [] };
                if (!tiles.isComplete()) {
                    var newNeeded = new Map();
                    var needed = this.neededTiles(tiles, level);
                    needed.forEach(function (d) {
                        var _d2 = _slicedToArray(d, 3),
                            url = _d2[0],
                            col = _d2[1],
                            row = _d2[2];

                        newNeeded.set(url, [col, row]);
                        if (!tiles.requested.has(url)) {
                            changed.added.push(d);
                        }
                    });
                    var _iteratorNormalCompletion46 = true;
                    var _didIteratorError46 = false;
                    var _iteratorError46 = undefined;

                    try {
                        for (var _iterator46 = tiles.needed.keys()[Symbol.iterator](), _step46; !(_iteratorNormalCompletion46 = (_step46 = _iterator46.next()).done); _iteratorNormalCompletion46 = true) {
                            var url = _step46.value;

                            if (!newNeeded.has(url)) {
                                var _tiles$needed$get = tiles.needed.get(url),
                                    _tiles$needed$get2 = _slicedToArray(_tiles$needed$get, 2),
                                    col = _tiles$needed$get2[0],
                                    row = _tiles$needed$get2[1];

                                changed.removed.push([url, col, row]);
                            }
                        }
                    } catch (err) {
                        _didIteratorError46 = true;
                        _iteratorError46 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion46 && _iterator46.return) {
                                _iterator46.return();
                            }
                        } finally {
                            if (_didIteratorError46) {
                                throw _iteratorError46;
                            }
                        }
                    }

                    tiles.needed = newNeeded;
                    if (this.debug) console.log(newNeeded);
                }
                if (this.debug) console.timeEnd('changedTiles');

                return changed;
            }

            /** Populates all tiles for a given level.
             * @param {Tiles} tiles - the grid of tiles
             * @param {number} level - The zoom level of the grid
             */

        }, {
            key: 'populateAllTiles',
            value: function populateAllTiles(tiles, level) {
                var all = this.allTiles(tiles, level);
                var _iteratorNormalCompletion47 = true;
                var _didIteratorError47 = false;
                var _iteratorError47 = undefined;

                try {
                    for (var _iterator47 = all[Symbol.iterator](), _step47; !(_iteratorNormalCompletion47 = (_step47 = _iterator47.next()).done); _iteratorNormalCompletion47 = true) {
                        var _step47$value = _slicedToArray(_step47.value, 3),
                            url = _step47$value[0],
                            col = _step47$value[1],
                            row = _step47$value[2];

                        this.addTileQuadNode(level, col, row, url);
                    }
                } catch (err) {
                    _didIteratorError47 = true;
                    _iteratorError47 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion47 && _iterator47.return) {
                            _iterator47.return();
                        }
                    } finally {
                        if (_didIteratorError47) {
                            throw _iteratorError47;
                        }
                    }
                }

                tiles.loadTiles(all, false, 0, 0);
            }

            /** Loads all tiles that are needed to fill the browser window.
             * If the optional about parameter is provided (as a point with col as x,
             * and row as y attr) the tiles are sorted by the distance to this point.
             *
             * @param {Tiles} tiles - the grid of tiles
             * @param {number} level - The zoom level of the grid
             * Optional parameter:
             * @param {boolean} onlyone - if true only one tile is loaded
             * @param {PIXI.Point} about - point of interaction
             */

        }, {
            key: 'populateTiles',
            value: function populateTiles(tiles, level) {
                var _ref18 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref18$onlyone = _ref18.onlyone,
                    onlyone = _ref18$onlyone === undefined ? false : _ref18$onlyone,
                    _ref18$about = _ref18.about,
                    about = _ref18$about === undefined ? null : _ref18$about;

                var changed = this.changedTiles(tiles, level);
                var removed = changed.removed;
                var _iteratorNormalCompletion48 = true;
                var _didIteratorError48 = false;
                var _iteratorError48 = undefined;

                try {
                    for (var _iterator48 = removed[Symbol.iterator](), _step48; !(_iteratorNormalCompletion48 = (_step48 = _iterator48.next()).done); _iteratorNormalCompletion48 = true) {
                        var _step48$value = _slicedToArray(_step48.value, 3),
                            url = _step48$value[0],
                            col = _step48$value[1],
                            row = _step48$value[2];

                        this.removeTileQuadNode(level, col, row, url);
                    }
                } catch (err) {
                    _didIteratorError48 = true;
                    _iteratorError48 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion48 && _iterator48.return) {
                            _iterator48.return();
                        }
                    } finally {
                        if (_didIteratorError48) {
                            throw _iteratorError48;
                        }
                    }
                }

                var added = changed.added;
                if (added.length == 0) return;
                var _iteratorNormalCompletion49 = true;
                var _didIteratorError49 = false;
                var _iteratorError49 = undefined;

                try {
                    for (var _iterator49 = added[Symbol.iterator](), _step49; !(_iteratorNormalCompletion49 = (_step49 = _iterator49.next()).done); _iteratorNormalCompletion49 = true) {
                        var _step49$value = _slicedToArray(_step49.value, 3),
                            url = _step49$value[0],
                            col = _step49$value[1],
                            row = _step49$value[2];

                        this.addTileQuadNode(level, col, row, url);
                    }
                } catch (err) {
                    _didIteratorError49 = true;
                    _iteratorError49 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion49 && _iterator49.return) {
                            _iterator49.return();
                        }
                    } finally {
                        if (_didIteratorError49) {
                            throw _iteratorError49;
                        }
                    }
                }

                var referenceCol = -1;
                var referenceRow = -1;
                if (about != null) {
                    // We want to load tiles in the focus of the user first, therefore
                    // we sort according to the distance of the focus of interaction
                    var refPoint = this.toLocal(about);
                    var scaledTileSize = tiles.tileSize * tiles.tileScale;

                    referenceCol = Math.floor(refPoint.x / scaledTileSize);
                    referenceRow = Math.floor(refPoint.y / scaledTileSize);

                    var ref = new PIXI.Point(referenceCol, referenceRow);

                    // Note: The array must be sorted in a way that the nearest tiles
                    // are at the end of the array since the load queue uses Array.push
                    // Array.pop

                    added.sort(function (a, b) {
                        var aa = new PIXI.Point(a[1], a[2]);
                        var bb = new PIXI.Point(b[1], b[2]);
                        var da = Points.distance(aa, ref);
                        var db = Points.distance(bb, ref);
                        return db - da;
                    });
                    //console.log("sorted populateTiles",  referenceCol, referenceRow, missing)
                }
                //console.log("populateTiles " +  missing.length)
                tiles.loadTiles(added, onlyone, referenceCol, referenceRow);
            }

            /** Private method: creates all tiles for a given level.
             * @param {number} level - The zoom level of the grid
             * @return {Tiles} - tiles
             */

        }, {
            key: '_createTiles',
            value: function _createTiles(key, level) {
                var _info$dimensions = this.info.dimensions(level),
                    _info$dimensions2 = _slicedToArray(_info$dimensions, 4),
                    cols = _info$dimensions2[0],
                    rows = _info$dimensions2[1],
                    w = _info$dimensions2[2],
                    h = _info$dimensions2[3];

                var increasedLevels = level - this.info.baseLevel;
                var invScale = Math.pow(0.5, increasedLevels);
                var tiles = new Tiles(level, this, invScale, cols, rows, w, h, this.info.tileSize, this.info.overlap);
                this.addTiles(key, tiles);
                if (this.info.clip) {
                    var rest = this.info.rests[level];
                    if (rest) {
                        var _x46 = rest.restCol * this.info.tileSize * invScale;
                        var _y3 = rest.restRow * this.info.tileSize * invScale;
                        tiles.x = -_x46;
                        tiles.y = -_y3;
                    }
                }
                return tiles;
            }

            /** Ensures that all needed tiles of a given level are loaded. Creates
             * a new Tiles layer if necessary
             * @param {number} level - The zoom level of the grid
             * @return {Tiles} tiles
             */

        }, {
            key: 'ensureTiles',
            value: function ensureTiles(level, about) {
                var key = level.toString();
                if (key in this.tileLayers) {
                    var _tiles = this.tileLayers[key];
                    this.populateTiles(_tiles, level, { about: about });
                    return _tiles;
                }
                var tiles = this._createTiles(key, level);
                this.populateTiles(tiles, level, { about: about });
                //console.log("ensureTiles", level)
                return tiles;
            }
        }, {
            key: 'untintTiles',
            value: function untintTiles(level) {
                var key = level.toString();
                if (key in this.tileLayers) {
                    var tiles = this.tileLayers[key];
                }
            }

            /** Ensures that all tiles of a given level are loaded.
             * @param {number} level - The zoom level of the grid
             */

        }, {
            key: 'ensureAllTiles',
            value: function ensureAllTiles(level) {
                var key = level.toString();
                if (key in this.tileLayers) {
                    var _tiles2 = this.tileLayers[key];
                    this.populateAllTiles(_tiles2, level);
                    _tiles2.keep = true;
                    return;
                }
                var tiles = this._createTiles(key, level);
                this.populateAllTiles(tiles, level);
                tiles.keep = true;
                return tiles;
            }

            /** Destroys all tiles above a given level to ensure that the memory can
             * be reused.
             * @param {number} level - The zoom level of the grid
             */

        }, {
            key: 'destroyTilesAboveLevel',
            value: function destroyTilesAboveLevel(level) {
                var _this34 = this;

                Object.keys(this.tileLayers).forEach(function (key) {
                    var tiles = _this34.tileLayers[key];
                    if (tiles.level > level && !tiles.keep) {
                        var _iteratorNormalCompletion50 = true;
                        var _didIteratorError50 = false;
                        var _iteratorError50 = undefined;

                        try {
                            for (var _iterator50 = tiles.available.keys()[Symbol.iterator](), _step50; !(_iteratorNormalCompletion50 = (_step50 = _iterator50.next()).done); _iteratorNormalCompletion50 = true) {
                                var url = _step50.value;

                                var quad = _this34.quadTrees.get(url);
                                if (quad) _this34.removeTileQuadNode(quad);
                            }
                        } catch (err) {
                            _didIteratorError50 = true;
                            _iteratorError50 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion50 && _iterator50.return) {
                                    _iterator50.return();
                                }
                            } finally {
                                if (_didIteratorError50) {
                                    throw _iteratorError50;
                                }
                            }
                        }

                        _this34.tileContainer.removeChild(tiles);
                        tiles.destroy();
                        delete _this34.tileLayers[key];
                    }
                });
            }
        }, {
            key: 'destroyTiles',
            value: function destroyTiles() {
                var _this35 = this;

                return;
                // UO: This is buggy
                Object.keys(this.tileLayers).forEach(function (key) {
                    var tiles = _this35.tileLayers[key];
                    if (!tiles.keep) tiles.destroyTiles(_this35.quadTrees);
                });
            }

            /* Tint all tiles
            * @param {number} level - The zoom level of the grid
            */

        }, {
            key: 'tintTilesBelowLevel',
            value: function tintTilesBelowLevel(level) {
                var _this36 = this;

                Object.keys(this.tileLayers).forEach(function (key) {
                    var tiles = _this36.tileLayers[key];
                    if (tiles.level < level) {
                        tiles.tintTiles(_this36.quadTrees);
                    }
                });
            }
        }, {
            key: '_eventLevel',
            value: function _eventLevel(event) {
                return this.levelForScale(event.scale);
            }

            /** A callback function that can be used by a Scatter view to inform
             * the zoomable image that it has been moved, rotated or scaled, and should
             * load tiles accordingly.
             * @param {PIXI.Point} translated - the movement of the scatter
             * @param {number} scale - the zoom factor
             * @param {PIXI.Point} about - the anchor point of the zoom
             * @param {boolean} fast - informs the callback to return as fast as possible,
             *  i.e. after loading a single tile
             * @param {boolean} debug - log debug infos
             */

        }, {
            key: 'transformed',
            value: function transformed(event) {
                var key = this.currentLevel.toString();
                var currentTiles = this.tileLayers[key];
                if (event.fast) {
                    this.fastLoads += 1;
                    this.populateTiles(currentTiles, this.currentLevel, {
                        onlyone: false,
                        about: event.about
                    });
                    this.destroyTiles();
                    return;
                }
                if (event.scale == null) {
                    this.ensureTiles(this.currentLevel, event.about);
                    return;
                }
                var newLevel = Math.max(this._eventLevel(event), this.minimumLevel);
                if (newLevel != this.currentLevel) {
                    if (!currentTiles.keep) currentTiles.loader.cancel();
                    this.destroyTilesAboveLevel(newLevel);
                    if (this.debug) this.tintTilesBelowLevel(newLevel);
                    this.destroyTiles();
                    var tiles = this.ensureTiles(newLevel, event.about);
                    tiles.untintTiles();
                    this.currentLevel = newLevel;
                } else {
                    this.ensureTiles(this.currentLevel, event.about);
                    this.destroyTiles();
                }

                if (this._foreground) {
                    this.addChild(this._foreground);
                }
            }
        }, {
            key: 'foreground',
            get: function get() {
                if (this._foreground == null) {
                    this._foreground = new PIXI.Container();
                    this.addChild(this._foreground);
                }
                return this._foreground;
            }

            /** Getter for the DeepZoomInfo base level size.
             **/

        }, {
            key: 'baseSize',
            get: function get() {
                return this.info.getDimensions(this.info.baseLevel);
            }

            /** Getter for the current scaled size in pixels.
             **/

        }, {
            key: 'pixelSize',
            get: function get() {
                var _baseSize4 = _slicedToArray(this.baseSize, 2),
                    w = _baseSize4[0],
                    h = _baseSize4[1];

                return [w * this.scale.x, h * this.scale.y];
            }

            /** Getter for the max scale factor.
             **/

        }, {
            key: 'maxScale',
            get: function get() {
                var delta = this.info.maxLevel - this.info.baseLevel;
                return Math.pow(2, delta) / this.resolution * 2;
            }

            /** Getter for the current width.
             **/

        }, {
            key: 'width',
            get: function get() {
                return this.pixelSize[0];
            }

            /** Getter for the current height.
             **/

        }, {
            key: 'height',
            get: function get() {
                return this.pixelSize[1];
            }

            /** Overrides PIXI.Container.hitArea()
             * Allows to optimize the hit testing. Container with hit areas are directly
             * hit tested without consideration of children.
             */

        }, {
            key: 'hitArea',
            get: function get() {
                return this;
            }
        }]);

        return DeepZoomImage;
    }(PIXI.Container);

    //import {getId} from './utils.js'

    var CardLoader$1 = function () {
        function CardLoader$1(src) {
            var _ref19 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref19$x = _ref19.x,
                x = _ref19$x === undefined ? 0 : _ref19$x,
                _ref19$y = _ref19.y,
                y = _ref19$y === undefined ? 0 : _ref19$y,
                _ref19$width = _ref19.width,
                width = _ref19$width === undefined ? 1000 : _ref19$width,
                _ref19$height = _ref19.height,
                height = _ref19$height === undefined ? 800 : _ref19$height,
                _ref19$maxWidth = _ref19.maxWidth,
                maxWidth = _ref19$maxWidth === undefined ? null : _ref19$maxWidth,
                _ref19$maxHeight = _ref19.maxHeight,
                maxHeight = _ref19$maxHeight === undefined ? null : _ref19$maxHeight,
                _ref19$scale = _ref19.scale,
                scale = _ref19$scale === undefined ? 1 : _ref19$scale,
                _ref19$minScale = _ref19.minScale,
                minScale = _ref19$minScale === undefined ? 0.5 : _ref19$minScale,
                _ref19$maxScale = _ref19.maxScale,
                maxScale = _ref19$maxScale === undefined ? 1.5 : _ref19$maxScale,
                _ref19$rotation = _ref19.rotation,
                rotation = _ref19$rotation === undefined ? 0 : _ref19$rotation;

            _classCallCheck(this, CardLoader$1);

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

        _createClass(CardLoader$1, [{
            key: 'unload',
            value: function unload() {
                if (this.addedNode) {
                    this.addedNode.remove();
                    this.addedNode = null;
                }
            }
        }]);

        return CardLoader$1;
    }();

    var ImageLoader$1 = function (_CardLoader$) {
        _inherits(ImageLoader$1, _CardLoader$);

        function ImageLoader$1() {
            _classCallCheck(this, ImageLoader$1);

            return _possibleConstructorReturn(this, (ImageLoader$1.__proto__ || Object.getPrototypeOf(ImageLoader$1)).apply(this, arguments));
        }

        _createClass(ImageLoader$1, [{
            key: 'load',
            value: function load(domNode) {
                var _this38 = this;

                return new Promise(function (resolve, reject) {
                    var isImage = domNode instanceof HTMLImageElement;
                    var image = isImage ? domNode : document.createElement('img');
                    image.onload = function (e) {
                        if (!isImage) {
                            domNode.appendChild(image);
                            _this38.addedNode = image;
                        }
                        _this38.wantedWidth = image.naturalWidth;
                        _this38.wantedHeight = image.naturalHeight;

                        var scaleW = _this38.maxWidth / image.naturalWidth;
                        var scaleH = _this38.maxHeight / image.naturalHeight;
                        _this38.scale = Math.min(_this38.maxScale, Math.min(scaleW, scaleH));
                        image.setAttribute('draggable', false);
                        image.width = image.naturalWidth;
                        image.height = image.naturalHeight;
                        resolve(_this38);
                    };
                    image.onerror = function (e) {
                        reject(_this38);
                    };
                    image.src = _this38.src;
                });
            }
        }]);

        return ImageLoader$1;
    }(CardLoader$1);

    var DOMFlip$1 = function () {
        function DOMFlip$1(domScatterContainer, flipTemplate, frontLoader, backLoader) {
            var _ref20 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref20$autoLoad = _ref20.autoLoad,
                autoLoad = _ref20$autoLoad === undefined ? false : _ref20$autoLoad,
                _ref20$center = _ref20.center,
                center = _ref20$center === undefined ? null : _ref20$center,
                _ref20$preloadBack = _ref20.preloadBack,
                preloadBack = _ref20$preloadBack === undefined ? false : _ref20$preloadBack,
                _ref20$translatable = _ref20.translatable,
                translatable = _ref20$translatable === undefined ? true : _ref20$translatable,
                _ref20$scalable = _ref20.scalable,
                scalable = _ref20$scalable === undefined ? true : _ref20$scalable,
                _ref20$rotatable = _ref20.rotatable,
                rotatable = _ref20$rotatable === undefined ? true : _ref20$rotatable,
                _ref20$onFront = _ref20.onFront,
                onFront = _ref20$onFront === undefined ? null : _ref20$onFront,
                _ref20$onBack = _ref20.onBack,
                onBack = _ref20$onBack === undefined ? null : _ref20$onBack,
                _ref20$onClose = _ref20.onClose,
                onClose = _ref20$onClose === undefined ? null : _ref20$onClose,
                _ref20$onUpdate = _ref20.onUpdate,
                onUpdate = _ref20$onUpdate === undefined ? null : _ref20$onUpdate,
                _ref20$onRemoved = _ref20.onRemoved,
                onRemoved = _ref20$onRemoved === undefined ? null : _ref20$onRemoved;

            _classCallCheck(this, DOMFlip$1);

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

        _createClass(DOMFlip$1, [{
            key: 'load',
            value: function load() {
                var _this39 = this;

                return new Promise(function (resolve, reject) {
                    var t = _this39.flipTemplate;
                    var dom = _this39.domScatterContainer.element;
                    var wrapper = t.content.querySelector('.flipWrapper');
                    wrapper.id = _this39.id;
                    var clone = document.importNode(t.content, true);
                    dom.appendChild(clone);
                    // We cannot use the document fragment itself because it
                    // is not part of the main dom tree. After the appendChild
                    // call we can access the new dom element by id
                    _this39.cardWrapper = dom.querySelector('#' + _this39.id);
                    var front = _this39.cardWrapper.querySelector('.front');
                    _this39.frontLoader.load(front).then(function (loader) {
                        _this39.frontLoaded(loader).then(resolve);
                    });
                });
            }
        }, {
            key: 'frontLoaded',
            value: function frontLoaded(loader) {
                var _this40 = this;

                return new Promise(function (resolve, reject) {
                    var scatter = new DOMScatter(_this40.cardWrapper, _this40.domScatterContainer, {
                        x: loader.x,
                        y: loader.y,
                        startScale: loader.scale,
                        scale: loader.scale,
                        maxScale: loader.maxScale,
                        minScale: loader.minScale,
                        width: loader.wantedWidth,
                        height: loader.wantedHeight,
                        rotation: loader.rotation,
                        translatable: _this40.translatable,
                        scalable: _this40.scalable,
                        rotatable: _this40.rotatable
                    });
                    if (_this40.center) {
                        scatter.centerAt(_this40.center);
                    }

                    var flippable = new DOMFlippable$1(_this40.cardWrapper, scatter, _this40);
                    var back = _this40.cardWrapper.querySelector('.back');

                    if (_this40.preloadBack) {
                        _this40.backLoader.load(back).then(function (loader) {
                            _this40.setupFlippable(flippable, loader);
                        });
                    }
                    _this40.flippable = flippable;
                    resolve(_this40);
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
                var _this41 = this;

                var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref21$duration = _ref21.duration,
                    duration = _ref21$duration === undefined ? 1.0 : _ref21$duration,
                    _ref21$targetCenter = _ref21.targetCenter,
                    targetCenter = _ref21$targetCenter === undefined ? null : _ref21$targetCenter;

                //console.log('DOMFlip.start', targetCenter)
                if (this.preloadBack) this.flippable.start({ duration: duration, targetCenter: targetCenter });else {
                    var back = this.cardWrapper.querySelector('.back');
                    var flippable = this.flippable;
                    this.backLoader.load(back).then(function (loader) {
                        _this41.setupFlippable(flippable, loader);
                        flippable.start({ duration: duration, targetCenter: targetCenter });
                    });
                }
            }
        }, {
            key: 'fadeOutAndRemove',
            value: function fadeOutAndRemove() {
                var _this42 = this;

                TweenLite.to(this.cardWrapper, 0.2, {
                    opacity: 0,
                    onComplete: function onComplete() {
                        _this42.cardWrapper.remove();
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

        return DOMFlip$1;
    }();

    var DOMFlippable$1 = function () {
        function DOMFlippable$1(element, scatter, flip) {
            var _this43 = this;

            _classCallCheck(this, DOMFlippable$1);

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
            TweenLite.set([this.back, this.front], {
                backfaceVisibility: 'hidden',
                perspective: 5000
            });
            TweenLite.set(this.front, { visibility: 'visible' });
            this.infoBtn = element.querySelector('.infoBtn');
            this.backBtn = element.querySelector('.backBtn');
            this.closeBtn = element.querySelector('.closeBtn');
            /* Buttons are not guaranteed to exist. */
            if (this.infoBtn) {
                this.infoBtn.onclick = function () {
                    _this43.flip.start();
                    //logging
                    app.log("image flipped to back", { id: flip.flippable.data.number });
                };
                this.show(this.infoBtn);
            }
            if (this.backBtn) {
                this.backBtn.onclick = function () {
                    _this43.start();
                    //logging
                    app.log("image flipped to front", { id: flip.flippable.data.number });
                };
            }
            if (this.closeBtn) {
                this.closeBtn.onclick = function () {
                    _this43.close();
                };
                this.show(this.closeBtn);
            }
            this.scaleButtons();
            this.bringToFront();
        }

        _createClass(DOMFlippable$1, [{
            key: 'close',
            value: function close() {
                var _this44 = this;

                this.hide(this.infoBtn);
                this.hide(this.closeBtn);
                if (this.onClose) {
                    this.onClose(this);
                    this.flip.closed();
                    //logging
                    app.log("image closed via button", { id: this.flip.flippable.data.number });
                } else {
                    this.scatter.zoom(0.1, {
                        animate: 0.5,
                        onComplete: function onComplete() {
                            _this44.element.remove();
                            _this44.flip.closed();
                            if (_this44.onRemoved) {
                                _this44.onRemoved.call(_this44);
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
                TweenLite.set(this.element, { zIndex: DOMScatter.zIndex++ });
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
                var _this45 = this;

                var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref22$duration = _ref22.duration,
                    duration = _ref22$duration === undefined ? 1.0 : _ref22$duration,
                    _ref22$targetCenter = _ref22.targetCenter,
                    targetCenter = _ref22$targetCenter === undefined ? null : _ref22$targetCenter;

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
                this.scatter.killAnimation();

                this.flipped = !this.flipped;
                var targetY = this.flipped ? 180 : 0;
                var targetZ = this.flipped ? this.startAngle + this.targetRotation(this.startAngle) : this.startAngle;
                var targetScale = this.flipped ? this.wantedScale : this.startScale;
                var w = this.flipped ? this.wantedWidth : this.startWidth;
                var h = this.flipped ? this.wantedHeight : this.startHeight;
                var dw = this.wantedWidth - this.scatter.width;
                var dh = this.wantedHeight - this.scatter.height;
                var tc = targetCenter;
                var xx = tc != null ? tc.x - w / 2 : this.startX - dw / 2;
                var yy = tc != null ? tc.y - h / 2 : this.startY - dh / 2;
                var x = this.flipped ? xx : this.startX;
                var y = this.flipped ? yy : this.startY;

                // console.log("DOMFlippable.start", this.flipped, targetCenter, x, y, this.saved)
                var onUpdate = this.onUpdate !== null ? function () {
                    return _this45.onUpdate(_this45);
                } : null;
                TweenLite.to(this.card, duration, {
                    rotationY: targetY,
                    ease: Power3.easeOut,
                    transformOrigin: '50% 50%',
                    onUpdate: onUpdate,
                    onComplete: function onComplete(e) {
                        if (_this45.flipped) {
                            //this.hide(this.front)
                            _this45.show(_this45.backBtn);
                            if (_this45.onFrontFlipped) {
                                _this45.onFrontFlipped(_this45);
                            }
                        } else {
                            //this.hide(this.back)
                            if (_this45.onBackFlipped == null) {
                                _this45.show(_this45.infoBtn);
                                _this45.show(_this45.closeBtn);
                            } else {
                                _this45.onBackFlipped(_this45);
                            }
                            _this45.flip.closed();
                        }
                        _this45.scatter.scale = targetScale;
                        _this45.scaleButtons();
                        _this45.scatter.rotationDegrees = targetZ;
                        _this45.scatter.width = _this45.flipped ? w : _this45.scatterStartWidth;
                        _this45.scatter.height = _this45.flipped ? h : _this45.scatterStartHeight;

                        var _saved = _this45.saved,
                            scalable = _saved.scalable,
                            translatable = _saved.translatable,
                            rotatable = _saved.rotatable;

                        _this45.scatter.scalable = scalable;
                        _this45.scatter.translatable = translatable;
                        _this45.scatter.rotatable = rotatable;
                    },
                    force3D: true
                });

                // See https://greensock.com/forums/topic/7997-rotate-the-shortest-way/
                TweenLite.to(this.element, duration / 2, {
                    scale: targetScale,
                    ease: Power3.easeOut,
                    rotationZ: targetZ + '_short',
                    transformOrigin: '50% 50%',
                    width: w,
                    height: h,
                    x: x,
                    y: y,
                    onComplete: function onComplete(e) {
                        if (_this45.flipped) {
                            _this45.hide(_this45.front);
                        } else {
                            _this45.hide(_this45.back);
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

        return DOMFlippable$1;
    }();

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
            var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref23$parent = _ref23.parent,
                parent = _ref23$parent === undefined ? null : _ref23$parent,
                _ref23$content = _ref23.content,
                content = _ref23$content === undefined ? null : _ref23$content,
                _ref23$fontSize = _ref23.fontSize,
                fontSize = _ref23$fontSize === undefined ? '1em' : _ref23$fontSize,
                _ref23$fontFamily = _ref23.fontFamily,
                fontFamily = _ref23$fontFamily === undefined ? 'Arial' : _ref23$fontFamily,
                _ref23$padding = _ref23.padding,
                padding = _ref23$padding === undefined ? 16 : _ref23$padding,
                _ref23$notchSize = _ref23.notchSize,
                notchSize = _ref23$notchSize === undefined ? 10 : _ref23$notchSize,
                _ref23$switchPos = _ref23.switchPos,
                switchPos = _ref23$switchPos === undefined ? false : _ref23$switchPos,
                _ref23$maxWidth = _ref23.maxWidth,
                maxWidth = _ref23$maxWidth === undefined ? 800 : _ref23$maxWidth,
                _ref23$backgroundColo = _ref23.backgroundColor,
                backgroundColor = _ref23$backgroundColo === undefined ? '#EEE' : _ref23$backgroundColo,
                _ref23$normalColor = _ref23.normalColor,
                normalColor = _ref23$normalColor === undefined ? '#444' : _ref23$normalColor,
                _ref23$notchPosition = _ref23.notchPosition,
                notchPosition = _ref23$notchPosition === undefined ? 'bottomLeft' : _ref23$notchPosition,
                _ref23$autoClose = _ref23.autoClose,
                autoClose = _ref23$autoClose === undefined ? true : _ref23$autoClose;

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
                var _this46 = this;

                var _ref24 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref24$parent = _ref24.parent,
                    parent = _ref24$parent === undefined ? null : _ref24$parent,
                    _ref24$fontSize = _ref24.fontSize,
                    fontSize = _ref24$fontSize === undefined ? '1em' : _ref24$fontSize,
                    _ref24$fontFamily = _ref24.fontFamily,
                    fontFamily = _ref24$fontFamily === undefined ? 'Arial' : _ref24$fontFamily,
                    _ref24$padding = _ref24.padding,
                    padding = _ref24$padding === undefined ? 16 : _ref24$padding,
                    _ref24$notchSize = _ref24.notchSize,
                    notchSize = _ref24$notchSize === undefined ? 10 : _ref24$notchSize,
                    _ref24$switchPos = _ref24.switchPos,
                    switchPos = _ref24$switchPos === undefined ? false : _ref24$switchPos,
                    _ref24$maxWidth = _ref24.maxWidth,
                    maxWidth = _ref24$maxWidth === undefined ? 800 : _ref24$maxWidth,
                    _ref24$backgroundColo = _ref24.backgroundColor,
                    backgroundColor = _ref24$backgroundColo === undefined ? '#EEE' : _ref24$backgroundColo,
                    _ref24$normalColor = _ref24.normalColor,
                    normalColor = _ref24$normalColor === undefined ? '#444' : _ref24$normalColor,
                    _ref24$autoClose = _ref24.autoClose,
                    autoClose = _ref24$autoClose === undefined ? true : _ref24$autoClose;

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
                    if (_this46.eventOutside(e)) _this46.closePopup(e);
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
                var _this47 = this;

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: "GET",
                        url: _this47.path,
                        dataType: "xml",
                        success: function success(xml) {
                            resolve(xml);
                        },
                        error: function error(e) {
                            console.warn("Error loading " + _this47.path, e);
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
                var _this48 = this;

                return new Promise(function (resolve, reject) {
                    _this48.loadXML().then(function (xml) {
                        _this48.parseXML(xml).then(function (json) {
                            var domTree = _this48.createDOM(json);
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
                var _this49 = this;

                return new Promise(function (resolve, reject) {
                    _this49.loadXML().then(function (xml) {
                        _this49.parseXML(xml).then(function (json) {
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
            var _ref25 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref25$width = _ref25.width,
                width = _ref25$width === undefined ? window.innerWidth : _ref25$width,
                _ref25$height = _ref25.height,
                height = _ref25$height === undefined ? window.innerHeight : _ref25$height,
                _ref25$assetsPath = _ref25.assetsPath,
                assetsPath = _ref25$assetsPath === undefined ? './cards/' : _ref25$assetsPath,
                _ref25$colors = _ref25.colors,
                colors = _ref25$colors === undefined ? { artist: '#b0c6b2',
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
            } : _ref25$colors;

            _classCallCheck(this, XMLIndexParser);

            var _this50 = _possibleConstructorReturn(this, (XMLIndexParser.__proto__ || Object.getPrototypeOf(XMLIndexParser)).call(this, path));

            _this50.width = width;
            _this50.height = height;
            _this50.assetsPath = assetsPath;
            _this50.colors = colors;
            return _this50;
        }

        _createClass(XMLIndexParser, [{
            key: 'parseXML',
            value: function parseXML(xmldat) {
                var _this51 = this;

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
                        var parser = new XMLCardParser(_this51.basePath + '/' + src);
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

                            var ratio = this.getRatio(this.assetsPath + node.source);
                            var _h = node.maxheight / 670 * this.height;
                            var _w2 = _h * ratio;

                            $(_clone).css({
                                'height': _h,
                                'width': _w2
                            });

                            $($(_clone).children('.mainimg')).attr('src', this.assetsPath + node.source);
                            $(_clone).attr('id', node.id);
                            $($(_clone).children('.zoomicon')).attr('id', node.iconid);

                            $(_clone).children('figcaption.cap').append(node.cap); // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">")
                            $(_clone).children('figcaption.zoomcap').append(node.zoomcap);

                            // show image highlights
                            var highlights = node.highlights;
                            node = "";

                            /*while (highlights.length > 0) {
                            
                              let highlight = highlights.pop()
                              node += "<a id='" + highlight.id.replace(/\./g, "_") + "' class='detail' href='#' data-target='" + highlight.target + "' data-radius = '" + highlight.radius + "' style='" + highlight.style + "' ></a>"
                              //console.log('highlight with radius: ',highlight.radius, highlight.target)
                            }*/

                            $(_clone).append(node);
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
                                //console.log('group image: ',node.figures[j+1])
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
                    //$(this).attr('data-tooltip', value)
                });
            }
        }, {
            key: 'completed',
            value: function completed(domNode) {
                var _this52 = this;

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
                    if (wrapper[0].popup) {
                        wrapper[0].popup.close();
                        wrapper[0].popup = null;
                    }
                    _this52.removeZoomable();
                    _this52.removeImageHighlight();
                    var target = $(e.target);
                    var tooltip = target.attr('data-tooltip');
                    if (tooltip) {
                        var globalPos = { x: e.pageX, y: e.pageY };
                        var localPos = Points.fromPageToNode(wrapper[0], globalPos);
                        var popup = new Popup({ parent: wrapper[0], backgroundColor: '#222' });
                        localPos.y = _this52.height - localPos.y;
                        popup.showAt({ html: tooltip }, localPos);
                        wrapper[0].popup = popup;

                        if (target.attr('class') == 'detail') {
                            _this52.currentHighlight = target;
                            _this52.openImageHighlight();
                            console.log('open image highlight with id:', target.attr('id'));
                        }

                        if (target.attr('imagehighlightid')) {
                            //console.log(target.attr('imagehighlightid'))
                            //console.log((target.attr('id') + "Detail").replace(/\./g, "_"))
                            var detailId = (target.attr('id') + "Detail").replace(/\./g, "_");
                            _this52.currentHighlight = document.getElementById(detailId);
                            _this52.openImageHighlight();
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
                        _this52.openZoomable(wrapper, zoomable);
                    }
                });
                this.domNode = domNode;
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
                    scale: 1.15,
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
                var _this53 = this;

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
                        _this53.zoomableTweenInProgress = false;
                    } });
            }
        }, {
            key: 'removeZoomable',
            value: function removeZoomable() {
                var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                //logging
                //app.log("zoomable image closed",{id: ''})

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
                var _this54 = this;

                //console.log("openZoomable",wrapper,zoomable)
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
                wrapper.append('<img class="zoomicon ZoomedIcon" src="../../src/cards/icons/close.svg">');

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
                    _this54.closeZoomable(wrapper, div, zoomable, localFigurePos, scale);
                });

                //logging
                app.log("zoomable image opened", { id: zoomable.attr('id') });

                div.show();
                TweenMax.set(icon[0], { x: localIconPos.x, y: localIconPos.y });
                TweenMax.set(div[0], { x: localFigurePos.x,
                    y: localFigurePos.y,
                    scale: scale,
                    transformOrigin: "top left" });

                //pm: this is more or less a quick and dirty solution to zoomables that are too large... should be reworked
                var scaleFactor = 1;
                if (height > app.height * 0.5) scaleFactor = 0.75;

                TweenMax.to(zoomable[0], 0.4, { autoAlpha: 0 });
                TweenMax.to(div[0], 0.4, { scale: scaleFactor,
                    x: "-=" + (width * scaleFactor - currentWidth),
                    y: "-=" + (height * scaleFactor - currentHeight) });
            }
        }, {
            key: 'getRatio',
            value: function getRatio(source) {
                var dummy = document.createElement("IMG");
                dummy.setAttribute("src", source);
                var ratio = dummy.naturalWidth / dummy.naturalHeight;
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

                        //logging
                        var cardType = event.currentTarget.id.substring(4);
                        cardType = cardType.replace(/\d+$/, "");
                        app.log("topic opened", { id: event.currentTarget.id.substring(0, 3), type: cardType });

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
                        $($(target).find('.cardicon')).attr('src', '../../src/cards/icons/close.svg');
                        $(target).find('.titlebar').css({ height: '8%' });
                        //console.log("Expand")
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
                                    height: '93.5%',
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

                                //logging
                                app.log("topic closed", { id: '' });

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
                var _this56 = this;

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
                        var title = _this56.preserveTags(header[0].innerHTML);
                        targetdat.header = title;
                    }

                    var preview = $(xmldat).find("preview");
                    var previewText = preview.find("text");
                    if (previewText.length > 0) {
                        preview = _this56.preserveTags(previewText[0].innerHTML);
                    } else {
                        var previewImage = preview.find("img");
                        if (previewImage.length > 0) {
                            var image = $(previewImage[0]);
                            var src = image.attr('src');
                            image.attr('src', _this56.createLinkURL(src));
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
                                html = _this56.replaceCDATA(html);
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
                                            var ref = _this56.createLinkURL(links[k].href);
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
                                        //node.html += '<p> ' + nodes[j].innerHTML + ' </p>'
                                        //UO: Enable the following line to remove all links from P tags
                                        node.html += '<p> ' + nodes[j].innerText + ' </p>';
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
                                    node.cap = _this56.caption(sourcecol[i]);
                                    node.zoomcap = _this56.zoomCaption(sourcecol[i]);
                                } else {

                                    node.type = 'singleimage';
                                    node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                                    node.source = $(sourcecol[i]).attr('src');
                                    node.id = 'zoomable' + imgindex;
                                    node.iconid = 'zoom' + imgindex;
                                    node.cap = _this56.caption(sourcecol[i]);
                                    node.zoomcap = _this56.zoomCaption(sourcecol[i]);

                                    //walk throungh highlights
                                    nodes = $.parseHTML(html);
                                    var highlights = [];

                                    for (var _j = 0; _j < nodes.length; _j++) {

                                        if (nodes[_j].nodeName == "HIGHLIGHT") {
                                            console.log('parsing highlight');

                                            var _ref26 = _this56.createLinkURL($(nodes[_j]).attr('href'));

                                            targetdat.tooltipdata[_ref26] = "";

                                            var subnode = {};

                                            subnode.id = ($(nodes[_j]).attr('id') + "Detail").replace(/\./g, "_");
                                            subnode.src = $(nodes[_j]).attr('id').replace(".jpg", "").replace(/.h\d+/, "").replace(".", "/") + ".jpg";

                                            var style = "";
                                            style = style + "left:" + $(nodes[_j]).attr('x') * 100 + "%;";
                                            style = style + "top:" + $(nodes[_j]).attr('y') * 100 + "%;";
                                            style = style + "height:" + $(nodes[_j]).attr('radius') * 180 + "%;";
                                            style = style + "width:" + $(nodes[_j]).attr('radius') * 180 + "%;";
                                            //style = style + "left:" + $(nodes[j]).attr('x') * 114 + "%;"
                                            //style = style + "top:" + $(nodes[j]).attr('y') * 106 + "%;"
                                            //style = style + "height:" + $(nodes[j]).attr('radius') * 145 + "%;"
                                            //style = style + "width:" + $(nodes[j]).attr('radius') * 190 + "%;"
                                            style = style + "background-image:url(" + _ref26.replace("xml", "jpg") + ");";

                                            subnode.style = style;
                                            subnode.target = _ref26;
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
                                    node.figures[_j2 + 1].cap = _this56.caption(srcimg);
                                    node.figures[_j2 + 1].zoomcap = _this56.zoomCaption(srcimg);
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
                    var _iteratorNormalCompletion51 = true;
                    var _didIteratorError51 = false;
                    var _iteratorError51 = undefined;

                    try {
                        var _loop = function _loop() {
                            var i = _step51.value;

                            var url = i;
                            var parser = new XMLParser(url);
                            var promise = parser.loadXML().then(function (xml) {
                                var img = $(xml).find('img');
                                for (var _i2 = 0; _i2 < img.length; _i2++) {
                                    var _src = $(img[_i2]).attr('src');
                                    $(img[_i2]).attr('src', _this56.createLinkURL(_src));
                                }
                                var linkdat = $(xml).find('content').html();
                                linkdat = _this56.replaceCDATA(linkdat);
                                linkdat = _this56.replaceText(linkdat);
                                targetdat.tooltipdata[url] = linkdat;
                            });
                            linkpromises.push(promise);
                        };

                        for (var _iterator51 = tooltipRefs[Symbol.iterator](), _step51; !(_iteratorNormalCompletion51 = (_step51 = _iterator51.next()).done); _iteratorNormalCompletion51 = true) {
                            _loop();
                        }
                    } catch (err) {
                        _didIteratorError51 = true;
                        _iteratorError51 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion51 && _iterator51.return) {
                                _iterator51.return();
                            }
                        } finally {
                            if (_didIteratorError51) {
                                throw _iteratorError51;
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
                return html.replace(/<\!\[CDATA\[/g, "").replace(/]]>/g, "");
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

    var XMLCardLoader = function (_CardLoader) {
        _inherits(XMLCardLoader, _CardLoader);

        function XMLCardLoader(src) {
            var _ref27 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref27$x = _ref27.x,
                x = _ref27$x === undefined ? 0 : _ref27$x,
                _ref27$y = _ref27.y,
                y = _ref27$y === undefined ? 0 : _ref27$y,
                _ref27$width = _ref27.width,
                width = _ref27$width === undefined ? 1400 : _ref27$width,
                _ref27$height = _ref27.height,
                height = _ref27$height === undefined ? 1200 : _ref27$height,
                _ref27$maxWidth = _ref27.maxWidth,
                maxWidth = _ref27$maxWidth === undefined ? null : _ref27$maxWidth,
                _ref27$maxHeight = _ref27.maxHeight,
                maxHeight = _ref27$maxHeight === undefined ? null : _ref27$maxHeight,
                _ref27$scale = _ref27.scale,
                scale = _ref27$scale === undefined ? 1 : _ref27$scale,
                _ref27$maxScale = _ref27.maxScale,
                maxScale = _ref27$maxScale === undefined ? 1 : _ref27$maxScale,
                _ref27$rotation = _ref27.rotation,
                rotation = _ref27$rotation === undefined ? 0 : _ref27$rotation;

            _classCallCheck(this, XMLCardLoader);

            var _this57 = _possibleConstructorReturn(this, (XMLCardLoader.__proto__ || Object.getPrototypeOf(XMLCardLoader)).call(this, src, { x: x, y: y, width: width, height: height, maxWidth: maxWidth, maxHeight: maxHeight,
                scale: scale, maxScale: maxScale, rotation: rotation }));

            _this57.xmlParser = new XMLIndexParser(_this57.src, { width: width, height: height });
            _this57.domTree = null;
            return _this57;
        }

        _createClass(XMLCardLoader, [{
            key: 'load',
            value: function load(domNode) {
                var _this58 = this;

                return new Promise(function (resolve, reject) {
                    _this58.xmlParser.loadParseAndCreateDOM().then(function (domTree) {
                        domNode.appendChild(domTree);
                        var scaleW = _this58.maxWidth / _this58.wantedWidth;
                        var scaleH = _this58.maxHeight / _this58.wantedHeight;
                        _this58.scale = Math.min(_this58.maxScale, Math.min(scaleW, scaleH));

                        var w = _this58.wantedWidth;
                        var h = _this58.wantedHeight;
                        $(domNode).css({ 'width': w,
                            'maxWidth': w,
                            'minWidth': w,
                            'height': h });
                        _this58.domTree = domTree;
                        _this58.xmlParser.completed(domNode); //pm: recent change
                        resolve(_this58);
                    }).catch(function (reason) {
                        console.warn("loadParseAndCreateDOM error", reason);
                    });
                });
            }
        }, {
            key: 'unload',
            value: function unload() {
                if (this.domTree) {
                    this.domTree.remove();
                    this.domTree = null;
                }
            }
        }]);

        return XMLCardLoader;
    }(CardLoader);

    var CloseButton = function (_PIXI$Graphics3) {
        _inherits(CloseButton, _PIXI$Graphics3);

        function CloseButton() {
            _classCallCheck(this, CloseButton);

            var _this59 = _possibleConstructorReturn(this, (CloseButton.__proto__ || Object.getPrototypeOf(CloseButton)).call(this));

            _this59.beginFill(0x000000, 0.5);
            _this59.drawCircle(0, 0, 22);
            _this59.lineStyle(4, 0xffffff);
            _this59.moveTo(-11, -11);
            _this59.lineTo(11, 11);

            _this59.moveTo(-11, 11);
            _this59.lineTo(11, -11);
            return _this59;
        }

        return CloseButton;
    }(PIXI.Graphics);

    var Pictures = function () {
        function Pictures() {
            _classCallCheck(this, Pictures);

            this.pictures = [];
            this.closeButton = null;
            this.opened = 0;
        }

        _createClass(Pictures, [{
            key: 'pictureRemoved',
            value: function pictureRemoved(d) {
                //console.log('picture removed', d.scatter, d)
                if (d.scatter) {
                    var element = d.scatter.element;

                    d.scatter.element.remove();
                    d.scatter = null;
                }

                //reset thumbnail selection
                app.resetActiveThumbID();

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
        }, {
            key: 'pictureTransformed',
            value: function pictureTransformed(event, d) {
                //console.log("pictureTransformed", d)

                if (d == null || d.ref == null || d.scatter == null || event == null) return;

                //logging
                if (event.type == 'onStart') {
                    app.log('image transform start', {
                        id: d.ref,
                        x: d.scatter.origin.x,
                        y: d.scatter.origin.y,
                        scale: event.scale
                    });
                    //console.log(d.scatter, d.ref, d.scatter.origin.x, d.scatter.y, event.scale)
                }

                if (event.type == 'onEnd') {
                    app.log('image transform end', {
                        id: d.ref,
                        x: d.scatter.origin.x,
                        y: d.scatter.origin.y,
                        scale: event.scale
                    });
                    //console.log(d.ref, d.scatter.bounds.x, d.scatter.bounds.y, event.scale)
                }

                if (event.type == 'onZoom') {
                    app.log('image zoomed', {
                        id: d.ref,
                        x: d.scatter.origin.x,
                        y: d.scatter.origin.y,
                        scale: event.scale
                    });
                    //console.log(d.ref, d.scatter.bounds.x, d.scatter.bounds.y, event.scale)
                }
            }
        }, {
            key: 'removeAll',
            value: function removeAll() {
                var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                //console.log('clearing open pictures',this.pictures.length)

                while (this.pictures.length > 0) {
                    var first = this.pictures.shift();
                    this.remove(first, animated);
                }
            }
        }, {
            key: 'remove',
            value: function remove(d) {
                var _this60 = this;

                var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                //console.log('removing picture',d,animate)
                if (animate) {
                    var bounds = main.getBoundingClientRect();
                    var origin = app.scene.position;
                    var sceneScale = app.scene.scale.x;
                    var p = d.thumbnail.position;
                    var _w3 = d.thumbnail.width;
                    var _h2 = d.thumbnail.height;
                    var element = d.scatter.element;
                    var tc = {
                        x: origin.x + (p.x + _w3 / 2) * sceneScale,
                        y: origin.y + bounds.top + (p.y + _h2 / 2) * sceneScale
                    };
                    var sc = d.scatter.center;
                    var delta = Points.subtract(tc, sc);
                    var _x60 = element._gsTransform.x;
                    var _y4 = element._gsTransform.y;
                    var ww = d.scatter.width;
                    var hh = d.scatter.height;
                    TweenLite.to(element, 0.5, {
                        x: _x60 + delta.x,
                        y: _y4 + delta.y,
                        scaleX: _w3 / ww,
                        scaleY: _h2 / hh,
                        transformOrigin: 'center center',
                        onComplete: function onComplete() {
                            _this60.pictureRemoved(d);
                        }
                    });
                } else {
                    this.pictureRemoved(d);
                }

                //logging
                app.log('image closed', { id: d.ref });
            }
        }, {
            key: 'show',
            value: function show(event, d) {
                var _this61 = this;

                //console.log('showing picture',d)
                var x = event.data.global.x;
                var y = event.data.global.y;

                /*if (this.pictures.length >= this.maxPictures) {
                    let first = this.pictures.shift()
                    this.remove(first, false)
                }*/

                //this.removeAll(false)

                var center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                var zoom = new ZoomPicture(d.pictureURL, {
                    startX: x,
                    startY: y,
                    endX: center.x,
                    endY: center.y,
                    maxWidth: window.innerWidth * 0.8,
                    maxHeight: window.innerHeight * 0.8
                });
                this.flipCards = new DOMFlip$1(app.domScatterContainer, flipTemplate, zoom, new XMLCardLoader(d.infoURL), {
                    autoLoad: false,
                    preloadBack: false,
                    rotatable: false,
                    center: center,
                    onClose: this.onClose.bind(this)
                });
                this.flipCards.load().then(function (flip) {
                    console.log("Flip loaded, setting scatter");
                    d.scatter = flip.flippable.scatter;
                    d.scatter.centerAt(center);
                    flip.flippable.data = d;

                    app.imageLoaded();

                    if (d.picture) {
                        return _this61.remove(d);
                    }
                    _this61.pictures.push(d);

                    d.scatter.addTransformEventCallback(function (event) {
                        _this61.pictureTransformed(event, d);
                    });
                });
            }
        }, {
            key: 'onClose',
            value: function onClose(flippable) {
                this.remove(flippable.data);
            }
        }, {
            key: 'maxPictures',
            get: function get() {
                return app.isMobile ? 1 : 1;
            }
        }]);

        return Pictures;
    }();

    var ZoomPicture = function (_ImageLoader$) {
        _inherits(ZoomPicture, _ImageLoader$);

        function ZoomPicture(src) {
            var _ref28 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref28$startX = _ref28.startX,
                startX = _ref28$startX === undefined ? 0 : _ref28$startX,
                _ref28$startY = _ref28.startY,
                startY = _ref28$startY === undefined ? 0 : _ref28$startY,
                _ref28$endX = _ref28.endX,
                endX = _ref28$endX === undefined ? 0 : _ref28$endX,
                _ref28$endY = _ref28.endY,
                endY = _ref28$endY === undefined ? 0 : _ref28$endY,
                _ref28$width = _ref28.width,
                width = _ref28$width === undefined ? 1000 : _ref28$width,
                _ref28$height = _ref28.height,
                height = _ref28$height === undefined ? 800 : _ref28$height,
                _ref28$maxWidth = _ref28.maxWidth,
                maxWidth = _ref28$maxWidth === undefined ? null : _ref28$maxWidth,
                _ref28$maxHeight = _ref28.maxHeight,
                maxHeight = _ref28$maxHeight === undefined ? null : _ref28$maxHeight,
                _ref28$scale = _ref28.scale,
                scale = _ref28$scale === undefined ? 1 : _ref28$scale,
                _ref28$maxScale = _ref28.maxScale,
                maxScale = _ref28$maxScale === undefined ? 1 : _ref28$maxScale;

            _classCallCheck(this, ZoomPicture);

            var _this62 = _possibleConstructorReturn(this, (ZoomPicture.__proto__ || Object.getPrototypeOf(ZoomPicture)).call(this, src, { width: width, height: height, maxWidth: maxWidth, maxHeight: maxHeight, scale: scale, maxScale: maxScale }));

            _this62.startX = startX;
            _this62.startY = startY;
            _this62.endX = endX;
            _this62.endY = endY;
            _this62.startScale = 0.125;
            _this62.minScale = 0.125;
            return _this62;
        }

        _createClass(ZoomPicture, [{
            key: 'load',
            value: function load(domNode) {
                var _this63 = this;

                return new Promise(function (resolve, reject) {
                    var isImage = domNode instanceof HTMLImageElement;
                    var image = document.createElement('img');
                    image.classList.add('epochal');
                    image.style.position = 'absolute';
                    image.style.left = 0;
                    image.style.top = 0;
                    image.onload = function (e) {
                        app.domScatterContainer.element.appendChild(image);
                        TweenMax.set(image, {
                            scale: _this63.startScale,
                            transformOrigin: 'center center'
                        });
                        _this63.wantedWidth = image.naturalWidth;
                        _this63.wantedHeight = image.naturalHeight;
                        var scaleW = _this63.maxWidth / image.naturalWidth;
                        var scaleH = _this63.maxHeight / image.naturalHeight;
                        _this63.scale = Math.min(_this63.maxScale, Math.min(scaleW, scaleH));
                        TweenMax.set(image, {
                            x: _this63.startX - image.naturalWidth / 2,
                            y: _this63.startY - image.naturalHeight / 2
                        });
                        image.width = image.naturalWidth;
                        image.height = image.naturalHeight;
                        TweenMax.to(image, 0.5, {
                            x: _this63.endX - image.naturalWidth / 2,
                            y: _this63.endY - image.naturalHeight / 2,
                            scale: _this63.scale,
                            transformOrigin: 'center center',
                            onComplete: function onComplete() {
                                if (isImage) {
                                    TweenMax.set(image, { scale: 1, x: 0, y: 0 });
                                    image.classList.add('flipFace');
                                    image.classList.add('front');
                                    domNode.parentNode.replaceChild(image, domNode);
                                } else {
                                    domNode.appendChild(image);
                                }
                                resolve(_this63);
                            }
                        });
                    };
                    image.onerror = function (e) {
                        reject(_this63);
                    };
                    image.src = _this63.src;
                });
            }
        }]);

        return ZoomPicture;
    }(ImageLoader$1);

    var SceneScatter = function (_DisplayObjectScatter) {
        _inherits(SceneScatter, _DisplayObjectScatter);

        function SceneScatter(scene, renderer) {
            _classCallCheck(this, SceneScatter);

            var _this64 = _possibleConstructorReturn(this, (SceneScatter.__proto__ || Object.getPrototypeOf(SceneScatter)).call(this, scene, renderer, { rotatable: false }));

            _this64.scene = scene;
            return _this64;
        }

        _createClass(SceneScatter, [{
            key: 'bringToFront',
            value: function bringToFront() {}
        }, {
            key: 'mapPositionToContainerPoint',
            value: function mapPositionToContainerPoint(point) {
                var interactionManager = this.renderer.plugins.interaction;
                var local = new PIXI.Point();
                interactionManager.mapPositionToPoint(local, point.x, point.y);
                return local;
            }
        }, {
            key: 'movableX',
            set: function set(value) {},
            get: function get() {
                return app.currentView.movableX;
            }
        }, {
            key: 'movableY',
            set: function set(value) {},
            get: function get() {
                return app.currentView.movableY;
            }
        }, {
            key: 'scalable',
            set: function set(value) {},
            get: function get() {
                return app.currentView === app.mapview;
            }
        }, {
            key: 'throwVisibility',
            set: function set(value) {
                this._throwVisibility = value;
            },
            get: function get() {
                if (app.currentView === app.timeline) return window.innerWidth;
                return this._throwVisibility;
            }
        }, {
            key: 'throwDamping',
            set: function set(value) {
                this._throwDamping = value;
            },
            get: function get() {
                if (app.currentView === app.timeline) return 0.975;
                return this._throwDamping;
            }
        }, {
            key: 'containerBounds',
            get: function get() {
                return app.renderer.view.getBoundingClientRect();
            }
        }]);

        return SceneScatter;
    }(DisplayObjectScatter);

    /*** Root of the PIXI display tree. Uses a single SceneScatter as
    main display object. Delegates events to this SceneScatter with one
    exception: If the Timeline view is selected, the events are
    processed by the scene itself because the Greensock throw behavior
    seems more appropriate for the timeline than the standard Scatter throw
    animation.
    This switch is handled by the findTarget method (see below).
    ***/


    var Scene = function (_LabeledGraphics2) {
        _inherits(Scene, _LabeledGraphics2);

        function Scene() {
            _classCallCheck(this, Scene);

            return _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).apply(this, arguments));
        }

        _createClass(Scene, [{
            key: 'setup',
            value: function setup(app) {
                this.scatter = new SceneScatter(this, app.renderer);
                this.delegate = new InteractionMapper(app.renderer.view, this, { mouseWheelElement: window });
            }
        }, {
            key: 'capture',
            value: function capture(event) {
                return true;
            }
        }, {
            key: 'findTarget',
            value: function findTarget(event, local, global) {
                if (event.claimedByScatter) return null;
                if (app.currentView === app.timeline) return this;
                return this.scatter;
            }
        }, {
            key: 'reset',
            value: function reset(x, y, scale) {
                this.scatter.x = x;
                this.scatter.y = y;
                this.scatter.zoom(scale);
            }
        }, {
            key: 'onStart',
            value: function onStart(event, interaction) {
                this.dragging = true;
                ThrowPropsPlugin.track(this.position, 'x,y');
                TweenMax.killAll();
            }
        }, {
            key: 'onMove',
            value: function onMove(event, interaction) {
                var currentView = app.currentView;
                if (this.dragging) {
                    var delta = interaction.delta();
                    var dx = delta.x;
                    var dy = delta.y;
                    if (currentView.movableX) {
                        this.scatter.x += dx;
                        currentView.x = this.scatter.x;
                    }
                    if (currentView.movableY) {
                        this.scatter.y += dy;
                        currentView.y = this.scatter.y;
                    }
                }
            }
        }, {
            key: 'onEnd',
            value: function onEnd(event, interaction) {
                this.dragging = false;
                var currentView = app.currentView;
                var props = {};
                if (currentView.movableX) {
                    var dx = ThrowPropsPlugin.getVelocity(this.position, 'x');
                    if (dx) {
                        var maxX = 0;
                        var minX = -currentView.w + window.innerWidth;
                        props['x'] = { velocity: dx, max: maxX, min: minX, resistance: 1000 };
                    }
                }
                if (currentView.moveableY) {
                    var dy = ThrowPropsPlugin.getVelocity(this.position, 'y');
                    if (dy) {
                        var maxY = 0;
                        var minY = -currentView.h + window.innerHeight;
                        props['y'] = { velocity: dy, max: maxY, min: minY, resistance: 1000 };
                    }
                }
                if (!isEmpty(props)) {
                    TweenMax.to(this.scatter, 1.0, { throwProps: props,
                        onUpdate: this.onThrow.bind(this) });
                }
                ThrowPropsPlugin.untrack(this.position);
            }
        }, {
            key: 'onThrow',
            value: function onThrow(event) {
                if (app.timebar) {
                    app.timebar.sceneMoved(this.scatter.x);
                }
            }
        }]);

        return Scene;
    }(LabeledGraphics);

    /**
     * Class that represents a PixiJS Theme.
     *
     * @example
     * // Create the theme
     * const yellow = new Theme({
     *     fill: 0xfecd2d,
     *     fillActive: 0xfe9727,
     *     strokeActive: 0xfecd2d,
     *     strokeActiveWidth: 4,
     *     textStyle: {
     *         fill: 0x5ec7f8
     *     },
     *     textStyleActive: {
     *         fill: 0x5954d3
     *     },
     *     textStyleLarge: {
     *         fontSize: 36
     *     }
     * })
     *
     * // Create the app and apply the new theme to it
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 450,
     *     height: 150,
     *     theme: yellow
     * }).setup().run()
     *
     * @class
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
     */


    var Theme = function () {

        /**
         * Creates an instance of a Theme.
         *
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the theme.
         * @param {number} [opts.margin=10] - The outer spacing (distance to other objects) from the border.
         * @param {number} [opts.padding=10] - The inner spacing (distance from icon and/or label) to the border.
         * @param {number} [opts.radius=4] - The radius used when drawing a rounded rectangle.
         * @param {number} [opts.fast=0.25] - The duration of time when it has to be fast.
         * @param {number} [opts.normal=0.5] - The duration of time when it has to be normal.
         * @param {number} [opts.slow=1] - The duration of time when it has to be slow.
         * @param {number} [opts.primaryColor=0x5ec7f8] - The primary color of the theme.
         * @param {number} [opts.color1=0x282828] - The first color of the theme. For example used for the background.
         * @param {number} [opts.color2=0xf6f6f6] - The second color of the theme. For example used for the border.
         * @param {number} [opts.fill=color1] - The color of the background as a hex value.
         * @param {number} [opts.fillAlpha=1] - The alpha value of the background.
         * @param {number} [opts.fillActive=color1] - The color of the background when activated.
         * @param {number} [opts.fillActiveAlpha=1] - The alpha value of the background when activated.
         * @param {number} [opts.stroke=color2] - The color of the border as a hex value.
         * @param {number} [opts.strokeWidth=0.6] - The width of the border in pixel.
         * @param {number} [opts.strokeAlpha=1] - The alpha value of the border.
         * @param {number} [opts.strokeActive=color2] - The color of the border when activated.
         * @param {number} [opts.strokeActiveWidth=0.6] - The width of the border in pixel when activated.
         * @param {number} [opts.strokeActiveAlpha=1] - The alpha value of the border when activated.
         * @param {number} [opts.iconColor=color2] - The color of the icon (set by the tint property) as a hex value.
         * @param {number} [opts.iconColorActive=colorPrimary] - The color of the icon when activated.
         * @param {number} [opts.background=color1] - The color of a background for a component (e.g. at the Modal class).
         * @param {object} [opts.textStyle={}] - A textstyle object for the styling of text. See PIXI.TextStyle
         *     for possible options. Default object:
         * @param {string} [opts.textStyle.fontFamily="Avenir Next", "Open Sans", "Segoe UI", ...] - The font family.
         * @param {string} [opts.textStyle.fontWeight=400] - The font weight.
         * @param {number} [opts.textStyle.fontSize=16] - The font size.
         * @param {number} [opts.textStyle.fill=color2] - The fill color.
         * @param {number} [opts.textStyle.stroke=color1] - The stroke color.
         * @param {number} [opts.textStyle.strokeThickness=0] - The thickness of the stroke.
         * @param {number} [opts.textStyle.miterLimit=1] - The meter limit.
         * @param {string} [opts.textStyle.lineJoin=round] - The line join.
         * @param {object} [opts.textStyleActive=textStyle + {fill: primaryColor}] - A textstyle object which is used
         *     for actived text.
         * @param {object} [opts.textStyleSmall=textStyle + {fontSize: -= 3}] - A textstyle object which is used for
         *     small text.
         * @param {object} [opts.textStyleSmallActive=textStyleSmall + {fill: primaryColor}] - A textstyle object which
         *     is used for small actived text.
         * @param {object} [opts.textStyleLarge=textStyle + {fontSize: += 3}] - A textstyle object which is used for
         *     large text.
         * @param {object} [opts.textStyleLargeActive=textStyleLarge + {fill: primaryColor}] - A textstyle object which
         *     is used for large actived text.
         */
        function Theme() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Theme);

            var colorPrimary = opts.primaryColor != null ? opts.primaryColor : 0x5ec7f8; // blue
            var color1 = opts.color1 != null ? opts.color1 : 0x282828; // black
            var color2 = opts.color2 != null ? opts.color2 : 0xf6f6f6; // white

            this.opts = Object.assign({}, {
                margin: 12,
                padding: 12,
                radius: 4,
                fast: .25,
                normal: .5,
                slow: 1,
                primaryColor: colorPrimary,
                color1: color1,
                color2: color2,
                fill: color1,
                fillAlpha: 1,
                fillActive: color1,
                fillActiveAlpha: 1,
                stroke: color2,
                strokeWidth: .6,
                strokeAlpha: 1,
                strokeActive: color2,
                strokeActiveWidth: .6,
                strokeActiveAlpha: 1,
                iconColor: color2,
                iconColorActive: colorPrimary,
                background: color1
            }, opts);

            // Set textStyle and variants
            this.opts.textStyle = Object.assign({}, {
                fontFamily: '"Avenir Next", "Open Sans", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, system-ui, BlinkMacSystemFont, Arial, sans-serif !default',
                fontWeight: '500',
                fontSize: 18,
                fill: color2,
                stroke: color1,
                strokeThickness: 0,
                miterLimit: 1,
                lineJoin: 'round'
            }, this.opts.textStyle);
            this.opts.textStyleSmall = Object.assign({}, this.opts.textStyle, { fontSize: this.opts.textStyle.fontSize - 3 }, this.opts.textStyleSmall);
            this.opts.textStyleLarge = Object.assign({}, this.opts.textStyle, { fontSize: this.opts.textStyle.fontSize + 3 }, this.opts.textStyleLarge);
            this.opts.textStyleActive = Object.assign({}, this.opts.textStyle, { fill: this.opts.primaryColor }, this.opts.textStyleActive);
            this.opts.textStyleSmallActive = Object.assign({}, this.opts.textStyleSmall, { fill: this.opts.primaryColor }, this.opts.textStyleSmallActive);
            this.opts.textStyleLargeActive = Object.assign({}, this.opts.textStyleLarge, { fill: this.opts.primaryColor }, this.opts.textStyleLargeActive);

            Object.assign(this, this.opts);
        }

        /**
         * Factory function
         *
         * @static
         * @param {string} theme=dark - The name of the theme to load.
         * @return {Theme} Returns a newly created Theme object.
         */


        _createClass(Theme, null, [{
            key: 'fromString',
            value: function fromString(theme) {

                if (theme && (typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) === 'object') {
                    return theme;
                }

                switch (theme) {
                    case 'light':
                        return new ThemeLight();
                    case 'red':
                        return new ThemeRed();
                    default:
                        return new ThemeDark();
                }
            }
        }]);

        return Theme;
    }();

    /**
     * Class that represents a PixiJS ThemeDark.
     *
     * @example
     * // Create the app with a new dark theme
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 450,
     *     height: 150,
     *     theme: new ThemeDark()
     * }).setup().run()
     *
     * @class
     * @extends Theme
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
     */


    var ThemeDark = function (_Theme) {
        _inherits(ThemeDark, _Theme);

        function ThemeDark() {
            _classCallCheck(this, ThemeDark);

            return _possibleConstructorReturn(this, (ThemeDark.__proto__ || Object.getPrototypeOf(ThemeDark)).apply(this, arguments));
        }

        return ThemeDark;
    }(Theme);

    /**
     * Class that represents a PixiJS ThemeLight.
     * The color1 is set to 0xf6f6f6, color2 to 0x282828.
     *
     * @example
     * // Create the app with a new light theme
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 450,
     *     height: 150,
     *     theme: new ThemeLight()
     * }).setup().run()
     *
     * @class
     * @extends Theme
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
     */


    var ThemeLight = function (_Theme2) {
        _inherits(ThemeLight, _Theme2);

        /**
         * Creates an instance of a ThemeLight.
         *
         * @constructor
         */
        function ThemeLight() {
            _classCallCheck(this, ThemeLight);

            return _possibleConstructorReturn(this, (ThemeLight.__proto__ || Object.getPrototypeOf(ThemeLight)).call(this, { color1: 0xf6f6f6, color2: 0x282828 }));
        }

        return ThemeLight;
    }(Theme);

    /**
     * Class that represents a PixiJS ThemeRed.
     * The primaryColor is set to 0xd92f31.
     *
     * @example
     * // Create the app with a new red theme
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 450,
     *     height: 150,
     *     theme: new ThemeRed()
     * }).setup().run()
     *
     * @class
     * @extends Theme
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/theme.html|DocTest}
     */


    var ThemeRed = function (_Theme3) {
        _inherits(ThemeRed, _Theme3);

        /**
         * Creates an instance of a ThemeRed.
         *
         * @constructor
         */
        function ThemeRed() {
            _classCallCheck(this, ThemeRed);

            return _possibleConstructorReturn(this, (ThemeRed.__proto__ || Object.getPrototypeOf(ThemeRed)).call(this, { primaryColor: 0xd92f31 }));
        }

        return ThemeRed;
    }(Theme);

    /**
     * Class that represents a PixiJS Progress.
     * 
     * @example
     * // Create the progress
     * const progress = new Progress({
     *     app: app
     * })
     *
     * // Add the progress to a DisplayObject
     * app.scene.addChild(progress)
     *
     * @class
     * @extends PIXI.Container
     * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/progress.html|DocTest}
     */


    var Progress = function (_PIXI$Container3) {
        _inherits(Progress, _PIXI$Container3);

        /**
         * Creates an instance of a Progress.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the progress.
         * @param {number} [opts.id=auto generated] - The id of the progress.
         * @param {PIXIApp} [opts.app=window.app] - The app where the progress belongs to.
         * @param {number} [opts.width] - The width of the progress bar. When not set, the width is the size of the app
         *     minus 2 * opts.margin.
         * @param {number} [opts.height=2] - The height of the progress bar.
         * @param {string|Theme} [opts.theme=dark] - The theme to use for this progress. Possible values are dark, light, red
         *     or a Theme object.
         * @param {number} [opts.margin=100] - The outer spacing to the edges of the app.
         * @param {number} [opts.padding=0] - The inner spacing (distance from icon and/or label) to the border.
         * @param {number} [opts.fill=Theme.fill] - The color of the progress background as a hex value.
         * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
         * @param {number} [opts.fillActive=Theme.primaryColor] - The color of the progress background when activated.
         * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
         * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
         * @param {number} [opts.strokeWidth=0] - The width of the border in pixel.
         * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
         * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
         * @param {number} [opts.strokeActiveWidth=0] - The width of the border in pixel when activated.
         * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
         * @param {boolean} [opts.background=false] - The alpha value of the border when activated.
         * @param {number} [opts.backgroundFill=Theme.background] - A textstyle object for the styling of the label. See PIXI.TextStyle
         *     for possible options.
         * @param {number} [opts.backgroundFillAlpha=1] - A textstyle object for the styling of the label when the
         *     progress is activated. See PIXI.TextStyle for possible options.
         * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the progress (which is a rounded rectangle).
         * @param {boolean} [opts.destroyOnComplete=true] - Should the progress bar destroy itself after reaching 100 %?
         * @param {boolean} [opts.visible=true] - Is the progress initially visible (property visible)?
         */
        function Progress() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Progress);

            var _this69 = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this));

            var theme = Theme.fromString(opts.theme);
            _this69.theme = theme;

            _this69.opts = Object.assign({}, {
                id: PIXI.utils.uid(),
                app: window.app,
                width: null,
                height: 2,
                margin: 100,
                padding: 0,
                fill: theme.fill,
                fillAlpha: theme.fillAlpha,
                fillActive: theme.primaryColor,
                fillActiveAlpha: theme.fillActiveAlpha,
                stroke: theme.stroke,
                strokeWidth: 0,
                strokeAlpha: theme.strokeAlpha,
                strokeActive: theme.strokeActive,
                strokeActiveWidth: 0,
                strokeActiveAlpha: theme.strokeActiveAlpha,
                background: false,
                backgroundFill: theme.background,
                backgroundFillAlpha: 1,
                radius: theme.radius,
                destroyOnComplete: true,
                visible: true
            }, opts);

            _this69.id = _this69.opts.id;

            _this69.background = null;
            _this69.bar = null;
            _this69.barActive = null;

            _this69.alpha = 0;

            _this69.visible = _this69.opts.visible;

            _this69._progress = 0;

            // setup
            //-----------------
            _this69.setup();

            // layout
            //-----------------
            _this69.layout();
            return _this69;
        }

        /**
         * Creates children and instantiates everything.
         * 
         * @private
         * @return {Progress} A reference to the progress for chaining.
         */


        _createClass(Progress, [{
            key: 'setup',
            value: function setup() {
                var _this70 = this;

                // interaction
                //-----------------
                this.on('added', function (e) {
                    _this70.show();
                });

                // background
                //-----------------
                if (this.opts.background) {
                    var background = new PIXI.Graphics();
                    this.background = background;
                    this.addChild(background);
                }

                // bar
                //-----------------
                var bar = new PIXI.Graphics();
                this.bar = bar;
                this.addChild(bar);

                var barActive = new PIXI.Graphics();
                this.barActive = barActive;
                this.bar.addChild(barActive);

                return this;
            }

            /**
             * Should be called to refresh the layout of the progress. Can be used after resizing.
             * 
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                var width = this.opts.app.size.width;
                var height = this.opts.app.size.height;

                // background
                //-----------------
                if (this.opts.background) {
                    this.background.clear();
                    this.background.beginFill(this.opts.backgroundFill, this.opts.backgroundFillAlpha);
                    this.background.drawRect(0, 0, width, height);
                    this.background.endFill();
                }

                this.draw();

                return this;
            }

            /**
             * Draws the canvas.
             * 
             * @private
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {

                this.bar.clear();
                this.barActive.clear();

                this.drawBar();
                this.drawBarActive();

                return this;
            }

            /**
             * Draws the bar.
             * 
             * @private
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'drawBar',
            value: function drawBar() {

                var width = this.opts.app.size.width;
                var height = this.opts.app.size.height;

                this.radius = this.opts.radius;
                if (this.radius * 2 > this.opts.height) {
                    this.radius = this.opts.height / 2;
                }

                var wantedWidth = this.opts.width || width - 2 * this.opts.margin;
                var wantedHeight = this.opts.height;

                this.bar.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
                this.bar.beginFill(this.opts.fill, this.opts.fillAlpha);
                if (this.radius > 1) {
                    this.bar.drawRoundedRect(0, 0, wantedWidth, wantedHeight, this.radius);
                } else {
                    this.bar.drawRect(0, 0, wantedWidth, wantedHeight);
                }
                this.bar.endFill();

                this.bar.x = width / 2 - this.bar.width / 2;
                this.bar.y = height / 2 - this.bar.height / 2;

                return this;
            }

            /**
             * Draws the active bar.
             * 
             * @private
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'drawBarActive',
            value: function drawBarActive() {

                var wantedWidth = this.bar.width - 2 * this.opts.padding;
                var wantedHeight = this.bar.height - 2 * this.opts.padding;

                var barActiveWidth = wantedWidth * this._progress / 100;

                this.barActive.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha);
                this.barActive.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha);
                if (barActiveWidth > 0) {
                    if (this.radius > 1) {
                        this.barActive.drawRoundedRect(0, 0, barActiveWidth, wantedHeight, this.radius);
                    } else {
                        this.barActive.drawRect(0, 0, barActiveWidth, wantedHeight);
                    }
                }
                this.barActive.endFill();

                this.barActive.x = this.opts.padding;
                this.barActive.y = this.opts.padding;

                return this;
            }

            /**
             * Shows the progress (sets his alpha values to 1).
             * 
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'show',
            value: function show() {
                TweenMax.to(this, this.theme.fast, { alpha: 1 });

                return this;
            }

            /**
             * Hides the progress (sets his alpha values to 1).
             * 
             * @return {Progress} A reference to the progress for chaining.
             */

        }, {
            key: 'hide',
            value: function hide() {
                var _this71 = this;

                TweenMax.to(this, this.theme.fast, { alpha: 0, onComplete: function onComplete() {
                        return _this71.visible = false;
                    } });

                return this;
            }

            /**
             * Gets or sets the progress. Has to be a number between 0 and 100.
             * 
             * @member {number}
             */

        }, {
            key: 'progress',
            get: function get() {
                return this._progress;
            },
            set: function set(value) {
                var _this72 = this;

                value = Math.round(value);

                if (value < 0) {
                    value = 0;
                }

                if (value > 100) {
                    value = 100;
                }

                TweenMax.to(this, this.theme.normal, {
                    _progress: value,
                    onUpdate: function onUpdate() {
                        return _this72.draw();
                    },
                    onComplete: function onComplete() {
                        if (value === 100 && _this72.opts.destroyOnComplete) {
                            TweenMax.to(_this72, _this72.theme.fast, {
                                alpha: 0,
                                onComplete: function onComplete() {
                                    return _this72.destroy({ children: true });
                                }
                            });
                        }
                    }
                });
            }
        }]);

        return Progress;
    }(PIXI.Container);

    /**
     * Callback for the popup onHidden.
     *
     * @callback hiddenCallback
     * @param {AbstractPopup} abstractPopup - A reference to the popup (also this refers to the popup).
     */

    /**
     * Class that represents a PixiJS AbstractPopup.
     * The class is used for various other Popup-like classes
     * like Popup, Message, Tooltip...
     *
     * @class
     * @abstract
     * @extends PIXI.Graphics
     * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
     */


    var AbstractPopup = function (_PIXI$Graphics4) {
        _inherits(AbstractPopup, _PIXI$Graphics4);

        /**
         * Creates an instance of an AbstractPopup (only for internal use).
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the popup.
         * @param {number} [opts.id=auto generated] - The id of the popup.
         * @param {number} [opts.x=0] - The x position of the popup. Can be also set after creation with popup.x = 0.
         * @param {number} [opts.y=0] - The y position of the popup. Can be also set after creation with popup.y = 0.
         * @param {string|Theme} [opts.theme=dark] - The theme to use for this popup. Possible values are dark, light, red
         *     or a Theme object.
         * @param {string|number|PIXI.Text} [opts.header] - The heading inside the popup as a string, a number (will be
         *     converted to a text) or as a PIXI.Text object.
         * @param {string|number|PIXI.DisplayObject} [opts.content] - A text, a number (will be converted to a text) or
         *     an PIXI.DisplayObject as the content of the popup.
         * @param {number} [opts.minWidth=320] - The minimum width of the popup.
         * @param {number} [opts.minHeight=130] - The minimum height of the popup.
         * @param {number} [opts.padding=Theme.padding] - The inner spacing (distance from header and content) the the border.
         * @param {number} [opts.fill=Theme.fill] - The color of the button background as a hex value.
         * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
         * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
         * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
         * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
         * @param {object} [opts.headerStyle=Theme.textStyleLarge] - A textstyle object for the styling of the header. See PIXI.TextStyle
         *     for possible options.
         * @param {object} [opts.textStyle=Theme.textStyleSmall] - A textstyle object for the styling of the text. See PIXI.TextStyle
         *     for possible options.
         * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the popup (which is a rounded rectangle).
         * @param {hiddenCallback} [opts.onHidden] - Executed when the popup gets hidden.
         * @param {boolean} [opts.visible=true] - Is the popup initially visible (property visible)?
         * @param {string} [opts.orientation] - When set to portrait, the popup cannot be displayed in landscape mode. When set
         *     to landscape, the popup cannot be displayed in portrait mode.
         */
        function AbstractPopup() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, AbstractPopup);

            var _this73 = _possibleConstructorReturn(this, (AbstractPopup.__proto__ || Object.getPrototypeOf(AbstractPopup)).call(this));

            var theme = Theme.fromString(opts.theme);
            _this73.theme = theme;

            _this73.opts = Object.assign({}, {
                id: PIXI.utils.uid(),
                x: 0,
                y: 0,
                header: null, // null or null
                content: null, // null or String or PIXI.DisplayObject
                minWidth: 320,
                minHeight: 130,
                maxWidth: null,
                padding: theme.padding,
                fill: theme.fill,
                fillAlpha: theme.fillAlpha,
                stroke: theme.stroke,
                strokeWidth: theme.strokeWidth,
                strokeAlpha: theme.strokeAlpha,
                headerStyle: theme.textStyleLarge,
                textStyle: theme.textStyleSmall,
                radius: theme.radius,
                onHidden: null,
                visible: true,
                orientation: null
            }, opts);

            _this73.id = _this73.opts.id;

            _this73.headerStyle = new PIXI.TextStyle(_this73.opts.headerStyle);
            _this73.textStyle = new PIXI.TextStyle(_this73.opts.textStyle);

            if (_this73.opts.maxWidth) {
                _this73.headerStyle.wordWrap = true;
                _this73.headerStyle.wordWrapWidth = _this73.opts.maxWidth - 2 * _this73.opts.padding;

                _this73.textStyle.wordWrap = true;
                _this73.textStyle.wordWrapWidth = _this73.opts.maxWidth - 2 * _this73.opts.padding;
            }

            _this73.alpha = 0;
            _this73.visible = _this73.opts.visible;

            _this73._header = null;
            _this73._content = null;

            // position
            _this73.x = _this73.opts.x;
            _this73.y = _this73.opts.y;

            // padding
            _this73.innerPadding = _this73.opts.padding * 1.5;

            // interaction
            //-----------------
            _this73.interactive = true;
            _this73.on('added', function (e) {
                _this73.show();
            });
            return _this73;
        }

        /**
         * Creates the framework and instantiates everything.
         * 
         * @private
         * @return {AbstractPopup} A reference to the popup for chaining.
         */


        _createClass(AbstractPopup, [{
            key: 'setup',
            value: function setup() {

                // position
                //-----------------
                this.sy = this.opts.padding;

                // header
                //-----------------
                if (this.opts.header != null) {

                    var header = null;

                    if (this.opts.header instanceof PIXI.Text) {
                        header = this.opts.header;
                    } else if (typeof this.opts.header === 'number') {
                        header = new PIXI.Text(this.opts.header.toString(), this.headerStyle);
                    } else {
                        header = new PIXI.Text(this.opts.header, this.headerStyle);
                    }

                    header.x = this.opts.padding;
                    header.y = this.sy;

                    this.addChild(header);

                    this.sy += header.height;

                    this._header = header;
                }

                if (this.opts.header && this.opts.content) {
                    this.sy += this.innerPadding;
                }

                // content
                //-----------------
                if (this.opts.content != null) {

                    var content = null;

                    if (typeof this.opts.content === 'string') {
                        content = new PIXI.Text(this.opts.content, this.textStyle);
                    } else if (typeof this.opts.content === 'number') {
                        content = new PIXI.Text(this.opts.content.toString(), this.textStyle);
                    } else {
                        content = this.opts.content;
                    }

                    content.x = this.opts.padding;
                    content.y = this.sy;

                    this.sy += content.height;

                    this.addChild(content);

                    this._content = content;
                }

                return this;
            }

            /**
             * Should be called to refresh the layout of the popup. Can be used after resizing.
             * 
             * @return {AbstractPopup} A reference to the popup for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                // wanted width & wanted height
                //-----------------
                var padding = this.opts.padding;
                var size = this.getInnerSize();
                var width = size.width + 2 * padding;
                var height = size.height + 2 * padding;

                this.wantedWidth = Math.max(width, this.opts.minWidth);
                this.wantedHeight = Math.max(height, this.opts.minHeight);

                if (this.opts.maxWidth) {
                    this.wantedWidth = Math.min(this.wantedWidth, this.opts.maxWidth);
                }

                if (this.opts.radius * 2 > this.wantedWidth) {
                    this.wantedWidth = this.opts.radius * 2;
                }

                if (this.opts.radius * 2 > this.wantedHeight) {
                    this.wantedHeight = this.opts.radius * 2;
                }

                switch (this.opts.orientation) {
                    case 'portrait':
                        if (this.wantedWidth > this.wantedHeight) {
                            this.wantedHeight = this.wantedWidth;
                        }
                        break;
                    case 'landscape':
                        if (this.wantedHeight > this.wantedWidth) {
                            this.wantedWidth = this.wantedHeight;
                        }
                        break;
                }

                this.draw();

                return this;
            }

            /**
             * Draws the canvas.
             * 
             * @private
             * @return {AbstractPopup} A reference to the popup for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {

                var square = Math.round(this.wantedWidth) === Math.round(this.wantedHeight);
                var diameter = Math.round(this.opts.radius * 2);

                this.clear();
                this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
                this.beginFill(this.opts.fill, this.opts.fillAlpha);
                if (square && diameter === this.wantedWidth) {
                    this.drawCircle(this.wantedWidth / 2, this.wantedHeight / 2, this.opts.radius);
                } else {
                    this.drawRoundedRect(0, 0, this.wantedWidth, this.wantedHeight, this.opts.radius);
                }
                this.endFill();

                return this;
            }

            /**
             * Calculates the size of the children of the AbstractPopup.
             * Cannot use getBounds() because it is not updated when children
             * are removed.
             * 
             * @private
             * @returns {object} An JavaScript object width the keys width and height.
             */

        }, {
            key: 'getInnerSize',
            value: function getInnerSize() {

                var width = 0;
                var height = 0;

                if (this._header) {
                    width = this._header.width;
                    height = this._header.height;
                }

                if (this._header && this._content) {
                    height += this.innerPadding;
                }

                if (this._content) {
                    width = Math.max(width, this._content.width);
                    height += this._content.height;
                }

                return { width: width, height: height };
            }

            /**
             * Shows the popup (sets his alpha values to 1).
             * 
             * @param {callback} [cb] - Executed when show animation was completed.
             * @return {AbstractPopup} A reference to the popup for chaining.
             */

        }, {
            key: 'show',
            value: function show(cb) {
                var _this74 = this;

                TweenMax.to(this, this.theme.fast, {
                    alpha: 1,
                    onComplete: function onComplete() {
                        if (cb) {
                            cb.call(_this74);
                        }
                    }
                });

                return this;
            }

            /**
             * Hides the popup (sets his alpha values to 0).
             * 
             * @param {callback} [cb] - Executed when hide animation was completed.
             * @return {AbstractPopup} A reference to the popup for chaining.
             */

        }, {
            key: 'hide',
            value: function hide(cb) {
                var _this75 = this;

                TweenMax.to(this, this.theme.fast, {
                    alpha: 0,
                    onComplete: function onComplete() {
                        _this75.visible = false;
                        if (cb) {
                            cb.call(_this75);
                        }
                    }
                });

                if (this.opts.onHidden) {
                    this.opts.onHidden.call(this, this);
                }

                return this;
            }

            /**
             * Sets or gets the header. The getter always returns a PIXI.Text object. The setter can receive
             * a string, a number or a PIXI.Text object.
             * 
             * @member {string|number|PIXI.Text}
             */

        }, {
            key: 'header',
            get: function get() {
                return this._header;
            },
            set: function set(value) {
                if (this._header) {
                    this._header.destroy();
                }
                this.opts.header = value;
                this.setup().layout();
            }

            /**
             * Sets or gets the content. The getter always returns an PIXI.DisplayObject. The setter can receive
             * a string, a number or a PIXI.DisplayObject.
             * 
             * @member {string|number|PIXI.DisplayObject}
             */

        }, {
            key: 'content',
            get: function get() {
                return this._content;
            },
            set: function set(value) {
                if (this._content) {
                    this._content.destroy();
                }
                this.opts.content = value;
                this.setup().layout();
            }
        }]);

        return AbstractPopup;
    }(PIXI.Graphics);

    /**
     * Class that represents a PixiJS Tooltip.
     * 
     * @example
     * // Create the app
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 900,
     *     height: 250
     * }).setup().run()
     * 
     * // Add an DisplayObject to the app
     * const circle = new PIXI.Graphics()
     * circle.beginFill(0x5251a3)
     * circle.drawCircle(50, 50, 40)
     * app.scene.addChild(circle)
     * 
     * const tooltip = new Tooltip({
     *     object: circle,
     *     container: app.scene,
     *     content: 'Das Gesetz ist der Freund des Schwachen.'
     * })
     *
     * @class
     * @extends AbstractPopup
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/tooltip.html|DocTest}
     */


    var Tooltip = function (_AbstractPopup) {
        _inherits(Tooltip, _AbstractPopup);

        /**
         * Creates an instance of a Tooltip.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the tooltip.
         * @param {number} [opts.minWidth=0] - The minimum width of the tooltip.
         * @param {number} [opts.minHeight=0] - The minimum height of the tooltip.
         * @param {number} [opts.padding=Theme.padding / 2] - The inner spacing of the tooltip.
         * @param {PIXI.DisplayObject} opts.object - The object, where the tooltip should be displayed.
         * @param {PIXI.DisplayObject} [opts.container=object] - The container where the tooltip should be attached to.
         * @param {number} [opts.offsetLeft=8] - The horizontal shift of the tooltip.
         * @param {number} [opts.offsetTop=-8] - The vertical shift of the tooltip.
         * @param {number} [opts.delay=0] - A delay, after which the tooltip should be opened.
         */
        function Tooltip() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Tooltip);

            var theme = Theme.fromString(opts.theme);

            opts = Object.assign({}, {
                minWidth: 0,
                minHeight: 0,
                padding: theme.padding / 2,
                object: null,
                container: null,
                offsetLeft: 8,
                offsetTop: -8,
                delay: 0
            }, opts);

            opts.container = opts.container || opts.object;

            // setup
            //-----------------
            var _this76 = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, opts));

            _this76.setup();

            // layout
            //-----------------
            _this76.layout();
            return _this76;
        }

        /**
         * Creates children and instantiates everything.
         * 
         * @private
         * @return {Tooltip} A reference to the tooltip for chaining.
         */


        _createClass(Tooltip, [{
            key: 'setup',
            value: function setup() {
                var _this77 = this;

                _get(Tooltip.prototype.__proto__ || Object.getPrototypeOf(Tooltip.prototype), 'setup', this).call(this);

                // bind events this
                //-----------------
                this.interactive = true;

                var mouseoverTooltip = false;

                this.on('mouseover', function (e) {
                    mouseoverTooltip = true;
                });

                this.on('mouseout', function (e) {
                    mouseoverTooltip = false;
                    if (!mouseoverObject) {
                        _this77.hide(function () {
                            _this77.opts.container.removeChild(_this77);
                        });
                    }
                });

                // bind events object
                //-----------------
                var object = this.opts.object;
                object.interactive = true;

                var mouseoverObject = false;

                object.on('mouseover', function (e) {

                    _this77.timeout = window.setTimeout(function () {
                        mouseoverObject = true;
                        _this77.visible = true;
                        _this77.opts.container.addChild(_this77);
                        _this77.setPosition(e);
                    }, _this77.opts.delay * 1000);
                });

                object.on('mousemove', function (e) {
                    if (mouseoverObject) {
                        _this77.setPosition(e);
                    }
                });

                object.on('mouseout', function (e) {
                    mouseoverObject = false;
                    window.clearTimeout(_this77.timeout);
                    if (!mouseoverTooltip) {
                        _this77.hide(function () {
                            _this77.opts.container.removeChild(_this77);
                        });
                    }
                });

                return this;
            }

            /**
             * Calculates and sets the position of the tooltip.
             * 
             * @private
             * @return {Tooltip} A reference to the tooltip for chaining.
             */

        }, {
            key: 'setPosition',
            value: function setPosition(e) {

                var position = e.data.getLocalPosition(this.opts.container);

                this.x = position.x + this.opts.offsetLeft;
                this.y = position.y + this.opts.offsetTop - this.height;

                return this;
            }
        }]);

        return Tooltip;
    }(AbstractPopup);

    /**
     * Class that represents a PixiJS Badge.
     * 
     * @example
     * // Create the app
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 900,
     *     height: 250
     * }).setup().run()
     * 
     * // Add an DisplayObject to the app
     * const circle = new PIXI.Graphics()
     * circle.beginFill(0x5251a3)
     * circle.drawCircle(50, 50, 40)
     * app.scene.addChild(circle)
     * 
     * const badge1 = new Badge({
     *     object: circle,
     *     container: app.scene,
     *     content: 'Das Gesetz ist der Freund des Schwachen.'
     * })
     *
     * @class
     * @extends AbstractPopup
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/badge.html|DocTest}
     */


    var Badge = function (_AbstractPopup2) {
        _inherits(Badge, _AbstractPopup2);

        /**
         * Creates an instance of a Badge.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the badge.
         * @param {number} [opts.minWidth=0] - The minimum width of the badge.
         * @param {number} [opts.minHeight=0] - The minimum height of the badge.
         * @param {number} [opts.padding=Theme.padding / 2] - The inner spacing of the badge.
         * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
         *     to display.
         */
        function Badge() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Badge);

            var theme = Theme.fromString(opts.theme);

            opts = Object.assign({}, {
                minWidth: 0,
                minHeight: 0,
                padding: theme.padding / 2,
                tooltip: null
            }, opts);

            var _this78 = _possibleConstructorReturn(this, (Badge.__proto__ || Object.getPrototypeOf(Badge)).call(this, opts));

            _this78.tooltip = null;

            // setup
            //-----------------
            _this78.setup();

            // layout
            //-----------------
            _this78.layout();
            return _this78;
        }

        /**
         * Creates children and instantiates everything.
         *
         * @private
         * @override
         * @return {Badge} A reference to the badge for chaining.
         */


        _createClass(Badge, [{
            key: 'setup',
            value: function setup() {

                _get(Badge.prototype.__proto__ || Object.getPrototypeOf(Badge.prototype), 'setup', this).call(this);

                // tooltip
                //-----------------
                if (this.opts.tooltip) {
                    if (typeof this.opts.tooltip === 'string') {
                        this.tooltip = new Tooltip({ object: this, content: this.opts.tooltip });
                    } else {
                        this.opts.tooltip = Object.assign({}, { object: this }, this.opts.tooltip);
                        this.tooltip = new Tooltip(this.opts.tooltip);
                    }
                }

                return this;
            }

            /**
             * Should be called to refresh the layout of the badge. Can be used after resizing.
             * 
             * @override
             * @return {Badge} A reference to the badge for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                _get(Badge.prototype.__proto__ || Object.getPrototypeOf(Badge.prototype), 'layout', this).call(this);

                this.content.x = this.width / 2 - this.content.width / 2 - this.opts.strokeWidth / 2;
                this.content.y = this.height / 2 - this.content.height / 2 - this.opts.strokeWidth / 2;

                return this;
            }
        }]);

        return Badge;
    }(AbstractPopup);

    /**
     * Callback for the button action.
     *
     * @callback actionCallback
     * @param {object} event - The event object.
     * @param {Button} button - A reference to the button (also this refers to the button).
     */

    /**
     * Callback for the button beforeAction.
     *
     * @callback beforeActionCallback
     * @param {object} event - The event object.
     * @param {Button} button - A reference to the button (also this refers to the button).
     */

    /**
     * Callback for the button afterAction.
     *
     * @callback afterActionCallback
     * @param {object} event - The event object.
     * @param {Button} button - A reference to the button (also this refers to the button).
     */

    /**
     * Class that represents a PixiJS Button.
     *
     * @example
     * // Create the button
     * const button = new Button({
     *     label: 'My Button',
     *     action: () => console.log('Button was clicked')
     * })
     *
     * // Add the button to a DisplayObject
     * app.scene.addChild(button)
     *
     * @class
     * @extends PIXI.Container
     * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/button.html|DocTest}
     */


    var Button = function (_PIXI$Container4) {
        _inherits(Button, _PIXI$Container4);

        /**
         * Creates an instance of a Button.
         *
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the button.
         * @param {number} [opts.id=auto generated] - The id of the button.
         * @param {string} [opts.label] - The label of the button.
         * @param {number} [opts.x=0] - The x position of the button. Can be also set after creation with button.x = 0.
         * @param {number} [opts.y=0] - The y position of the button. Can be also set after creation with button.y = 0.
         * @param {string|Theme} [opts.theme=dark] - The theme to use for this button. Possible values are dark, light, red
         *     or a Theme object.
         * @param {number} [opts.minWidth=44] - The minimum width of the button.
         * @param {number} [opts.minHeight=44] - The minimum height of the button.
         * @param {number} [opts.padding=Theme.padding] - The inner spacing (distance from icon and/or label) to the border.
         * @param {string|PIXI.DisplayObject} [opts.icon] - The icon of the button. Can be a predefined one, an URL or an PIXI.DisplayObject.
         * @param {string|PIXI.DisplayObject} [opts.iconActive=icon] - The icon of the button when activated. Can be a predefined one, an URL or an PIXI.DisplayObject.
         * @param {string} [opts.iconPosition=left] - The position of the icon in relation to the label. Can be left or right.
         * @param {number} [opts.iconColor=Theme.iconColor] - The color of the icon (set by the tint property) as a hex value.
         * @param {number} [opts.iconColorActive=Theme.iconColorActive] - The color of the icon when activated.
         * @param {number} [opts.fill=Theme.fill] - The color of the button background as a hex value.
         * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
         * @param {number} [opts.fillActive=Theme.fillActive] - The color of the button background when activated.
         * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
         * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
         * @param {number} [opts.strokeWidth=Theme.strokeWidth] - The width of the border in pixel.
         * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
         * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
         * @param {number} [opts.strokeActiveWidth=Theme.strokeActiveWidth] - The width of the border in pixel when activated.
         * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
         * @param {object} [opts.textStyle=Theme.textStyle] - A textstyle object for the styling of the label. See PIXI.TextStyle
         *     for possible options.
         * @param {number} [opts.textStyleActive=Theme.textStyleActive] - A textstyle object for the styling of the label when the
         *     button is activated. See PIXI.TextStyle for possible options.
         * @param {string} [opts.style=default] - A shortcut for styling options. Possible values are default, link.
         * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the button (which is a rounded rectangle).
         * @param {boolean} [opts.disabled=false] - Is the button disabled? When disabled, the button has a lower alpha value
         *     and cannot be clicked (interactive is set to false).
         * @param {boolean} [opts.active=false] - Is the button initially active?
         * @param {actionCallback} [opts.action] - Executed when the button was triggered (by pointerup).
         * @param {beforeActionCallback} [opts.beforeAction] - Executed before the main action is triggered.
         * @param {afterActionCallback} [opts.afterAction] - Executed after the main action was triggered.
         * @param {string} [opts.type=default] - The type of the button. Can be default or checkbox. When the type is
         *     checkbox, the active state is toggled automatically.
         * @param {string} [opts.align=center] - The horizontal position of the label and the icon. Possible values are
         *     left, center and right. Only affects the style when the minWidth is bigger than the width of the icon and label.
         * @param {string} [opts.verticalAlign=middle] - The vertical position of the label and the icon. Possible values are
         *     top, middle and button. Only affects the style when the minHeight is bigger than the height of the icon and label.
         * @param {string|object} [opts.tooltip] - A string for the label of the tooltip or an object to configure the tooltip
         *     to display.
         * @param {string|object} [opts.badge] - A string for the label of the badge or an object to configure the badge to display.
         *     If the parameter is an object, all badge options can be set plus the following:
         * @param {string} [opts.badge.align=right] - The horizontal alignment of the badge. Possible values: left, center, right
         * @param {string} [opts.badge.verticalAlign=top] - The vertical alignment of the badge. Possible values: top, middle, bottom
         * @param {number} [opts.badge.offsetLeft=0] - The horizontal shift of the badge.
         * @param {number} [opts.badge.offsetTop=0] - The vertical shift of the badge.
         * @param {boolean} [opts.visible=true] - Is the button initially visible (property visible)?
         */
        function Button() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Button);

            var _this79 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

            var theme = Theme.fromString(opts.theme);
            _this79.theme = theme;

            _this79.opts = Object.assign({}, {
                id: PIXI.utils.uid(),
                label: null,
                x: 0,
                y: 0,
                minWidth: 44,
                minHeight: 44,
                padding: theme.padding,
                icon: undefined,
                iconActive: undefined,
                iconPosition: 'left',
                iconColor: theme.iconColor,
                iconColorActive: theme.iconColorActive,
                fill: theme.fill,
                fillAlpha: theme.fillAlpha,
                fillActive: theme.fillActive,
                fillActiveAlpha: theme.fillActiveAlpha,
                stroke: theme.stroke,
                strokeWidth: theme.strokeWidth,
                strokeAlpha: theme.strokeAlpha,
                strokeActive: theme.strokeActive,
                strokeActiveWidth: theme.strokeActiveWidth,
                strokeActiveAlpha: theme.strokeActiveAlpha,
                textStyle: theme.textStyle,
                textStyleActive: theme.textStyleActive,
                style: 'default',
                radius: theme.radius,
                disabled: false,
                active: false,
                action: null,
                beforeAction: null,
                afterAction: null,
                type: 'default',
                align: 'center',
                verticalAlign: 'middle',
                tooltip: null,
                badge: null,
                visible: true
            }, opts);

            _this79.id = _this79.opts.id;

            if (typeof _this79.opts.icon === 'undefined' && typeof _this79.opts.iconActive !== 'undefined') {
                _this79.opts.icon = _this79.opts.iconActive;
            } else if (typeof _this79.opts.icon !== 'undefined' && typeof _this79.opts.iconActive === 'undefined') {
                _this79.opts.iconActive = _this79.opts.icon;
            }

            if (_this79.opts.style === 'link') {
                Object.assign(_this79.opts, { strokeAlpha: 0, strokeActiveAlpha: 0, fillAlpha: 0, fillActiveAlpha: 0 });
            }

            _this79._active = null;
            _this79._disabled = null;

            _this79.iconInactive = null;
            _this79.iconActive = null;
            _this79.text = null;

            _this79.button = null;
            _this79.content = null;

            _this79.tooltip = null;
            _this79.badge = null;

            _this79.visible = _this79.opts.visible;

            // setup
            //-----------------
            _this79.setup();
            return _this79;
        }

        /**
         * Creates children and instantiates everything.
         *
         * @private
         * @return {Button} A reference to the button for chaining.
         */


        _createClass(Button, [{
            key: 'setup',
            value: function setup() {
                var _this80 = this;

                // Button
                //-----------------
                var button = new PIXI.Graphics();
                this.button = button;
                this.addChild(button);

                // Content
                //-----------------
                var content = new PIXI.Container();
                this.content = content;
                this.addChild(content);

                // Text
                //-----------------
                if (this.opts.label) {
                    this.text = new PIXI.Text(this.opts.label, this.opts.textStyle);
                }

                // Icon
                //-----------------
                if (this.opts.icon) {
                    this.iconInactive = this.loadIcon(this.opts.icon, this.opts.iconColor);
                }

                if (this.opts.iconActive) {
                    this.iconActive = this.loadIcon(this.opts.iconActive, this.opts.iconColorActive);
                }

                // interaction
                //-----------------
                this.button.on('pointerover', function (e) {
                    TweenMax.to([_this80.button, _this80.content], _this80.theme.fast, { alpha: .83, overwrite: 'none' });
                });

                this.button.on('pointerout', function (e) {
                    TweenMax.to([_this80.button, _this80.content], _this80.theme.fast, { alpha: 1, overwrite: 'none' });
                });

                this.button.on('pointerdown', function (e) {
                    TweenMax.to([_this80.button, _this80.content], _this80.theme.fast, { alpha: .7, overwrite: 'none' });
                });

                this.button.on('pointerup', function (e) {

                    if (_this80.opts.beforeAction) {
                        _this80.opts.beforeAction.call(_this80, e, _this80);
                    }

                    if (_this80.opts.action) {
                        _this80.opts.action.call(_this80, e, _this80);
                    }

                    TweenMax.to([_this80.button, _this80.content], _this80.theme.fast, { alpha: .83, overwrite: 'none' });

                    if (_this80.opts.type === 'checkbox') {
                        _this80.active = !_this80.active;
                    }

                    if (_this80.opts.afterAction) {
                        _this80.opts.afterAction.call(_this80, e, _this80);
                    }
                });

                // disabled
                //-----------------
                this.disabled = this.opts.disabled;

                // active
                //-----------------
                this.active = this.opts.active; // calls .layout()

                // tooltip
                //-----------------
                if (this.opts.tooltip) {
                    if (typeof this.opts.tooltip === 'string') {
                        this.tooltip = new Tooltip({ object: this, content: this.opts.tooltip });
                    } else {
                        this.opts.tooltip = Object.assign({}, { object: this }, this.opts.tooltip);
                        this.tooltip = new Tooltip(this.opts.tooltip);
                    }
                }

                // badge
                //-----------------
                if (this.opts.badge) {
                    var opts = Object.assign({}, {
                        align: 'right',
                        verticalAlign: 'top',
                        offsetLeft: 0,
                        offsetTop: 0
                    });
                    if (typeof this.opts.badge === 'string') {
                        opts = Object.assign(opts, { content: this.opts.badge });
                    } else {
                        opts = Object.assign(opts, this.opts.badge);
                    }

                    var badge = new Badge(opts);

                    switch (opts.align) {
                        case 'left':
                            badge.x = this.x - badge.width / 2 + opts.offsetLeft;
                            break;
                        case 'center':
                            badge.x = this.x + this.width / 2 - badge.width / 2 + opts.offsetLeft;
                            break;
                        case 'right':
                            badge.x = this.x + this.width - badge.width / 2 + opts.offsetLeft;
                    }

                    switch (opts.verticalAlign) {
                        case 'top':
                            badge.y = this.y - badge.height / 2 + opts.offsetTop;
                            break;
                        case 'middle':
                            badge.y = this.y + this.height / 2 - badge.height / 2 + opts.offsetTop;
                            break;
                        case 'bottom':
                            badge.y = this.y + this.height - badge.height / 2 + opts.offsetTop;
                    }

                    this.addChild(badge);

                    this.badge = badge;
                }

                // set position
                //-----------------
                this.position.set(this.opts.x, this.opts.y);

                return this;
            }

            /**
             * Should be called to refresh the layout of the button. Can be used after resizing.
             *
             * @return {Button} A reference to the button for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                // Clear content
                //-----------------
                this.removeChild(this.content);
                this.content = new PIXI.Container();
                this.addChild(this.content);

                // Set the icon
                //-----------------
                var icon = null;

                if (!this.active && this.iconInactive) {
                    icon = this.iconInactive;
                } else if (this.active && this.iconActive) {
                    icon = this.iconActive;
                }

                // Set the text
                //-----------------
                if (this.text) {
                    this.text.position.set(0, 0);
                }

                // Width and Height
                //-----------------
                var width = 0;
                if (icon && this.text) {
                    width = icon.width + this.text.width + 3 * this.opts.padding;
                } else if (icon) {
                    width = icon.width + 2 * this.opts.padding;
                } else if (this.text) {
                    width = this.text.width + 2 * this.opts.padding;
                }

                if (width < this.opts.minWidth) {
                    width = this.opts.minWidth;
                }

                var height = 0;
                if (icon) {
                    height = icon.height + 2 * this.opts.padding;
                } else if (this.text) {
                    height = this.text.height + 2 * this.opts.padding;
                }

                if (height < this.opts.minHeight) {
                    height = this.opts.minHeight;
                }

                this._width = width;
                this._height = height;

                // Position icon and text
                //-----------------
                if (icon && this.text) {
                    if (this.opts.iconPosition === 'right') {
                        icon.x = this.text.width + this.opts.padding;
                    } else {
                        this.text.x = icon.width + this.opts.padding;
                    }
                    this.content.addChild(icon, this.text);
                } else if (icon) {
                    this.content.addChild(icon);
                } else if (this.text) {
                    this.content.addChild(this.text);
                }

                this.layoutInnerContent();
                this.layoutContent();

                this.icon = icon;

                // draw
                //-----------------
                this.draw();

                return this;
            }

            /**
             * Calculates the positions of the content children (icon and/or text).
             * 
             * @private
             * @return {Button} A reference to the button for chaining.
             */

        }, {
            key: 'layoutInnerContent',
            value: function layoutInnerContent() {
                var _iteratorNormalCompletion52 = true;
                var _didIteratorError52 = false;
                var _iteratorError52 = undefined;

                try {

                    for (var _iterator52 = this.content.children[Symbol.iterator](), _step52; !(_iteratorNormalCompletion52 = (_step52 = _iterator52.next()).done); _iteratorNormalCompletion52 = true) {
                        var child = _step52.value;

                        switch (this.opts.verticalAlign) {
                            case 'top':
                                child.y = 0;
                                break;
                            case 'middle':
                                child.y = this.content.height / 2 - child.height / 2;
                                break;
                            case 'bottom':
                                child.y = this.content.height - child.height;
                                break;
                        }
                    }
                } catch (err) {
                    _didIteratorError52 = true;
                    _iteratorError52 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion52 && _iterator52.return) {
                            _iterator52.return();
                        }
                    } finally {
                        if (_didIteratorError52) {
                            throw _iteratorError52;
                        }
                    }
                }

                return this;
            }

            /**
             * Sets the horizontal and vertical position of the content.
             * Uses the option keys "align" and "verticalAlign".
             * 
             * @private
             * @return {Button} A reference to the button for chaining.
             */

        }, {
            key: 'layoutContent',
            value: function layoutContent() {

                switch (this.opts.align) {
                    case 'left':
                        this.content.x = this.opts.padding;
                        break;
                    case 'center':
                        this.content.x = (this._width - this.content.width) / 2;
                        break;
                    case 'right':
                        this.content.x = this._width - this.opts.padding - this.content.width;
                        break;
                }

                switch (this.opts.verticalAlign) {
                    case 'top':
                        this.content.y = this.opts.padding;
                        break;
                    case 'middle':
                        this.content.y = (this._height - this.content.height) / 2;
                        break;
                    case 'bottom':
                        this.content.y = this._height - this.opts.padding - this.content.height;
                        break;
                }

                return this;
            }

            /**
             * Draws the canvas.
             *
             * @private
             * @return {Button} A reference to the button for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {

                this.button.clear();
                if (this.active) {
                    this.button.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha);
                    this.button.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha);
                } else {
                    this.button.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
                    this.button.beginFill(this.opts.fill, this.opts.fillAlpha);
                }
                this.button.drawRoundedRect(0, 0, this._width, this._height, this.opts.radius);
                this.button.endFill();

                return this;
            }

            /**
             * Gets or sets the active state.
             *
             * @member {boolean}
             */

        }, {
            key: 'show',


            /**
             * Shows the button (sets his alpha values to 1).
             *
             * @return {Button} A reference to the button for chaining.
             */
            value: function show() {

                this.opts.strokeAlpha = 1;
                this.opts.strokeActiveAlpha = 1;
                this.opts.fillAlpha = 1;
                this.opts.fillActiveAlpha = 1;

                this.layout();

                return this;
            }

            /**
             * Hides the button (sets his alpha values to 0).
             *
             * @return {Button} A reference to the button for chaining.
             */

        }, {
            key: 'hide',
            value: function hide() {

                this.opts.strokeAlpha = 0;
                this.opts.strokeActiveAlpha = 0;
                this.opts.fillAlpha = 0;
                this.opts.fillActiveAlpha = 0;

                this.layout();

                return this;
            }

            /**
             * Loads an icon
             * 
             * @private
             * @param {string|PIXI.DisplayObject} icon - The icon to load.
             * @param {number} color - The color of the icon (if not an PIXI.DisplayObject).
             * @return {PIXI.DisplayObject} Return the icon as an PIXI.DisplayObject.
             */

        }, {
            key: 'loadIcon',
            value: function loadIcon(icon, color) {

                var displayObject = null;

                if (icon instanceof PIXI.DisplayObject) {
                    displayObject = icon;
                } else {
                    var size = 17;
                    if (this.text) {
                        size = this.text.height;
                    } else if (this.opts.minHeight) {
                        size = this.opts.minHeight - 2 * this.opts.padding;
                    }

                    var _url = Button.iconIsUrl(icon) ? icon : '../../assets/icons/png/flat/' + icon + '.png';
                    var iconTexture = PIXI.Texture.fromImage(_url, true);

                    var sprite = new PIXI.Sprite(iconTexture);
                    sprite.tint = color;
                    sprite.width = size;
                    sprite.height = size;

                    displayObject = sprite;
                }

                return displayObject;
            }

            /**
             * Tests if an icon string is an url.
             * 
             * @private
             * @static
             * @param {string} url - The url to test.
             * @return {boolean} true if the url is an url to an image.
             */

        }, {
            key: 'active',
            get: function get() {
                return this._active;
            },
            set: function set(value) {

                this._active = value;

                if (this._active) {
                    if (this.text) {
                        this.text.style = this.opts.textStyleActive;
                    }
                } else {
                    if (this.text) {
                        this.text.style = this.opts.textStyle;
                    }
                }

                this.layout();
            }

            /**
             * Gets or sets the disabled state. When disabled, the button cannot be clicked.
             *
             * @member {boolean}
             */

        }, {
            key: 'disabled',
            get: function get() {
                return this._disabled;
            },
            set: function set(value) {

                this._disabled = value;

                if (this._disabled) {
                    this.button.interactive = false;
                    this.button.buttonMode = false;
                    this.button.alpha = .5;
                    if (this.icon) {
                        this.icon.alpha = .5;
                    }
                    if (this.text) {
                        this.text.alpha = .5;
                    }
                } else {
                    this.button.interactive = true;
                    this.button.buttonMode = true;
                    this.button.alpha = 1;
                    if (this.icon) {
                        this.icon.alpha = 1;
                    }
                    if (this.text) {
                        this.text.alpha = 1;
                    }
                }
            }
        }, {
            key: 'iconColor',


            /**
             * Gets or sets the color of the current icon (no matter how the status is). Changing the color, changes
             * the tint property of the icon sprite.
             *
             * @member {number}
             */
            get: function get() {
                return this.icon ? this.icon.tint : null;
            },
            set: function set(value) {
                if (this.icon) {
                    this.icon.tint = value;
                }
            }
        }], [{
            key: 'iconIsUrl',
            value: function iconIsUrl(url) {
                return (/\.(png|svg|gif|jpg|jpeg|tif|tiff)$/i.test(url)
                );
            }
        }]);

        return Button;
    }(PIXI.Container);

    /**
     * Class that represents a PixiJS ButtonGroup.
     * 
     * @example
     * // Create the button group
     * const buttonGroup = new ButtonGroup({
     *     buttons: [
     *         {label: 'Button 1', action: event => console.log(event)},
     *         {label: 'Button 2', action: event => console.log(event)},
     *         {label: 'Button 3', action: event => console.log(event)}
     *     ],
     *     minWidth: 100
     * })
     *
     * // Add the button group to a DisplayObject
     * app.scene.addChild(buttonGroup)
     *
     * @class
     * @extends PIXI.Graphics
     * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/buttongroup.html|DocTest}
     */


    var ButtonGroup = function (_PIXI$Graphics5) {
        _inherits(ButtonGroup, _PIXI$Graphics5);

        /**
         * Creates an instance of a ButtonGroup.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the button group.
         * @param {number} [opts.id=auto generated] - The id of the button group.
         * @param {number} [opts.x=0] - The x position of the button group. Can be also set after creation with buttonGroup.x = 0.
         * @param {number} [opts.y=0] - The y position of the button group. Can be also set after creation with buttonGroup.y = 0.
         * @param {object[]} [opts.buttons=[]] - An array of the buttons of the button group. One item of the array (one object)
         *     can have exactly the same properties as an Button object when instantiating a Button. If a property of the button group
         *     conflicts with a property of a button object, the value from the button object will be used.
         * @param {string|Theme=} [opts.theme=dark] - The theme to use for this button group. Possible values are dark, light, red
         *     or a Theme object.
         * @param {number} [opts.minWidth=44] - Button: The minimum width of one button.
         * @param {number} [opts.minHeight=44] - Button: The minimum height of one button.
         * @param {number} [opts.padding=Theme.padding] - Button: The inner spacing (distance from icon and/or label) the the border.
         * @param {number} [opts.margin=Theme.margin] - The outer spacing (distance from one button to the previous/next button).
         * @param {string} [opts.iconPosition=left] - Button: The position of the icon in relation to the label. Can be left or right.
         * @param {number} [opts.iconColor=Theme.iconColor] - Button: The color of the icon (set by the tint property) as a hex value.
         * @param {number} [opts.iconColorActive=Theme.iconColorActive] - Button: The color of the icon when activated.
         * @param {number} [opts.fill=Theme.fill] - Button: The color of the button background as a hex value.
         * @param {number} [opts.fillAlpha=Theme.fillAlpha] - Button: The alpha value of the background.
         * @param {number} [opts.fillActive=Theme.fillActive] - Button: The color of the button background when activated.
         * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - Button: The alpha value of the background when activated.
         * @param {number} [opts.stroke=Theme.stroke] - Button: The color of the border as a hex value.
         * @param {number} [opts.strokeWidth=Theme.strokeWidth] - Button: The width of the border in pixel.
         * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - Button: The alpha value of the border.
         * @param {number} [opts.strokeActive=Theme.strokeActive] - Button: The color of the border when activated.
         * @param {number} [opts.strokeActiveWidth=Theme.strokeActiveWidth] - Button: The width of the border in pixel when activated.
         * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - Button: The alpha value of the border when activated.
         * @param {object} [opts.textStyle=Theme.textStyle] - Button: A textstyle object for the styling of the label. See PIXI.TextStyle
         *     for possible options.
         * @param {number} [opts.textStyleActive=Theme.textStyleActive] - Button: A textstyle object for the styling of the label when the
         *     button is activated. See PIXI.TextStyle for possible options.
         * @param {string} [opts.style=default] - A shortcut for styling options. Possible values are default, link.
         * @param {number} [opts.radius=Theme.radius] - Button: The radius of the four corners of the button (which is a rounded rectangle).
         * @param {boolean} [opts.disabled=false] - Is the button group disabled? When disabled, the button group has a lower alpha value
         *     and cannot be clicked (interactive of every button is set to false).
         * @param {string} [opts.type=default] - The type of the button group. Can be default, checkbox or radio. When the type is
         *     checkbox, the active state is toggled for each button automatically. When the type is radio, only one button can
         *     be activated at the same time.
         * @param {string} [opts.orientation=horizontal] - The orientation of the button group. Can be horizontal or vertical.
         * @param {string} [opts.align=center] - Button: The horizontal position of the label and the icon. Possible values are
         *     left, center and right. Only affects the style when the minWidth is bigger than the width of the icon and label.
         * @param {string} [opts.verticalAlign=middle] - Button: The vertical position of the label and the icon. Possible values are
         *     top, middle and button. Only affects the style when the minHeight is bigger than the height of the icon and label.
         * @param {boolean} [opts.visible=true] - Is the button group initially visible (property visible)?
         */
        function ButtonGroup() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, ButtonGroup);

            var _this81 = _possibleConstructorReturn(this, (ButtonGroup.__proto__ || Object.getPrototypeOf(ButtonGroup)).call(this));

            var theme = Theme.fromString(opts.theme);
            _this81.theme = theme;

            _this81.opts = Object.assign({}, {
                id: PIXI.utils.uid(),
                x: 0,
                y: 0,
                buttons: [],
                minWidth: 44,
                minHeight: 44,
                padding: theme.padding,
                margin: theme.margin,
                iconPosition: 'left', // left, right
                iconColor: theme.iconColor,
                iconColorActive: theme.iconColorActive,
                fill: theme.fill,
                fillAlpha: theme.fillAlpha,
                fillActive: theme.fillActive,
                fillActiveAlpha: theme.fillActiveAlpha,
                stroke: theme.stroke,
                strokeWidth: theme.strokeWidth,
                strokeAlpha: theme.strokeAlpha,
                strokeActive: theme.strokeActive,
                strokeActiveWidth: theme.strokeActiveWidth,
                strokeActiveAlpha: theme.strokeActiveAlpha,
                textStyle: theme.textStyle,
                textStyleActive: theme.textStyleActive,
                style: 'default',
                radius: theme.radius,
                disabled: null,
                type: 'default', // default, checkbox, radio
                orientation: 'horizontal',
                align: 'center', // left, center, right
                verticalAlign: 'middle', // top, middle, bottom
                visible: true
            }, opts);

            _this81.buttons = [];

            _this81._disabled = null;

            _this81.visible = _this81.opts.visible;

            // setup
            //-----------------
            _this81.setup();

            // layout
            //-----------------
            _this81.layout();
            return _this81;
        }

        /**
         * Creates children and instantiates everything.
         * 
         * @private
         * @return {ButtonGroup} A reference to the button group for chaining.
         */


        _createClass(ButtonGroup, [{
            key: 'setup',
            value: function setup() {
                var _this82 = this;

                // Buttons
                //-----------------
                var position = 0;

                var _iteratorNormalCompletion53 = true;
                var _didIteratorError53 = false;
                var _iteratorError53 = undefined;

                try {
                    for (var _iterator53 = this.opts.buttons[Symbol.iterator](), _step53; !(_iteratorNormalCompletion53 = (_step53 = _iterator53.next()).done); _iteratorNormalCompletion53 = true) {
                        var it = _step53.value;


                        delete it.x;
                        delete it.y;

                        if (this.opts.orientation === 'horizontal') {
                            it.x = position;
                        } else {
                            it.y = position;
                        }

                        it.theme = it.theme || this.opts.theme;
                        it.minWidth = it.minWidth || this.opts.minWidth;
                        it.minHeight = it.minHeight || this.opts.minHeight;
                        it.padding = it.padding || this.opts.padding;
                        it.iconPosition = it.iconPosition || this.opts.iconPosition;
                        it.iconColor = it.iconColor || this.opts.iconColor;
                        it.iconColorActive = it.iconColorActive || this.opts.iconColorActive;
                        it.fill = it.fill || this.opts.fill;
                        it.fillAlpha = it.fillAlpha || this.opts.fillAlpha;
                        it.fillActive = it.fillActive || this.opts.fillActive;
                        it.fillActiveAlpha = it.fillActiveAlpha || this.opts.fillActiveAlpha;
                        it.stroke = it.stroke || this.opts.stroke;
                        it.strokeWidth = it.strokeWidth != null ? it.strokeWidth : this.opts.strokeWidth;
                        it.strokeAlpha = it.strokeAlpha != null ? it.strokeAlpha : this.opts.strokeAlpha;
                        it.strokeActive = it.strokeActive || this.opts.strokeActive;
                        it.strokeActiveWidth = it.strokeActiveWidth != null ? it.strokeActiveWidth : this.opts.strokeActiveWidth;
                        it.strokeActiveAlpha = it.strokeActiveAlpha != null ? it.strokeActiveAlpha : this.opts.strokeActiveAlpha;
                        it.textStyle = it.textStyle || this.opts.textStyle;
                        it.textStyleActive = it.textStyleActive || this.opts.textStyleActive;
                        it.style = it.style || this.opts.style;
                        it.radius = it.radius != null ? it.radius : this.opts.radius;
                        if (!it.type) {
                            switch (this.opts.type) {
                                case 'checkbox':
                                    it.type = this.opts.type;
                                    break;
                                default:
                                    it.type = 'default';
                                    break;
                            }
                        }
                        //it.type = it.type || this.opts.type || 'default'
                        it.align = it.align || this.opts.align;
                        it.verticalAlign = it.verticalAlign || this.opts.verticalAlign;
                        it.afterAction = function (event, button) {
                            if (_this82.opts.type === 'radio' && button.opts.type === 'default') {
                                _this82.buttons.forEach(function (it) {
                                    if (it.opts.type === 'default') {
                                        it.active = false;
                                    }
                                });

                                if (button.opts.type === 'default') {
                                    button.active = true;
                                }
                            }
                        };

                        if (it.tooltip) {
                            if (typeof it.tooltip === 'string') {
                                it.tooltip = { content: it.tooltip, container: this };
                            } else {
                                it.tooltip = Object.assign({}, { container: this }, it.tooltip);
                            }
                        }

                        var button = new Button(it);

                        this.addChild(button);
                        this.buttons.push(button);

                        position += (this.opts.orientation === 'horizontal' ? button.width : button.height) + this.opts.margin;
                    }
                } catch (err) {
                    _didIteratorError53 = true;
                    _iteratorError53 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion53 && _iterator53.return) {
                            _iterator53.return();
                        }
                    } finally {
                        if (_didIteratorError53) {
                            throw _iteratorError53;
                        }
                    }
                }

                if (this.opts.orientation === 'vertical') {
                    var maxWidth = this.getMaxButtonWidth();

                    this.buttons.forEach(function (it) {
                        it.opts.minWidth = maxWidth;
                        it.layout();
                    });
                }

                // disabled
                //-----------------
                if (this.opts.disabled != null) {
                    this.disabled = this.opts.disabled;
                }

                return this;
            }

            /**
             * Should be called to refresh the layout of the button group. Can be used after resizing.
             * 
             * @return {ButtonGroup} A reference to the button group for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                // set position
                //-----------------
                this.position.set(this.opts.x, this.opts.y);

                // draw
                //-----------------
                this.draw();

                return this;
            }

            /**
             * Draws the canvas.
             * 
             * @private
             * @return {ButtonGroup} A reference to the button group for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {
                var _this83 = this;

                if (this.opts.margin === 0) {

                    this.buttons.forEach(function (it) {
                        return it.hide();
                    });

                    this.clear();
                    this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha);
                    this.beginFill(this.opts.fill, this.opts.fillAlpha);
                    this.drawRoundedRect(0, 0, this.width, this.height, this.opts.radius);

                    // Draw borders
                    this.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha / 2);

                    this.buttons.forEach(function (it, i) {
                        if (i > 0) {
                            _this83.moveTo(it.x, it.y);

                            if (_this83.opts.orientation === 'horizontal') {
                                _this83.lineTo(it.x, it.height);
                            } else {
                                _this83.lineTo(it.width, it.y);
                            }
                        }
                    });

                    this.endFill();
                }

                return this;
            }

            /**
             * Gets or sets the disabled state. When disabled, no button of the button group can be clicked.
             * 
             * @member {boolean}
             */

        }, {
            key: 'getMaxButtonWidth',


            /**
             * Searches all buttons of the button group and returns the maximum width of one button.
             * 
             * @private
             * @return {number} The maximum with of a button of the button group.
             */
            value: function getMaxButtonWidth() {

                var widths = this.buttons.map(function (it) {
                    return it.width;
                });

                return Math.max.apply(Math, _toConsumableArray(widths));
            }

            /**
             * Shows the button group (sets his alpha value to 1).
             * 
             * @return {ButtonGroup} A reference to the button group for chaining.
             */

        }, {
            key: 'show',
            value: function show() {

                this.alpha = 1;

                return this;
            }

            /**
             * Hides the button group (sets his alpha value to 0).
             * 
             * @return {ButtonGroup} A reference to the button group for chaining.
             */

        }, {
            key: 'hide',
            value: function hide() {

                this.alpha = 0;

                return this;
            }
        }, {
            key: 'disabled',
            get: function get() {
                return this._disabled;
            },
            set: function set(value) {

                this._disabled = value;

                this.buttons.forEach(function (it) {
                    return it.disabled = value;
                });
            }
        }]);

        return ButtonGroup;
    }(PIXI.Graphics);

    /**
     * Class that represents a PixiJS InteractivePopup.
     * The class is used for various other Popup-like classes
     * like Popup, Message...
     *
     * @class
     * @abstract
     * @extends AbstractPopup
     */


    var InteractivePopup = function (_AbstractPopup3) {
        _inherits(InteractivePopup, _AbstractPopup3);

        /**
         * Creates an instance of an InteractivePopup (only for internal use).
         *
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the popup.
         * @param {boolean} [opts.closeOnPopup=false] - Should the popup be closed when the user clicks on the popup?
         * @param {boolean} [opts.closeButton=true] - Should a close button be displayed on the upper right corner?
         * @param {object} [opts.button] - A Button object to be display on the lower right corner.
         * @param {object} [opts.buttonGroup] - A ButtonGroup object to be displayed on the lower right corner.
         */
        function InteractivePopup() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, InteractivePopup);

            opts = Object.assign({}, {
                closeOnPopup: false,
                closeButton: true,
                button: null,
                buttonGroup: null
            }, opts);

            var _this84 = _possibleConstructorReturn(this, (InteractivePopup.__proto__ || Object.getPrototypeOf(InteractivePopup)).call(this, opts));

            _this84._closeButton = null;
            _this84._buttons = null;

            // padding
            _this84.smallPadding = _this84.opts.padding / 2;

            // setup
            //-----------------
            _this84.setup();

            // layout
            //-----------------
            _this84.layout();
            return _this84;
        }

        /**
         * Creates the framework and instantiates everything.
         *
         * @private
         * @return {AbstractPopup} A reference to the popup for chaining.
         */


        _createClass(InteractivePopup, [{
            key: 'setup',
            value: function setup() {
                var _this85 = this;

                _get(InteractivePopup.prototype.__proto__ || Object.getPrototypeOf(InteractivePopup.prototype), 'setup', this).call(this);

                // interaction
                //-----------------
                this.on('pointerup', function (e) {
                    if (_this85.opts.closeOnPopup) {
                        _this85.hide();
                    } else {
                        e.stopPropagation();
                    }
                });

                // closeButton
                //-----------------
                if (this.opts.closeButton) {
                    var closeButton = PIXI.Sprite.fromImage('../../assets/icons/png/flat/close.png', true);
                    closeButton.width = this.headerStyle.fontSize;
                    closeButton.height = closeButton.width;
                    closeButton.tint = this.theme.color2;
                    // This is needed, because the closeButton belongs to the content. The popup must resize with the closeButton.
                    if (this._header) {
                        closeButton.x = this._header.width + this.innerPadding;
                    } else if (this._content) {
                        closeButton.x = this._content.width + this.innerPadding;
                    }

                    closeButton.interactive = true;
                    closeButton.buttonMode = true;
                    closeButton.on('pointerdown', function (e) {
                        _this85.hide();
                    });

                    this._closeButton = closeButton;
                    this.addChild(closeButton);

                    // maxWidth is set and a closeButton should be displayed
                    //-----------------
                    if (this.opts.maxWidth) {
                        var wordWrapWidth = this.opts.maxWidth - 2 * this.opts.padding - this.smallPadding - this._closeButton.width;
                        if (this._header) {
                            this.headerStyle.wordWrapWidth = wordWrapWidth;
                        } else if (this._content) {
                            this.textStyle.wordWrapWidth = wordWrapWidth;
                        }
                    }
                }

                // buttons
                //-----------------
                if (this.opts.button || this.opts.buttonGroup) {
                    if (this.opts.button) {
                        this._buttons = new Button(Object.assign({ textStyle: this.theme.textStyleSmall }, this.opts.button));
                    } else {
                        this._buttons = new ButtonGroup(Object.assign({ textStyle: this.theme.textStyleSmall }, this.opts.buttonGroup));
                    }
                    this.addChild(this._buttons);

                    this._buttons.y = this.innerPadding + this.sy;
                }

                return this;
            }

            /**
             * Should be called to refresh the layout of the popup. Can be used after resizing.
             *
             * @return {AbstractPopup} A reference to the popup for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                _get(InteractivePopup.prototype.__proto__ || Object.getPrototypeOf(InteractivePopup.prototype), 'layout', this).call(this);

                // closeButton
                //-----------------
                if (this.opts.closeButton) {
                    this._closeButton.x = this.wantedWidth - this.smallPadding - this._closeButton.width;
                    this._closeButton.y = this.smallPadding;
                }

                // buttons
                //-----------------
                if (this._buttons) {
                    this._buttons.x = this.wantedWidth - this.opts.padding - this._buttons.width;
                    this._buttons.y = this.wantedHeight - this.opts.padding - this._buttons.height;
                }

                return this;
            }

            /**
             * Calculates the size of the children of the AbstractPopup.
             * Cannot use getBounds() because it is not updated when children
             * are removed.
             * 
             * @private
             * @override
             * @returns {object} An JavaScript object width the keys width and height.
             */

        }, {
            key: 'getInnerSize',
            value: function getInnerSize() {

                var size = _get(InteractivePopup.prototype.__proto__ || Object.getPrototypeOf(InteractivePopup.prototype), 'getInnerSize', this).call(this);

                if (this._closeButton) {
                    size.width += this.smallPadding + this._closeButton.width;
                }

                if (this._buttons) {
                    size.width = Math.max(size.width, this._buttons.x + this._buttons.width);
                    size.height += this.innerPadding + this._buttons.height;
                }

                return size;
            }
        }]);

        return InteractivePopup;
    }(AbstractPopup);

    /**
     * Class that represents a PixiJS Modal.
     * 
     * @example
     * // Create the button and the modal when clicked
     * const button = new Button({
     *     label: 'Show Modal',
     *     action: e => {
     *         const modal = new Modal({
     *             app: app,
     *             header: 'This is the header',
     *             content: 'This is the text.'
     *         })
     *         app.scene.addChild(modal)
     *     }
     * })
     *
     * // Add the button to a DisplayObject
     * app.scene.addChild(button)
     *
     * @class
     * @extends PIXI.Container
     * @extends InteractivePopup
     * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/modal.html|DocTest}
     */


    var Modal = function (_PIXI$Container5) {
        _inherits(Modal, _PIXI$Container5);

        /**
         * Creates an instance of a Modal.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the modal.
         * @param {number} [opts.id=auto generated] - The id of the modal.
         * @param {PIXIApp} [opts.app=window.app] - The app where the modal belongs to.
         * @param {number} [opts.backgroundFill=Theme.background] - The color of the background.
         * @param {number} [opts.backgroundFillAlpha=0.6] - The opacity of the background.
         * @param {boolean} [opts.closeOnBackground=true] - Should the modal be closed when the user clicks the
         *     background?
         * @param {boolean} [opts.visible=true] - Is the modal initially visible (property visible)?
         */
        function Modal() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Modal);

            var _this86 = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this));

            var theme = Theme.fromString(opts.theme);
            _this86.theme = theme;

            _this86.opts = Object.assign({}, {
                id: PIXI.utils.uid(),
                app: window.app,
                backgroundFill: theme.background,
                backgroundFillAlpha: .6,
                closeOnBackground: true,
                visible: true
            }, opts);

            _this86.id = _this86.opts.id;

            _this86.background = null;
            _this86.popup = null;

            _this86.alpha = 0;
            _this86.visible = _this86.opts.visible;

            // setup
            //-----------------
            _this86.setup();

            // layout
            //-----------------
            _this86.layout();
            return _this86;
        }

        /**
         * Creates children and instantiates everything.
         * 
         * @private
         * @return {Modal} A reference to the modal for chaining.
         */


        _createClass(Modal, [{
            key: 'setup',
            value: function setup() {
                var _this87 = this;

                // interaction
                //-----------------
                this.interactive = true;
                this.on('added', function (e) {
                    if (_this87.visible) {
                        _this87.show();
                    }
                });

                // background
                //-----------------
                var background = new PIXI.Graphics();
                this.background = background;
                this.addChild(this.background);

                if (this.opts.closeOnBackground) {
                    background.interactive = true;
                    background.on('pointerup', function (e) {
                        _this87.hide();
                    });
                }

                // popup
                //-----------------
                var popupOpts = Object.assign({}, this.opts, {
                    visible: true,
                    onHidden: function onHidden() {
                        _this87.hide();
                    }
                });
                var popup = new InteractivePopup(popupOpts);
                this.popup = popup;
                this.addChild(popup);
                popup.show();

                return this;
            }

            /**
             * Should be called to refresh the layout of the modal. Can be used after resizing.
             * 
             * @return {Modal} A reference to the modal for chaining.
             */

        }, {
            key: 'layout',
            value: function layout() {

                var width = this.opts.app.size.width;
                var height = this.opts.app.size.height;

                // background
                //-----------------
                this.background.clear();
                this.background.beginFill(this.opts.backgroundFill, this.opts.backgroundFillAlpha);
                this.background.drawRect(0, 0, width, height);
                this.background.endFill();

                // position
                this.popup.x = width / 2 - this.popup.width / 2;
                this.popup.y = height / 2 - this.popup.height / 2;

                return this;
            }

            /**
             * Shows the modal (sets his alpha values to 1).
             * 
             * @return {Modal} A reference to the modal for chaining.
             */

        }, {
            key: 'show',
            value: function show() {
                var _this88 = this;

                TweenMax.to(this, this.theme.fast, { alpha: 1, onStart: function onStart() {
                        return _this88.visible = true;
                    } });

                return this;
            }

            /**
             * Hides the modal (sets his alpha values to 0).
             * 
             * @return {Modal} A reference to the modal for chaining.
             */

        }, {
            key: 'hide',
            value: function hide() {
                var _this89 = this;

                TweenMax.to(this, this.theme.fast, { alpha: 0, onComplete: function onComplete() {
                        return _this89.visible = false;
                    } });

                return this;
            }

            /**
             * Sets or gets the header. The getter always returns a PIXI.Text object. The setter can receive
             * a string or a PIXI.Text object.
             * 
             * @member {string|PIXI.Text}
             */

        }, {
            key: 'header',
            get: function get() {
                return this.popup.header;
            },
            set: function set(value) {
                this.opts.header = value;
                this.background.destroy();
                this.popup.destroy();
                this.setup().layout();
            }

            /**
             * Sets or gets the content. The getter always returns an PIXI.DisplayObject. The setter can receive
             * a string or a PIXI.DisplayObject.
             * 
             * @member {string|PIXI.DisplayObject}
             */

        }, {
            key: 'content',
            get: function get() {
                return this.popup.content;
            },
            set: function set(value) {
                this.opts.content = value;
                this.background.destroy();
                this.popup.destroy();
                this.setup().layout();
            }
        }]);

        return Modal;
    }(PIXI.Container);

    /**
     * Class that represents a Message. A message pops up and disappears after a specific amount of time.
     * 
     * @example
     * // Create the PixiJS App
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 900,
     *     height: 250
     * }).setup().run()
     * 
     * // Create a button
     * let button = new Button({
     *     label: 'Click me',
     *     action: e => {
     *         const message = new Message({
     *             app: app,
     *             header: 'Header',
     *             content: 'Text.'
     *         })
     *         app.scene.addChild(message)
     *     }
     * })
     * 
     * // Add the button to the scene
     * app.scene.addChild(button)
     *
     * @class
     * @extends InteractivePopup
     * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/message.html|DocTest}
     */


    var Message = function (_InteractivePopup) {
        _inherits(Message, _InteractivePopup);

        /**
         * Creates an instance of a Message.
         * 
         * @constructor
         * @param {object} [opts] - An options object to specify to style and behaviour of the message.
         * @param {PIXIApp} [opts.app=window.app] - The PIXIApp where this message belongs to.
         * @param {boolean} [opts.closeButton=false] - Should a close button be displayed in the upper right corner?
         * @param {number} [opts.minWidth=280] - The minimum width of the message box. Automatically expands with the content.
         * @param {number} [opts.minHeight=100] - The minimum height of the message box. Automatically expands with the content.
         * @param {number} [opts.margin=Theme.margin] - The outer spacing of the message box.
         * @param {string} [opts.align=right] - The horizontal position of the message box relative to the app. Possible
         *     values are left, center, right.
         * @param {string} [opts.verticalAlign=top] - The vertical position of the message box relative to the app. Possible
         *     values are top, middle, bottom.
         * @param {number} [opts.duration=5] - The duration in seconds when the message box should disappear.
         * @param {boolean} [opts.autoClose=true] - Should the message box be closed automatically?
         * @param {number} [opts.closeDuration=Theme.fast] - The duration in seconds of the closing of the message box.
         */
        function Message() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Message);

            var theme = Theme.fromString(opts.theme);

            opts = Object.assign({}, {
                app: window.app,
                closeButton: false,
                minWidth: 280,
                minHeight: 100,
                margin: theme.margin,
                align: 'right', // left, center, right
                verticalAlign: 'top', // top, middle, bottom
                duration: 5,
                autoClose: true,
                closeDuration: theme.fast
            }, opts);

            return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, opts));
        }

        /**
         * Relayouts the position of the message box.
         * 
         * @return {Message} Returns the message box for chaining.
         */


        _createClass(Message, [{
            key: 'layout',
            value: function layout() {

                _get(Message.prototype.__proto__ || Object.getPrototypeOf(Message.prototype), 'layout', this).call(this);

                // horizontal
                switch (this.opts.align) {
                    case 'left':
                        this.x = this.opts.margin;
                        break;
                    case 'center':
                        this.x = this.opts.app.size.width / 2 - this.width / 2;
                        break;
                    case 'right':
                        this.x = this.opts.app.size.width - this.opts.margin - this.width;
                        break;
                }

                // vertical
                switch (this.opts.verticalAlign) {
                    case 'top':
                        this.y = this.opts.margin;
                        break;
                    case 'middle':
                        this.y = this.opts.app.size.height / 2 - this.height / 2;
                        break;
                    case 'bottom':
                        this.y = this.opts.app.size.height - this.opts.margin - this.height;
                        break;
                }
            }

            /**
             * Shows the message box.
             * 
             * @private
             */

        }, {
            key: 'show',
            value: function show() {
                var _this91 = this;

                _get(Message.prototype.__proto__ || Object.getPrototypeOf(Message.prototype), 'show', this).call(this);

                if (this.opts.autoClose) {
                    window.setTimeout(function () {
                        _this91.hide();
                    }, this.opts.duration * 1000);
                }
            }
        }]);

        return Message;
    }(InteractivePopup);

    /* global apollo, subscriptions, gql */

    /**
     * A special InteractionManager for fullscreen apps, which may
     * go beyond the limits of WebGL drawing buffers. On Safari and Chrome
     * the drawing buffers are limited to 4096 in width (Safari) or 4096x4096
     * in total buffer size (Chrome). The original InteractionManager.mapPositionToPoint
     * does not work with these extreme sizes which mainly occur if large
     * retina displays (>= 4K) are used with devicePixelRatio > 1.
     *
     * @private
     * @class
     * @extends PIXI.interaction.InteractionManager
     * @see {@link http://pixijs.download/dev/docs/PIXI.interaction.InteractionManager.html|PIXI.interaction.InteractionManager}
     * @see {@link https://stackoverflow.com/questions/29710696/webgl-drawing-buffer-size-does-not-equal-canvas-size}
     */


    var FullscreenInteractionManager = function (_PIXI$interaction$Int) {
        _inherits(FullscreenInteractionManager, _PIXI$interaction$Int);

        function FullscreenInteractionManager() {
            _classCallCheck(this, FullscreenInteractionManager);

            return _possibleConstructorReturn(this, (FullscreenInteractionManager.__proto__ || Object.getPrototypeOf(FullscreenInteractionManager)).apply(this, arguments));
        }

        _createClass(FullscreenInteractionManager, [{
            key: 'mapPositionToPoint',
            value: function mapPositionToPoint(point, x, y) {
                var resolution = this.renderer.resolution;
                var extendWidth = 1.0;
                var extendHeight = 1.0;
                var dy = 0;
                var canvas = this.renderer.view;
                var context = canvas.getContext('webgl');
                if (context.drawingBufferWidth < canvas.width || context.drawingBufferHeight < canvas.height) {
                    extendWidth = context.drawingBufferWidth / canvas.width;
                    extendHeight = context.drawingBufferHeight / canvas.height;
                    //dx = wantedWidth - context.drawingBufferWidth
                    dy = (canvas.height - context.drawingBufferHeight) / resolution;
                }
                x *= extendWidth;
                y *= extendHeight;

                _get(FullscreenInteractionManager.prototype.__proto__ || Object.getPrototypeOf(FullscreenInteractionManager.prototype), 'mapPositionToPoint', this).call(this, point, x, y + dy);
            }
        }]);

        return FullscreenInteractionManager;
    }(PIXI.interaction.InteractionManager);

    /**
     * The class PixiApp extends the class PIXI.Application
     * by several functions and makes meaningful pre-assumptions.
     *
     * @example
     * // Create the app
     * const app = new PIXIApp({
     *     view: canvas,
     *     width: 450,
     *     height: 150,
     *     fpsLogging: true,
     *     theme: 'light',
     *     transparent: false
     * }).setup().run()
     *
     * @class
     * @extends PIXI.Application
     * @see {@link http://pixijs.download/dev/docs/PIXI.Application.html|PIXI.Application}
     */


    var PIXIApp = function (_PIXI$Application) {
        _inherits(PIXIApp, _PIXI$Application);

        /**
         * Creates an instance of a PixiApp.
         *
         * @constructor
         * @param {object} [opts={}] - An options object. The following options can be set:
         * @param {number} [opts.width] - The width of the renderer. If no set, the application will run in fullscreen.
         * @param {number} [opts.height] - The height of the renderer. If no set, the application will run in fullscreen.
         * @param {HTMLElement} [opts.view] - The canvas HTML element. If not set, a render-element is added inside the body.
         * @param {boolean} [opts.transparent=true] - Should the render view be transparent?
         * @param {boolean} [opts.antialias=true] - Sets antialias (only applicable in chrome at the moment).
         * @param {number} [opts.resolution=window.devicePixelRatio | 1] - The resolution / device pixel ratio of the renderer, retina would be 2.
         * @param {boolean} [opts.autoResize=true] - Should the canvas-element be resized automatically if the resolution was set?
         * @param {number} [opts.backgroundColor=0x282828] - The color of the background.
         * @param {string|Theme} [opts.theme=dark] - The name of the theme (dark, light, red) or a Theme object to use for styling.
         * @param {boolean} [opts.fpsLogging=false] - If set to true, the current frames per second are displayed in the upper left corner.
         * @param {object} [opts.progress={}] - Can be used to add options to the progress bar. See class Progress for more informations.
         * @param {boolean} [opts.forceCanvas=false] - Prevents selection of WebGL renderer, even if such is present.
         * @param {boolean} [opts.roundPixels=true] - Align PIXI.DisplayObject coordinates to screen resolution.
         * @param {boolean} [opts.monkeyPatchMapping=true] - Monkey patch for canvas fullscreen support on large displays.
         */
        function PIXIApp(_ref29) {
            var _ref29$width = _ref29.width,
                width = _ref29$width === undefined ? null : _ref29$width,
                _ref29$height = _ref29.height,
                height = _ref29$height === undefined ? null : _ref29$height,
                _ref29$view = _ref29.view,
                view = _ref29$view === undefined ? null : _ref29$view,
                _ref29$transparent = _ref29.transparent,
                transparent = _ref29$transparent === undefined ? true : _ref29$transparent,
                _ref29$backgroundColo = _ref29.backgroundColor,
                backgroundColor = _ref29$backgroundColo === undefined ? 0x282828 : _ref29$backgroundColo,
                _ref29$theme = _ref29.theme,
                theme = _ref29$theme === undefined ? 'dark' : _ref29$theme,
                _ref29$antialias = _ref29.antialias,
                antialias = _ref29$antialias === undefined ? true : _ref29$antialias,
                _ref29$resolution = _ref29.resolution,
                resolution = _ref29$resolution === undefined ? window.devicePixelRatio || 1 : _ref29$resolution,
                _ref29$autoResize = _ref29.autoResize,
                autoResize = _ref29$autoResize === undefined ? true : _ref29$autoResize,
                _ref29$fpsLogging = _ref29.fpsLogging,
                fpsLogging = _ref29$fpsLogging === undefined ? false : _ref29$fpsLogging,
                _ref29$progress = _ref29.progress,
                progress = _ref29$progress === undefined ? {} : _ref29$progress,
                _ref29$forceCanvas = _ref29.forceCanvas,
                forceCanvas = _ref29$forceCanvas === undefined ? false : _ref29$forceCanvas,
                _ref29$roundPixels = _ref29.roundPixels,
                roundPixels = _ref29$roundPixels === undefined ? true : _ref29$roundPixels,
                _ref29$monkeyPatchMap = _ref29.monkeyPatchMapping,
                monkeyPatchMapping = _ref29$monkeyPatchMap === undefined ? true : _ref29$monkeyPatchMap,
                _ref29$graphql = _ref29.graphql,
                graphql = _ref29$graphql === undefined ? false : _ref29$graphql;

            _classCallCheck(this, PIXIApp);

            var fullScreen = !width || !height;

            if (fullScreen) {
                width = window.innerWidth;
                height = window.innerHeight;
            }

            var _this93 = _possibleConstructorReturn(this, (PIXIApp.__proto__ || Object.getPrototypeOf(PIXIApp)).call(this, {
                view: view,
                width: width,
                height: height,
                transparent: transparent,
                antialias: antialias,
                resolution: resolution,
                autoResize: autoResize,
                backgroundColor: backgroundColor,
                roundPixels: roundPixels,
                forceCanvas: forceCanvas
            }));

            _this93.width = width;
            _this93.height = height;
            _this93.theme = Theme.fromString(theme);
            _this93.fpsLogging = fpsLogging;
            _this93.progressOpts = progress;
            _this93.fullScreen = fullScreen;
            _this93.orient = null;
            _this93.originalMapPositionToPoint = null;
            _this93.monkeyPatchMapping = monkeyPatchMapping;
            _this93.graphql = graphql;
            if (fullScreen) {
                console.log('App is in fullScreen mode');
                window.addEventListener('resize', _this93.resize.bind(_this93));
                document.body.addEventListener('orientationchange', _this93.checkOrientation.bind(_this93));
            }
            if (monkeyPatchMapping) {
                console.log('Using monkey patched coordinate mapping');
                // Pluggin the specializtion does not work. Monkey patching does
                // this.renderer.plugins.interaction = new FullscreenInteractionManager(this.renderer)
                _this93.monkeyPatchPixiMapping();
            }
            return _this93;
        }

        /**
         * Extra setup method to construct complex scenes, etc...
         * Overwrite this method if you need additonal views and components.
         *
         * @return {PIXIApp} A reference to the PIXIApp for chaining.
         */


        _createClass(PIXIApp, [{
            key: 'setup',
            value: function setup() {
                this.scene = this.sceneFactory();
                this.stage.addChild(this.scene);

                // fpsLogging
                if (this.fpsLogging) {
                    this.addFpsDisplay();
                }

                // GraphQL
                if (this.graphql && typeof apollo !== 'undefined') {

                    var networkInterface = apollo.createNetworkInterface({
                        uri: '/graphql'
                    });

                    var wsClient = new subscriptions.SubscriptionClient('wss://' + location.hostname + '/subscriptions', {
                        reconnect: true,
                        connectionParams: {}
                    });

                    var networkInterfaceWithSubscriptions = subscriptions.addGraphQLSubscriptions(networkInterface, wsClient);

                    this.apolloClient = new apollo.ApolloClient({
                        networkInterface: networkInterfaceWithSubscriptions
                    });
                }

                // progress
                this._progress = new Progress(Object.assign({ theme: this.theme }, this.progressOpts, { app: this }));
                this._progress.visible = false;
                this.stage.addChild(this._progress);

                return this;
            }

            /**
             * Tests whether the width is larger than the height of the application.
             *
             * @return {boolean} Returns true if app is in landscape mode.
             */

        }, {
            key: 'orientation',
            value: function orientation() {
                return this.width > this.height;
            }

            /**
             * Checks orientation and adapts view size if necessary. Implements a
             * handler for the orientationchange event.
             *
             * @param {event=} - orientationchange event
             */

        }, {
            key: 'checkOrientation',
            value: function checkOrientation(event) {
                var value = this.orientation();
                if (value != this.orient) {
                    setTimeout(100, function () {
                        this.orientationChanged(true);
                    }.bind(this));
                    this.orient = value;
                }
            }

            /**
             * Called if checkOrientation detects an orientation change event.
             *
             * @param {boolean=} [force=false] - Called if checkOrientation detects an orientation change event.
             */

        }, {
            key: 'orientationChanged',
            value: function orientationChanged() {
                var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                if (this.expandRenderer() || force) {
                    this.layout();
                }
            }

            /**
             * Called after a resize. Empty method but can be overwritten to
             * adapt their layout to the new app size.
             *
             * @param {number} [width] - The width of the app.
             * @param {number} [height] - The height of the app.
             */

        }, {
            key: 'layout',
            value: function layout(width, height) {}

            /**
             * Draws the display tree of the app. Typically this can be delegated
             * to the layout method.
             *
             */

        }, {
            key: 'draw',
            value: function draw() {
                this.layout(this.width, this.height);
            }

            /*
             * Run the application. Override this method with everything
             * that is needed to maintain your App, e.g. setup calls, main loops, etc.
             *
             */

        }, {
            key: 'run',
            value: function run() {
                return this;
            }

            /*
             * Overwrite this factory method if your application needs a special
             * scene object.
             *
             * @returns {PIXI.Container} - A new PIXI Container for use as a scene.
             */

        }, {
            key: 'sceneFactory',
            value: function sceneFactory() {
                return new PIXI.Container();
            }

            /**
             * Adds the display of the frames per second to the renderer in the upper left corner.
             *
             * @return {PIXIApp} - Returns the PIXIApp for chaining.
             */

        }, {
            key: 'addFpsDisplay',
            value: function addFpsDisplay() {
                var fpsDisplay = new FpsDisplay(this);
                this.stage.addChild(fpsDisplay);

                return this;
            }

            /**
             * Returns the size of the renderer as an object with the keys width and height.
             *
             * @readonly
             * @member {object}
             */

        }, {
            key: 'resize',


            /**
             * Resizes the renderer to fit into the window or given width and height.
             *
             * @param {object} [event] - The event.
             * @param {object=} [opts={}] - The event.
             * @param {number} [opts.width=window.innerWidth] - The width of the app to resize to.
             * @param {number} [opts.height=window.innerHeight] - The height of the app to resize to.
             * @return {PIXIApp} - Returns the PIXIApp for chaining.
             */
            value: function resize(event) {
                var _ref30 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref30$width = _ref30.width,
                    width = _ref30$width === undefined ? window.innerWidth : _ref30$width,
                    _ref30$height = _ref30.height,
                    height = _ref30$height === undefined ? window.innerHeight : _ref30$height;

                this.width = width;
                this.height = height;
                this.expandRenderer();
                this.layout(width, height);
                // if (this.scene) {
                // console.log("gl.drawingBufferWidth", this.renderer.view.getContext('webgl').drawingBufferWidth)
                // console.log("scene", this.scene.scale, this.renderer, this.renderer.autoResize, this.renderer.resolution)
                // }
                return this;
            }

            /**
             * @todo Write the documentation.
             *
             * @private
             */

        }, {
            key: 'monkeyPatchPixiMapping',
            value: function monkeyPatchPixiMapping() {
                var _this94 = this;

                if (this.originalMapPositionToPoint === null) {
                    var interactionManager = this.renderer.plugins.interaction;
                    this.originalMapPositionToPoint = interactionManager.mapPositionToPoint;
                    interactionManager.mapPositionToPoint = function (point, x, y) {
                        return _this94.fixedMapPositionToPoint(point, x, y);
                    };
                }
            }

            /**
             * @todo Write the documentation.
             *
             * @private
             * @param {any} local
             * @param {number} x
             * @param {number} y
             * @return {} interactionManager.mapPositionToPoint
             */

        }, {
            key: 'fixedMapPositionToPoint',
            value: function fixedMapPositionToPoint(local, x, y) {
                var resolution = this.renderer.resolution;
                var interactionManager = this.renderer.plugins.interaction;
                var extendWidth = 1.0;
                var extendHeight = 1.0;
                var dy = 0;
                var canvas = this.renderer.view;
                var context = canvas.getContext('webgl');

                if (context !== null && (context.drawingBufferWidth < canvas.width || context.drawingBufferHeight < canvas.height)) {
                    extendWidth = context.drawingBufferWidth / canvas.width;
                    extendHeight = context.drawingBufferHeight / canvas.height;
                    //dx = wantedWidth - context.drawingBufferWidth
                    dy = (canvas.height - context.drawingBufferHeight) / resolution;
                }
                x *= extendWidth;
                y *= extendHeight;
                return this.originalMapPositionToPoint.call(interactionManager, local, x, y + dy);
            }

            /**
             * Expand the renderer step-wise on resize.
             *
             * @param {number} [expand] - The amount of additional space for the renderer [px].
             * @return {boolean} true if the renderer was resized.
             */

        }, {
            key: 'expandRenderer',
            value: function expandRenderer() {
                var expand = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;

                var renderer = this.renderer;
                var resolution = this.renderer.resolution;
                var ww = this.width;
                var hh = this.height;
                var sw = this.screen.width;
                var sh = this.screen.height;
                if (ww > sw || hh > sh) {
                    console.log('App.expandRenderer');
                    renderer.resize(ww + expand, hh + expand);
                    return true;
                }

                renderer.resize(ww, hh);
                return false;
            }

            /**
             * Set the loading progress of the application. If called for the first time, display the progress bar.
             *
             * @param {number} [value] - Should be a value between 0 and 100. If 100, the progress bar will disappear.
             * @return {PIXIApp|Progress} The PixiApp object for chaining or the Progress object when the method was
             *     called without a parameter.
             */

        }, {
            key: 'progress',
            value: function progress(value) {

                if (typeof value === 'undefined') {
                    return this._progress;
                }

                this._progress.visible = true;
                this._progress.progress = value;

                return this;
            }

            /**
             * Opens a new Modal object binded to this app.
             *
             * @param {object} [opts] - An options object for the Modal object.
             * @return {Modal} Returns the Modal object.
             */

        }, {
            key: 'modal',
            value: function modal() {
                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                var modal = new Modal(Object.assign({ theme: this.theme }, opts, { app: this }));
                this.scene.addChild(modal);

                return modal;
            }

            /**
             * Opens a new Message object binded to this app.
             *
             * @param {object} [opts] - An options object for the Message object.
             * @return {Message} Returns the Message object.
             */

        }, {
            key: 'message',
            value: function message() {
                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                var message = new Message(Object.assign({ theme: this.theme }, opts, { app: this }));
                this.scene.addChild(message);

                return message;
            }

            /**
             * Loads sprites, e.g. images into the PIXI TextureCache.
             *
             * @param {string|string[]} resources - A String or an Array of urls to the images to load.
             * @param {function} [loaded] - A callback which is executed after all resources has been loaded.
             *     Receives one paramter, a Map of sprites where the key is the path of the image which was
             *     loaded and the value is the PIXI.Sprite object.
             * @param {object} [opts] - An options object for more specific parameters.
             * @param {boolean} [opts.resolutionDependent=true] - Should the sprites be loaded dependent of the
             *     renderer resolution?
             * @param {boolean} [opts.progress=false] - Should a progress bar display the loading status?
             * @return {PIXIApp} The PIXIApp object for chaining.
             */

        }, {
            key: 'loadSprites',
            value: function loadSprites(resources) {
                var _this95 = this;

                var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                var _ref31 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref31$resolutionDepe = _ref31.resolutionDependent,
                    resolutionDependent = _ref31$resolutionDepe === undefined ? true : _ref31$resolutionDepe,
                    _ref31$progress = _ref31.progress,
                    progress = _ref31$progress === undefined ? false : _ref31$progress;

                this.loadTextures(resources, function (textures) {

                    var sprites = new Map();

                    var _iteratorNormalCompletion54 = true;
                    var _didIteratorError54 = false;
                    var _iteratorError54 = undefined;

                    try {
                        for (var _iterator54 = textures[Symbol.iterator](), _step54; !(_iteratorNormalCompletion54 = (_step54 = _iterator54.next()).done); _iteratorNormalCompletion54 = true) {
                            var _step54$value = _slicedToArray(_step54.value, 2),
                                key = _step54$value[0],
                                texture = _step54$value[1];

                            sprites.set(key, new PIXI.Sprite(texture));
                        }
                    } catch (err) {
                        _didIteratorError54 = true;
                        _iteratorError54 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion54 && _iterator54.return) {
                                _iterator54.return();
                            }
                        } finally {
                            if (_didIteratorError54) {
                                throw _iteratorError54;
                            }
                        }
                    }

                    if (loaded) {
                        loaded.call(_this95, sprites);
                    }
                }, { resolutionDependent: resolutionDependent, progress: progress });

                return this;
            }

            /**
             * Loads textures, e.g. images into the PIXI TextureCache.
             *
             * @param {string|string[]} resources - A String or an Array of urls to the images to load.
             * @param {function} [loaded] - A callback which is executed after all resources has been loaded.
             *     Receives one paramter, a Map of sprites where the key is the path of the image which was
             *     loaded and the value is the PIXI.Sprite object.
             * @param {object} [opts] - An options object for more specific parameters.
             * @param {boolean} [opts.resolutionDependent=true] - Should the textures be loaded dependent of the
             *     renderer resolution?
             * @param {boolean} [opts.progress=false] - Should a progress bar display the loading status?
             * @return {PIXIApp} The PIXIApp object for chaining.
             */

        }, {
            key: 'loadTextures',
            value: function loadTextures(resources) {
                var _this96 = this;

                var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                var _ref32 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref32$resolutionDepe = _ref32.resolutionDependent,
                    resolutionDependent = _ref32$resolutionDepe === undefined ? true : _ref32$resolutionDepe,
                    _ref32$progress = _ref32.progress,
                    progress = _ref32$progress === undefined ? false : _ref32$progress;

                if (!Array.isArray(resources)) {
                    resources = [resources];
                }

                var loader = this.loader;

                var _iteratorNormalCompletion55 = true;
                var _didIteratorError55 = false;
                var _iteratorError55 = undefined;

                try {
                    for (var _iterator55 = resources[Symbol.iterator](), _step55; !(_iteratorNormalCompletion55 = (_step55 = _iterator55.next()).done); _iteratorNormalCompletion55 = true) {
                        var resource = _step55.value;


                        if (!loader.resources[resource]) {

                            if (resolutionDependent) {
                                var resolution = Math.round(this.renderer.resolution);
                                switch (resolution) {
                                    case 2:
                                        loader.add(resource, resource.replace(/\.([^.]*)$/, '@2x.$1'));
                                        break;
                                    case 3:
                                        loader.add(resource, resource.replace(/\.([^.]*)$/, '@3x.$1'));
                                        break;
                                    default:
                                        loader.add(resource);
                                        break;
                                }
                            } else {
                                loader.add(resource);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError55 = true;
                    _iteratorError55 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion55 && _iterator55.return) {
                            _iterator55.return();
                        }
                    } finally {
                        if (_didIteratorError55) {
                            throw _iteratorError55;
                        }
                    }
                }

                if (progress) {
                    loader.on('progress', function (e) {
                        _this96.progress(e.progress);
                    });
                }

                loader.load(function (loader, resources) {
                    var textures = new Map();

                    for (var key in resources) {
                        textures.set(key, resources[key].texture);
                    }

                    if (loaded) {
                        loaded.call(_this96, textures);
                    }
                });

                return this;
            }

            /**
             * Queries the GraphQL endpoint.
             *
             * @param {string} [query] - The GraphQL query string.
             * @param {object} [opts={}] - An options object. The following options can be set:
             *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query
             * @return {Promise} Returns a Promise which is either resolved with the resulting data or
             *     rejected with an error.
             */

        }, {
            key: 'query',
            value: function query(_query) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


                if (typeof _query === 'string') {
                    opts = Object.assign({}, opts, { query: _query });
                } else {
                    opts = Object.assign({}, _query);
                }

                opts.query = opts.query.trim();

                if (!opts.query.startsWith('query')) {
                    if (opts.query.startsWith('{')) {
                        opts.query = 'query ' + opts.query;
                    } else {
                        opts.query = 'query {' + opts.query + '}';
                    }
                }

                opts.query = gql(opts.query);

                return this.apolloClient.query(opts);
            }

            /**
             * Mutate the GraphQL endpoint.
             *
             * @param {string} [mutation] - The GraphQL mutation string.
             * @param {object} [opts={}] - An options object. The following options can be set:
             *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.mutate
             * @return {Promise} Returns a Promise which is either resolved with the resulting data or
             *     rejected with an error.
             */

        }, {
            key: 'mutate',
            value: function mutate(mutation) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


                if (typeof mutation === 'string') {
                    opts = Object.assign({}, opts, { mutation: mutation });
                } else {
                    opts = Object.assign({}, mutation);
                }

                opts.mutation = opts.mutation.trim();

                if (!opts.mutation.startsWith('mutation')) {
                    if (opts.mutation.startsWith('{')) {
                        opts.mutation = 'mutation ' + opts.mutation;
                    } else {
                        opts.mutation = 'mutation {' + opts.mutation + '}';
                    }
                }

                opts.mutation = gql(opts.mutation);

                return this.apolloClient.mutate(opts);
            }

            /**
             * Subscribe the GraphQL endpoint.
             *
             * @param {string} [subscription] - The GraphQL subscription.
             * @param {object} [opts={}] - An options object. The following options can be set:
             *     http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query
             * @return {Promise} Returns a Promise which is either resolved with the resulting data or
             *     rejected with an error.
             */

        }, {
            key: 'subscribe',
            value: function subscribe(subscription) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


                if (typeof subscription === 'string') {
                    opts = Object.assign({}, opts, { subscription: subscription });
                } else {
                    opts = Object.assign({}, subscription);
                }

                opts.subscription = opts.subscription.trim();

                if (!opts.subscription.startsWith('subscription')) {
                    if (opts.subscription.startsWith('{')) {
                        opts.subscription = 'subscription ' + opts.subscription;
                    } else {
                        opts.subscription = 'subscription {' + opts.subscription + '}';
                    }
                }

                opts.query = gql(opts.subscription);

                delete opts.subscription;

                return this.apolloClient.subscribe(opts);
            }
        }, {
            key: 'size',
            get: function get() {
                return { width: this.width, height: this.height };
            }

            /**
             * Returns the center of the renderer as an object with the keys x and y.
             *
             * @readonly
             * @member {object}
             */

        }, {
            key: 'center',
            get: function get() {
                return { x: this.width / 2, y: this.height / 2 };
            }
        }]);

        return PIXIApp;
    }(PIXI.Application);

    /**
     * The class fpsdisplay shows in the upper left corner
     * of the renderer the current image refresh rate.
     *
     * @private
     * @class
     * @extends PIXI.Graphics
     * @see {@link http://pixijs.download/dev/docs/PIXI.Graphics.html|PIXI.Graphics}
     */


    var FpsDisplay = function (_PIXI$Graphics6) {
        _inherits(FpsDisplay, _PIXI$Graphics6);

        /**
         * Creates an instance of a FpsDisplay.
         *
         * @constructor
         * @param {PIXIApp} app - The PIXIApp where the frames per second should be displayed.
         */
        function FpsDisplay(app) {
            _classCallCheck(this, FpsDisplay);

            var _this97 = _possibleConstructorReturn(this, (FpsDisplay.__proto__ || Object.getPrototypeOf(FpsDisplay)).call(this));

            _this97.app = app;

            _this97.lineStyle(3, 0x434f4f, 1).beginFill(0x434f4f, .6).drawRoundedRect(0, 0, 68, 32, 5).endFill().position.set(20, 20);

            _this97.text = new PIXI.Text(_this97.fps, new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#f6f6f6',
                stroke: '#434f4f',
                strokeThickness: 3
            }));
            _this97.text.position.set(6, 6);

            _this97.addChild(_this97.text);

            _this97.refreshFps();

            window.setInterval(_this97.refreshFps.bind(_this97), 1000);
            return _this97;
        }

        /**
         * Refreshes fps numer.
         *
         * @return {PIXIApp} Returns the PIXIApp object for chaining.
         */


        _createClass(FpsDisplay, [{
            key: 'refreshFps',
            value: function refreshFps() {
                this.text.text = this.app.ticker.FPS.toFixed(1) + ' fps';

                return this;
            }
        }]);

        return FpsDisplay;
    }(PIXI.Graphics);

    var EpochalApp = function (_PIXIApp) {
        _inherits(EpochalApp, _PIXIApp);

        function EpochalApp() {
            _classCallCheck(this, EpochalApp);

            return _possibleConstructorReturn(this, (EpochalApp.__proto__ || Object.getPrototypeOf(EpochalApp)).apply(this, arguments));
        }

        _createClass(EpochalApp, [{
            key: 'sceneFactory',
            value: function sceneFactory() {
                return new Scene();
            }
        }, {
            key: 'setup',
            value: function setup(data, domScatterContainer) {
                window.app = this; // Make the app a global variable

                _get(EpochalApp.prototype.__proto__ || Object.getPrototypeOf(EpochalApp.prototype), 'setup', this).call(this);
                this.audio = null;
                this.allData = [];
                this.wantedThumbHeight = 66.0;
                this.audioRef = null;
                this.pictures = new Pictures();
                this.orient = this.orientation();

                this.overview = new Overview();
                this.timeline = new Timeline();
                this.mapview = new MapView();
                this.cat1View = new CategoryView();
                this.cat1View.init('./Gattung.png', './positions1.txt', 'category1.xml');
                this.cat2View = new CategoryView();
                this.cat2View.init('./Epochen.png', './positions2.txt', 'category2.xml');
                this.cat3View = new CategoryView();
                this.cat3View.init('./Herkunft.png', './positions3.txt', 'category3.xml');
                this.cat4View = new CategoryView();
                this.cat4View.init('./Thematik.png', './positions4.txt', 'category4.xml');

                this.views = [this.overview, this.timeline, this.cat1View, this.cat2View, this.cat3View, this.cat4View];
                this.currentView = this.views[0];
                this.loadedThumbs = 0;
                this.allData = data;
                this.scene.setup(this);
                this.timebar = new TimeScrollbar();
                this.stage.addChild(this.timebar);
                this.preloadImages(); // preloadImages calls the other setup methods

                //init logger
                try {
                    this.setupLogger();
                } catch (e) {
                    console.warn('Cannot setup logger: ' + e.message);
                }
                //init save logs on keypress
                document.addEventListener('keydown', function (e) {
                    this.handleKeyDown(e);
                }.bind(this), false);
                //init save logs on touch hold on header
                this.header = document.getElementsByClassName('epochal').item(0);
                //console.log('header extracted with name:', this.header.name)
                this.headerTouchListener = this.headerTouchChanged.bind(this);
                this.header.addEventListener('touchstart', function (e) {
                    this.headerTouchStart(e);
                }.bind(this), false);

                this.domScatterContainer = domScatterContainer;

                window.onbeforeunload = function (e) {
                    var dialog = 'Wirklich beenden?';
                    e.returnValue = dialog;
                    return dialog;
                };

                window.document.addEventListener('mousedown', this.closeOpenCards.bind(this), true);
                window.document.addEventListener('touchstart', this.closeOpenCards.bind(this), true);

                //setup active thumbnail
                this.activeThumbID = -1;
                this.setupSocket();

                console.log('app.setup', app.width, app.height);
            }
        }, {
            key: 'closeOpenCards',
            value: function closeOpenCards(event) {
                var targetClass = $(event.target).attr('class');
                var targetId = $(event.target).attr('id');
                if (targetId == 'canvas') {
                    console.log('closing current picture because canvas was clicked');
                    this.pictures.removeAll();
                }
            }
        }, {
            key: 'handleKeyDown',
            value: function handleKeyDown(event) {
                var keyName = event.key;
                if ( /*event.ctrlKey &&*/keyName == 's') {
                    var useridRetrieval = confirm('Save user logs?');
                    if (useridRetrieval) this.reportingCSVActionlog();
                }
            }
        }, {
            key: 'headerTouchStart',
            value: function headerTouchStart(event) {
                this.logFileTimer = setTimeout(this.headerLongTouch.bind(this), 3000);

                this.header.addEventListener('touchend', this.headerTouchListener, false);
                this.header.addEventListener('touchmove', this.headerTouchListener, false);
            }
        }, {
            key: 'headerTouchChanged',
            value: function headerTouchChanged(event) {
                clearTimeout(this.logFileTimer);

                this.header.removeEventListener('touchend', this.headerTouchListener);
                this.header.removeEventListener('touchmove', this.headerTouchListener);

                //console.log('long touch cancelled')
            }
        }, {
            key: 'headerLongTouch',
            value: function headerLongTouch() {
                var useridRetrieval = confirm('Save user logs?');
                if (useridRetrieval) this.reportingCSVActionlog();

                //window.open('data:attachment/csv;charset=utf-8,' + encodeURI('hallo'))

                //console.log('loooong touch detected')
            }
        }, {
            key: 'setupLogger',
            value: function setupLogger() {
                this.userid = prompt('Please enter your name', 'XYZ00');
                console.log('logger is initiated for user', this.userid);
                this.runid = 1;
                this.studyid = 'eyevisit';
                this.pageid = 'ÜBERSICHT';
                var date = new Date();
                this.startTime = date.getTime();

                this.logger = new LocalLogger();
                this.logger.init();
            }
        }, {
            key: 'setupSocket',
            value: function setupSocket() {
                var _this99 = this;

                console.log('setting up socket.io');

                this.socket = typeof io != 'undefined' ? io('http://localhost:8081') : null;

                this.socket.on('welcome', function (data) {
                    console.log('server says hi', data);
                });

                this.socket.on('update', function (data) {
                    console.log('socket update received', data);
                    var updatedThumbID = data;
                    _this99.pictures.removeAll();
                    _this99.updateActiveThumbID(updatedThumbID);

                    //logging
                    _this99.log('sync from server', { id: updatedThumbID });
                });
            }
        }, {
            key: 'toggleAudio',
            value: function toggleAudio(d) {
                if (this.audioRef == d.ref) {
                    TweenMax.to(this.audio, 0.5, { visibility: 'hidden' });
                    this.audio.src = null;
                    this.audioRef = null;
                } else {
                    TweenMax.to(this.audio, 0.5, { opacity: 1, visibility: 'visible' });
                    this.audio.src = d.audioURL;
                    this.audio.play();
                    this.audioRef = d.ref;
                }
            }
        }, {
            key: 'resizeStage',
            value: function resizeStage(w, h) {
                console.log('resizeStage', w, h);
                this.scene.hitArea = new PIXI.Rectangle(0, 0, w, h);
            }
        }, {
            key: 'preloadImages',
            value: function preloadImages() {
                var prefix = './cards/';
                var loader = PIXI.loader;
                this.allData.forEach(function (d) {
                    // UO: Disable audio for the moment

                    d.audio = null;
                    d.ref = d.name.split(' ')[0];
                    //d.thumbURL =  prefix + d.ref + '.thumb.png'
                    //d.pictureURL = prefix + d.ref + '.jpg'
                    d.thumbURL = prefix + d.ref + '/' + d.ref + '.thumb.png';
                    d.pictureURL = prefix + d.ref + '/' + d.ref + '.jpeg';
                    //d.infoURL = prefix + 'exponat' + parseInt(d.ref) + '.pdf'

                    //d.infoURL = '../../var/eyevisit/' + d.ref + '/' + d.ref + '.xml'
                    d.infoURL = './cards/' + d.ref + '/' + d.ref + '.xml';
                    console.log('d.infoURL', d.infoURL);
                    d.audioURL = prefix + d.audio;
                    loader.add(d.ref, d.thumbURL);

                    // UO: Preload images into cache
                    var image = document.createElement('img');
                    image.onload = function (e) {
                        console.log('Preloaded ' + d.pictureURL);
                    };
                    image.src = d.pictureURL;
                });
                loader.once('complete', this.thumbsLoaded.bind(this));
                loader.load();
            }
        }, {
            key: 'thumbnailSelected',
            value: function thumbnailSelected(event) {
                //console.log('thumbnail selected ----> calling show()')

                //disable interaction until image is properly loaded
                this.allData.forEach(function (d) {
                    d.thumbnail.click = null;
                    d.thumbnail.tap = null;
                }.bind(this));

                var d = event.target.data;

                //if (d.audio) {
                //    this.toggleAudio(d)
                //}

                this.pictures.show(event, d);

                console.log('opening image', d.ref);

                //update local and remote thumbnail selection
                this.socket.emit('update', d.ref);
                this.updateActiveThumbID(d.ref);

                //logging
                this.log('image opened', { id: d.ref });
            }
        }, {
            key: 'updateActiveThumbID',
            value: function updateActiveThumbID(id) {
                this.activeThumbID = id;

                this.allData.forEach(function (d) {
                    if (d.ref == id) {
                        d.thumbnail.filters = [new GlowFilter(10, 0, 1, 0xFF0000, 0.5), new OutlineFilter(9, 0xFF0000)];
                    } else {
                        d.thumbnail.filters = [];
                    }
                });
            }
        }, {
            key: 'resetActiveThumbID',
            value: function resetActiveThumbID() {
                this.socket.emit('update', -1);
                this.updateActiveThumbID(-1);
            }
        }, {
            key: 'imageLoaded',
            value: function imageLoaded() {
                //console.log('picture.show completed ----> re-enable interaction')

                //re-enable interaction when image is properly loaded
                this.allData.forEach(function (d) {
                    d.thumbnail.click = this.thumbnailSelected.bind(this);
                    d.thumbnail.tap = this.thumbnailSelected.bind(this);
                }.bind(this));
            }
        }, {
            key: 'addThumbnail',
            value: function addThumbnail(d) {
                var texture = PIXI.loader.resources[d.ref].texture;
                var sprite = new PIXI.Sprite(texture);
                sprite.interactive = true;
                sprite.data = d;
                this.scene.addChild(sprite);
                sprite.click = this.thumbnailSelected.bind(this);
                sprite.tap = this.thumbnailSelected.bind(this);
                // sprite.alpha = (d.audio) ? 1.0 : 0.5
                return sprite;
            }
        }, {
            key: 'thumbsLoaded',
            value: function thumbsLoaded() {
                this.allData.forEach(function (d) {
                    d.thumbnail = this.addThumbnail(d);
                }.bind(this));
                this.prepareData();
                this.draw();
            }
        }, {
            key: 'prepareData',
            value: function prepareData() {
                var size = this.size;
                var w = size.width;
                var h = size.height - 400;
                var hh = this.wantedThumbHeight;
                var total = w * h * 0.75;
                var sum = 0;
                this.allData.forEach(function (d) {
                    d.mapX = d.x;
                    d.mapY = d.y;
                    var ww = d.thumbnail.width * (hh / d.thumbnail.height) + 1;
                    sum += ww * hh;
                }.bind(this));
                this.wantedThumbHeight *= Math.sqrt(total) / Math.sqrt(sum);

                this.allData.forEach(function (d) {
                    d.scaledHeight = hh;
                    d.scaledWidth = d.thumbnail.width * (hh / d.thumbnail.height) + 1;
                });
            }
        }, {
            key: 'placeThumbs',
            value: function placeThumbs() {
                this.allData.forEach(function (d) {
                    d.thumbnail.x = d.x;
                    d.thumbnail.y = d.y;
                    d.thumbnail.width = d.width;
                    d.thumbnail.height = d.height;
                });
            }
        }, {
            key: 'animateThumbs',
            value: function animateThumbs() {
                this.allData.forEach(function (d) {
                    TweenLite.to(d.thumbnail, 0.5, {
                        x: d.x,
                        y: d.y,
                        width: d.width,
                        height: d.height
                    });
                });
            }
        }, {
            key: 'layout',
            value: function layout(width, height) {
                if (this.currentView) this.currentView.layout(width, height);
                if (this.allData) this.placeThumbs(width, height);
            }
        }, {
            key: 'selectMenuItem',
            value: function selectMenuItem(event) {
                var item = event.target;
                var tmpView = this.currentView;

                if (item.innerHTML == 'ÜBERSICHT') {
                    tmpView = this.views[0];
                } else if (item.innerHTML == 'ZEITACHSE') {
                    tmpView = this.views[1];
                } else if (item.innerHTML == 'GATTUNG') {
                    tmpView = this.views[2];
                } else if (item.innerHTML == 'EPOCHEN') {
                    tmpView = this.views[3];
                } else if (item.innerHTML == 'HERKUNFT') {
                    tmpView = this.views[4];
                } else if (item.innerHTML == 'THEMATIK') {
                    tmpView = this.views[5];
                } else {
                    return;
                }

                if (this.currentView) this.currentView.clear();
                d3.selectAll('.menuitem').classed('selected', false);
                d3.select(event.target).classed('selected', true);

                this.currentView = tmpView;

                this.currentView.layout(app.width, app.height);
                this.currentView.adjust();
                this.animateThumbs();

                //logging        
                this.log('view opened', { id: item.innerHTML });

                this.pageid = item.innerHTML;
            }
        }, {
            key: 'log',
            value: function log(action, data) {
                var date = new Date();
                var currentTime = date.getTime() - this.startTime;
                this.logger.logAction(this.studyid, this.runid, this.userid, 0, this.pageid, date.toISOString(), currentTime, action, data);
            }
        }, {
            key: 'reportingCSVActionlog',
            value: function reportingCSVActionlog() {
                var data = [['study', 'run', 'user', 'pagecounter', 'page', 'timestamp', 'elapsedtime', 'action']];
                var datafields = new Set();
                console.log('csvactionlog reporting for eyevisit started');
                var trans = this.logger.db.transaction(['log'], 'readonly');
                var store = trans.objectStore('log');
                var index = store.index('log_index1');
                var request = index.openCursor(IDBKeyRange.only(this.studyid));
                request.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        var logdata = cursor.value;
                        for (var key in logdata.data) {
                            datafields.add(key);
                        }
                        cursor.continue();
                    } else {
                        var df = Array.from(datafields);
                        df.sort();
                        data[0] = data[0].concat(df);
                        var _trans3 = this.logger.db.transaction(['log'], 'readonly');
                        var _store8 = _trans3.objectStore('log');
                        var _index = _store8.index('log_index1');
                        var _request3 = _index.openCursor(IDBKeyRange.only(this.studyid));
                        _request3.onsuccess = function (evt) {
                            var cursor = evt.target.result;
                            if (cursor) {
                                var dbitem = cursor.value;
                                var dataset = [dbitem.studyid, dbitem.runid, dbitem.userid, dbitem.pagecounter, dbitem.pageid, dbitem.timestamp, dbitem.elapsedtime, dbitem.action];
                                var _iteratorNormalCompletion56 = true;
                                var _didIteratorError56 = false;
                                var _iteratorError56 = undefined;

                                try {
                                    for (var _iterator56 = df[Symbol.iterator](), _step56; !(_iteratorNormalCompletion56 = (_step56 = _iterator56.next()).done); _iteratorNormalCompletion56 = true) {
                                        var dfitem = _step56.value;

                                        if (dbitem.data.hasOwnProperty(dfitem)) {
                                            dataset.push(dbitem.data[dfitem]);
                                        } else {
                                            dataset.push('');
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError56 = true;
                                    _iteratorError56 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion56 && _iterator56.return) {
                                            _iterator56.return();
                                        }
                                    } finally {
                                        if (_didIteratorError56) {
                                            throw _iteratorError56;
                                        }
                                    }
                                }

                                data.push(dataset);
                                cursor.continue();
                            } else {
                                console.log(data.length - 1 + ' datasets created, exporting to csv');
                                this.exportToCsv(this.studyid + '_actionlog.csv', data, 'csvactionlog');
                            }
                        }.bind(this);
                    }
                }.bind(this);
            }
        }, {
            key: 'exportToCsv',
            value: function exportToCsv(filename, rows, mode) {
                var processRow = function processRow(row) {
                    var newline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';

                    var finalVal = '';
                    for (var j = 0; j < row.length; j++) {
                        var innerValue = row[j] === null ? '' : row[j].toString();
                        if (row[j] instanceof Date) {
                            innerValue = row[j].toLocaleString();
                        }
                        var result = innerValue.replace(/"/g, '""');
                        if (result.search(/("|;|\n)/g) >= 0) result = '"' + result + '"';
                        if (j > 0) finalVal += ';';
                        finalVal += result;
                    }
                    return finalVal + newline;
                };

                var csvFile = '';
                for (var i = 0; i < rows.length; i++) {
                    csvFile += processRow(rows[i]);
                }

                var csvData = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                if (navigator.msSaveBlob) {
                    // IE 10+
                    navigator.msSaveBlob(csvData, filename);
                } else {
                    var supportsDownloadAttribute = 'download' in document.createElement('a');
                    if (supportsDownloadAttribute) {
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(csvData);
                        link.setAttribute('download', filename);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        console.log('trying to save without support of download attribute');

                        //document.getElementById("log_overlay").style.display = "block";

                        /*let link = document.createElement('a');
                        link.onclick = function(e) {
                            window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csvFile))
                        }
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);*/

                        //window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csvFile))
                        saveAs(csvData, filename);
                    }
                }
            }
        }]);

        return EpochalApp;
    }(PIXIApp);

    /*!
     * @pixi/filter-glow - v2.3.0
     * Compiled Wed, 29 Nov 2017 16:44:42 UTC
     *
     * pixi-filters is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */


    var vertex$9 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
    var fragment$9 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";
    var GlowFilter = function (o) {
        function n(n, t, r, e, l) {
            void 0 === n && (n = 10), void 0 === t && (t = 4), void 0 === r && (r = 0), void 0 === e && (e = 16777215), void 0 === l && (l = .1), o.call(this, vertex$9, fragment$9.replace(/%QUALITY_DIST%/gi, "" + (1 / l / n).toFixed(7)).replace(/%DIST%/gi, "" + n.toFixed(7))), this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]), this.distance = n, this.color = e, this.outerStrength = t, this.innerStrength = r;
        }o && (n.__proto__ = o), (n.prototype = Object.create(o && o.prototype)).constructor = n;var t = { color: { configurable: !0 }, distance: { configurable: !0 }, outerStrength: { configurable: !0 }, innerStrength: { configurable: !0 } };return t.color.get = function () {
            return PIXI.utils.rgb2hex(this.uniforms.glowColor);
        }, t.color.set = function (o) {
            PIXI.utils.hex2rgb(o, this.uniforms.glowColor);
        }, t.distance.get = function () {
            return this.uniforms.distance;
        }, t.distance.set = function (o) {
            this.uniforms.distance = o;
        }, t.outerStrength.get = function () {
            return this.uniforms.outerStrength;
        }, t.outerStrength.set = function (o) {
            this.uniforms.outerStrength = o;
        }, t.innerStrength.get = function () {
            return this.uniforms.innerStrength;
        }, t.innerStrength.set = function (o) {
            this.uniforms.innerStrength = o;
        }, Object.defineProperties(n.prototype, t), n;
    }(PIXI.Filter);PIXI.filters.GlowFilter = GlowFilter;

    /*!
     * @pixi/filter-outline - v2.3.0
     * Compiled Wed, 29 Nov 2017 16:44:44 UTC
     *
     * pixi-filters is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    var vertex$11 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
    var fragment$10 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
    var OutlineFilter = function (e) {
        function o(o, r) {
            void 0 === o && (o = 1), void 0 === r && (r = 0), e.call(this, vertex$11, fragment$10.replace(/%THICKNESS%/gi, (1 / o).toFixed(7))), this.thickness = o, this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]), this.color = r;
        }e && (o.__proto__ = e), (o.prototype = Object.create(e && e.prototype)).constructor = o;var r = { color: { configurable: !0 }, thickness: { configurable: !0 } };return r.color.get = function () {
            return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
        }, r.color.set = function (e) {
            PIXI.utils.hex2rgb(e, this.uniforms.outlineColor);
        }, r.thickness.get = function () {
            return this.uniforms.thickness;
        }, r.thickness.set = function (e) {
            this.uniforms.thickness = e;
        }, Object.defineProperties(o.prototype, r), o;
    }(PIXI.Filter);PIXI.filters.OutlineFilter = OutlineFilter;

    var domScatterContainer = new DOMScatterContainer(document.body);
    var app$1 = new EpochalApp({ view: canvas, monkeyPatchMapping: false });

    app$1.setup(data, domScatterContainer);
    app$1.run();
})();
