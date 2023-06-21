'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bootstrap = function (_Object) {
    _inherits(Bootstrap, _Object);

    function Bootstrap() {
        _classCallCheck(this, Bootstrap);

        return _possibleConstructorReturn(this, (Bootstrap.__proto__ || Object.getPrototypeOf(Bootstrap)).apply(this, arguments));
    }

    _createClass(Bootstrap, null, [{
        key: 'import',
        value: function _import(src) {
            var _this2 = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (src.endsWith('babel.js')) {
                this.load(this.baseUrl + '/3rdparty/polyfills/babel-polyfill.js', function () {
                    _this2.load(src, null, null);
                }, null);
            } else if (this.isModernSafari || this.isModernChrome) {
                this.load(src, callback);
            } else {
                this.load(this.baseUrl + '/3rdparty/systemjs/system.js', function () {
                    SystemJS.config(_this2.systemjsConfig);
                    SystemJS.import(src);
                }, 'script');
            }
        }
    }, {
        key: 'load',
        value: function load(src, callback) {
            var _this3 = this;

            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'module';

            var script = document.createElement('script');
            if (type === 'module') {
                script.setAttribute('type', 'module');
                script.setAttribute('crossorigin', 'use-credentials');
            }
            script.onload = function () {
                if (callback) {
                    callback.call(_this3, script);
                }
            };
            script.src = src;
            document.head.appendChild(script);
        }
    }, {
        key: 'require',
        value: function require(src) {
            console.log('Dummy require');
        }
    }, {
        key: 'renderFont',
        value: function renderFont() {
            var font = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Open Sans';
            var _arr = [300, 400, 600, 700, 800];

            for (var _i = 0; _i < _arr.length; _i++) {
                var weight = _arr[_i];var _arr2 = ['normal', 'italic'];

                for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                    var style = _arr2[_i2];
                    var p = document.createElement('p');
                    p.innerHTML = '.';
                    document.body.appendChild(p);
                    p.setAttribute('style', 'font-family: \'' + font + '\'; font-weight: ' + weight + '; font-style: \'' + style + '\'; position: absolute; top: -10000px;');
                }
            }
        }
    }, {
        key: 'isSafari',
        get: function get() {
            return (/Safari/.test(navigator.userAgent) && /Apple Computer, Inc/.test(navigator.vendor)
            );
        }
    }, {
        key: 'isModernSafari',
        get: function get() {
            if (!this.isSafari) return false;
            var agent = navigator.appVersion;
            var offset = agent.indexOf('Version');
            if (offset != -1) {
                var version = parseFloat(agent.substring(offset + 8));
                return version >= 10.1;
            }
            return false;
        }
    }, {
        key: 'isChrome',
        get: function get() {
            var isChromium = window.chrome;
            var winNav = window.navigator;
            var vendorName = winNav.vendor;
            var isOpera = winNav.userAgent.indexOf('OPR') > -1;
            var isIEedge = winNav.userAgent.indexOf('Edge') > -1;
            var isIOSChrome = winNav.userAgent.match('CriOS');

            if (isIOSChrome) {
                return true;
            } else if (isChromium !== null && isChromium !== undefined && vendorName === 'Google Inc.' && isOpera == false && isIEedge == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'isModernChrome',
        get: function get() {
            if (!this.isChrome) {
                return false;
            }
            var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            var version = raw ? parseInt(raw[2], 10) : false;
            return version > 62;
        }
    }, {
        key: 'systemjsConfig',
        get: function get() {

            var baseUrl = this.baseUrl;

            return {
                baseURL: baseUrl,
                map: {
                    'plugin-babel': baseUrl + '/3rdparty/systemjs/plugin-babel.js',
                    'systemjs-babel-build': baseUrl + '/3rdparty/systemjs/systemjs-babel-browser.js'
                },
                transpiler: 'plugin-babel',
                meta: {
                    '*.js': {
                        authorization: true,
                        babelOptions: {
                            es2015: false
                        }
                    }
                }
            };
        }
    }, {
        key: 'baseUrl',
        get: function get() {

            var baseUrl = './';
            var scripts = document.getElementsByTagName('script');

            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                var src = script.getAttribute('src');
                var re = /\/bootstrap(.babel)?\.js$/;
                if (re.test(src)) {
                    baseUrl = src.replace(re, '');
                }
            }

            return baseUrl;
        }
    }]);

    return Bootstrap;
}(Object);

window.Bootstrap = Bootstrap;