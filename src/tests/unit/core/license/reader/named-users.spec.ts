import { LicenseReader } from '@smc/modules/license/services/license-reader';
import { TestBed, inject } from '@angular/core/testing';

describe('LicenseModule: Reader', () => {

    let _reader: LicenseReader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LicenseReader]
        });
    });

    /** inject license validator and save it */
    beforeEach(inject([LicenseReader], reader => {
        _reader = reader;
    }));
});
