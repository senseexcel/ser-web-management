import { IMailSettings, IFileSettings, IHubSettings } from 'ser.api';
import { ISerDelivery } from '../api/ser-delivery.interface';

export class DeliveryModel implements ISerDelivery {

    private deliveryEmailSettings: IMailSettings;

    private deliveryFileSettings: IFileSettings;

    private deliveryHubSettings: IHubSettings;

    public get mail(): IMailSettings {
        return this.deliveryEmailSettings;
    }

    public get file(): IFileSettings {
        return this.deliveryFileSettings;
    }

    public get hub(): IHubSettings {
        return this.deliveryHubSettings;
    }

    public set mail(settings: IMailSettings) {
        this.deliveryEmailSettings = settings;
    }

    public set file(settings: IFileSettings) {
        this.deliveryFileSettings = settings;
    }

    public set hub(settings: IHubSettings) {
        this.deliveryHubSettings = settings;
    }
}
