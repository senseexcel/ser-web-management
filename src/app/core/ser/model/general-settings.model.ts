import { ISerGeneral } from 'ser.api';
import { importData } from '@smc/modules/smc-common/utils/model/import-data.decorator';
import { IModel } from '@smc/modules/smc-common';

export class GeneralSettingsModel implements ISerGeneral, IModel<ISerGeneral> {

    private generalCleanupTimeOut: number;

    private generalErrorRepeatCount: number;

    private generalTaskCount: number;

    private generalTimeout: number;

    private generalUseSandbox: boolean;

    private generalUseUserSelections: SelectionMode;

    private rawData: ISerGeneral;

    /** The time after clean up the temp folder. */
    public set cleanupTimeOut(timeout: number) {
        this.generalCleanupTimeOut = timeout;
    }

    /** The time until the report is aborted. */
    public set timeout(timeout: number) {
        this.generalTimeout = timeout;
    }

    /** The repeat until the report is canceled as error. */
    public set errorRepeatCount(count: number) {
        this.generalErrorRepeatCount = count;
    }

    /** The count of cpus or cpu cores. */
    public set taskCount(count: number) {
        this.generalTaskCount = count;
    }

    /** Use the sand box for script execute. */
    public set useSandbox(sandbox: boolean) {
        this.generalUseSandbox = sandbox;
    }

    /** Use the ondemand mode or normal config mode. */
    public set useUserSelections(selectionMode: SelectionMode) {
        this.generalUseUserSelections = selectionMode;
    }

    /** The time after clean up the temp folder. */
    public get cleanupTimeOut(): number {
        return this.generalCleanupTimeOut;
    }

    /** The time until the report is aborted. */
    public get timeout(): number {
        return this.generalTimeout;
    }

    /** The repeat until the report is canceled as error. */
    public get errorRepeatCount(): number {
        return this.generalErrorRepeatCount;
    }

    /** The count of cpus or cpu cores. */
    public get taskCount(): number {
        return this.generalTaskCount;
    }

    /** Use the sand box for script execute. */
    public get useSandbox(): boolean {
        return this.generalUseSandbox;
    }

    /** Use the ondemand mode or normal config mode. */
    public get useUserSelections(): SelectionMode {
        return this.generalUseUserSelections;
    }

    @importData
    public set raw(data: ISerGeneral) {
        this.rawData = data;
    }

    public get raw(): ISerGeneral {
        return {
            cleanupTimeOut: this.generalCleanupTimeOut,
            errorRepeatCount: this.generalErrorRepeatCount,
            timeout: this.generalTimeout,
            useSandbox: this.generalUseSandbox
        };
    }
}
