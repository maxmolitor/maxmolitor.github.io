import {Capabilities} from './capabilities.js'

export default class Index {

    constructor(template, pages, notfound="thumbnails/notfound.png") {
        this.template = template
        this.pages = pages
        this.notfound = notfound
    }

    setup() {
        for(let pair of this.pages) {
            let [title, src] = pair
            let id = getId()
            pair.push(id)
            let t = this.template
            let wrapper = t.content.querySelector('.wrapper')
            wrapper.id = id
            let clone = document.importNode(t.content, true)
            container.appendChild(clone)
            wrapper = container.querySelector('#'+id)

            let icon = wrapper.querySelector('.icon')

            icon.onerror = (e) => {
                if (this.notfound)
                    icon.src = this.notfound
            }
            let iconSrc = src.replace('.html', '.png')
            console.log("iconSrc", iconSrc)
            if (iconSrc.endsWith('index.png')) {
                icon.src = iconSrc.replace('index.png', 'thumbnail.png')
            }
            else {
                icon.src = "thumbnails/" + iconSrc
            }
            wrapper.href = src
            let titleDiv = wrapper.querySelector('.title')
            titleDiv.innerText = title
        }
    }

    frames() {
        if (this.pages.length == 0)
            return
        let [title, src, id] = this.pages.shift()
        let iframe = document.createElement('iframe')
        iframe.frameborder = 0
        let wrapper = document.getElementById(id)
        let icon = wrapper.querySelector('.icon')

        icon.parentNode.replaceChild(iframe, icon)
        iframe.onload = (e) => {
            this.frames()
        }
        iframe.src = src + window.location.search
    }

    load() {
        this.setup()
        if (window.location.search.startsWith('?test'))
            this.frames()
    }

    loadAndTest() {
        this.setup()
        if (!Capabilities.isMobile)
            this.frames()
    }
}
