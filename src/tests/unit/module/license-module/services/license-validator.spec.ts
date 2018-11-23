import { LicenseValidator } from '@app/modules/ser-license/services/license-validator';
import { TestBed, inject, async } from '@angular/core/testing';
import { ContentLibService, LicenseRepository } from '@app/modules/ser-license/services';
import { ContentLibMockService } from '../mock/content-lib-mock.service';
import { LicenseRepositoryMock } from '../mock/license-repository-mock';
import { LicenseModel } from '@app/modules/ser-license/model/license.model';
import moment = require('moment');

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

    /** inject license validator and save it */
    beforeEach(inject([LicenseValidator], service => {
        licenseValidator = service;
    }));

    it('should be initialized', () => {
        expect(licenseValidator).toBeTruthy();
    });

    /**
     *  user validation
     */
    describe('License Validation Users, user limit 2', () => {

        const license: LicenseModel = new LicenseModel();

        beforeAll(() => {
            license.userLimit = 2;
        });

        describe('License Users valid', () => {

            it('Valid: only 2 users registerd', async(() => {
                const startDate: string = moment().format('Y-MM-DD');
                const endDate: string   = moment().add(1, 'M').format('Y-MM-DD');

                license.users = [
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate }
                ];

                licenseValidator.validateUsers(license)
                    .subscribe((result) => {
                        expect(result.isValid).toBeTruthy();
                    });
            }));

            it('Valid: 3 users registerd, but on diffrent dates', async(() => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                license.users = [
                    { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                    { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                    { id: 'jasmine/test', from: sd.add(1, 'day').add(1, 'month').format('Y-MM-DD'), to: ed.format('Y-MM-DD')  }
                ];

                licenseValidator.validateUsers(license)
                    .subscribe((result) => {
                        expect(result.isValid).toBeTruthy();
                    });
            }));
        });

        /**
         * validate users
         */
        describe('Users Invalid', () => {
            it('Invalid: 3 Users active at the same day', async(() => {

                const startDate: string = moment().format('Y-MM-DD');
                const endDate: string   = moment().add(1, 'M').format('Y-MM-DD');

                license.users = [
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate }
                ];

                licenseValidator.validateUsers(license)
                    .subscribe((result) => {
                        expect(result.isValid).toBeFalsy();
                    });
            }));

            /**
             * should be invalid for because on next day we have 3 users
             * so it is only valid for today but invalid tomorrow
             */
            it('Invalid: 3 Users active at same day but not only today', async(() => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                license.users = [
                    { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                    { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                    { id: 'jasmine/test', from: sd.add(1, 'day').format('Y-MM-DD'), to: ed.format('Y-MM-DD')  }
                ];

                licenseValidator.validateUsers(license)
                    .subscribe((result) => {
                        expect(result.isValid).toBeFalsy();
                    });
            }));

            /**
             * should be invalid
             *
             * user 1: from: today until today + 1 month
             * user 2: from: today until today + 1 month
             * user 3: from: today + 1 month until today + 2 months
             */
            it('Invalid: Enddate of 2 Users is the same Startdate for 3rd User', async(() => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                license.users = [{
                    id: 'jasmine/test',
                    from: sd.format('Y-MM-DD'),
                    to: ed.format('Y-MM-DD') },
                {
                    id: 'jasmine/test',
                    from: sd.format('Y-MM-DD'),
                    to: ed.format('Y-MM-DD')
                },
                {
                    id: 'jasmine/test',
                    from: sd.add(1, 'month').format('Y-MM-DD'),
                    to: ed.add(1, 'month').format('Y-MM-DD')
                }];

                licenseValidator.validateUsers(license)
                    .subscribe((result) => {
                        expect(result.isValid).toBeFalsy();
                    });
            }));
        });
    });
});
