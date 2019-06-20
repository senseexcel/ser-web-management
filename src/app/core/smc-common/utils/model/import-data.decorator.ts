import { IDataNode } from '../../api';

export function importData(target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor {

    if (!descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    return {
        set: function (data: IDataNode) {
            Object.keys(data).forEach((property: string) => {
                const targetDescriptor = Object.getOwnPropertyDescriptor(target, property);

                if (targetDescriptor.set instanceof Function) {
                    targetDescriptor.set.call(this, data[property]);
                }

            });
            return descriptor.set.call(this, data);
        },
        enumerable: true,
        configurable: true
    };
}
