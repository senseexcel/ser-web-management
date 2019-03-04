import { IModel, IDataNode } from '@smc/modules/smc-common';

/**
 * model for task excution data
 *
 * @export
 * @class ExecutionModel
 */
export class ExecutionModel implements IModel<IDataNode> {

    /**
     * task is eanbled
     *
     * @private
     * @type {boolean}
     * @memberof ExecutionModel
     */
    private executionEnabled: boolean;

    /**
     * max session timeout in minutes
     *
     * @private
     * @type {number}
     * @memberof ExecutionModel
     */
    private executionTimeout = 1;

    /**
     * max retries of a task
     *
     * @private
     * @type {number}
     * @memberof ExecutionModel
     */
    private executionMaxRetries = 1;

    /**
     * return task is enabled
     *
     * @readonly
     * @type {boolean}
     * @memberof ExecutionModel
     */
    public get enabled(): boolean {
        return this.executionEnabled;
    }

    /**
     * return session timeout in minutes
     *
     * @readonly
     * @type {number}
     * @memberof ExecutionModel
     */
    public get taskSessionTimeout(): number {
        return this.executionTimeout;
    }

    /**
     * return max retries count
     *
     * @readonly
     * @type {number}
     * @memberof ExecutionModel
     */
    public get maxRetries(): number {
        return this.executionMaxRetries;
    }

    /**
     * set task is enabled
     *
     * @memberof ExecutionModel
     */
    public set enabled(enabled: boolean) {
        this.executionEnabled = enabled;
    }

    /**
     * set execution timeout
     *
     * @memberof ExecutionModel
     */
    public set taskSessionTimeout(timeout: number) {
        this.executionTimeout = timeout;
    }

    /**
     * set max retries
     *
     * @memberof ExecutionModel
     */
    public set maxRetries(maxRetries: number) {
        this.executionMaxRetries = maxRetries;
    }

    public get raw(): IDataNode {
        return {
            enabled: this.enabled,
            maxRetries: this.maxRetries,
            taskSessionTimeout: this.executionTimeout
        };
    }
}
