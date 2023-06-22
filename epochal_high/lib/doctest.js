// Allows browsers to perform doctests.
// Uses the code highlight package from http://highlightjs.readthedocs.io
// if available

var docTestLogMessages = []

Array.prototype.equals = function(array) {
    return this.length == array.length &&
         this.every( function(this_i,i) { return this_i == array[i] } )
}

export default class Doctest {

    static assert(value) {
        if (!value) {
            throw new Error('Assertion violated')
        }
    }

    static pprint(obj) {
        let stringified = obj.toString()
        if (stringified == '[object Object]')
            return JSON.stringify(obj)
        return stringified
    }

    static expect(expr, value) {
        if (this.pprint(expr) != this.pprint(value)) {
            //throw new Error("got `" + expr + "` but expected `" + value + "`.")
            throw new Error('got `' + this.pprint(expr) + '` but expected `' + this.pprint(value) + '`.')
        }
    }

    static expectError(error, message) {
        let index = error.toString().indexOf(message)
        if (index < 0) {
            throw new Error('got `' + message + '` but expected `' + error + '`.')
        }
    }

    static expectLog(...messages) {
       // if (!docTestLogMessages.equals(messages)) {
            docTestLogMessages.forEach((msg, i) => {
                if (msg != messages[i])
                    throw new Error('Unexpected log message: `' + messages[i] + '`.')
            })
        //    throw new Error('Uups')
        //}
    }

    static log(message) {
        docTestLogMessages.push(message)
    }

    static highlight(code) {
        if (typeof(hljs) == 'undefined')
            return code
        return hljs.highlight('javascript', code)
    }

    static stripLeadingLines(code) {
        let result = []
        let informative = false
        for(let line of code.split('\n')) {
            if (line.trim().length > 0) {
                informative = true
            }
            if (informative)
                result.push(line)
        }
        return result.join('\n')
    }

    static event(type='mouse', {clientX = 0, clientY = 0} = {}) {
        if (type.startsWith('mouse')) {
            return new MouseEvent(type, { clientX, clientY })
        }
        return { type, clientX, clientY }
    }

    static run(replaceExpect=false) {
        if (typeof(hljs) != 'undefined') {
            hljs.initHighlighting()
        }
        let doctests = document.querySelectorAll('.doctest')
        for(let i=0; i<doctests.length; i++) {
            let doctest = doctests[i]
            let code = this.stripLeadingLines(doctest.innerHTML)
            let text = this.highlight(code)
            let pre = document.createElement('pre')
            // See http://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
            // let re = /Doctest\.expect\(([\s\S]*)[\,\s\S]*([\s\S]*)\)/g
            let lines = text.value.split('\n')
            let better = []
            for(let line of lines) {
                if (replaceExpect && line.trim().startsWith('Doctest.expect(')) {
                    line = line.replace(/Doctest\.expect\(/, '>>> ').trim()
                    if (line.endsWith(')') || line.endsWith(',')) {
                        line = line.slice(0, -1)
                    }
                }
                better.push(line)
            }
            pre.innerHTML = better.join('\n') // text.value.replace(re, ">>> $1\n$2")
            doctest.parentNode.replaceChild(pre, doctest)
        }
    }
}

// Needed to make Doctest visible in modules
//window.Doctest = Doctest
