import { IDataNode } from '../../api';

export function importData(target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor {

    if (!descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    return {
        set: function (data: IDataNode) {
            // get all properties, exclude decorated property
            const properties = Object.keys(target).filter((prop) => prop !== key);
            properties.forEach((property) => {
                if (data.hasOwnProperty(property)) {
                    this[property] = data[property];
                }
            });
            // call original descriptor
            return descriptor.set.call(this, data);
        },
        enumerable: true,
        configurable: true
    };
}
