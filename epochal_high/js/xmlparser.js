import {Points} from '../lib/utils.js'
import Popup from '../lib/popup.js'

/*** Base parser for loading EyeVisit-style XML. Converts the XML into
 * an internal JSON format that in turn is converted into a HTML 5 representation
 * of EyeVisit cards.
 *
 * Defines the base API for processing the XML.
***/

class XMLParser {

  constructor(path) {
    this.path = path
    let basePath = this.removeLastSegment(this.path)
    this.basePath = this.removeLastSegment(basePath)
  }

  removeLastSegment(path) {
    let to = path.lastIndexOf('/')
    return path.substring(0, to)
  }

  extractLastSegment(path) {
    let to = path.lastIndexOf('/')
    return path.substring(to + 1, path.length)
  }

  /*** Loads the XML from the given path. ***/
  loadXML() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: this.path,
        dataType: "xml",
        success: (xml) => {
          resolve(xml)
        },
        error: (e) => {
          console.warn("Error loading " + this.path, e)
          reject()
        }
      })
    })
  }

  /*** Entry point, loads and parses the XML. Returns a promise that
    completes if all sub objects are loaded and converted into a single
    DOM tree and to add.***/
  loadParseAndCreateDOM() {
    return new Promise((resolve, reject) => {
        this.loadXML().then((xml) => {
            this.parseXML(xml).then((json) => {
                let domTree = this.createDOM(json)
                resolve(domTree)
            }).catch((reason) => {
                console.warn("parseXML failed", reason)
                reject(reason)
            })
        }).catch((reason) => {
            console.warn("loadXML failed", reason)
            reject(reason)
        })
    })
  }

  loadAndParseXML() {
    return new Promise((resolve, reject) => {
      this.loadXML().then((xml) => {
        this.parseXML(xml).then((json) => {
             resolve(json)
        }).catch((reason) => {
            console.warn("parseXML in loadAndParseXML failed", reason)
            reject(reason)
        })
      }).catch((reason) => {
            console.warn("loadXML in loadAndParseXML failed", reason)
            reject(reason)
      })
    })
  }

  /*** Parse the received XML into a JSON structure. Returns a promise. ***/
  parseXML(xmldat) {
    console.warn("Needs to be overwritten")
  }

  /*** Create DOM nodes from JSON structure. Returns a promise. ***/
  createDOM(json) {
    console.warn("Needs to be overwritten")
  }
}

export class XMLIndexParser extends XMLParser {

  constructor(path, { width= window.innerWidth,
                      height= window.innerHeight,
                      //assetsPath= '../../var/eyevisit/',
                      assetsPath = './cards/',
                      colors = { artist:'#b0c6b2',
                                 thema:'#c3c0d1',
                                 details:'#dec1b2',
                                 leben_des_kunstwerks: '#e1dea7',
                                 komposition: '#bebebe',
                                 licht_und_farbe: '#90a2ab',
                                 extra_info: '#c8d9d7',
                                 extra: '#c8d9d7',
                                 extrainfo: '#c8d9d7',
                                 artwork: '#e1dea7',
                                 technik: '#d9b3bd'
                              }
                     } = {}) {
    super(path)
    this.width = width
    this.height = height
    this.assetsPath = assetsPath
    this.colors = colors
  }

  parseXML(xmldat) {
    return new Promise((resolve, reject) => {
      let indexdat = {
        cards: [],
        cardsources: []
      }
      let data = $(xmldat).find('data')
      for (let key of['thumbnail',
        'artist',
        'title',
        'misc',
        'description',
        'year',
        'nr',
        'annotation']) {
        indexdat[key] = data.find(key).html()
      }
      let promises = []
      data.find('card').each((i, card) => {
        let src = $(card).attr('src')
        indexdat.cardsources.push(src)
        let parser = new XMLCardParser(this.basePath + '/' + src)
        let subCard = parser.loadAndParseXML().then((json) => {
          indexdat.cards.push(json)
        })
        promises.push(subCard)
      })
      Promise.all(promises).then((result) => {
        resolve(indexdat)
      })
    })
  }

