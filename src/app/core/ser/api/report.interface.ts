import { ISerConnection, ISerGeneral, ISerTemplate } from 'ser.api';
import { ISerDelivery } from './ser-delivery.interface';

export interface ISerReport {

    connections: ISerConnection;

    distribute: ISerDelivery;

    general: ISerGeneral;

    template: ISerTemplate;
}
