import { InjectionToken } from '@angular/core';

const SmcSettings = {

    list: {
        /** items per page */
        itemPageCount: 1,
    }
};

export const SMC_SETTINGS = new InjectionToken('SmcSettings', {
    factory: () => SmcSettings
});
