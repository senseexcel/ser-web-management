import { DATA_MODEL_VALIDATION } from '../validate-property.decorator';
import { IDataNode } from '@smc/modules/smc-common';

const enum PROPERTIES {
    VALIDATION_MAP = '__MODEL_VALIDATION_MAP__'
}

/**
 * Model Validation Mixin
 */
export function ModelValidation() {

    const self = this;

    const VALIDATION_MAP: Map<IDataNode, boolean> = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(self), PROPERTIES.VALIDATION_MAP).value;

    /**
     * if validation was successfully and old value was false
     * call onValidationChange
     */
    this.__onModelValidationSuccess__ = function(property: IDataNode, value) {
        if (VALIDATION_MAP.has(property) && !VALIDATION_MAP.get(property)) {
            VALIDATION_MAP.set(property, true);
            onValidationChange();
        }
    };

    /**
     * if validation failed and old value was true
     * call onValidationChange
     */
    this.__onModelValidationError__ = function(property: IDataNode) {
        if (VALIDATION_MAP.has(property) && VALIDATION_MAP.get(property)) {
            VALIDATION_MAP.set(property, false);
            onValidationChange();
        }
    };

    /**
     * validation state has been changed try to call callback on
     * model
     */
    function onValidationChange() {
        const callback = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(self), 'onModelValidationChange');

        if (callback && callback.value) {
            const isValid = Array.from(VALIDATION_MAP.values()).every(valid => valid);
            callback.value.call(self, isValid);
        }
    }
}

/**
 * initialize ModelValidation
 *
 * @static
 */
ModelValidation.initialize = function(target: () => void, metaData: PropertyDescriptor) {

    // add validation to data model
    if (metaData && metaData.value.has(DATA_MODEL_VALIDATION)) {

        Object.defineProperty(target.prototype, PROPERTIES.VALIDATION_MAP, {
            value: (() => {
                const data = Array.from<IDataNode>(metaData.value.get(DATA_MODEL_VALIDATION));
                return new Map<IDataNode, boolean>(
                    data.map(meta => [meta, meta.valid]) as any
                );
            })(),
            writable: false
        });

        Array.from(metaData.value.get(DATA_MODEL_VALIDATION))
            .forEach((meta: IDataNode) => {
                const _source = Object.getOwnPropertyDescriptor(target.prototype, meta.key);
                // define multiple setter which decorate the validations
                Object.defineProperty(target.prototype, `${meta.key}`, {
                    set: function (value) {
                        try {
                            _source.set.call(this, value);
                            this.__onModelValidationSuccess__(meta, value);
                        } catch (error) {
                            // set model to invalid since one has failed
                            this.__onModelValidationError__(meta, error);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            });
    }
};
