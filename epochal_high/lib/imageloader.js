let loadQueue = []
let pendingRequests = new Map()

function onload(event) {
    let url = event.target.responseURL
    pendingRequests.delete(url)
    postMessage({ success: true, url: url })
}

function onerror(event) {
    let url = event.target.responseURL
    pendingRequests.delete(url)
    postMessage({ success: false, url: url })
}

function load() {
    loadQueue.forEach((url) => {
        let xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = onload
        xhr.onerror = onerror
        xhr.open('GET', url, true)
        xhr.send()
        pendingRequests.set(url, xhr)
    })
}

self.onmessage = (event) => {
    let msg = event.data
    switch(msg.command) {
        case 'load':
            for(let url of msg.urls) {
                console.log('Load', url)
                loadQueue.push(url)
            }
            load()
            break
        case 'abort':
            loadQueue = []
            for(let xhr of pendingRequests.values()) {
                console.log('Abort')
                xhr.abort()
            }
            break
        default:
            console.warn('Unknown worker command: ' +  msg.command)
    }

}
