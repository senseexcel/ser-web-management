import { ISerGeneral, ISerTemplate, ISerConnection } from 'ser.api';
import { ISerReport } from '../api';

export class ReportModel implements ISerReport {

    private reportGeneral: ISerGeneral;

    private reportTemplate: ISerTemplate;

    private reportConnections: ISerConnection;

    public set connections(connections: ISerConnection) {
        this.reportConnections = connections;
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
