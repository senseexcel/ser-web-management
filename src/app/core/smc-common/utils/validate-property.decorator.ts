/**
 * Validate Property Decorator
 *
 * @export
 * @template T
 * @param {Array<(property: T) => boolean>} validators
 * @example
 * class MyModel {
 *  @Validate<number>([Validators.isNumber])
 *  public set myIntegerValue(value: number) {
 *     ...
 *  }
 * }
 */
export function Validate<T>(validators: Array<(property: T) => boolean>) {

    return (target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor => {

        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }

        return {
            set: function (value: T) {
                const isValid = validators.every((validator) => validator(value));
                if (!isValid) {
                    value = null;
                }
                return descriptor.set.call(this, value);
            },
            enumerable: true,
            configurable: true
        };
    };
}

/**
 *
 *
 * @export
 * @abstract
 * @class Validators
 */
export abstract class Validators {

    public static get Required(): (property: any) => boolean {
        return (property) => property !== null && property !== undefined;
    }

    public static get NotEmpty(): (property: any) => boolean {
        return (property) => property.replace(/(^\s*|\s*$)/g, '').length !== 0;
    }

    /**
     * validate given value is number
     *
     * @readonly
     * @static
     * @memberof Validators
     */
    public static get isNumber(): (property: number) => boolean {
        return (property: number) => {
            let isNumber = true;
            isNumber = isNumber && Object.prototype.toString.call(property).slice(8, -1).toLowerCase() === 'number';
            isNumber = isNumber && !isNaN(property);
            return isNumber;
        };
    }

    public static get isString(): (property: number) => boolean {
        return (property: number) => {
            let isString = true;
            isString = isString && Object.prototype.toString.call(property).slice(8, -1).toLowerCase() === 'string';
            return isString;
        };
    }
}
