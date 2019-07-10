import { IMailSettings, EMailType, IMailServerSettings, SettingsType } from 'ser.api';
import { MailServerSettingsModel } from './mail-server.model';
import { mapDataTo, importData } from '@smc/modules/smc-common/utils';

export class EmailModel implements IMailSettings {

    private emailModelSubject: string;
    private emailModelMessage: string;
    private emailModelMailType: EMailType;
    private emailModelTo: string;
    private emailModelCc: string;
    private emailModelBcc: string;
    private emailModelMailServer: MailServerSettingsModel;
    private emailModelPaths: string[];
    private emailModelReportName: string;
    private emailModelType: SettingsType;
    private emailModelActive = false;

    public constructor() {
        this.emailModelMailServer = new MailServerSettingsModel();
    }

    public set subject(subject: string) {
        this.emailModelSubject = subject;
    }

    public set message(message: string) {
        this.emailModelMessage = message;
    }

    public set mailType(mailType: EMailType) {
        this.emailModelMailType = mailType;
    }
    public set to(to: string) {
        this.emailModelTo = to;
    }

    public set cc(cc: string) {
        this.emailModelCc = cc;
    }

    public set bcc(bcc: string) {
        this.emailModelBcc = bcc;
    }

    @mapDataTo(MailServerSettingsModel)
    public set mailServer(mailServer: MailServerSettingsModel) {
        this.emailModelMailServer = mailServer;
    }

    public set paths(paths: string[]) {
        this.emailModelPaths = paths;
    }

    public set reportName(reportName: string) {
        this.emailModelReportName = reportName;
    }

    public set type(type: SettingsType) {
        this.emailModelType = type;
    }

    public set active(active: boolean) {
        this.emailModelActive = active;
    }

    public get subject(): string {
        return this.emailModelSubject;
    }

    public get message(): string {
        return this.emailModelMessage;
    }

    public get mailType(): EMailType {
        return this.emailModelMailType;
    }

    public get to(): string {
        return this.emailModelTo;
    }

    public get cc(): string {
        return this.emailModelCc;
    }

    public get bcc(): string {
        return this.emailModelBcc;
    }

    public get mailServer(): MailServerSettingsModel {
        return this.emailModelMailServer;
    }

    public get paths(): string[] {
        return this.emailModelPaths;
    }

    public get reportName(): string {
        return this.emailModelReportName;
    }

    public get type(): SettingsType {
        return this.emailModelType;
    }

    public get active(): boolean {
        return this.emailModelActive;
    }

    @importData
    public set raw(data: IMailSettings) {}

    public get raw(): IMailSettings {

        let server = null;

        if ( this.emailModelMailServer ) {
            const mailServer = this.emailModelMailServer as MailServerSettingsModel;
            server     = mailServer.raw as IMailServerSettings || null;
        }

        const d =  {
            subject:    this.subject,
            message:    this.message,
            mailType:   this.mailType,
            to:         this.to,
            cc:         this.cc,
            bcc:        this.bcc,
            mailServer: server,
            paths:      this.paths,
            reportName: this.reportName,
            type:       this.type,
            active:     this.active
        };
        return d;
    }
}
