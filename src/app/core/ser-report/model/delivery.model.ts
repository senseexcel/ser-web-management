import { IMailSettings, IFileSettings, IHubSettings } from 'ser.api';
import { ISerDelivery } from '../api/ser-delivery.interface';

export class DeliveryModel implements ISerDelivery {

    private deliveryEmailSettings: IMailSettings;

    private deliveryFileSettings: IFileSettings;

    private deliveryHubSettings: IHubSettings;

    public get mailSettings(): IMailSettings {
        return this.deliveryEmailSettings;
    }

    public get fileSettings(): IFileSettings {
        return this.deliveryFileSettings;
    }

    public get hubSettings(): IHubSettings {
        return this.deliveryHubSettings;
    }

    public set mailSettings(settings: IMailSettings) {
        this.deliveryEmailSettings = settings;
    }

    public set fileSettings(settings: IFileSettings) {
        this.deliveryFileSettings = settings;
    }

    public set hubSettings(settings: IHubSettings) {
        this.hubSettings = settings;
    }
}