  createDOM(tree) {

    let targetnode = document.createElement('div')
    $(targetnode).attr('id', tree.nr)

    let clone = $("#BACK").html()
    $(targetnode).append(clone)
    clone = $(targetnode).children().last()

    $($(clone).find('header img')).attr('src', this.assetsPath + tree.thumbnail)
    $($(clone).find('.artist')).append(tree.artist)
    $($(clone).find('.title')).append(tree.title)
    $($(clone).find('.misc')).append(tree.misc)
    $($(clone).find('.description')).append(tree.description)

    if (tree.annotation != null) {
      $($(clone)).find('.annotation').append(tree.annotation)
    }

    for (var i = 0; i < tree.cards.length; i++) {
      let id = tree.cardsources[i].match(/[^/]*$/, '')[0].replace('.xml', '')
      let cardclone = $("#CARD").html()
      $(clone).find('main').append(cardclone)
      cardclone = $(clone).find('main').children().last()
      cardclone.attr('id', id)
      this.createCardDOM(tree.cards[i], cardclone)
    }

    this.setupIndex(targetnode)
    return targetnode
  }

  createCardDOM(tree, targetnode) {

    if (tree.template == 2) {
      targetnode.find('#leftcol').addClass('wide')
      targetnode.find('#rightcol').addClass('narrow')
    }

    let colct = 2

    if (tree.template == 3) {
      targetnode.find('.wrapper').append("<div id='bottomcol'></div>")
      // set leftcol/rightcol height
      // set bottom col styles
      colct = 3
    }

    targetnode.find('.titlebar').append('<p>' + tree.header + '</p>')
    targetnode.find('.titlebar').css({'background': this.colors[tree.type]})
    targetnode.find('.preview').append('<p>' + tree.preview + '</p>')
    for (var index = 1; index < colct+1; index++) {

      let targetcol = targetnode.find('.wrapper').children()[index]
      let sourcecol = targetnode.find('.wrapper').children()[index].id
      //console.log(sourcecol)

      while (tree[sourcecol].length > 0) {

        let node = tree[sourcecol].pop()

        if (node.type == "text") {
          let clone = $("#TEXT").html()
          $(targetcol).append(clone).find(".text").last().append(node.html)
        }

        if (node.type == "singleimage") {

          let clone = $("#SINGLEIMAGE").html()
          $(targetcol).append(clone)
          clone = $(targetcol).children().last()

          let ratio = this.getRatio(this.assetsPath + node.source)
          let h = (node.maxheight / 670) * this.height
          let w = h * ratio

          $(clone).css({
            'height': h,
            'width': w
          })

          $($(clone).children('.mainimg')).attr('src', this.assetsPath + node.source)
          $(clone).attr('id', node.id)
          $($(clone).children('.zoomicon')).attr('id', node.iconid)

          $(clone).children('figcaption.cap').append(node.cap) // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">")
          $(clone).children('figcaption.zoomcap').append(node.zoomcap)

          // show image highlights
          let highlights = node.highlights
          node = ""
          
          /*while (highlights.length > 0) {
          
            let highlight = highlights.pop()
            node += "<a id='" + highlight.id.replace(/\./g, "_") + "' class='detail' href='#' data-target='" + highlight.target + "' data-radius = '" + highlight.radius + "' style='" + highlight.style + "' ></a>"
            //console.log('highlight with radius: ',highlight.radius, highlight.target)
          }*/

          $(clone).append(node)
        }

        if (node.type == "video") {

          let targetsrc = node.source.replace('f4v', 'mp4')

          let clone = $("#VIDEO").html()
          $(targetcol).append(clone)
          clone = $(targetcol).children().last()

          $(clone).css({
            'max-height': (node.maxheight / 670) * this.height
          })
          $($(clone).children('video').children('source')).attr('src', this.assetsPath + targetsrc)

          $(clone).attr('id', node.id)
          $($(clone).children('.zoomicon')).attr('id', node.iconid)
          $(clone).children('figcaption.cap').append(node.cap) // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">"))
          $(clone).children('figcaption.zoomcap').append(node.zoomcap)

          $(clone).append(node)
        }

        if (node.type == "space") {
          $(targetcol).append($("#SPACE").html())
          let clone = $(targetcol).children().last()
          $(clone).css({height: node.height})
        }

        if (node.type == "groupimage") {

          let clone = $("#GROUPIMAGE").html()
          $(targetcol).append(clone)
          clone = $(targetcol).children().last()

          $(clone).css({
            'height': (node.maxheight / 670) * this.height
          })

          let len = Object.keys(node.figures).length
          if(len > 2){
            let diff = len - 2
            while(diff > 0){
              let gr_figure = $("#GROUPIMAGE_FIGURE").html()
              $(clone).append(gr_figure)
              diff -= 1
            }
          }

          for (let j = 0; j < len; j++) {
            let figure = $($(clone).children('figure')[j])
            //console.log('group image: ',node.figures[j+1])
            figure.children('.mainimghalf').attr('src', this.assetsPath + node.figures[j+1].source)
            figure.attr('id', node.figures[j+1].id)
            figure.children('.zoomicon').attr('id', node.figures[j+1].iconid)

            figure.children('figcaption.cap').append(node.figures[j+1].cap)
            figure.children('figcaption.zoomcap').append(node.figures[j+1].zoomcap)
          }
        }
      }
    }

    targetnode.find('a').each(function() {
        let value = tree.tooltipdata[$(this).attr('data-target')]
        //$(this).attr('data-tooltip', value)
    })

  }

