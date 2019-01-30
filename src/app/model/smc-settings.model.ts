import { InjectionToken } from '@angular/core';
import { IDataNode } from '@smc/modules/smc-common';
import { Pages } from './page.model';

const SmcSettings: IDataNode = {

    list: {
        /** items per page */
        itemPageCount: 100,
    },
    pages: Pages
};

export const SMC_SETTINGS = new InjectionToken('SmcSettings', {
    factory: () => SmcSettings
});
