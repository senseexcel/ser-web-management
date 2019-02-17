import { IDataNode, IModel } from '../../api';

export function mapToArray<T>() {

    return (target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor => {

        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }

        return {
            set: function (data: IDataNode[]|IDataNode) {
                let value = data;
                if (!Array.isArray(value)) {
                    value = value !== null && value !== undefined ? [value] : [];
                }
                return descriptor.set.call(this, value);
            },
            enumerable: true,
            configurable: true
        };
    };
}

