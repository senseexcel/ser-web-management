//#region
import { ISerConfig,
         ISerTask,
         ISerReport,
         ISerConnection,
         ISerTemplate,
         ISerGeneral,
         ISerSenseSelection}                    from "../node_modules/ser.api/index";
import { ESERDistribute,
         ISERDistribute,
         ISERFile,
         ISERHub,
         ISERMail,
         ISERReportExtend }                     from "./utils";
//#endregion

export class SERReport {

    //#region variables
    private template: ISerTemplate;
    private connection: ISerConnection;
    private report: ISerReport;
    private general: ISerGeneral;
    private distribute: ISERDistribute;
    private selections: ISerSenseSelection[];
    //#endregion

    constructor() {
        console.log("Constructor called: SERReport");

        this.general = {};
        this.distribute = {};
    }

    //#region public functions

    /**
     * createReportConfig
     */
    public createReportConfig(): Promise<ISerReport> {
        console.log("fcn called: createReportConfig - SERReport");

        return new Promise((resolve, reject) => {
            try {

                let report: ISERReportExtend = {
                    connections: [this.connection],
                    general: this.general,
                    distribute: this.distribute,
                    template: this.template
                };
                report.template.selections = this.selections;
                resolve(report);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * setConnection
     */
    public setConnection(input: ISerConnection | string): void {
        console.log("fcn called: setConnection - SERReport");

        try {
            if (typeof(input)!=="string") {
                this.connection = input;
                return;
            }
            this.connection = {
                app: input,
            };
        } catch (error) {
            console.error("ERROR in setConnection - SERReport", error);
        }
    }

    /**
     * setTemplate
     */
    public setTemplate(input: ISerTemplate | string): void {
        console.log("fcn called: setTemplate - SERReport");

        try {
            if (typeof(input)!=="string") {
                this.template = input;
                return;
            }
            this.template = {
                input: input,
                output: "default.pdf"
            };
        } catch (error) {
            console.error("ERROR in setTemplate - SERReport", error);
        }
    }

    /**
     * setDistribute
     */
    public setDistribute(distribute: ISERDistribute): void {
        console.log("fcn called: setDistribute - SERReport");

        let arr = Object.getOwnPropertyNames(distribute);

        try {
            if(arr.indexOf("hub")!==-1) {
                this.distribute.hub = this.getHubDistribute(distribute.hub);
            }

            if(arr.indexOf("file")!==-1) {
                this.distribute.file = this.getFileDistribute(distribute.file);
            }

            if(arr.indexOf("mail")!==-1) {
                this.distribute.mail = this.getMailDistribute(distribute.mail);
            }
        } catch (error) {
            console.error("ERROR in setDistribute - SERReport", error);
        }
    }

    /**
     * setDistribute
     */
    public setSelections(selections: ISerSenseSelection[]): void {
        console.log("fcn called: setSelections - SERReport");

        try {
            this.selections = selections;
        } catch (error) {
            console.error("ERROR in setSelections - SERReport", error);
        }
    }

    //#endregion

    //#region private Functions
    private getHubDistribute(inputHub: ISERHub): ISERHub {
        console.log("fcn called: getHubDistribute - SERReport");

        try {
            inputHub = this.checkForModeAndConnecInDist(inputHub) as ISERHub;
        } catch (error) {
            console.error("ERROR in getHubDistribute - SERReport", error);
        }
        return inputHub;
    }

    private getFileDistribute(inputFile: ISERFile): ISERFile {
        console.log("fcn called: getFileDistribute - SERReport");

        try {
            inputFile = this.checkForModeAndConnecInDist(inputFile) as ISERFile;

            if (inputFile.target.indexOf("lib")===-1) {
                inputFile.target = `lib://${inputFile.target}`;
            }
        } catch (error) {
            console.error("ERROR in getFileDistribute - SERReport", error);
        }
        return inputFile;
    }

    private checkForModeAndConnecInDist(input: ISERFile | ISERHub): ISERFile | ISERHub {
        try {
            if (typeof(input.connections)==="undefined") {
                input.connections = "@CONFIGCONNECTION@";
            }

            if (typeof(input.mode)==="undefined") {
                input.mode = "DeleteAllFirst";
            }
        } catch (error) {
            console.error("ERROR in checkForModeAndConnecInDist - SERReport", error);
        }
        return input;
    }

    private getMailDistribute(inputFile: ISERMail): ISERMail {
        console.log("fcn called: getMailDistribute - SERReport");

        return inputFile;
    }
    //#endregion
}