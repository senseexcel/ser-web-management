import { ModelValidation } from './mixins/model-validation.mixin';

/**
 * Decorator for DataModels
 *
 * @export
 * @param {*} target
 * @returns
 */
export function DataModel(target) {

    // save a reference to the original constructor
    const original = target;
    const metaData: PropertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, '__smc_model_meta__');

    // a utility function to generate instances of a class
    function construct(constructor, args) {
        const c: any = function () {
            // inject mixins
            ModelValidation.call(this);
            return constructor.apply(this, args);
        };
        c.prototype = original.prototype;
        return new c;
    }

    // the new constructor behaviour
    const newConstructor: any = function (...args) {
        const instance = construct(original, args);
        return instance;
    };
    // copy prototype so intanceof operator still works
    newConstructor.prototype = original.prototype;
    ModelValidation.initialize(newConstructor, metaData);

    // return new constructor (will override original)
    return newConstructor;
}
