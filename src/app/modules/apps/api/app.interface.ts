import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';

export interface IQlikApp {

    qConnctedUsers?: number;

    qDocId: string;

    qDocName: string;

    qFileSize?: number;

    qTitle?: string;

    source?: IQrsApp;
}
