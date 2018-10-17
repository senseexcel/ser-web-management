import { IModel } from '@core/api/model.interface';

/**
 * model for task excution data
 *
 * @export
 * @class ExecutionModel
 */
export class TriggerModel implements IModel {

    private triggerStartTime: number;

    private triggerEnabled: boolean;

    public get enabled(): boolean {
        return this.triggerEnabled;
    }

    public set enabled(enabled: boolean) {
        this.triggerEnabled = enabled;
    }

    public get startTime(): number {
        return this.triggerStartTime;
    }

    public set startTime(time: number) {
        this.triggerStartTime = time;
    }

    public get raw() {
        return {
            enabled: this.enabled,
            startTime: this.startTime
        };
    }
}
