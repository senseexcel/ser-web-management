import { ISerScriptData, ReportModel } from '@smc/modules/ser';
import { ISerReport } from './ser-config.interface';

export interface IReportCache {

    /** app id we currently edit */
    app: string;

    /** app script */
    script: ISerScriptData;

    /** report data */
    report: ReportModel;

    raw: ISerReport;
}
