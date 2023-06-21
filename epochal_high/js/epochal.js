import Overview from './overview.js'
import {Timeline, TimeScrollbar} from './timeline.js'
import MapView from './mapview.js'
import CategoryView from './categoryView.js'
import LocalLogger from './iwm_loggerlocal.js'
import Pictures from './pictures.js'
import Scene from './scene.js'
import PIXIApp from '../lib/pixi/app.js'
//import {GlowFilter} from '../lib/3rdparty/pixi/pixi-filters.js'
import {ScatterContainer} from '../lib/pixi/scatter.js'

var HighlightElements=[];



export default class EpochalApp extends PIXIApp {
    sceneFactory() {
        return new Scene()
    }

    setup(data, domScatterContainer) {
        window.app = this // Make the app a global variable

        super.setup()
        
        this.audio = null
        this.allData = []
        this.wantedThumbHeight = 66.0
        this.audioRef = null
        this.pictures = new Pictures()
        this.orient = this.orientation()

        this.overview = new Overview()
        this.timeline = new Timeline()
        this.mapview = new MapView()
        this.cat1View = new CategoryView()
        this.cat1View.init('./Gattung.png', './positions1.txt', 'category1.xml')
        this.cat2View = new CategoryView()
        this.cat2View.init('./Epochen.png', './positions2.txt', 'category2.xml')
        this.cat3View = new CategoryView()
        this.cat3View.init(
            './Herkunft.png',
            './positions3.txt',
            'category3.xml'
        )
        this.cat4View = new CategoryView()
        this.cat4View.init(
            './Thematik.png',
            './positions4.txt',
            'category4.xml'
        )

        this.views = [
            this.overview,
            this.timeline,
            this.cat1View,
            this.cat2View,
            this.cat3View,
            this.cat4View
        ]
        this.currentView = this.views[0]
        this.loadedThumbs = 0
        this.allData = data
        this.scene.setup(this)
        this.timebar = new TimeScrollbar()
        this.stage.addChild(this.timebar)
        this.preloadImages() // preloadImages calls the other setup methods

        //i want to call updateHighlights() everytime the question change
        const nextButton = window.parent.document.getElementById("next")
        //const prevButton = window.parent.document.getElementById("previous")
        nextButton.addEventListener("click",updateHighlights.bind(this))
        //prevButton.addEventListener("click",updateHighlights.bind(this))

        


        //init logger
        try {
            this.setupLogger()
        } catch(e) {
            console.warn('Cannot setup logger: ' + e.message)
        }
        //init save logs on keypress
        document.addEventListener(
            'keydown',
            function(e) {
                this.handleKeyDown(e)
            }.bind(this),
            false
        )
        //init save logs on touch hold on header
        this.header = document.getElementsByClassName('epochal').item(0)
        //console.log('header extracted with name:', this.header.name)
        this.headerTouchListener = this.headerTouchChanged.bind(this)
        this.header.addEventListener(
            'touchstart',
            function(e) {
                this.headerTouchStart(e)
            }.bind(this),
            false
        )

        this.domScatterContainer = domScatterContainer

        window.onbeforeunload = function(e) {
            //var dialog = 'Wirklich beenden?'
            e.returnValue = dialog
            return dialog
        }

        window.document.addEventListener(
            'mousedown',
            this.closeOpenCards.bind(this),
            true
        )
        window.document.addEventListener(
            'touchstart',
            this.closeOpenCards.bind(this),
            true
        )


        //setup active thumbnail
        this.activeThumbID = -1
        //this.setupSocket() //pm: auskommentiert für reguläre non-socket Variante


        console.log('app.setup', app.width, app.height)
    }

    closeOpenCards(event) {
        let targetClass = $(event.target).attr('class')
        let targetId = $(event.target).attr('id')
        if (targetId == 'canvas') {
            console.log('closing current picture because canvas was clicked')
            this.pictures.removeAll()
        }

        
    }

