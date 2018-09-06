import { IQlikApp } from '@qlik/api/app.interface';
import { ISerConfig } from '../api';

export interface ISerApp {

    qapp: IQlikApp;

    config: string;

    serConfig?: ISerConfig;
}