  completed(domNode) {
    /*** Called after the domNode has been added.

    At this point we can register a click handler for the
    flip wrapper which allows us to add a popup that can extend over the back
    and front card bounds. Note that popups have to be closed on click events
    outside the popups.

    TODO: On mobile devices we have to
    stay within the card bounds. That's much more complicated.
    ***/
    let wrapper = $(domNode).closest('.flipWrapper')
    wrapper.on('click', (e) => {
        if (wrapper[0].popup) {
            wrapper[0].popup.close()
            wrapper[0].popup = null
        }
        this.removeZoomable()
        this.removeImageHighlight()
        let target = $(e.target)
        let tooltip = target.attr('data-tooltip')
        if (tooltip) {
            let globalPos = { x: e.pageX, y: e.pageY }
            let localPos = Points.fromPageToNode(wrapper[0], globalPos)
            let popup = new Popup({ parent: wrapper[0], backgroundColor:'#222'})
            localPos.y = this.height - localPos.y
            popup.showAt({html: tooltip}, localPos)
            wrapper[0].popup = popup

            if(target.attr('class') == 'detail'){
              this.currentHighlight = target
              this.openImageHighlight();
              console.log('open image highlight with id:', target.attr('id'))
            }

            if(target.attr('imagehighlightid')){
              //console.log(target.attr('imagehighlightid'))
              //console.log((target.attr('id') + "Detail").replace(/\./g, "_"))
              let detailId = (target.attr('id') + "Detail").replace(/\./g, "_")
              this.currentHighlight = document.getElementById(detailId)
              this.openImageHighlight();
            }

            //console.log('tooltip found:',target, target.attr('data-tooltip'), target.scale, this.currentHighlight)

        }
        let zoomable = target.closest('.zoomable')
        if (zoomable.length > 0 && !tooltip) {
            // let wrapper = $(e.target).closest('.flipWrapper')
//             let div = wrapper.find('.ZoomedFigure')
//             if (div.length > 0) {
//                 this.closeZoomable(wrapper, div)
//                 return
//             }
            this.openZoomable(wrapper, zoomable)
        }
    })
    this.domNode = domNode
  }

