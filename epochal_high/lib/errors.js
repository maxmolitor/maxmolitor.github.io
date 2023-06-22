var recordedErrors = new Map()

export default class Errors {

    static countErrors() {
        let total = 0
        for(let error of recordedErrors.keys()) {
            total += recordedErrors.get(error).size
        }
        return total
    }

    static setStyle(element, styles) {
        for(let key in styles) {
            element.style[key] = styles[key]
        }
    }

    static appendError(error, source) {
        if (recordedErrors.has(error)) {
            let sources = recordedErrors.get(error)
            sources.add(source)
        }
        else {
            recordedErrors.set(error, new Set([source]))
        }
    }

    static showErrors() {
        if (this.countErrors() == 0) {
            return
        }
        let errors = document.getElementById('runtime-errors')
        if (errors == null) {
            errors = document.createElement('div')
            errors.setAttribute('id', 'runtime-errors')
            this.setStyle(document.body, {
                border: '2px solid red'
            })
            this.setStyle(errors, {position: 'absolute',
                top: '0px',
                padding: '8px',
                width: '100%',
                background: 'red',
                color: 'white'})
            document.body.appendChild(errors)
            let counter = document.createElement('div')
            counter.setAttribute('id', 'runtime-errors-counter')
            this.setStyle(counter, {borderRadius: '50%',
                width: '32px',
                height: '32px',
                background: 'white',
                color: 'red',
                fontSize: '18px',
                textAlign: 'center',
                lineHeight: '32px',
                verticalAlign: 'middle'})
            counter.innerHTML = '1'
            errors.appendChild(counter)

            let header = document.createElement('div')
            this.setStyle(header, {position: 'absolute',
                top: '6px',
                left: '48px',
                height: '44px',
                fontSize: '32px'})
            header.innerHTML = 'Runtime Errors'
            errors.appendChild(header)
            errors.addEventListener('click', this.toggleErrors.bind(this))
        }
        let counter = document.getElementById('runtime-errors-counter')
        counter.innerHTML = this.countErrors()
    }

    static expandErrors() {
        let errors = document.getElementById('runtime-errors')
        for(let error of recordedErrors.keys()) {
            for(var source of recordedErrors.get(error)) {
                if (typeof(source) == 'undefined') {
                    source = 'See console for details'
                    return
                }
                let info = document.createElement('div')
                info.className = 'info'
                info.style.wordWrap = 'break-word'
                info.innerHTML = error + `<br/><small>${source}</small>`
                errors.appendChild(info)
            }
        }
    }

    static toggleErrors() {
        let errors = document.getElementById('runtime-errors')
        let infos = errors.querySelectorAll('.info')
        if (infos.length > 0) {
            infos.forEach((info) => errors.removeChild(info))
        }
        else {
            this.expandErrors()
        }
    }

    static removeError(event) {
        console.log('removeError', event)
        if (recordedErrors.has(event.error)) {
            let sources = recordedErrors.get(event.error)
            sources.delete(event.source)
            console.log('sources', sources)
        }
    }

    static registerGlobalErrorHandler() {
        // Register more informative error handler
        window.addEventListener('error', (event) => {
        //     if (typeof(event.error) == 'undefined') {
//                 console.info("Catched undefined error", event)
//             }
            this.appendError(event.error, event.filename)
        }, true)

        document.addEventListener('DOMContentLoaded', (event) => {
            this.showErrors()
        })
    }

    static registerFrameAwaitErrors() {
        let iframes = document.getElementsByTagName('iframe')
        for(let i=0; i<iframes.length; i++) {
            let target = iframes[i]
            target.iframeTimeout = setTimeout(
                () => {
                    this.appendError('Cannot load iframe', target.src)},
                frameErrorTimeout)
            target.onload = () => {
                clearTimeout(target.iframeTimeout)
            }
        }
    }
}

Errors.registerGlobalErrorHandler()
