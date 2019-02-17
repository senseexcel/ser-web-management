import { Injectable } from '@angular/core';
import * as hjson from 'hjson';
import { ISerScriptData, ISerReport, ISerConfig } from '../api';

@Injectable()
export class ScriptService {

    public parse(source: string): ISerScriptData {
        if (!this.hasSerScript(source)) {
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

    public hasSerScript(script: string): boolean {
        return script.indexOf('SER.START') !== -1;
    }

    public createReportConfig(report: ISerReport): ISerConfig {
        return {
            tasks: [{
                reports: [report]
            }]
        };
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
        // check model has
        let isValidScript = data.script.hasOwnProperty('tasks');
        isValidScript = isValidScript && Array.isArray(data.script.tasks);
        isValidScript = isValidScript && data.script.tasks[0].hasOwnProperty('reports');

        if (!isValidScript) {
            throw new Error('invalid or customized script found');
        }
        return data.script.tasks[0].reports;
    }

    /**
     *
     *
     * @returns {boolean}
     * @memberof ScriptService
     */
    public isValid(): boolean {
        return false;
    }
}
