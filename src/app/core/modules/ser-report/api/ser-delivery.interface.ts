import { IMailSettings, IFileSettings, IHubSettings } from 'ser.api';

export interface ISerDelivery {

    mail: IMailSettings;

    file: IFileSettings;

    hub: IHubSettings;
}
