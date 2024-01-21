/*** Base parser for loading EyeVisit-style XML. Converts the XML into
 * an internal JSON format that in turn is converted into a HTML 5 representation
 * of EyeVisit cards.
 *
 * Defines the base API for processing the XML.
***/

import EpochalApp from './epochal.js'

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
                console.log("parseXML received json", JSON.stringify(json))
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
                      assetsPath= './cards/',
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

    console.log(this.height)

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

    targetnode.find('.titlebar').append('<p>' + tree.header + '</p>')
    targetnode.find('.titlebar').css({'background': this.colors[tree.type]})
    targetnode.find('.preview').append('<p>' + tree.preview + '</p>')

    for (var index = 1; index < 3; index++) {
        console.log("index", index)
      let targetcol = targetnode.find('.wrapper').children()[index]
      let sourcecol = targetnode.find('.wrapper').children()[index].id

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

          $(clone).children('figcaption.cap').append(node.cap.replace("&lt;", "<").replace("&gt;", ">"))
          $(clone).children('figcaption.zoomcap').append(node.zoomcap)

          // let highlights = node.highlights
          // node = ""
          //
          // while (highlights.length > 0) {
          //
          //   let highlight = highlights.pop()
          //   node += "<a id='" + highlight.id.replace(/\./g, "_") + "' class='detail' href='#' data-target='" + highlight.target + "' data-radius = '" + highlight.radius + "' style='" + highlight.style + "' ></a>"
          //
          // }
          $(clone).append(node)
        }

        if (node.type == "video") {

          targetsrc = node.source.replace('f4v', 'mp4')

          let clone = $("#VIDEO").html()
          $(targetcol).append(clone)
          clone = $(targetcol).children().last()

          $(clone).css({
            'max-height': (node.maxheight / 670) * this.height
          })
          $($(clone).children('video').children('source')).attr('src', this.assetsPath + targetsrc)

          $(clone).attr('id', node.id)
          $($(clone).children('.zoomicon')).attr('id', node.iconid)
          $(clone).children('figcaption.cap').append(node.cap.replace("&lt;", "<").replace("&gt;", ">"))
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

          let figure0 = $($(clone).children('figure')[0])
          figure0.children('.mainimghalf').attr('src', this.assetsPath + node.figures[1].source)
          figure0.attr('id', node.figures[1].id)
          figure0.children('.zoomicon').attr('id', node.figures[1].iconid)

          figure0.children('figcaption.cap').append(node.figures[1].cap.replace("&lt;", "<").replace("&gt;", ">"))
          figure0.children('figcaption.zoomcap').append(node.figures[1].zoomcap)

          let figure1 = $($(clone).children('figure')[1])

          figure1.children('.mainimghalf').attr('src', this.assetsPath + node.figures[2].source)
          figure1.attr('id', node.figures[2].id)
          figure1.children('.zoomicon').attr('id', node.figures[2].iconid)

          figure1.children('figcaption.cap').append(node.figures[2].cap.replace("&lt;", "<").replace("&gt;", ">"))
          figure1.children('figcaption.zoomcap').append(node.figures[2].zoomcap)
        }
      }
    }

    targetnode.find('a').each(function() {
      $(this).attr('data-tooltip', tree.tooltipdata[$(this).attr('data-target')])
    })
  }

  getRatio(source) {
    let dummy = document.createElement("IMG");
    dummy.setAttribute("src", source);
    let ratio = dummy.naturalWidth / dummy.naturalHeight
    return ratio
  }

  setupIndex(indexnode) {

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
        $($(target).find('.cardicon')).attr('src', 'icons/icon_close.png')
        $(target).find('.preview').fadeOut(700)

        $(target).css({
          'position': 'absolute',
          'top': root.offset().top,
          'left': root.offset().left,
          'transform': 'rotate(' + angle + 'deg)',
          'z-index': '101'
        })

        $(target).find('.titlebar').css({height: '8%'})

        $(target).prependTo(indexbox)

        $(target).find('.cardicon').on('click', function(event) {
          
          //logging
          app.log("topic closed",{id: ''})

          $(target).fadeOut(600, function() {
            $(target).remove()
          })
        })

        $(target).animate({
          top: '10%',
          left: '2%',
          width: '96%',
          height: '80%',
          margin: '0'
        }, 400)

        $({deg: 0}).animate({
          deg: angle
        }, {
          duration: 400,
          step: function(now) {
            $(target).css({transform: 'rotate(0deg)'})
          }
        })
      })

      // this.setupZoomables($(target)) ??? is this this the this i want to this ???

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
            let targetdat = {
              'leftcol': {},
              'rightcol': {}
            }
            targetdat.template = $($(xmldat).find('content')).attr('template')
            targetdat.type = $($(xmldat).find('card')).attr('type').replace(/\s/g, '_')

            let title = $(xmldat).find("h1")[0].innerHTML
            targetdat.header = title

            let preview = $(xmldat).find("preview").find("text")
            if (preview.length > 0) {
                preview = preview[0].innerHTML.replace(/\t/g, "").replace("&lt;", "<").replace("&gt;", ">")
            }
            else{
                var previewImg = $(xmldat).find("preview").find("img")
                console.log("TO DO: image handling in preview", previewImg.length)
            }

            /*let preview = $(xmldat).find("preview")
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
            }*/

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
                        html = html.replace("<![CDATA[", "").replace("]]>", "")
                        html = html.replace(/-([a-z]) /gi, "$1")
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
                            // node.html += '<p> ' + nodes[j].innerHTML + ' </p>'
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

                          targetsrc = $(sourcecol[i]).attr('src').replace('f4v', 'mp4')

                          node.type = 'video'
                          node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px'
                          node.source = targetsrc
                          node.id = 'zoomable' + imgindex
                          node.iconid = 'zoom' + imgindex
                          node.cap = $(sourcecol[i]).attr('caption').replace("&lt;", "<").replace("&gt;", ">")
                          node.zoomcap = $(sourcecol[i]).attr('zoomCaption')

                        } else {

                          node.type = 'singleimage'
                          node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px'
                          node.source = $(sourcecol[i]).attr('src')
                          node.id = 'zoomable' + imgindex
                          node.iconid = 'zoom' + imgindex
                          node.cap = $(sourcecol[i]).attr('caption').replace("&lt;", "<").replace("&gt;", ">")
                          node.zoomcap = $(sourcecol[i]).attr('zoomCaption')

                          //walk throungh highlights
                          nodes = $.parseHTML(html)
                          let highlights = []

                          for (let j = 0; j < nodes.length; j++) {

                            if (nodes[j].nodeName == "HIGHLIGHT") {

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
                              style = style + "background-image:url(" + ref.replace("xml", "jpg") + ");"

                              subnode.style = style
                              subnode.target = ref
                              subnode.radius = $(nodes[j]).attr('radius')

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
                        node.figures = {
                          1: {},
                          2: {}
                        }

                        imgindex += 1
                        let srcimg = $(sourcecol[i]).children('img')[0]

                        node.figures[1].source = $(srcimg).attr('src')
                        node.figures[1].id = 'zoomable' + imgindex
                        node.figures[1].iconid = 'zoom' + imgindex
                        node.figures[1].cap = $(srcimg).attr('caption').replace("&lt;", "<").replace("&gt;", ">")
                        node.figures[1].zoomcap = $(srcimg).attr('zoomCaption')

                        imgindex += 1
                        srcimg = $(sourcecol[i]).children('img')[1]

                        node.figures[2].source = $(srcimg).attr('src')
                        node.figures[2].id = 'zoomable' + imgindex
                        node.figures[2].iconid = 'zoom' + imgindex
                        node.figures[2].cap = $(srcimg).attr('caption').replace("&lt;", "<").replace("&gt;", ">")
                        node.figures[2].zoomcap = $(srcimg).attr('zoomCaption')
                    }
                    newnodes.push(node)
                }
                targetdat[keydat[index]] = newnodes.reverse()
            }
            targetdat.plaintext = plaintext
            let tooltipRefs = Object.keys(targetdat.tooltipdata)
            console.log(tooltipRefs)
            let linkpromises = []
            for (let i of tooltipRefs) {
                let linkdat
                let url = i
                let parser = new XMLParser(url)
                let promise = parser.loadXML().then((xml) => {
                    linkdat = xml
                    linkdat = $(linkdat).find('content').html()
                    linkdat = linkdat.replace("<![CDATA[", "").replace("]]>", "").replace("</text>", "").replace("<text>", "").replace(/\t/g, "").replace(/"/g, "'").replace(/\n/g, '').replace(/\r/g, '')
                    targetdat.tooltipdata[url] = linkdat
                })
                linkpromises.push(promise)
            }

            Promise.all(linkpromises).then((input) => {
                resolve(targetdat)
            })
        })
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
