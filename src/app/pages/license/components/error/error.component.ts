import { Component, Input } from '@angular/core';
import { ValidationStep, ILicenseValidationResult } from '../../api/validation-result.interface';
import { KeyValue } from '@angular/common';

@Component({
    selector: 'smc-license-error',
    styleUrls: ['error.component.scss'],
    templateUrl: 'error.component.html'
})

export class ErrorComponent {

    @Input()
    public progress: Map<ValidationStep , ILicenseValidationResult>;

    /**
     * sort function for keyvalue pipe, this will sort items at this way
     * that inValid propertys allways comes at last and valid properties first
     *
     * @param {KeyValue<string, ILicenseValidationResult>} a
     * @param {KeyValue<string, ILicenseValidationResult>} b
     * @returns {number}
     * @memberof ErrorComponent
     */
    public sortIsValid(
        a: KeyValue<string, ILicenseValidationResult>,
        b: KeyValue<string, ILicenseValidationResult>
    ): number {
        const val1 = a.value.isValid;
        const val2 = b.value.isValid;

        if (val1 < val2) {
            return 1;
        }

        if (val2 < val1) {
            return -1;
        }
        return 0;
    }
}
