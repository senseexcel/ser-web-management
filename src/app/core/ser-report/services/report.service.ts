import { Injectable } from '@angular/core';
import { ISerDelivery } from '../api/ser-delivery.interface';
import { IDeliverySettings } from 'ser.api';
import { DeliveryModel } from '@core/ser-report/model/delivery.model';
import { EmailModel } from '@core/ser-report/model/delivery/email.model';
import { FileModel } from '@core/ser-report/model/delivery/file.model';

@Injectable()
export class ReportService {


    public createDeliverySettings(settings?: IDeliverySettings): ISerDelivery {

        if ( ! settings ) {
            const delivery = new DeliveryModel();
            delivery.file = new FileModel();
            delivery.mail = new EmailModel();

            return delivery;
        }
    }
}
