//#region

import { ISerConfig,
         ISerTask,
         ISerReport,
         ISerConnection,
         ISerTemplate,
         ISerGeneral }                  from "../node_modules/ser.api/index";
import { ISERDistribute,
         ISERFile,
         ISERReportExtend }             from "./utils";

//#endregion


export class SERReport {

    private template: ISerTemplate;
    private connection: ISerConnection;
    private report: ISerReport;

    constructor(appName?: string, input?: string) {
        console.log("Constructor called: SERReport");

        this.template = {
            input: input,
            output: "default.pdf"
        };
        this.connection = {
            app: appName
        };
    }

    /**
     * createReportConfig
     */
    public createReportConfig(template?: ISerTemplate, connection?: ISerConnection): Promise<ISerReport> {
        console.log("fcn called: createReportConfig - SERReport");

        return new Promise((resolve, reject) => {
            try {

                let report: ISERReportExtend = {
                    connections: [this.connection],
                    general: {},
                    template: this.template
                };
                resolve(report);
            } catch (error) {
                reject(error);
            }
        });
    }

}