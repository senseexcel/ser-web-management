import { Injectable } from '@angular/core';
import { ReportModel } from '../model';
import { ISerReport } from '../api';
import { IDataNode } from '@smc/modules/smc-common';

@Injectable()
export class ReportService {

    /**
     *
     *
     * @param {ISerReport} data
     * @returns {ReportModel}
     * @memberof ReportService
     */
    public createReport(modelData: ISerReport): ReportModel {
        const data = modelData || { general: {}, distribute: {}, connections: {}, template: {} } as any;
        const report = new ReportModel();
        report.raw = data;
        return report;
    }

    /**
     * clean report
     *
     * @param {*} report
     * @returns
     * @memberof ReportService
     */
    public cleanReport(report: IDataNode) {
        const data = JSON.parse(JSON.stringify(report));
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            const value = data[key];

            if (value && Object.prototype.toString.apply(value).slice(8, -1) === 'Object') {
                const cleaned = this.cleanReport(data[key]);
                data[key] = Object.keys(cleaned).length ? cleaned : null;
            } else if (value && Array.isArray(value) && !value.length) {
                data[key] = null;
            }

            if (data[key] === undefined || data[key] === null) {
                delete data[key];
            }
        }
        return data;
    }
}
