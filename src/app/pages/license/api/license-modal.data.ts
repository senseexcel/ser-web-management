import { IModalData } from '@smc/modules/modal';
import { ILicense } from '@smc/modules/license/api';

export interface ILicenseModalData<T> extends IModalData<T> {
    license: ILicense;
}
