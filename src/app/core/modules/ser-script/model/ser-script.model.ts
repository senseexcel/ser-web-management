import { ISerScriptData } from '../api/ser-script-data.interface';
import { ISerConfig } from '../api/ser-config.interface';

export class SerScriptModel implements ISerScriptData {

    private serScript: ISerConfig;

    private serScriptAfter: string;

    private serScriptBefore: string;

    public get after(): string {
        return this.serScriptAfter;
    }

    public get before(): string {
        return this.serScriptBefore;
    }

    public get script(): ISerConfig {
        return this.serScript;
    }

    public set after(after: string) {
        this.serScriptAfter = after;
    }

    public set before(before: string) {
        this.serScriptBefore = before;
    }

    public set script(script: ISerConfig) {
        this.serScript = script;
    }
}
