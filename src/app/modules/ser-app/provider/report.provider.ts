import * as hjson from 'hjson';
import { Injectable } from '@angular/core';
import { ISerConnection, ISerGeneral, ISerTemplate } from 'ser.api';
import { ISerConfig, ISerTask, ISerReport, IScriptData } from '../api';
import { ConfigModel, ReportModel, TaskModel, ConnectionModel, GeneralModel, TemplateModel } from '../model';

@Injectable()
export class ReportProvider {

    // should create new report config
    constructor() {}

    /**
     * create empty sense excel reporting configuration object
     *
     * @returns {ISerConfig}
     * @memberof ReportProvider
     */
    public createConfiguration(): ISerConfig {

        const config: ISerConfig = new ConfigModel();
        const task: ISerTask     = new TaskModel();
        const report: ISerReport = this.createReport();

        task.reports = [report];
        config.tasks = [task];

        return config;
    }

    public createReport(): ISerReport {

        const report: ISerReport = new ReportModel();

        report.connections = new ConnectionModel();
        report.general     = new GeneralModel();
        report.template    = new TemplateModel();

        return report;
    }

    /**
     * parse sense excel reporting script
     *
     * @param {string} source
     * @returns {IScriptData}
     * @memberof ReportProvider
     */
    public parseSerAppScript(source: string): IScriptData {

        const indexStart = source.indexOf('SER.START');

        if ( indexStart === -1 ) {
            throw new Error('no ser data available');
        }

        const taskNamePattern = new RegExp(`SER\.START.*?\\((.*?)\\)`);
        const taskName = source.match(taskNamePattern)[1];
        const jsonPattern = new RegExp(`SET\\s*${taskName}.*?\u00B4([^\u00B4]*)`, 'm');

        const result = source.match(jsonPattern);
        const start = result.index + result[0].length - result[1].length;
        const end   = start + result[1].length;

        return {
            after : source.substr(end),
            before: source.substr(0, start),
            config: result[1]
        };
    }

    /**
     *
     *
     * @param {ISerConfig} config
     * @returns {string}
     * @memberof ReportProvider
     */
    public serializeConfiguration(config: ISerConfig): string {
        return hjson.stringify(config);
    }

    /**
     *
     *
     * @param {string} data
     * @returns {ISerConfig}
     * @memberof ReportProvider
     */
    public loadConfigurationFromJson(data: string): ISerConfig {
        const config: ISerConfig = hjson.parse(data);
        return config;
    }

    /**
     *
     *
     * @param {ISerReport} report
     * @param {ISerConnection} data
     * @memberof ReportProvider
     */
    public writeConnectionConfiguration(report: ISerReport, data: ISerConnection) {
        report.connections = data;
    }

    /**
     *
     *
     * @param {ISerReport} report
     * @param {ISerGeneral} data
     * @memberof ReportProvider
     */
    public writeGeneralConfiguration(report: ISerReport, data: ISerGeneral) {
        report.general = data;
    }

    /**
     *
     *
     * @param {ISerReport} report
     * @param {ISerTemplate} data
     * @memberof ReportProvider
     */
    public writeTemplateConfiguration(report: ISerReport, data: ISerTemplate) {
        report.template = data;
    }
}
