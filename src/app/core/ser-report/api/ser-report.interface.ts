import { ISerConnection, ISerGeneral, ISerTemplate, IFileSettings, IHubSettings, IMailSettings } from 'ser.api';
import { ISerDelivery } from './ser-delivery.interface';

export interface ISerReport {

    connections: ISerConnection;

    distribute: ISerDelivery;

    general: ISerGeneral;

    template: ISerTemplate;
}
