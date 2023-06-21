import {View} from "./views.js"
import EpochalApp from "./epochal.js"

export default class CategoryView extends View {

    layout(w, h) {
        if (app.timebar)
            app.timebar.clear()
        let baseY = h - 32
        this.resize(w, baseY + 32)

        //rescale background image
        /*this.ratio = this.backgroundImg.width / app.width
        //console.log("rescaling bgImage (layout)",this.backgroundImg.width,app.width,this.ratio)
        this.backgroundImg.width = app.width
        this.backgroundImg.height = this.backgroundImg.height / this.ratio*/

        this.viewHeight = app.height * 0.85 //that's really a rough estimate...
        this.ratio = this.backgroundImg.height / this.viewHeight
        this.backgroundImg.height = this.viewHeight
        this.backgroundImg.width = this.backgroundImg.width / this.ratio
        if(this.offsetX)
            this.oldOffsetX = this.offsetX
        else
            this.oldOffsetX = 0
        this.offsetX = (app.width - this.backgroundImg.width) / 2
        this.backgroundImg.x = this.offsetX


        //add background to stage
        app.stage.addChildAt(this.bgSprite,0)
        let bgRectangle = new PIXI.Graphics()
        bgRectangle.beginFill(0x000000)
        bgRectangle.drawRect(0,0,app.width,app.height)
        bgRectangle.endFill()
        this.bgSprite.addChildAt(bgRectangle,0)
        //this.bgSprite.y = app.height * 0.05

        //resize thumbs
        app.allData.forEach(function (d) {
            //this.thumbScaleFactor = 2048 / app.width
            this.thumbScaleFactor = 1280 / this.viewHeight
            let thumbSizeScaled = 205 / this.thumbScaleFactor
            let scaleFactorToCurrentSize = thumbSizeScaled / d.scaledHeight
            let ww = d.scaledWidth * scaleFactorToCurrentSize
            let hh = d.scaledHeight * scaleFactorToCurrentSize
            d.width = ww
            d.height = hh
        },this)

        //position thumbs
        app.allData.forEach(function (d) {
            let key = parseInt(d.ref)
            //console.log("finding position for artwork:",key)
            //console.log(this.positions[key])
            let target = this.positions[key]
            if(target == undefined) {
                d.x = -d.width
                d.y = 0
            }
            else {
                d.x = (target.x / this.thumbScaleFactor) + this.offsetX
                d.y = target.y / this.thumbScaleFactor
                //d.y += app.height * 0.05
            }

        },this)

        //position and scale info icons
        for(let i = 0; i < 3; i++){
            this.categoryInfoIcons[i].x -= this.oldOffsetX
            this.categoryInfoIcons[i].width /= this.ratio
            this.categoryInfoIcons[i].height /= this.ratio
            this.categoryInfoIcons[i].x /= this.ratio
            this.categoryInfoIcons[i].y /= this.ratio
            this.categoryInfoIcons[i].x += this.offsetX
        }

        this.clearInfo()

    }

    clear() {
        super.clear()
        app.stage.removeChild(this.bgSprite)
    }

    init(backgroundUrl, positionsUrl, categoryUrl){
        //init background image
        this.bgSprite = new PIXI.Sprite()
        this.backgroundImg = PIXI.Sprite.fromImage(backgroundUrl)
        this.bgSprite.addChildAt(this.backgroundImg,0)

        //init artwork positions
        let positionsText = this.readTextFile(positionsUrl, false)
        let positionsLines = positionsText.split("\n")
        let positionsDict = {};

        positionsLines.forEach(function(entry){
            let curLine = entry.split("\t")
            if(curLine[0] != "")
                positionsDict[curLine[0]] = new Point(curLine[1],curLine[2])
        })

        this.positions = positionsDict

        //init description texts and info icons
        let categoryXml = this.readTextFile(categoryUrl, true)

        let headers = categoryXml.getElementsByTagName("h1")
        let bodies = categoryXml.getElementsByTagName("body")
        let infoXPositions = categoryXml.getElementsByTagName("infoX")
        let infoYPositions = categoryXml.getElementsByTagName("infoY")

        this.categoryInfoIcons = []
        this.categoryHeaders = []
        this.categoryDescriptions = []
        this.categoryInfoIconPositions = []
        for(let i = 0; i < 3; i++){
            let tmpIcon = PIXI.Sprite.fromImage("./icon_info_1x.png")
            tmpIcon.interactive = true
            this.categoryInfoIcons[i] = tmpIcon
            this.bgSprite.addChild(tmpIcon)
            tmpIcon.click = this.infoSelected.bind(this)
            tmpIcon.tap = this.infoSelected.bind(this)

            let tmpPos = new Point(infoXPositions[i].childNodes[0].nodeValue, infoYPositions[i].childNodes[0].nodeValue)
            this.categoryHeaders[i] = headers[i].childNodes[0].nodeValue
            this.categoryDescriptions[i] = bodies[i].childNodes[1].nodeValue
            this.categoryInfoIconPositions[i] = tmpPos
            this.categoryInfoIcons[i].x = tmpPos.x
            this.categoryInfoIcons[i].y = tmpPos.y
            this.categoryInfoIcons[i].id = 'catInfoIcon'
        }
        //console.log(this.categoryHeaders)
        //console.log(this.categoryDescriptions[0])

        this.currentInfoIdx = -1;

    }

