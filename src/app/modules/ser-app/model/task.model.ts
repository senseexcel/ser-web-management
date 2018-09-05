import { ISerReport, ISerTask } from '../api';

export class TaskModel implements ISerTask {

    private taskReports: ISerReport[];

    public set reports(reports: ISerReport[]) {
        this.taskReports = reports;
    }

    public get reports(): ISerReport[] {
        return this.taskReports;
    }
}
