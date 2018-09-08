import { ISerGeneral, ISerTemplate, ISerConnection } from 'ser.api';
import { ISerReport } from '../api/ser-report.interface';
import { ISerDelivery } from '../api/ser-delivery.interface';

export class ReportModel implements ISerReport {

    private reportGeneral: ISerGeneral;

    private reportTemplate: ISerTemplate;

    private reportConnections: ISerConnection;

    private reportDistribute: ISerDelivery;

    public set connections(connections: ISerConnection) {
        this.reportConnections = connections;
    }

    public set distribute(delivery: ISerDelivery) {
        this.reportDistribute = delivery;
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

    public get distribute(): ISerDelivery {
        return this.reportDistribute;
    }

    public get general(): ISerGeneral {
        return this.reportGeneral;
    }

    public get template(): ISerTemplate {
        return this.reportTemplate;
    }
}
