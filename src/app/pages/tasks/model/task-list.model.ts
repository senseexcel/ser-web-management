import { IApp } from '@smc/modules/ser';

export class TaskList {

    private taskApp: IApp;

    public constructor() {}

    public set app(app: IApp) {
        this.taskApp = app;
    }
}
