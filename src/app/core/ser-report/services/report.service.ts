import { Injectable } from '@angular/core';
import { ISerDelivery } from '../api/ser-delivery.interface';
import { IDeliverySettings } from 'ser.api';
import { DeliveryModel } from '@core/ser-report/model/delivery.model';
import { EmailModel } from '@core/ser-report/model/delivery/email.model';
import { FileModel } from '@core/ser-report/model/delivery/file.model';
import { MailServerSettingsModel } from '@core/ser-report/model/settings/mail-server-settings.model';
import { HubModel } from '@core/ser-report/model/delivery/hub.model';

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
