import moment = require('moment');
import { UserLicense } from '../mock/user-license.mock';
import { UserLicenseValidator } from '@smc/modules/license/validators/user.validator';
import { toManyUsersAtSameDateError, noUserLimitError } from '@smc/modules/license/validators/validation.tokens';

describe('LicenseModule', () => {

    describe('Validators', () => {

        describe('UserLicense', () => {

            let validator: UserLicenseValidator;
            let userLicense: UserLicense;

            beforeEach(() => {
                validator = new UserLicenseValidator();
                userLicense = new UserLicense();
                userLicense.userLimit = 2;
            });

            it('Valid: only 2 users registerd', () => {
                const startDate = moment();
                const endDate = moment().add(1, 'M');

                userLicense.addUsers([
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate }
                ]);

                const result = validator.validate(userLicense);
                expect(result.isValid).toBeTruthy();
            });

            it('Valid: 3 users registerd, but on diffrent dates', () => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                userLicense.addUsers([
                    { id: 'jasmine/test', from: sd, to: ed },
                    { id: 'jasmine/test', from: sd, to: ed },
                    { id: 'jasmine/test', from: sd.add(1, 'day').add(1, 'month'), to: ed }
                ]);

                const result = validator.validate(userLicense);
                expect(result.isValid).toBeTruthy();
            });

            /**
             * validate users
             */
            it('Invalid: 3 Users active at the same day', () => {

                const startDate = moment();
                const endDate = moment().add(1, 'M');

                userLicense.addUsers([
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate },
                    { id: 'jasmine/test', from: startDate, to: endDate }
                ]);

                expect(validator.validate(userLicense).isValid).toBeFalsy();
            });

            /**
             * should be invalid for because on next day we have 3 users
             * so it is only valid for today but invalid tomorrow
             */
            it('Invalid: 3 Users active at same day but not only today', () => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                userLicense.addUsers([
                    { id: 'jasmine/test', from: sd, to: ed },
                    { id: 'jasmine/test', from: sd, to: ed },
                    { id: 'jasmine/test', from: sd.add(1, 'day'), to: ed }
                ]);

                expect(validator.validate(userLicense).isValid).toBeFalsy();
            });

            /**
             * should be invalid
             *
             * user 1: from: today until today + 1 month
             * user 2: from: today until today + 1 month
             * user 3: from: today + 1 month until today + 2 months
             */
            it('Invalid: Enddate of 2 Users is the same Startdate for 3rd User', () => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');

                userLicense.addUsers([{
                    id: 'jasmine/test',
                    from: sd,
                    to: ed
                },
                {
                    id: 'jasmine/test',
                    from: sd,
                    to: ed
                },
                {
                    id: 'jasmine/test',
                    from: sd.add(1, 'month'),
                    to: ed.add(1, 'month')
                }]);

                const result = validator.validate(userLicense);
                expect(result.isValid).toBeFalsy();
                expect(result.errors.has(toManyUsersAtSameDateError)).toBeTruthy();
            });

            it('should be invalid since no userLimit is given', () => {

                const sd: moment.Moment = moment();
                const ed: moment.Moment = moment().add(1, 'month');
                userLicense.userLimit = null;

                userLicense.addUsers([{
                    id: 'jasmine/test',
                    from: sd,
                    to: ed
                },
                {
                    id: 'jasmine/test',
                    from: sd,
                    to: ed
                },
                {
                    id: 'jasmine/test',
                    from: sd.add(1, 'month'),
                    to: ed.add(1, 'month')
                }]);

                const result = validator.validate(userLicense);
                expect(result.isValid).toBeFalsy();
                expect(result.errors.has(noUserLimitError)).toBeTruthy();
            });
        });
    });
});
