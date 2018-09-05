import { ISerConfig, IScriptData, ISerReport } from '@ser-app/api';

export class QAppModel {

    private appInstance: EngineAPI.IApp;

    private appSerReport: ISerReport;

    private appScriptData: IScriptData;

    public set app(app: EngineAPI.IApp) {
        this.appInstance = app;
    }

    public get app(): EngineAPI.IApp {
        return this.appInstance;
    }

    public set report(config: ISerReport) {
        this.appSerReport = config;
    }

    public get report(): ISerReport {
        return this.appSerReport;
    }

    public set scriptData(data: IScriptData) {
        this.appScriptData = data;
    }

    public get scriptData(): IScriptData {
        return this.appScriptData;
    }
}
