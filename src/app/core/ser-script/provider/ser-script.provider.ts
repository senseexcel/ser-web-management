import { Injectable } from '@angular/core';
import * as hjson from 'hjson';

import { ISerScript } from '../api/ser-script.interface';
import { ISerScriptData } from '../api/ser-script-data.interface';
import { ISerReport } from '@core/ser-report/api/ser-report.interface';

@Injectable()
export class SerScriptService {

    constructor() {
    }

    public parse(source: string): ISerScriptData {

        const indexStart = source.indexOf('SER.START');

        if ( indexStart === -1 ) {
            throw new Error('no ser data available');
        }

        const taskNamePattern = new RegExp(`SER\.START.*?\\((.*?)\\)`);
        const taskName = source.match(taskNamePattern)[1];
        const jsonPattern = new RegExp(`SET\\s*${taskName}.*?\u00B4([^\u00B4]*)`, 'm');

        const result = source.match(jsonPattern);
        const start = result.index + result[0].length - result[1].length;
        const end   = start + result[1].length;

        return {
            after : source.substr(end),
            before: source.substr(0, start),
            script: hjson.parse(result[1])
        };
    }

    public stringify(script: ISerScript): string {
        return hjson.stringify(script);
    }

    /**
     * @todo implement this will only extract first task report from script
     *
     * @param data
     */
    public extractReports(data: ISerScriptData): ISerReport[] {

        let reports: ISerReport[];

        try {
            reports = data.script.tasks[0].reports;
        } catch (e) {
            reports = [];
        }

        return reports;
    }
}
