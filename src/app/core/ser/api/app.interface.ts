import { ISerReport } from './report.interface';
import { ISerScriptData } from './ser-script-data.interface';
import { ITask } from '@smc/modules/qrs';

export interface IApp {

    appId: string;

    report: ISerReport;

    script: ISerScriptData;

    tasks: ITask[];

    title: string;

    invalid: boolean;
}
