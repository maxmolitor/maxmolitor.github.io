export class Inspect {
    // Code inspection functions

    static allScriptSources()
    {
        let sources = []
        let scripts = document.getElementsByTagName('script')
        for (let i = 0; i < scripts.length; i++) {
            console.dir(scripts[i])
            sources.push(scripts[i])
        }
        return sources
    }
}