    handleKeyDown(event) {
        const keyName = event.key
        if (/*event.ctrlKey &&*/ keyName == 's') {
            let useridRetrieval = confirm('Save user logs?')
            if (useridRetrieval) this.reportingCSVActionlog()
        }
    }

    headerTouchStart(event) {
        this.logFileTimer = setTimeout(this.headerLongTouch.bind(this), 3000)

        this.header.addEventListener(
            'touchend',
            this.headerTouchListener,
            false
        )
        this.header.addEventListener(
            'touchmove',
            this.headerTouchListener,
            false
        )
    }

    headerTouchChanged(event) {
        clearTimeout(this.logFileTimer)

        this.header.removeEventListener('touchend', this.headerTouchListener)
        this.header.removeEventListener('touchmove', this.headerTouchListener)

        //console.log('long touch cancelled')
    }

    headerLongTouch() {
        let useridRetrieval = confirm('Save user logs?')
        if (useridRetrieval) this.reportingCSVActionlog()

        //window.open('data:attachment/csv;charset=utf-8,' + encodeURI('hallo'))

        //console.log('loooong touch detected')
    }

    setupLogger() {
        //this.userid = prompt('Please enter your name', 'XYZ00')
        console.log('logger is initiated for user', this.userid)
        this.runid = 1
        this.studyid = 'eyevisit'
        this.pageid = 'ÜBERSICHT'
        let date = new Date()
        this.startTime = date.getTime()

        this.logger = new LocalLogger()
        this.logger.init()
    }

    setupSocket(){
        console.log('setting up socket.io')

        this.socket = (typeof io != 'undefined') ? io('http://localhost:8081') : null

        this.socket.on('welcome', data => {
            console.log('server says hi', data)
        })

        this.socket.on('update', data => {
            console.log('socket update received', data)
            let updatedThumbID = data
            this.pictures.removeAll()

            //commented out for the highlight condition
            //this.updateActiveThumbID(updatedThumbID)     
            
            //logging
            this.log('sync from server', {id: updatedThumbID})
        })
    }


    toggleAudio(d) {
        if (this.audioRef == d.ref) {
            TweenMax.to(this.audio, 0.5, {visibility: 'hidden'})
            this.audio.src = null
            this.audioRef = null
        } else {
            TweenMax.to(this.audio, 0.5, {opacity: 1, visibility: 'visible'})
            this.audio.src = d.audioURL
            this.audio.play()
            this.audioRef = d.ref
        }
    }

    resizeStage(w, h) {
        console.log('resizeStage', w, h)
        this.scene.hitArea = new PIXI.Rectangle(0, 0, w, h)
    }

    preloadImages() {
        
        let prefix = './cards/'
        let loader = PIXI.loader
        this.allData.forEach(function(d) {
            // UO: Disable audio for the moment

            d.audio = null
            d.ref = d.name.split(' ')[0]
            //d.thumbURL =  prefix + d.ref + '.thumb.png'
            //d.pictureURL = prefix + d.ref + '.jpg'
            d.thumbURL = prefix + d.ref + '/' + d.ref + '.thumb.png'
            d.pictureURL = prefix + d.ref + '/' + d.ref + '.jpeg'
            //d.infoURL = prefix + 'exponat' + parseInt(d.ref) + '.pdf'

            //d.infoURL = '../../var/eyevisit/' + d.ref + '/' + d.ref + '.xml'
            d.infoURL = './cards/' + d.ref + '/' + d.ref + '.xml'
            console.log('d.infoURL', d.infoURL)
            d.audioURL = prefix + d.audio
            loader.add(d.ref, d.thumbURL)

            // UO: Preload images into cache
            let image = document.createElement('img')
            image.onload = e => {
                console.log('Preloaded ' + d.pictureURL)
            }
            image.src = d.pictureURL
        })
        loader.once('complete', this.thumbsLoaded.bind(this))
        loader.load()
    }

