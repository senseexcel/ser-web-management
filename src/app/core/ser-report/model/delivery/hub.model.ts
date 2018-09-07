import { IHubSettings, SettingsType, DistributeMode, ISerConnection } from 'ser.api';

export class HubModel implements IHubSettings {

    private hubType: SettingsType;

    private hubActive: boolean;

    private hubTarget: string;

    private hubMode: DistributeMode;

    private hubOwner: string;

    private hubConnections: ISerConnection[];

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
        return this.hubMode;
    }

    public get owner(): string {
        return this.hubOwner;
    }

    public get connections(): ISerConnection[] {
        return this.hubConnections;
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

    public set connections(connections: ISerConnection[]) {
        this.hubConnections = connections;
    }
}
