import { Injectable } from '@angular/core';
import { ISerDelivery } from '../api/ser-delivery.interface';
import { IDeliverySettings } from 'ser.api';
import { DeliveryModel, EmailModel, FileModel, MailServerSettingsModel, HubModel } from '../model';
import { ISerReport } from '../api/ser-report.interface';

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

    public getRawValue(report: ISerReport): ISerReport {

        const mailServer = report.distribute.mail.mailServer;
        const mail       = report.distribute.mail;
        mail.mailServer = mailServer;

        const distribute: ISerDelivery = {
            file: report.distribute.file,
            hub:  report.distribute.hub,
            mail
        };

        return {
            connections: report.connections,
            distribute,
            general:     report.general,
            template:    report.template
        };
    }
}
