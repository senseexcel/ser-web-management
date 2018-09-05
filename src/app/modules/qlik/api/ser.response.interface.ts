import { IQlikApp } from '@qlik/api/app.interface';
import { ISerConfiguration } from '@qlik/api/ser-config.interface';

export interface ISerApp {

    qapp: IQlikApp;

    script: ISerConfiguration | string;
}
