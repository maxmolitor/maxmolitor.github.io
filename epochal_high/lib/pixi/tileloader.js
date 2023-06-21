let loadQueue = []
let pendingRequests = new Map()
const batchSize = 8
const debug = false

function load() {
  
    while(loadQueue.length>0 && pendingRequests.size<batchSize) {
        let tile = loadQueue.shift()
        let [col, row, url] = tile
        let xhr = new XMLHttpRequest()
        xhr.responseType = "arraybuffer"
        xhr.onload = (event) => {
            pendingRequests.delete(url)
            let buffer = xhr.response
            postMessage({ success: true, url, col, row, buffer}, [buffer])
        }
        xhr.onerror = (event) => {
            pendingRequests.delete(url)
            let buffer = null
            postMessage({ success: false, url, col, row, buffer})
        }
        xhr.open('GET', url, true)
        xhr.send()
        pendingRequests.set(url, xhr)
    }
    if (loadQueue.length>0)
        setTimeout(load, 1000/120)
    else {
        if (debug) console.log("Ready")
    }
}

self.onmessage = (event) => {
    let msg = event.data
    switch(msg.command) {
        case 'load':
            for(let tile of msg.tiles) {
                loadQueue.push(tile)
            }
            load()
            break
        case 'abort':
            loadQueue = []
            for(let xhr of pendingRequests.values()) {
                xhr.abort()
            }
            if (debug) console.log('Abort')
            break
        default:
            console.warn('Unknown worker command: ' +  msg.command)
    }
}
