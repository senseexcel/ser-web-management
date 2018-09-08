import { ISerApp } from '../api/ser-app.interface';
import { ISerReport } from '@core/modules/ser-report/api/ser-report.interface';
import { ISerScriptData } from '@core/modules/ser-script/api/ser-script-data.interface';

export class SerApp implements ISerApp {

    private serAppId: string;

    private serAppReport: ISerReport;

    private serAppScript: ISerScriptData;

    private serAppTitle: string;

    public set appId(appId: string) {
        this.serAppId = appId;
    }

    public set report(report: ISerReport) {
        this.serAppReport = report;
    }

    public set script(script: ISerScriptData) {
        this.serAppScript = script;
    }

    public set title(title: string) {
        this.serAppTitle = title;
    }

    public get appId(): string {
        return this.serAppId;
    }

    public get report(): ISerReport {
        return this.serAppReport;
    }

    public get script(): ISerScriptData {
        return this.serAppScript;
    }

    public get title(): string {
        return this.serAppTitle;
    }
}
