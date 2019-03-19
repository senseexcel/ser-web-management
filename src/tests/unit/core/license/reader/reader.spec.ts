import { LicenseReader } from '@smc/modules/license/services/license-reader';
import { TestBed, inject } from '@angular/core/testing';
import { LicenseType } from '@smc/modules/license';
import { license1, license7, license8, license9 } from '../mock/named-license';

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

    describe('license type', () => {
        it('should be an empty license', () => {
            const result = _reader.read('');
            expect(result.licenseMeta.type).toBe(LicenseType.EMPTY);
        });

        it('should be an unknown license', () => {
            const result = _reader.read('EXCEL_UNKNOWN_LICENSE_TYPE');
            expect(result.licenseMeta.type).toBe(LicenseType.UNKNOWN);
        });

        it('should be an named license', () => {
            const result = _reader.read('EXCEL_NAMED');
            expect(result.licenseMeta.type).toBe(LicenseType.NAMED);
        });
    });

    describe('extract lines', () => {

        it('raw data from result should be empty', () => {
            const _result = _reader.read(license1);
            expect(_result.raw).toEqual([]);
        });

        it('raw data from result should contain 2 entries', () => {
            const _result = _reader.read(license7);
            expect(_result.raw).toEqual([
                'PARENT;;', 'PARENT;;'
            ]);
        });

        it('raw data from result should trimmed', () => {
            const _result = _reader.read(license8);
            expect(_result.raw).toEqual([
                'PARENT;;', 'PARENT;;', 'PARENT;;'
            ]);
        });

        it('should extract all parents from lines', () => {

            const _result = _reader.read(license9);
            const searchToken = /^PARENT;;/;
            const parents = _reader.extract(_result.raw, [searchToken]).get(searchToken);

            expect(parents.length).toBe(2);
            expect(parents).toEqual(['PARENT;;', 'PARENT;;']);
            expect(_result.raw).toEqual(['Child;;', 'Child;;']);
        });
    });
});