  openImageHighlight() {
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
      onComplete: () => {
        //...
    }})
  }

  removeImageHighlight(){
    if(this.currentHighlight){
      //TweenMax.to(this.currentHighlight, 0.4, {scale: 1})
      TweenMax.set(this.currentHighlight, {scale: 1})
      this.currentHighlight = null
    }
    
  }

  closeZoomable(wrapper, div, zoomable, pos, scale, duration=0.4) {
    //console.log("closeZoomable")
    this.zoomableTweenInProgress = true
    if (zoomable.length > 0) {
        TweenMax.to(zoomable[0], duration, {
          autoAlpha: 1,
          onComplete: () => {
            //console.log("tween finished")
        }})
    }
    TweenMax.to(div[0], duration, {
        scale: scale,
        x: pos.x,
        y: pos.y,
        onComplete: () => {
            //console.log("closeZoomable tween finished")
            div.remove()
            let icon = wrapper.find('.ZoomedIcon')
            icon.remove()
            this.zoomableTweenInProgress = false
        }})
  }

  removeZoomable(animated=false) {
      //logging
      //app.log("zoomable image closed",{id: ''})

      //console.log("checking for open zoomables (animated?: " + animated + " )")
       let wrapper = $(this.domNode).closest('.flipWrapper')
       let div = wrapper.find('.ZoomedFigure')
       if (div.length > 0) {
        if (animated) {
              let zoomable = div[0].zoomable
              let zoomablePos = div[0].zoomablePos
              let zoomableScale = div[0].zoomableScale
              if (zoomable) {
                  this.closeZoomable(wrapper, div, zoomable, zoomablePos, zoomableScale, 0.1)
              }
        }
        else {
          //cleanup is not necessary if zoomable tween is in progress
          if(!this.zoomableTweenInProgress){
            let zoomable = div[0].zoomable
            if(zoomable.length > 0){
              zoomable[0].style.visibility = "visible"
              zoomable[0].style.opacity = 1
            }
            let icon = wrapper.find('.ZoomedIcon')
            div.remove()
            icon.remove()
          }
        }
      }
  }

  openZoomable(wrapper, zoomable) {
    //console.log("openZoomable",wrapper,zoomable)
    wrapper.append('<div class="ZoomedFigure" style="display:hidden;"><figure></figure></div>')
    let div = wrapper.find('.ZoomedFigure')

    let figure = div.find('figure')
    let img = zoomable.find('.mainimg')
    if (img.length == 0) {
        img = zoomable.find('.mainimghalf')
    }
    figure.append('<img src="' + img.attr('src') + '">')
    let zoomCap = zoomable.find('.zoomcap')
    let zoomCapClone = zoomCap.clone()
    figure.append(zoomCapClone)
    zoomCapClone.show()

    let zoomIcon = zoomable.find('.zoomicon')
    wrapper.append('<img class="zoomicon ZoomedIcon" src="../../src/cards/icons/close.svg">')

    let globalIconPos = Points.fromNodeToPage(zoomIcon[0], { x: 0, y: 0})
    let localIconPos = Points.fromPageToNode(wrapper[0], globalIconPos)

    let globalFigurePos = Points.fromNodeToPage(zoomable[0], { x: 0, y: 0})
    let localFigurePos = Points.fromPageToNode(wrapper[0], globalFigurePos)
    let relativeIconPos = Points.fromPageToNode(zoomable[0], globalIconPos)

    let currentWidth = relativeIconPos.x
    let currentHeight = relativeIconPos.y
    let width = img[0].naturalWidth - 16
    let height = img[0].naturalHeight - 16
    let scale = (currentWidth / width) * 1.1

    div[0].zoomable = zoomable
    div[0].zoomablePos = localFigurePos
    div[0].zoomableScale = scale

    let icon = wrapper.find('.ZoomedIcon')
    icon.on('click', (e) => {
        this.closeZoomable(wrapper, div, zoomable, localFigurePos, scale)
    })

    //logging
    app.log("zoomable image opened",{id: zoomable.attr('id')})

    div.show()
    TweenMax.set(icon[0], { x: localIconPos.x, y: localIconPos.y })
    TweenMax.set(div[0], {  x:localFigurePos.x,
                            y:localFigurePos.y,
                            scale: scale,
                            transformOrigin: "top left"})
    
    //pm: this is more or less a quick and dirty solution to zoomables that are too large... should be reworked
    let scaleFactor = 1
    if(height>app.height*0.5)
      scaleFactor = 0.75

    TweenMax.to(zoomable[0], 0.4, { autoAlpha: 0})
    TweenMax.to(div[0], 0.4, { scale: scaleFactor,
                                    x: "-=" + (width * scaleFactor - currentWidth),
                                    y: "-=" + (height * scaleFactor - currentHeight)})
  }

  getRatio(source) {
    let dummy = document.createElement("IMG");
    dummy.setAttribute("src", source);
    let ratio = dummy.naturalWidth / dummy.naturalHeight
    return ratio
  }

  setupIndex(indexnode, useGreenSock=true) {
    let duration = 300
    let that = this
    $(indexnode).find('.card').each(function() {
      $(this).on('click', function(event) {

        //logging
        let cardType = event.currentTarget.id.substring(4)
        cardType = cardType.replace(/\d+$/, "")
        app.log("topic opened",{id: event.currentTarget.id.substring(0,3), type: cardType})

        if ($(this).attr("expanded") == "true") {
          $(this).attr("expanded", "false")
          $(this).css('flex-grow', '0')
        }
        that.removeZoomable(true)

        let cardbox = $(this).parent()
        let indexbox = $(this).parents('.mainview')

        let el = $(this)[0];
        let st = window.getComputedStyle(el, null)
        let tr = st.getPropertyValue('transform')
        let angle = 0
        if (tr !== "none") {
          let values = tr.split('(')[1].split(')')[0].split(',')
          let a = values[0]
          let b = values[1]
          angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
        }

        let target = $(this).clone()
        let root = $(this)

        $(target).attr('id', 'overlay')
        $($(target).find('.cardicon')).attr('src', '../../src/cards/icons/close.svg')
        $(target).find('.titlebar').css({height: '8%'})
        //console.log("Expand")
        if (useGreenSock) {

            let indexWidth = indexnode.getBoundingClientRect().width
            let indexHeight = indexnode.getBoundingClientRect().height
            let rootWidth = root[0].getBoundingClientRect().width
            let rootHeight = root[0].getBoundingClientRect().height
            let scale = (useGreenSock) ? rootWidth / indexWidth : 1

            let globalOrigin = Points.fromNodeToPage(root[0], {x:0, y:0})
            let localOrigin = Points.fromPageToNode(indexbox[0], globalOrigin)

            TweenMax.set(target[0], { css: {
                 position: 'absolute',
                 width: '97.5%',
                 height: '93.5%',
                 margin: 0,
                 zIndex: 101
            }})
            TweenMax.set(root[0], { alpha: 0})
            TweenMax.set(target[0], {
                  x: localOrigin.x,
                  y: localOrigin.y,
                  scale: scale,
                  transformOrigin: '0% 0%',
                  rotation: angle,
            })

            $(target).prependTo(indexbox)

            TweenMax.to(target[0], 0.2, {
                x: indexWidth * 0.02,
                y: 0,
                scale: 1,
                rotation: 0
            })
            let preview = $(target).find('.preview')
            TweenMax.to(preview[0], 0.5, { autoAlpha: 0 })

            $(target).find('.cardicon').on('click', (event) => {

                //logging
                app.log("topic closed",{id: ''})

                that.removeZoomable(true)
                TweenMax.set(root[0], { autoAlpha: 1 })
                TweenMax.to(target[0], 0.2, {
                    x: localOrigin.x,
                    y: localOrigin.y,
                    scale: scale,
                    rotation: angle,
                    onComplete: () => {
                        TweenMax.to(target[0], 0.4,
                            { delay: 0.2,
                              alpha: 0,
                              onComplete:
                                () => {
                                    target[0].remove()}
                            })
                    }
                })

               // TweenMax.to(preview[0], 0.2, { alpha: 1 })
            })

        }
        else {
            $(target).find('.cardicon').on('click', function(event) {
              $(target).fadeOut(duration, function() {
                $(target).remove()
              })
            })

            $(target).css({
              'position': 'absolute',
              'top': root.offset().top,
              'left': root.offset().left,
              'margin': 0,
              'z-index': '101'
            })
            $(target).prependTo(indexbox)

            $(target).animate({
                top: '5%',
                left: '2%',
                width: '96%',
                height: '90%',
                margin: '0'
                }, duration)
            $(target).find('.preview').fadeOut(700)

            $({deg: 0}).animate({
                deg: angle
                }, {
                duration: duration,
                step: function(now) {
                    $(target).css({transform: 'rotate(0deg)'})
                }
            })
        }

      // this.setupZoomables($(target)) ??? is this this the this i want to this ???

        })
    })
}

  setupZoomables(cardnode) {
    $(cardnode).find('figure.zoomable').each(function() {
      // zoomfun()
    })
  }
}

