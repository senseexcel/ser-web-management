import { IMailSettings, EMailType, IMailServerSettings, SettingsType } from 'ser.api';
import { MailServerSettingsModel } from '@core/modules/ser-report/model/settings/mail-server-settings.model';

export class EmailModel implements IMailSettings {

    private emailModelSubject: string;
    private emailModelMessage: string;
    private emailModelMailType: EMailType;
    private emailModelTo: string;
    private emailModelCc: string;
    private emailModelBcc: string;
    private emailModelMailServer: IMailServerSettings;
    private emailModelPaths: string[];
    private emailModelReportName: string;
    private emailModelType: SettingsType;
    private emailModelActive: boolean;

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

    public set mailServer(mailServer: IMailServerSettings) {
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

    public get mailServer(): IMailServerSettings {
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

    public get raw(): IMailSettings {
        const mailServer = this.emailModelMailServer as MailServerSettingsModel;
        return {
            subject:    this.emailModelSubject,
            message:    this.emailModelMessage,
            mailType:   this.emailModelMailType,
            to:         this.emailModelTo,
            cc:         this.emailModelCc,
            bcc:        this.emailModelBcc,
            mailServer: mailServer.raw,
            paths:      this.emailModelPaths,
            reportName: this.emailModelReportName,
            type:       this.emailModelType,
            active:     this.emailModelActive,
        };
    }
}
