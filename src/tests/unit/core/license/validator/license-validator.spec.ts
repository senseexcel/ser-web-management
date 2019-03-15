import { LicenseValidator } from '@smc/modules/license/validators/license.validator';
import { licenseExpiredError, licenseNotActiveYetError } from '@smc/modules/license/validators/validation.tokens';
import moment = require('moment');
import { LicenseMock } from '../mock/license.mock';

describe('LicenseModule', () => {

    describe('Validators', () => {

        describe('License', () => {

            let validator: LicenseValidator;
            let license: LicenseMock;

            beforeEach(() => {
                validator = new LicenseValidator();
                license = new LicenseMock();
            });

            it('should be valid', () => {
                license.from = moment();
                license.to   = moment(license.from).add(1, 'month');
                expect(validator.validate(license).isValid).toBeTruthy();
            });

            it('should be expired', () => {
                license.from = moment();
                license.to   = moment(license.from).add(-1, 'month');

                const result = validator.validate(license);
                expect(result.isValid).toBeFalsy();
                expect(result.errors.has(licenseExpiredError)).toBeTruthy();
            });

            it('should not activated yet', () => {
                license.from = moment().add(1, 'month');
                license.to   = moment(license.from).add(1, 'month');

                const result = validator.validate(license);
                expect(result.isValid).toBeFalsy();
                expect(result.errors.has(licenseNotActiveYetError)).toBeTruthy();
            });
        });
    });
});

