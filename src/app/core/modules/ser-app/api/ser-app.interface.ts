import { ISerReport } from '@core/modules/ser-report/api/ser-report.interface';
import { ISerScriptData } from '@core/modules/ser-script/api/ser-script-data.interface';
import { ITask } from '@core/modules/ser-engine/api/task.interface';

export interface ISerApp {

    appId: string;

    report: ISerReport;

    script: ISerScriptData;

    tasks: ITask[];

    title: string;

    invalid: boolean;
}
