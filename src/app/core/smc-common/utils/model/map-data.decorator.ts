import { IDataNode, IModel } from '../../api';

 interface ModelConstructor<T> {
    new (...args: any[]): T;
}

export function mapDataTo<T>(constructor: ModelConstructor<IModel>) {

    return (target, key = null, descriptor: PropertyDescriptor): PropertyDescriptor => {

        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }

        function mapDataToModel(modelData: IDataNode) {
            const model = new constructor();
            const modelProperties: string[] = Object.getOwnPropertyNames(constructor.prototype);
            Object.keys(modelData).forEach((prop) => {
                if (modelProperties.indexOf(prop) > -1) {
                    model[prop] = modelData[prop];
                }
            });
            return model;
        }

        return {
            set: function (data: IDataNode[]|IDataNode) {
                let value = data;

                if (Array.isArray(value)) {
                    value = value.map((modelData) => mapDataToModel(modelData));
                } else {
                    value = mapDataToModel(value);
                }
                return descriptor.set.call(this, value);
            },
            enumerable: true,
            configurable: true
        };
    };
}
