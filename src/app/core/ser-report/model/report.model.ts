import { ISerGeneral, ISerTemplate, ISerConnection, IDeliverySettings } from 'ser.api';
import { ISerReport } from '../api/ser-report.interface';
import { ISerDelivery } from '../api/ser-delivery.interface';

export class ReportModel implements ISerReport {

    private reportGeneral: ISerGeneral;

    private reportTemplate: ISerTemplate;

    private reportConnections: ISerConnection;

    public set connections(connections: ISerConnection) {
        this.reportConnections = connections;
    }

    public set delivery(delivery: ISerDelivery) {
    }

    public set general(value: ISerGeneral) {
        this.reportGeneral = value;
    }

    public set template(template: ISerTemplate) {
        this.reportTemplate = template;
    }

    public get connections(): ISerConnection {
        return this.reportConnections;
    }

    public get general(): ISerGeneral {
        return this.reportGeneral;
    }

    public get template(): ISerTemplate {
        return this.reportTemplate;
    }
}
