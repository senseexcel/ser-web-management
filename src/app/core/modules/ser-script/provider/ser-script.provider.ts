import { Injectable } from '@angular/core';
import * as hjson from 'hjson';

import { ISerScriptData } from '../api/ser-script-data.interface';
import { ISerReport } from '@core/modules/ser-report/api/ser-report.interface';
import { IDataNode } from '@core/api/model.interface';
import { ISerConfig } from '../api/ser-config.interface';

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

    /**
     * throws InvalidSerScriptException
     */
    private validateScript () {
        // script should have tasks is array
        // script should have reports is array
        // report comes now, this have to match a valid format
        // daten die ich durchlaufe müssen genau diese Eigenschaften haben die ich im
        // interface definiert habe ansonsten  ist es invalide
    }

    /**
     * return complete app script as string
     *
     * @param {ISerScriptData} script
     * @returns {string}
     * @memberof SerScriptService
     */
    public stringify(script: ISerScriptData): string {

        return ''.concat(
            script.before,
            hjson.stringify(script.script),
            script.after
        );
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

    /**
     * sanitize script to enable simple mode for scripts
     * in this case this is not a complete ISerConfig and can contain
     * only report configuration
     *
     * @private
     * @param {IDataNode} script
     * @returns {ISerConfig}
     * @memberof SerScriptService
     */
    private sanitizeScript(script: IDataNode): ISerConfig {

        let sanitizedScript = script;

        if (!sanitizedScript.hasOwnProperty('tasks')) {
            sanitizedScript = {
                tasks: [{reports: [script]}]
            };
        }

        return sanitizedScript as ISerConfig;
    }
}