    thumbnailSelected(event) {
        //console.log('thumbnail selected ----> calling show()')

        //disable interaction until image is properly loaded
        this.allData.forEach(
            function(d) {
                d.thumbnail.click = null
                d.thumbnail.tap = null
            }.bind(this)
        )

        let d = event.target.data

        //if (d.audio) {
        //    this.toggleAudio(d)
        //}

        this.pictures.show(event, d)

        console.log('opening image', d.ref)

        //update local and remote thumbnail selection
        //this.socket.emit('update', d.ref) //pm: auskommentiert für reguläre non-socket Variante
        
        //commented out for the highlight condition
        //this.updateActiveThumbID(d.ref)

        //logging
        this.log('image opened', {id: d.ref})
    }

    //do not call updateactivethumb id in highlight condition
    //every call of this function is commented out in the highlight condition
    updateActiveThumbID(id){
        this.activeThumbID = id
        console.log("id: "+id);
        
        this.allData.forEach(function(d) {
                //d.ref==id causes selected image to be highlighted

                if(d.ref == id){
                    d.thumbnail.filters = [
                        new GlowFilter(10, 0, 1, 0x00FF00, 0.5),
                        new OutlineFilter(9, 0x00FF00)
                    ]
                }
                else{
                    d.thumbnail.filters = []
    
                }
    
        })
        
        

    }

    //should read a text file with (path)
    readFile(path){
        const fs = require('fs')
        
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) throw err;

