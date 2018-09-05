import { Injectable } from '@angular/core';
import { ISerConnection } from 'ser.api';
import { ISerConfig, ISerTask, ISerReport } from '../api';
import { ConfigModel, ReportModel, TaskModel, ConnectionModel, GeneralModel, TemplateModel } from '../model';

@Injectable()
export class ReportConfigProvider {

    // should create new report config
    constructor() {}

    public createConfiguration(): ISerConfig {

        const config: ISerConfig = new ConfigModel();
        const task: ISerTask     = new TaskModel();
        const report: ISerReport = new ReportModel();

        report.connections = new ConnectionModel();
        report.general     = new GeneralModel();
        report.template    = new TemplateModel();

        task.reports = [report];
        config.tasks = [task];

        return config;
    }

    public importConfiguration(data: ISerConfig): ISerConfig {
        const config: ISerConfig = this.createConfiguration();
        const report: ISerReport = data.tasks[0].reports[0];

        const connection: ISerConnection = new ConnectionModel();
        connection.app = report.connections[0].app;

        return config;
    }
}
