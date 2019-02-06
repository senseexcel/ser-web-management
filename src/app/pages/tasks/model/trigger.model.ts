import { IModel } from '@smc/modules/smc-common/api/model.interface';
import { IDataNode } from '@smc/modules/smc-common';

/**
 * model for task excution data
 *
 * @export
 * @class ExecutionModel
 */
export class TriggerModel implements IModel<IDataNode> {

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

    public get raw(): IDataNode {
        return {
            enabled: this.enabled,
            hour:    this.hour
        };
    }
}
