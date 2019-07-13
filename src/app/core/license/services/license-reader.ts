import { ILicenseMeta, IReaderResult, LicenseType } from '../api';
import { SearchTokens } from '../model/search.tokens';
import { Injectable } from '@angular/core';

/**
 * read license data from given string
 */
@Injectable()
export class LicenseReader {

    /**
     * find all lines wich matched by searchTokens in source
     */
    public search(source: string[], searchTokens: RegExp[]): WeakMap<RegExp, string[]> {
        return this.find(source, searchTokens);
    }

    /**
     * extract data from lines this will modify source array
     */
    public extract(source: string[], searchTokens: RegExp[]): WeakMap<RegExp, string[]> {
        return this.find(source, searchTokens, true);
    }

    /**
     * read license data
     */
    public read(data: string): IReaderResult {
        let lines: string[] = [];
        let raw: string[] = [];
        let meta: ILicenseMeta;
        let result: IReaderResult;

        try {
            lines = this.sanitizeData(data.split(/\r?\n/));
            raw   = this.parseLicenseRaw(lines);
            meta  = this.parseLicenseMeta(raw);
            result = { licenseKey: raw[0], licenseMeta: meta, licenseRaw: raw, raw: lines };
        } catch (error) {
            result = {
                licenseKey: '',
                licenseMeta: { count: 0, from: '', to: '', type: LicenseType.INVALID },
                licenseRaw: lines,
                raw: []
            };

            console.log(result.licenseMeta.type);
        }
        return result;
    }

    /**
     * extract license informations to resolve license meta data
     * this could be TOKEN, USERS or anything else
     */
    private parseLicenseMeta(lines: string[]): ILicenseMeta {

        const licenseMeta: ILicenseMeta = {
            count: 0,
            from: '',
            to: '',
            type: LicenseType.EMPTY
        };

        if (lines.length !== 0) {
            licenseMeta.type = LicenseType.UNKNOWN;

            const namedMetaSearch = SearchTokens.NAMED_LICENSE_META;
            const tokenMetaSearch = SearchTokens.TOKEN_LICENSE_META;
            const result = this.find(lines, [namedMetaSearch, tokenMetaSearch], false);

            if (result.get(namedMetaSearch).length || result.get(tokenMetaSearch).length) {
                const metaDataLine = result.get(namedMetaSearch).length
                    ? result.get(namedMetaSearch)
                    : result.get(tokenMetaSearch);

                const metaData = metaDataLine[0].split(';');

                licenseMeta.count = metaData[1] ? parseInt(metaData[1], 10) : null;
                licenseMeta.from  = metaData[2] || null;
                licenseMeta.to    = metaData[3] || null;
                licenseMeta.type  = result.get(namedMetaSearch).length ? LicenseType.NAMED : LicenseType.TOKEN;
            }
        }
        return licenseMeta;
    }

    /**
     * parse license raw data
     */
    private parseLicenseRaw(lines: string[]): string[] {
        const result: string[] = [];
        if (lines.length !== 0) {
            let hasSignature = false;
            /** loop content array until we find signature line and split */
            for (const [index, line] of Array.from(lines.entries())) {
                result.push(line);
                /** signature match */
                if (line.match(/^([A-Z,0-9]{4}(?=-)-){4}[A-Z,0-9]{4}$/)) {
                    hasSignature = true;
                    // remove license data from source
                    lines.splice(0, index + 1);
                    break;
                }
            }

            if (!hasSignature) {
                throw new Error('no signature found');
            }
        }
        return result;
    }

    /**
     * find lines by search token
     */
    private find(lines: string[], searchTokens: RegExp[], extract = true): WeakMap<RegExp, string[]> {
        /** create ReadonlyArray as datasource for matches*/
        const mapData = searchTokens.map<[RegExp, string[]]>((searchToken) => [searchToken, []]);
        const matches = new WeakMap<RegExp, string[]>(mapData);

        for (let index = lines.length - 1; index >= 0; index--) {
            const line = lines[index];
            const matched = searchTokens.filter((token) => token.test(line))[0];
            if (!matched) {
                continue;
            }
            matches.get(matched).unshift(...(extract ? lines.splice(index, 1) : [line]));
        }
        return matches;
    }

    /**
     * clone original source into new array so we do not modify original
     * data.
     *
     * trim all lines and remove them from source if they are empty
     */
    private sanitizeData(source: string[]): string[] {
        const lines = Array.from(source);
        for (let index = lines.length - 1; index >= 0; index--) {
            const line = lines[index];
            const trimmed = line.replace(/(^\s*|\s*$)/g, '');

            if (trimmed !== '') {
                lines.splice(index, 1, trimmed);
                continue;
            }
            lines.splice(index, 1);
        }
        return lines;
    }
}
