//#region

import { ISerConfig,
         ISerTask,
         ISerReport,
         ISerConnection,
         ISerTemplate,
         ISerGeneral }                  from "../node_modules/ser.api/index";
import { ESERDistribute,
         ISERDistribute,
         ISERFile,
         ISERReportExtend }             from "./utils";

//#endregion


export class SERReport {

    private template: ISerTemplate;
    private connection: ISerConnection;
    private report: ISerReport;
    private general: ISerGeneral;
    private distribute: ISERDistribute;

    constructor(appName?: string, input?: string) {
        console.log("Constructor called: SERReport");

        this.template = {
            input: input,
            output: "default.pdf"
        };

        this.connection = {
            app: appName
        };

        this.general = {};

        this.distribute = {};
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
                    general: this.general,
                    distribute: this.distribute,
                    template: this.template
                };
                resolve(report);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * setDistribute
     */
    public setDistribute(distributeMode: ESERDistribute) {
        console.log("fcn called: setDistribute - SERReport");

        let defaultDistribute: ISERDistribute = {};

        switch (distributeMode) {
            case ESERDistribute.file:
                defaultDistribute = {
                    file: {
                        connections: "",
                        mode: 1,
                        target: ""
                    }
                };
                break;

            case ESERDistribute.file:

                break;

            default:
                break;
        }
    }

}