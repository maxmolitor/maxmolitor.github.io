import Interface from './interface.js'

/** Basic Application object to be used as a singleton.
    Provides an interface for automatic testing and common device specific
    feature detection.
*/

export class IApp extends Interface {
    /** Build the app by registering event handlers,
     *   adding DOM elements, instanciating templates, etc...
     */
    setup() { return this }

    /** Run the application by starting a main loop, ...
     */
    run() { return this }
}

export default class App extends Object {
    /** Override this method to build your app.
    */
    setup() {
        return this
    }

    /** Start and run the application. Override this method with everything
    that is needed to maintain your App, main loops, etc.
    */
    run() {
        return this
    }

    /** Defines all test suites. Overwrite this method to ensure that
    all testable aspects of your App are evaluated.
    */
    allTests() {
        console.log('Overwrite App.allTests()')
    }

    /** Run all tests. Should return 'ok' and the amount of time needed to
    run App.allTests() or a failure message with diagnostic error decription.
    @return {array} - array with 'ok' as first element and needed time as
                      second element or "Tests failed" and an error string
    */
    runTests() {
        var start = performance.now()
        try {
            this.allTests()
            var end = performance.now()
            return ['ok', end - start]
        }
        catch(e) {
            console.trace()
            return ['Tests failed', e.message]
        }
    }
}

IApp.implementedBy(App)
