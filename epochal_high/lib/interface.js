// In order to test this interface implementation run jsc interface.js

export default class Interface {
    // Abstract interface that should be extended in interface subclasses.
    // By convention all interfaces should start with an upper 'I'

    static implementationError(klass) {
        let interfaceKeys = Reflect.ownKeys(this.prototype)
        let classKeys = Reflect.ownKeys(klass.prototype)
        for(let key of interfaceKeys) {
            let interfaceDesc = this.prototype[key]
            let classDesc = klass.prototype[key]
            if (typeof(classDesc) == 'undefined')
                return 'Missing ' + key
        }
        return null
    }

    static implementedBy(klass) {
        // In the first step only checks whether the methods of this
        // interface are all implemented by the given class
        let error = this.implementationError(klass)
        return error == null
    }

        // TODO: Specify optional methods
//     static optionalMethods() {
//         return [this.onMouseWheel]
//     }
}
