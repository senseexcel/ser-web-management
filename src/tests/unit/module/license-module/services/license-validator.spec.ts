import { LicenseValidator } from '@app/modules/ser-license/services/license-validator';
import { TestBed, inject, async } from '@angular/core/testing';
import { ContentLibService, LicenseRepository } from '@app/modules/ser-license/services';
import { ContentLibMockService } from '../mock/content-lib-mock.service';
import { LicenseRepositoryMock, SerialNumbers } from '../mock/license-repository-mock';

describe('LicenseValidatorTest', () => {

    let licenseValidator: LicenseValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ContentLibService, useClass: ContentLibMockService },
                { provide: LicenseRepository, useClass: LicenseRepositoryMock },
                LicenseValidator
            ]
        });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ContentLibService, useClass: ContentLibMockService },
                { provide: LicenseRepository, useClass: LicenseRepositoryMock },
                LicenseValidator
            ]
        });
    });

    /** inject license validator and save it */
    beforeEach(inject([LicenseValidator], service => {
        licenseValidator = service;
    }));

    it('should be initialized', () => {
        expect(licenseValidator).toBeTruthy();
    });

    it('should be valid ser license', async(() => {
        const serSerial = SerialNumbers.Qlik;
        licenseValidator.validateLicenseKey(serSerial).subscribe((result) => {
            expect(result.isValid).toBeTruthy();
        });
    }));
});
