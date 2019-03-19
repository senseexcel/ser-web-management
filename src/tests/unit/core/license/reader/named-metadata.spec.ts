import { LicenseReader } from '@smc/modules/license/services/license-reader';
import { TestBed, inject } from '@angular/core/testing';
import { license1, license3, license2, license4, license5, license6 } from '../mock/named-license';
import { IReaderResult } from '@smc/modules/license/api/reader-result.interface';
import { LicenseType } from '@smc/modules/license';

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

    describe('named: metadata', () => {

        let _result: IReaderResult;

        it('should be have meta data count: 5; from:empty; to: 2019-01-31', () => {
            _result = _reader.read(license1);
            expect(_result.licenseMeta.type).toBe(LicenseType.NAMED);
            expect(_result.licenseMeta.count).toBe(5);
            expect(_result.licenseMeta.from).toBe(null);
            expect(_result.licenseMeta.to).toBe('2019-01-31');
        });


        it('should be have meta data count: 20; from:2020-01-20: to: empty', () => {
            _result = _reader.read(license2);
            expect(_result.licenseMeta.type).toBe(LicenseType.NAMED);
            expect(_result.licenseMeta.count).toBe(20);
            expect(_result.licenseMeta.from).toBe('2020-01-20');
            expect(_result.licenseMeta.to).toBe(null);
        });


        it('should be have meta data count: 20; from:empty; to: empty', () => {
            _result = _reader.read(license3);
            expect(_result.licenseMeta.type).toBe(LicenseType.NAMED);
            expect(_result.licenseMeta.count).toBe(20);
            expect(_result.licenseMeta.from).toBe(null);
            expect(_result.licenseMeta.to).toBe(null);
        });

        it('should be have meta data count: 20; from:2020-01-20: to: empty', () => {
            _result = _reader.read(license4);
            expect(_result.licenseMeta.type).toBe(LicenseType.NAMED);
            expect(_result.licenseMeta.count).toBe(20);
            expect(_result.licenseMeta.from).toBe('2020-01-20');
            expect(_result.licenseMeta.to).toBe('2021-01-20');
        });
    });
});
