import { ISerConfig, ISerTask } from '../api';

export class ConfigModel implements  ISerConfig {

    private configTasks: ISerTask[];

    public set tasks(tasks: ISerTask[]) {
        this.configTasks = tasks;
    }

    public get tasks(): ISerTask[] {
        return this.configTasks;
    }
}
