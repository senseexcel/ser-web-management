import { Injectable } from '@angular/core';
import {
    ReportModel,
} from '../model';
import { ISerReport } from '../api';

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
        const data   = modelData || {general: null, distribute: null, connections: null, template: null};
        const report = new ReportModel();
        report.raw = data;
        return report;
    }

    /**
     * update report data
     *
     * @param {*} report
     * @param {string} name
     * @param {string[]} path
     * @param {*} updateData
     * @memberof ReportService
     */
    public updateReport(report: ISerReport, name: string, path: string[], updateData: any): ISerReport {

        let model: any = report;

        /** get first correct model which is defined by path */
        path.concat([name]).forEach( (modelName: string) => {
            if (!model[modelName] ) {
                throw new Error('not not find correct model to update.');
            }
            model = model[modelName];
        });

        /** set fields on model */
        Object.keys(model.raw).forEach( (property) => {
            if ( ! updateData[property] ) {
                return;
            }
            model[property] = updateData[property];
        });

        return report;
    }

    /**
     * clean report
     *
     * @param {*} report
     * @returns
     * @memberof ReportService
     */
    public cleanReport(report: any) {
        const data = report;
        for (const key in data) {

            if ( ! data.hasOwnProperty(key) ) {
                continue;
            }

            const value = data[key];
            if ( value && Object.prototype.toString.apply(value).slice(8, -1) === 'Object') {
                const cleaned = this.cleanReport(data[key]);
                if ( Object.keys(cleaned).length === 0 ) {
                    delete data[key];
                }
            } else {
                if ( data[key] === undefined ) {
                    delete data[key];
                }
            }
        }
        return data;
    }

    /**
     * validate model only values which we find in
     * raw data of model are accepted otherwise it will
     * be rejected
     *
     * @private
     * @param {*} model
     * @param {*} data
     * @returns {boolean}
     * @memberof ReportService
     */
    private validateModelData(model, data): boolean {
        let isValid = true;
        Object.keys(data).forEach((property) => {
            if (!(property in model)) {
                isValid = false;
            }
        });
        return isValid;
    }
}
