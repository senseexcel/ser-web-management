import { InjectionToken } from '@angular/core';
import { IDataNode } from '@smc/modules/smc-common';

const SmcSettings: IDataNode = {
    list: {
        /** items per page */
        itemPageCount: 100,
    }
};

export const SMC_SETTINGS = new InjectionToken('SmcSettings', {
    factory: () => SmcSettings
});
