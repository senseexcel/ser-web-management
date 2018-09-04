import { ISerConfiguration } from '@qlik/api/ser-config.interface';

export interface IScriptData {

    after: string;

    before: string;

    serConfig: ISerConfiguration;
}