            return data;
        })
    }

    resetActiveThumbID(){
        //this.socket.emit('update', -1) //pm: auskommentiert für reguläre non-socket Variante
        
        //commented out for the highlight condition
        //this.updateActiveThumbID(-1)
    }

    imageLoaded() {
        //console.log('picture.show completed ----> re-enable interaction')

        //re-enable interaction when image is properly loaded
        this.allData.forEach(
            function(d) {
                d.thumbnail.click = this.thumbnailSelected.bind(this)
                d.thumbnail.tap = this.thumbnailSelected.bind(this)
            }.bind(this)
        )
    }

    addThumbnail(d) {
        let texture = PIXI.loader.resources[d.ref].texture
        let sprite = new PIXI.Sprite(texture)
        sprite.interactive = true
        sprite.data = d
        this.scene.addChild(sprite)
        sprite.click = this.thumbnailSelected.bind(this)
        sprite.tap = this.thumbnailSelected.bind(this)


        HighlightElements = window.parent.myQuestions[window.parent.currentQuestion].highlights;


        for(x=0;x<HighlightElements.length;x++){
            if(d.ref==HighlightElements[x]){
                sprite.filters=[new GlowFilter(10, 0, 1, 0x00FF00, 0.5),
                    new OutlineFilter(9, 0x00FF00)]
            }
        }
        
        // sprite.alpha = (d.audio) ? 1.0 : 0.5
        return sprite
    }

    thumbsLoaded() {
        this.allData.forEach(
            function(d) {
                d.thumbnail = this.addThumbnail(d)
            }.bind(this)
        )
        this.prepareData()
        this.draw()
    }

    prepareData() {
        let size = this.size
        let w = size.width
        let h = size.height - 400
        let hh = this.wantedThumbHeight
        let total = w * h * 0.75
        let sum = 0
        this.allData.forEach(
            function(d) {
                d.mapX = d.x
                d.mapY = d.y
                let ww = d.thumbnail.width * (hh / d.thumbnail.height) + 1
                sum += ww * hh
            }.bind(this)
        )
        this.wantedThumbHeight *= Math.sqrt(total) / Math.sqrt(sum)

        this.allData.forEach(function(d) {
            d.scaledHeight = hh
            d.scaledWidth = d.thumbnail.width * (hh / d.thumbnail.height) + 1
        })
    }

    placeThumbs() {
        this.allData.forEach(function(d) {
            d.thumbnail.x = d.x
            d.thumbnail.y = d.y
            d.thumbnail.width = d.width
            d.thumbnail.height = d.height
        })
    }

    animateThumbs() {
        this.allData.forEach(function(d) {
            TweenLite.to(d.thumbnail, 0.5, {
                x: d.x,
                y: d.y,
                width: d.width,
                height: d.height
            })
        })
    }

    layout(width, height) {
        if (this.currentView) this.currentView.layout(width, height)
        if (this.allData) this.placeThumbs(width, height)
    }

    selectMenuItem(event) {
        let item = event.target
        let tmpView = this.currentView
        
        if (item.innerHTML == 'ÜBERSICHT') {
            tmpView = this.views[0]
        } else if (item.innerHTML == 'ZEITACHSE') {
            tmpView = this.views[1]
        } else if (item.innerHTML == 'GATTUNG') {
            tmpView = this.views[2]
        } else if (item.innerHTML == 'EPOCHEN') {
            tmpView = this.views[3]
        } else if (item.innerHTML == 'HERKUNFT') {
            tmpView = this.views[4]
        } else if (item.innerHTML == 'THEMATIK') {
            tmpView = this.views[5]
        } else {
            return
        }

        if (this.currentView) this.currentView.clear()
        d3.selectAll('.menuitem').classed('selected', false)
        d3.select(event.target).classed('selected', true)

        this.currentView = tmpView

        this.currentView.layout(app.width, app.height)
        this.currentView.adjust()
        this.animateThumbs()

        //logging        
        this.log('view opened', {id: item.innerHTML})

        this.pageid = item.innerHTML
        
    }

    log(action, data) {
        let date = new Date()
        let currentTime = date.getTime() - this.startTime
        this.logger.logAction(
            this.studyid,
            this.runid,
            this.userid,
            0,
            this.pageid,
            date.toISOString(),
            currentTime,
            action,
            data
        )
    }

    reportingCSVActionlog() {
        let data = [
            [
                'study',
                'run',
                'user',
                'pagecounter',
                'page',
                'timestamp',
                'elapsedtime',
                'action'
            ]
        ]
        let datafields = new Set()
        console.log('csvactionlog reporting for eyevisit started')
        let trans = this.logger.db.transaction(['log'], 'readonly')
        let store = trans.objectStore('log')
        let index = store.index('log_index1')
        let request = index.openCursor(IDBKeyRange.only(this.studyid))
        request.onsuccess = function(evt) {
            let cursor = evt.target.result
            if (cursor) {
                let logdata = cursor.value
                for (let key in logdata.data) {
                    datafields.add(key)
                }
                cursor.continue()
            } else {
                let df = Array.from(datafields)
                df.sort()
                data[0] = data[0].concat(df)
                let trans = this.logger.db.transaction(['log'], 'readonly')
                let store = trans.objectStore('log')
                let index = store.index('log_index1')
                let request = index.openCursor(IDBKeyRange.only(this.studyid))
                request.onsuccess = function(evt) {
                    let cursor = evt.target.result
                    if (cursor) {
                        let dbitem = cursor.value
                        let dataset = [
                            dbitem.studyid,
                            dbitem.runid,
                            dbitem.userid,
                            dbitem.pagecounter,
                            dbitem.pageid,
                            dbitem.timestamp,
                            dbitem.elapsedtime,
                            dbitem.action
                        ]
                        for (let dfitem of df) {
                            if (dbitem.data.hasOwnProperty(dfitem)) {
                                dataset.push(dbitem.data[dfitem])
                            } else {
                                dataset.push('')
                            }
                        }
                        data.push(dataset)
                        cursor.continue()
                    } else {
                        console.log(
                            `${data.length -
                                1} datasets created, exporting to csv`
                        )
                        this.exportToCsv(
                            `${this.studyid}_actionlog.csv`,
                            data,
                            'csvactionlog'
                        )
                    }
                }.bind(this)
            }
        }.bind(this)
    }

    exportToCsv(filename, rows, mode) {
        let processRow = function(row, newline = '\n') {
            let finalVal = ''
            for (let j = 0; j < row.length; j++) {
                let innerValue = row[j] === null ? '' : row[j].toString()
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString()
                }
                let result = innerValue.replace(/"/g, '""')
                if (result.search(/("|;|\n)/g) >= 0) result = '"' + result + '"'
                if (j > 0) finalVal += ';'
                finalVal += result
            }
            return finalVal + newline
        }

        let csvFile = ''
        for (let i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i])
        }

        let csvData = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'})
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(csvData, filename)
        } else {
            let supportsDownloadAttribute =
                'download' in document.createElement('a')
            if (supportsDownloadAttribute) {
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(csvData)
                link.setAttribute('download', filename)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                console.log(
                    'trying to save without support of download attribute'
                )

                //document.getElementById("log_overlay").style.display = "block";

                /*let link = document.createElement('a');
                link.onclick = function(e) {
                    window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csvFile))
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);*/

                //window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csvFile))
                saveAs(csvData, filename)
            }
        }
    }
}

