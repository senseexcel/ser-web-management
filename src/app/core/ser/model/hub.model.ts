import { IHubSettings, SettingsType, DistributeMode, ISerConnection } from 'ser.api';
import { importData } from '@smc/modules/smc-common/utils';

export class HubModel implements IHubSettings {

    private hubSharedContentType: string;

    private hubType: SettingsType;

    private hubActive = false;

    private hubTarget: string;

    private hubMode: DistributeMode = DistributeMode.DELETEALLFIRST;

    private hubOwner: string;

    private hubConnections: any = '@CONFIGCONNECTION@';

    public get type(): SettingsType {
        return this.hubType;
    }

    public get active(): boolean {
        return this.hubActive;
    }

    public get target(): string {
        return this.hubTarget;
    }

    public get mode(): DistributeMode {
        let mode: any = this.hubMode;
        if (typeof this.hubMode === 'number') {
            const modes = Object.keys(DistributeMode).filter((val) => isNaN(parseInt(val, 10)));
            mode = modes.map((cur) => {
                if (cur !== DistributeMode[this.hubMode]) {
                    cur = DistributeMode[this.hubMode];
                }
                return cur;
            })[0];
        }
        return mode;
    }

    public get owner(): string {
        return this.hubOwner;
    }

    public get connections(): any {
        return this.hubConnections;
    }

    public get sharedContentType(): string {
        return this.hubSharedContentType;
    }

    public set type(type: SettingsType) {
        this.hubType = type;
    }

    public set active(active: boolean) {
        this.hubActive = active;
    }

    public set target(target: string) {
        this.hubTarget = target;
    }

    public set mode(mode: DistributeMode) {
        this.hubMode = mode;
    }

    public set owner(owner: string) {
        this.hubOwner = owner;
    }

    public set connections(connections: any) {
        this.hubConnections = connections;
    }

    public set sharedContentType(type: string) {
        this.hubSharedContentType = type;
    }

    @importData
    public set raw(hubSettings: IHubSettings) {}

    public get raw(): IHubSettings {

        return {
            type:   this.hubType,
            active: this.hubActive,
            target: this.hubTarget,
            mode: this.hubMode,
            owner:  this.hubOwner,
            connections: this.hubConnections,
            sharedContentType: this.sharedContentType
        };
    }
}
