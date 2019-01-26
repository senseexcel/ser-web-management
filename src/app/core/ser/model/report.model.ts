import { ISerReport } from '../api/report.interface';
import { GeneralSettingsModel } from './general-settings.model';
import { TemplateModel } from './template.model';
import { ConnectionModel } from './connection.model';
import { DeliveryModel } from './delivery.model';
import { DataModel, importData, Validate, Validators, OnValidationChange, mapDataTo } from '@smc/modules/smc-common/utils/model';

@DataModel
export class ReportModel implements ISerReport, OnValidationChange {

    private reportGeneral: GeneralSettingsModel;

    private reportTemplate: TemplateModel;

    private reportConnections: ConnectionModel;

    private reportDistribute: DeliveryModel;

    private reportValid = false;

    public constructor() {
        this.reportGeneral     = new GeneralSettingsModel();
        this.reportTemplate    = new TemplateModel();
        this.reportConnections = new ConnectionModel();
        this.reportDistribute  = new DeliveryModel();
    }

    @Validate([Validators.Required])
    @mapDataTo(ConnectionModel)
    public set connections(connections: ConnectionModel) {
        this.reportConnections = connections;
    }

    @Validate([Validators.Required])
    @mapDataTo(DeliveryModel)
    public set distribute(delivery: DeliveryModel) {
        this.reportDistribute = delivery;
    }

    @Validate([Validators.Required])
    @mapDataTo(GeneralSettingsModel)
    public set general(value: GeneralSettingsModel) {
        this.reportGeneral.raw = value;
    }

    @Validate([Validators.Required])
    @mapDataTo(TemplateModel)
    public set template(data: TemplateModel) {
        this.reportTemplate.raw = data;
    }

    public get connections(): ConnectionModel {
        return this.reportConnections;
    }

    public get distribute(): DeliveryModel {
        return this.reportDistribute;
    }

    public get general(): GeneralSettingsModel {
        return this.reportGeneral;
    }

    public get template(): TemplateModel {
        return this.reportTemplate;
    }

    @importData
    public set raw(data: ISerReport) {
    }

    public onModelValidationChange(isValid: boolean): void {
        this.reportValid = isValid;
    }

    public get isValid(): boolean {
        return this.reportValid;
    }

    public get raw(): ISerReport {

        const general     = this.reportGeneral     as GeneralSettingsModel;
        const template    = this.reportTemplate    as TemplateModel;
        const connections = this.reportConnections as ConnectionModel;
        const distribute  = this.reportDistribute  as DeliveryModel;

        return {
            general    : general.raw,
            template   : template.raw,
            connections: connections.raw,
            distribute : distribute.raw
        };
    }
}
