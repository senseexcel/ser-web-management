import { IMailSettings, IFileSettings, IHubSettings } from 'ser.api';

export interface ISerDelivery {

    mailSettings: IMailSettings;

    fileSettings: IFileSettings;

    hubSettings: IHubSettings;
}
