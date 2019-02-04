import { IModel } from '@smc/modules/smc-common/api/model.interface';

/**
 * model for task excution data
 *
 * @export
 * @class ExecutionModel
 */
export class TriggerModel implements IModel {

    private triggerHour: number;

    private triggerEnabled: boolean;

    public get enabled(): boolean {
        return this.triggerEnabled;
    }

    public set enabled(enabled: boolean) {
        this.triggerEnabled = enabled;
    }

    public set hour(hour: number) {
        this.triggerHour = hour;
    }

    public get hour(): number {
        return this.triggerHour;
    }

    public get raw() {
        return {
            enabled: this.enabled,
            hour:    this.hour
        };
    }
}