//make variable value change listener
function check1(oldvalue) {
    undefined === oldvalue && (oldvalue = value);
    clearcheck = setInterval(repeatcheck,500,oldvalue);
    function repeatcheck(oldvalue) {
        if (value !== oldvalue) {
            // do something
            clearInterval(clearcheck);
            console.log("check1 value changed from " +
                oldvalue + " to " + value);
        }
    }
}

//Highlight function, currently not working
function updateHighlights(){

    HighlightElements = window.parent.myQuestions[window.parent.currentQuestion].highlights;
    console.log(HighlightElements[0]);

    this.allData.forEach(function(d) {
            //d.ref==id causes selected image to be highlighted
            
            if(HighlightElements.indexOf(d.ref) != -1){
                d.thumbnail.filters = [
                    new GlowFilter(10, 0, 1, 0x00FF00, 0.5),
                    new OutlineFilter(9, 0x00FF00)

                ]
            }
            else{
                d.thumbnail.filters = []

            }

    })
 
    // //cycle thru all highlightable elements
    // for(x=0;x<HighlightElements.length;x++){
        
    //     console.log("x:"+x);
    //     //cycle thru all elements
    //     //highlight elem that corrensponds to one of the elems in the tobehighlighted-list
    //     window.app.data.forEach(function(d) {
    //         //d.ref==id causes selected image to be highlighted
    //         if(d.ref == HighlightElements[x]){
    //             console.log("d.ref:"+d.ref);
    //             d.sprite.filters=[new GlowFilter(10, 0, 1, 0x00FF00, 0.5),
    //                 new OutlineFilter(9, 0x00FF00)]
    //         }
    //         else{

    //         }
    //     })

    // }
    
    
}

function outCry(){
    console.log("cry");
}

/*!
 * @pixi/filter-glow - v2.3.0
 * Compiled Wed, 29 Nov 2017 16:44:42 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$9="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$9="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";
var GlowFilter=function(o){function n(n,t,r,e,l){void 0===n&&(n=10),void 0===t&&(t=4),void 0===r&&(r=0),void 0===e&&(e=16777215),void 0===l&&(l=.1),o.call(this,vertex$9,fragment$9.replace(/%QUALITY_DIST%/gi,""+(1/l/n).toFixed(7)).replace(/%DIST%/gi,""+n.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=n,this.color=e,this.outerStrength=t,this.innerStrength=r;}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var t={color:{configurable:!0},distance:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0}};return t.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},t.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor);},t.distance.get=function(){return this.uniforms.distance},t.distance.set=function(o){this.uniforms.distance=o;},t.outerStrength.get=function(){return this.uniforms.outerStrength},t.outerStrength.set=function(o){this.uniforms.outerStrength=o;},t.innerStrength.get=function(){return this.uniforms.innerStrength},t.innerStrength.set=function(o){this.uniforms.innerStrength=o;},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.GlowFilter=GlowFilter;

/*!
 * @pixi/filter-outline - v2.3.0
 * Compiled Wed, 29 Nov 2017 16:44:44 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$11="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$10="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
var OutlineFilter=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=0),e.call(this,vertex$11,fragment$10.replace(/%THICKNESS%/gi,(1/o).toFixed(7))),this.thickness=o,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r;}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={color:{configurable:!0},thickness:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor);},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e;},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.OutlineFilter=OutlineFilter;
