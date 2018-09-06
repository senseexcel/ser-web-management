import {  IMailSettings, IFileSettings, IHubSettings, ISerConnection, ISerGeneral, ISerTemplate } from 'ser.api';

export interface ISerReport {

    /** The general setting of a report. */
    general: ISerGeneral;

    /** The template of a report. */
    template: ISerTemplate;

    /** The available connections to Qlik. */
    connections: ISerConnection;

    distribute?: {
        file?: IFileSettings,
        hub?: IHubSettings,
        mail?: IMailSettings
    };
}

export interface ISerTask {
    reports: ISerReport[];
}

export interface ISerConfig {
    tasks: ISerTask[];
}
