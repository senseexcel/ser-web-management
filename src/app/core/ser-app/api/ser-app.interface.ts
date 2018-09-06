import { ISerReport } from '@core/ser-report/api/ser-report.interface';
import { ISerScriptData } from '@core/ser-script/api/ser-script-data.interface';

export interface ISerApp {

    appId: string;

    report: ISerReport;

    script: ISerScriptData;

    title: string;
}
