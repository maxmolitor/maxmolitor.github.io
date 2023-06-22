
class Bootstrap extends Object {

    static get isSafari() {
        return /Safari/.test(navigator.userAgent) && /Apple Computer, Inc/.test(navigator.vendor)
    }

    static get isModernSafari() {
        if (!this.isSafari)
            return false
        let agent = navigator.appVersion
        let offset = agent.indexOf('Version')
        if (offset!= -1) {
            let version = parseFloat(agent.substring(offset + 8))
            return version >= 10.1
        }
        return false
    }

    static get isChrome() {
        const isChromium = window.chrome
        const winNav = window.navigator
        const vendorName = winNav.vendor
        const isOpera = winNav.userAgent.indexOf('OPR') > -1
        const isIEedge = winNav.userAgent.indexOf('Edge') > -1
        const isIOSChrome = winNav.userAgent.match('CriOS')

        if (isIOSChrome) {
            return true
        } else if (isChromium !== null && isChromium !== undefined && vendorName === 'Google Inc.' && isOpera == false && isIEedge == false) {
            return true
        } else {
            return false
        }
    }

    static get isModernChrome() {
        if (!this.isChrome) {
            return false
        }
        const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
        const version = raw ? parseInt(raw[2], 10) : false
        return version > 64
    }

    static get isFirefox() {

        if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
            return true
        }

        return false
    }

    static get isModernFirefox() {

        if (!this.isFirefox) {
            return false
        }

        const match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
        const version = match ? parseInt(match[1]) : 0

        return version > 58
    }

    static import(src, callback = null) {
        if (src.endsWith('babel.js')) {
            this.load(this.baseUrl + '/3rdparty/polyfills/babel-polyfill.js',
                () => {
                    this.load(src, null, null)
                },
                null)
        }
        else if (this.isModernSafari || this.isModernChrome || this.isModernFirefox) {
            this.load(src, callback)
        } else {
            this.load(this.baseUrl + '/3rdparty/systemjs/system.js', () => {
                SystemJS.config(this.systemjsConfig)
                SystemJS.import(src)
            }, 'script')
        }
    }

    static load(src, callback, type = 'module') {
        let script = document.createElement('script')
        if (type === 'module') {
            script.setAttribute('type', 'module')
            script.setAttribute('crossorigin', 'use-credentials')
        }
        script.onload = () => {
            if (callback) {
                callback.call(this, script)
            }
        }
        script.src = src
        document.head.appendChild(script)
    }

    static require(src) {
        console.log('Dummy require')
    }

    static get systemjsConfig() {

        const baseUrl = this.baseUrl

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
        }
    }

    static get baseUrl() {

        let baseUrl = './'
        let scripts = document.getElementsByTagName('script')

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i]
            const src = script.getAttribute('src')
            const re = /\/bootstrap(.babel)?\.js$/
            if (re.test(src)) {
                baseUrl = src.replace(re, '')
            }
        }

        return baseUrl
    }

    static renderFont(font = 'Open Sans') {
        for (let weight of [300, 400, 600, 700, 800]) {
            for (let style of ['normal', 'italic']) {
                let p = document.createElement('p')
                p.innerHTML = '.'
                document.body.appendChild(p)
                p.setAttribute('style', `font-family: '${font}'; font-weight: ${weight}; font-style: '${style}'; position: absolute; top: -10000px;`)
            }
        }
    }
}

window.Bootstrap = Bootstrap