export class XMLCardParser extends XMLParser {

    parseXML(xmldat) {
        return new Promise((resolve, reject) => {

            let template = $($(xmldat).find('content')).attr('template')
            let targetdat

            if(template==3){
              targetdat = {
                'leftcol': {},
                'rightcol': {},
                'bottomcol': {}
              }
            } else {
              targetdat = {
                'leftcol': {},
                'rightcol': {}
              }
            }


            targetdat.template = template
            targetdat.type = $($(xmldat).find('card')).attr('type').replace(/\s/g, '_')
            let header = $(xmldat).find("h1")
            if (header.length > 0) {
                let title = this.preserveTags(header[0].innerHTML)
                targetdat.header = title
            }

            let preview = $(xmldat).find("preview")
            let previewText = preview.find("text")
            if (previewText.length > 0) {
                preview = this.preserveTags(previewText[0].innerHTML)
            }
            else {
                let previewImage = preview.find("img")
                if (previewImage.length > 0) {
                    let image = $(previewImage[0])
                    let src = image.attr('src')
                    image.attr('src', this.createLinkURL(src))
                    preview = previewImage[0].outerHTML
                }
            }

            targetdat.preview = preview
            targetdat.tooltipdata = {}
            let cols = $(xmldat).find("column")
            let keydat = Object.keys(targetdat)
            let imgindex = 0,
                plaintext = '',
                type,
                html,
                nodes,
                linkdat

            for (let index = 0; index < cols.length; index++) {
                let sourcecol = $(cols[index]).children()
                targetdat[keydat[index]] = {}
                let newnodes = []
               for (let i = 0; i < sourcecol.length; i++) {
                    let type = sourcecol[i].nodeName
                    let html = sourcecol[i].innerHTML
                    let nodes = ""
                    let node = {}
                    // content type: PREVIEW, TEXT, VIDEO, GROUPIMAGE, SINGLEIMAGE, GLOSS_LINK, DETAIL_LINK, DETAIL_ZOOM, SPACE
                    if (type == "text") {
                        html = this.replaceCDATA(html)
                        html = html.replace(/-([a-z]) /gi, "$1")
                        // UO: The following line is in conflict with URL like tete-a-tete.xml
                        html = html.replace(/-([a-z])/gi, "$1")
                        nodes = $.parseHTML(html)
                        node.type = 'text'
                        node.html = ''
                        for (let j = 0; j < nodes.length; j++) {
                            if (nodes[j].nodeName == "P") {
                                let links = nodes[j].getElementsByTagName('a')
                                for (let k = 0; k < links.length; k++) {
                                    let ref = this.createLinkURL(links[k].href)
                                    $(links[k]).attr('data-target', ref)
                                    targetdat.tooltipdata[ref] = ""
                                    links[k].href = "#"
                                    let linktype = ""
                                    if (links[k].href.indexOf("glossar") != -1) {
                                        linktype = "glossLink"
                                    } else if (links[k].hasAttribute("imagehighlightid")) {
                                        linktype = "detailLink"
                                        links[k].id = $(links[k]).attr('imagehighlightid').replace(/\./g, "_")
                                    } else {
                                        linktype = "glossLink"
                                    }
                                    $(links[k]).attr("class", linktype)
                                    /*** UO: This crashed on Firefox 48. Seems to be unnecessary.
                                     nodes[j].getElementsByTagName("a")[k] = links[k]
                                       ***/
                                }
                            //node.html += '<p> ' + nodes[j].innerHTML + ' </p>'
                            //UO: Enable the following line to remove all links from P tags
                            node.html += '<p> ' + nodes[j].innerText + ' </p>'
                            plaintext += nodes[j].innerText
                            } else if (nodes[j].nodeName == "H2") {
                                node.html += '<h2> ' + nodes[j].innerHTML + ' </h2>'
                                plaintext += nodes[j].innerText
                            }
                        }
                    }

                    if (type == "img") {

                        imgindex = imgindex + 1
                        let newhtml = ""

                        if ($(sourcecol[i]).attr('src').indexOf(".f4v") >= 0) {

                          node.type = 'video'
                          node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px'
                          node.source = $(sourcecol[i]).attr('src').replace('f4v', 'mp4')
                          node.id = 'zoomable' + imgindex
                          node.iconid = 'zoom' + imgindex
                          node.cap = this.caption(sourcecol[i])
                          node.zoomcap = this.zoomCaption(sourcecol[i])

                        } else {

                          node.type = 'singleimage'
                          node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px'
                          node.source = $(sourcecol[i]).attr('src')
                          node.id = 'zoomable' + imgindex
                          node.iconid = 'zoom' + imgindex
                          node.cap = this.caption(sourcecol[i])
                          node.zoomcap = this.zoomCaption(sourcecol[i])

                          //walk throungh highlights
                          nodes = $.parseHTML(html)
                          let highlights = []

                          for (let j = 0; j < nodes.length; j++) {

                            if (nodes[j].nodeName == "HIGHLIGHT") {
                              console.log('parsing highlight')

                              let ref = this.createLinkURL($(nodes[j]).attr('href'))

                              targetdat.tooltipdata[ref] = ""

                              let subnode = {}

                              subnode.id = ($(nodes[j]).attr('id') + "Detail").replace(/\./g, "_")
                              subnode.src = $(nodes[j]).attr('id').replace(".jpg", "").replace(/.h\d+/, "").replace(".", "/") + ".jpg"

                              let style = ""
                              style = style + "left:" + $(nodes[j]).attr('x') * 100 + "%;"
                              style = style + "top:" + $(nodes[j]).attr('y') * 100 + "%;"
                              style = style + "height:" + $(nodes[j]).attr('radius') * 180 + "%;"
                              style = style + "width:" + $(nodes[j]).attr('radius') * 180 + "%;"
                              //style = style + "left:" + $(nodes[j]).attr('x') * 114 + "%;"
                              //style = style + "top:" + $(nodes[j]).attr('y') * 106 + "%;"
                              //style = style + "height:" + $(nodes[j]).attr('radius') * 145 + "%;"
                              //style = style + "width:" + $(nodes[j]).attr('radius') * 190 + "%;"
                              style = style + "background-image:url(" + ref.replace("xml", "jpg") + ");"

                              subnode.style = style
                              subnode.target = ref
                              subnode.radius = $(nodes[j]).attr('radius')

                              console.log(subnode.src,subnode.target)

                              highlights.push(subnode)

                            }
                          }
                          node.highlights = highlights.reverse()
                        }
                      }

                    if (type == "space" & i == 0) {
                        node.type = 'space'
                        node.height = $(sourcecol[i]).attr('height') + "px"
                    }

                    if (type == "imggroup") {

                        node.type = 'groupimage'
                        node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px'
                        node.figures = {}

                        for(let j = 0; j < $(sourcecol[i]).children('img').length; j++){

                          imgindex += 1
                          let srcimg = $(sourcecol[i]).children('img')[j]

                          node.figures[j+1] = {}
                          node.figures[j+1].source = $(srcimg).attr('src')
                          node.figures[j+1].id = 'zoomable' + imgindex
                          node.figures[j+1].iconid = 'zoom' + imgindex
                          node.figures[j+1].cap = this.caption(srcimg)
                          node.figures[j+1].zoomcap = this.zoomCaption(srcimg)

                        }
                    }
                    newnodes.push(node)
                }
                targetdat[keydat[index]] = newnodes.reverse()
            }
            targetdat.plaintext = plaintext
            let tooltipRefs = Object.keys(targetdat.tooltipdata)
            //console.log(tooltipRefs)
            let linkpromises = []
            for (let i of tooltipRefs) {
                let url = i
                let parser = new XMLParser(url)
                let promise = parser.loadXML().then((xml) => {
                    let img = $(xml).find('img')
                    for(let i=0; i<img.length; i++) {
                        let src = $(img[i]).attr('src')
                        $(img[i]).attr('src', this.createLinkURL(src))
                    }
                    let linkdat = $(xml).find('content').html()
                    linkdat = this.replaceCDATA(linkdat)
                    linkdat = this.replaceText(linkdat)
                    targetdat.tooltipdata[url] = linkdat
                })
                linkpromises.push(promise)
            }

            Promise.all(linkpromises).then((input) => {
                resolve(targetdat)
            })
        })
    }

