import { IMailSettings, IFileSettings, IHubSettings } from 'ser.api';
import { ISerDelivery } from '../api/ser-delivery.interface';
import { FileModel } from './file.model';
import { HubModel } from './hub.model';
import { EmailModel } from './email.model';
import { mapDataTo, importData } from '@smc/modules/smc-common/utils';

export class DeliveryModel implements ISerDelivery {

    private deliveryEmailSettings: EmailModel;

    private deliveryFileSettings: FileModel;

    private deliveryHubSettings: HubModel;

    public constructor() {
        this.deliveryEmailSettings = new EmailModel();
        this.deliveryFileSettings  = new FileModel();
        this.deliveryHubSettings   = new HubModel();
    }

    public get mail(): EmailModel {
        return this.deliveryEmailSettings;
    }

    public get file(): FileModel {
        return this.deliveryFileSettings;
    }

    public get hub(): HubModel {
        return this.deliveryHubSettings;
    }

    @mapDataTo(EmailModel)
    public set mail(settings: EmailModel) {
        this.deliveryEmailSettings = settings;
    }

    @mapDataTo(FileModel)
    public set file(settings: FileModel) {
        this.deliveryFileSettings = settings;
    }

    @mapDataTo(HubModel)
    public set hub(settings: HubModel) {
        this.deliveryHubSettings = settings;
    }

    @importData
    public set raw(data: ISerDelivery) {}

    public get raw(): ISerDelivery {

        const mail = this.mail as EmailModel;
        const hub  = this.hub  as HubModel;
        const file = this.file as FileModel;

        return {
            mail: mail.raw,
            file: file.raw,
            hub:  hub.raw,
        };
    }
}
