import { async } from '@angular/core/testing';
import { UserLicenseValidator } from '@smc/modules/license/validators/user.validator';
import moment = require('moment');
import { UserLicense } from '../mock/user-license.mock';

describe('LicenseModule: Validator', () => {

    describe('UserLicense', () => {

        let validator: UserLicenseValidator;
        let userLicense: UserLicense;

        beforeEach(() => {
            validator = new UserLicenseValidator();
            userLicense = new UserLicense();
            userLicense.userLimit = 2;
        });

        it('Valid: only 2 users registerd', async(() => {
            const startDate: string = moment().format('Y-MM-DD');
            const endDate: string = moment().add(1, 'M').format('Y-MM-DD');

            userLicense.addUsers([
                { id: 'jasmine/test', from: startDate, to: endDate },
                { id: 'jasmine/test', from: startDate, to: endDate }
            ]);

            validator.validate(userLicense)
                .subscribe((result) => {
                    expect(result.isValid).toBeTruthy();
                });
        }));

        it('Valid: 3 users registerd, but on diffrent dates', async(() => {

            const sd: moment.Moment = moment();
            const ed: moment.Moment = moment().add(1, 'month');

            userLicense.addUsers([
                { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                { id: 'jasmine/test', from: sd.add(1, 'day').add(1, 'month').format('Y-MM-DD'), to: ed.format('Y-MM-DD') }
            ]);

            validator.validate(userLicense)
                .subscribe((result) => {
                    expect(result.isValid).toBeTruthy();
                });
        }));

        /**
         * validate users
         */
        it('Invalid: 3 Users active at the same day', async(() => {

            const startDate: string = moment().format('Y-MM-DD');
            const endDate: string = moment().add(1, 'M').format('Y-MM-DD');

            userLicense.addUsers([
                { id: 'jasmine/test', from: startDate, to: endDate },
                { id: 'jasmine/test', from: startDate, to: endDate },
                { id: 'jasmine/test', from: startDate, to: endDate }
            ]);

            validator.validate(userLicense)
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

            userLicense.addUsers([
                { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                { id: 'jasmine/test', from: sd.format('Y-MM-DD'), to: ed.format('Y-MM-DD') },
                { id: 'jasmine/test', from: sd.add(1, 'day').format('Y-MM-DD'), to: ed.format('Y-MM-DD') }
            ]);

            validator.validate(userLicense)
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

            userLicense.addUsers([{
                id: 'jasmine/test',
                from: sd.format('Y-MM-DD'),
                to: ed.format('Y-MM-DD')
            },
            {
                id: 'jasmine/test',
                from: sd.format('Y-MM-DD'),
                to: ed.format('Y-MM-DD')
            },
            {
                id: 'jasmine/test',
                from: sd.add(1, 'month').format('Y-MM-DD'),
                to: ed.add(1, 'month').format('Y-MM-DD')
            }]);

            validator.validate(userLicense)
                .subscribe((result) => {
                    expect(result.isValid).toBeFalsy();
                });
        }));
    });
});
