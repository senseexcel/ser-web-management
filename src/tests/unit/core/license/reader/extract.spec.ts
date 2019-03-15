
import { LicenseReader } from '@smc/modules/license/services/license-reader';
import { TestBed, inject } from '@angular/core/testing';
import { IReaderResult } from '@smc/modules/license/api/reader-result.interface';
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

    describe('general: extract', () => {

        let _result: IReaderResult;

        it('raw data from result should be empty', () => {
            _result = _reader.read(license1);
            expect(_result.raw).toEqual([]);
        });

        it('raw data from result should contain 2 entries', () => {
            _result = _reader.read(license7);
            expect(_result.raw).toEqual([
                'PARENT;;', 'PARENT;;'
            ]);
        });

        it('raw data from result should trimmed', () => {
            _result = _reader.read(license8);
            expect(_result.raw).toEqual([
                'PARENT;;', 'PARENT;;', 'PARENT;;'
            ]);
        });

        it('should extract all parents from lines', () => {

            _result = _reader.read(license9);
            const searchToken = /^PARENT;;/;
            const parents = _reader.extract(_result.raw, [searchToken]).get(searchToken);

            expect(parents.length).toBe(2);
            expect(parents).toEqual(['PARENT;;', 'PARENT;;']);
            expect(_result.raw).toEqual(['Child;;', 'Child;;']);
        });
    });
});