    replaceText(html) {
        return html.replace(/<\/text>/g, "")
            .replace(/<text>/g, "")
            .replace(/\t/g, "")
            .replace(/"/g, "'")
            .replace(/\n/g, '')
            .replace(/\r/g, '')
    }

    replaceCDATA(html) {
        return html.replace(/<\!\[CDATA\[/g, "").replace(/]]>/g, "")
    }

    replaceEscapedAngleBrackets(html) {
        return html.replace(/\t/g, "").replace(/&lt;/, "<").replace(/&gt;/, ">")
    }

    preserveTags(html) {
        return this.replaceEscapedAngleBrackets(html)
    }

    caption(element) {
        try {
            return this.replaceEscapedAngleBrackets($(element).attr('caption'))
        } catch(e) {
            return "Missing Caption"
        }
    }

    zoomCaption(element) {
        try {
            return this.replaceEscapedAngleBrackets($(element).attr('zoomCaption'))
        } catch(e) {
            return "Missing ZoomCaption"
        }
    }

    /* Converts absolute URLs in href attributes created by the DOM builder
        into correct src url. */
    createLinkURL(href) {
        let last = this.extractLastSegment(href)
        let rest = this.removeLastSegment(href)
        let first = this.extractLastSegment(rest)
        return this.basePath + '/' + first + '/' + last
    }

}