    infoSelected(event) {
        //console.log("info selected",event)

        let d = event.target
        let idx = this.categoryInfoIcons.indexOf(d)

        //category info views
        this.infoBg = new PIXI.Graphics
        this.infoBg.beginFill(0x000000,0.8)
        this.infoBg.drawRect((this.backgroundImg.width / 3) * idx, 0, this.backgroundImg.width / 3, this.backgroundImg.height * 1.1)
        this.infoBg.endFill()
        this.infoBg.x = this.offsetX

        //text
        let h1style = new PIXI.TextStyle({
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
        })
        let h1 = new PIXI.Text(this.categoryHeaders[idx], h1style)
        //let h1 = new PIXI.Text("hello", h1style)
        h1.x = (this.backgroundImg.width / 3) * idx + this.backgroundImg.width / 24
        //h1.y = this.backgroundImg.height / 11
        //this.infoBg.addChild(h1)

        let infoTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: this.backgroundImg.width / 60,
            //fontWeight: 'bold',
            fill: 'white',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: (this.backgroundImg.width / 3.75),
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4
        })
        let body = new PIXI.Text(this.categoryDescriptions[idx], infoTextStyle)
        //let h1 = new PIXI.Text("hello", h1style)
        body.x = (this.backgroundImg.width / 3) * idx + this.backgroundImg.width / 24
        //body.y = this.backgroundImg.height / 7
        body.y = this.backgroundImg.height / 10
        this.infoBg.addChild(body)

        if(this.currentInfoIdx != idx){
            app.stage.addChild(this.infoBg)
            this.currentInfoIdx = idx

            //logging
            app.log("category info opened",{id: (idx+1).toString()})

            this.infoListener = this.clearInfo.bind(this)
            window.document.addEventListener('mousedown',this.infoListener,false)
            window.document.addEventListener('touchstart',this.infoListener,false)
        }
        else{
            this.currentInfoIdx = -1
        }

    }

    clearInfo(event) {
        if(event){
            //console.log('clearInfo',event)
        }

        if(app.stage.children.indexOf(this.infoBg) !== -1){
            window.document.removeEventListener('mousedown',this.infoListener)
            window.document.removeEventListener('touchstart',this.infoListener)
            app.stage.removeChild(this.infoBg)

            //logging
            app.log("category info closed","")

            //console.log(this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX,event.pageY)))
            //console.log(event.pageX,event.pageY,this.categoryInfoIcons[this.currentInfoIdx].x,this.categoryInfoIcons[this.currentInfoIdx].y)
            //console.log(this.categoryInfoIcons[this.currentInfoIdx].width,this.categoryInfoIcons[this.currentInfoIdx].height)
            //console.log(this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX,event.pageY-64)))

            if(!this.categoryInfoIcons[this.currentInfoIdx].containsPoint(new PIXI.Point(event.pageX,event.pageY-64))){
                this.currentInfoIdx = -1
            }


        }

    }

    readTextFile(file,targetIsXml)
    {
        let rawFile = new XMLHttpRequest()
        let response
        rawFile.open("GET", file, false)
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    if(targetIsXml)
                        response = rawFile.responseXML
                    else
                        response = rawFile.responseText
                }
            }
        }
        rawFile.send(null);
        return response
    }

}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
