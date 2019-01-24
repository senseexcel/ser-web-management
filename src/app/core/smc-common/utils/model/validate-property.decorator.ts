import { IDataNode } from '../../api';

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
export const DATA_MODEL_VALIDATION = { meta: 'validation' };

function initializeMetaData(target): Set<IDataNode> {
    let metaData = Object.getOwnPropertyDescriptor(target, '__smc_model_meta__');
    if (!metaData) {
        Object.defineProperties(target, {
            __smc_model_meta__: {
                value: new WeakMap(),
                configurable: false,
                writable: false,
                enumerable: false,
            }
        });
        metaData = Object.getOwnPropertyDescriptor(target, '__smc_model_meta__');
    }

    if (!metaData.value.has(DATA_MODEL_VALIDATION)) {
        metaData.value.set(DATA_MODEL_VALIDATION, new Set());
    }
    return metaData.value.get(DATA_MODEL_VALIDATION);
}

export function Validate<T>(validators: Array<(property: T) => boolean>) {
    return (target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor => {
        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const validationMetaDataMap = initializeMetaData(target);
        validationMetaDataMap.add({
            key,
            valid: validators.indexOf(Validators.Required) === -1
        });
        const newSetter = {
            set: function (value: T) {
                const isValid = validators.every((validator) => validator(value));
                if (!isValid) {
                    throw new Error('invalid');
                }
                return descriptor.set.call(this, value);
            },
            enumerable: true,
            configurable: true
        };
        return newSetter;
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

    public static Required(property: any): boolean {
        return property !== null && property !== undefined;
    }

    public static NotEmpty(property: any): boolean {
        return property.replace(/(^\s*|\s*$)/g, '').length !== 0;
    }

    /**
     * validate given value is number
     *
     * @readonly
     * @static
     * @memberof Validators
     */
    public static isNumber(value: number): boolean {
        let isNumber = true;
        isNumber = isNumber && Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === 'number';
        isNumber = isNumber && !isNaN(value);
        return isNumber;
    }

    public static isString(value: string): boolean {
        let isString = true;
        isString = isString && Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === 'string';
        return isString;
    }
}
