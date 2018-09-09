import { Injectable } from '@angular/core';
import { ISerDelivery } from '../api/ser-delivery.interface';
import { IDeliverySettings } from 'ser.api';
import { DeliveryModel, EmailModel, FileModel, MailServerSettingsModel, HubModel } from '../model';

@Injectable()
export class ReportService {


    public createDeliverySettings(settings?: IDeliverySettings): ISerDelivery {

        const delivery = new DeliveryModel();
        delivery.file  = new FileModel();
        delivery.mail  = new EmailModel();
        delivery.hub   = new HubModel();
        delivery.mail.mailServer = new MailServerSettingsModel();

        return delivery;
    }
}
