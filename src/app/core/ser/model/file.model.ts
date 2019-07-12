import { IFileSettings, SettingsType, DistributeMode, ISerConnection } from 'ser.api';
import { importData } from '@smc/modules/smc-common/utils';

export class FileModel implements IFileSettings {

    private fileType: SettingsType;

    private fileActive = false;

    private fileTarget: string;

    private fileMode: DistributeMode = DistributeMode.DELETEALLFIRST;

    private fileOwner: string;

    private fileConnections: any = '@CONFIGCONNECTION@';

    public get type(): SettingsType {
        return this.fileType;
    }

    public get active(): boolean {
        return this.fileActive;
    }

    public get target(): string {
        return this.fileTarget;
    }

    public get mode(): DistributeMode {
        let mode: any = this.fileMode;
        if (typeof this.fileMode === 'number') {
            const modes = Object.keys(DistributeMode).filter((val) => isNaN(parseInt(val, 10)));
            mode = modes.map((cur) => {
                if (cur !== DistributeMode[this.fileMode]) {
                    cur = DistributeMode[this.fileMode];
                }
                return cur;
            })[0];
        }
        return mode;
    }

    public get owner(): string {
        return this.fileOwner;
    }

    public get connections(): any {
        return this.fileConnections;
    }

    public set type(type: SettingsType) {
        this.fileType = type;
    }

    public set active(active: boolean) {
        this.fileActive = active;
    }

    public set target(target: string) {
        this.fileTarget = target;
    }

    public set mode(mode: DistributeMode) {
        this.fileMode = mode;
    }

    public set owner(owner: string) {
        this.fileOwner = owner;
    }

    public set connections(connections: any) {
        this.fileConnections = connections;
    }

    @importData
    public set raw(settings: IFileSettings) {}

    public get raw(): IFileSettings {
        return {
            type:   this.fileType,
            active: this.fileActive,
            target: this.fileTarget,
            mode:   this.fileMode,
            owner:  this.fileOwner,
            connections: this.fileConnections,
        };
    }
}
