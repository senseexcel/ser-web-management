import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';

export class TaskList {

    private taskApp: ISerApp;

    public constructor() {}

    public set app(app: ISerApp) {
        this.taskApp = app;
    }
}
