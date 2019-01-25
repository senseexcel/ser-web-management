import { ISerGeneral, ISerTemplate, ISerConnection } from 'ser.api';
import { ISerReport } from '../api/report.interface';
import { ISerDelivery } from '../api/ser-delivery.interface';

import { GeneralSettingsModel } from './general-settings.model';
import { TemplateModel } from './template.model';
import { ConnectionModel } from './connection.model';
import { DeliveryModel } from './delivery.model';
import { DataModel, importData, Validate, Validators, OnValidationChange, mapDataTo } from '@smc/modules/smc-common/utils/model';

@DataModel
export class ReportModel implements ISerReport, OnValidationChange {

    private reportGeneral: GeneralSettingsModel;

    private reportTemplate: TemplateModel;

    private reportConnections: ISerConnection;

    private reportDistribute: ISerDelivery;

    private reportValid = false;

    public constructor() {
        this.reportGeneral     = new GeneralSettingsModel();
        this.reportTemplate    = new TemplateModel();
        this.reportConnections = new ConnectionModel();
        this.reportDistribute  = new DeliveryModel();
    }

    @Validate([Validators.Required])
    @mapDataTo(ConnectionModel)
    public set connections(connections: ISerConnection) {
        this.reportConnections = connections;
    }

    @Validate([Validators.Required])
    @mapDataTo(DeliveryModel)
    public set distribute(delivery: ISerDelivery) {
        this.reportDistribute = delivery;
    }

    @Validate([Validators.Required])
    @mapDataTo(GeneralSettingsModel)
    public set general(value: ISerGeneral) {
        this.reportGeneral.raw = value;
    }

    @Validate([Validators.Required])
    @mapDataTo(TemplateModel)
    public set template(data: ISerTemplate) {
        this.reportTemplate.raw = data;
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
