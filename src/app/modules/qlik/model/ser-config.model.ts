import { ISerTemplate, IDeliverySettings, ISerConnection, ISerGeneral } from 'ser.api';

export class SERConfig {

    /**
     * sense excel reporting general config
     *
     * @private
     * @type {*}
     * @memberof SERConfig
     */
    private serGeneralConfig: ISerGeneral;

    /**
     * sense excel reporting template configuration
     *
     * @private
     * @type {ISerTemplate}
     * @memberof SERConfig
     */
    private serTemplateConfig: ISerTemplate;

    /**
     * sense excel reporting distribution configuration
     *
     * @private
     * @type {ISERDistribution}
     * @memberof SERConfig
     */
    private serDistributionConfig: any;

    /**
     * sense excel reporting connection configuration
     *
     * @private
     * @type {ISERConnection}
     * @memberof SERConfig
     */
    private serConnectionConfig: any;

    /**
     * get connection config for sense excel reporting
     *
     * @type {ISERConnection}
     * @memberof SERConfig
     */
    public get connectionConfig(): ISerConnection {
        return this.serConnectionConfig;
    }

    /**
     * get distribution config for sense excel reporting
     *
     * @type {ISERDistribution}
     * @memberof SERConfig
     */
    public get distributionConfig(): any {
        return this.serDistributionConfig;
    }

    /**
     * get general config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public get generalConfig(): ISerGeneral {
        return this.serGeneralConfig;
    }

    /**
     * get template config for sense excel reporting
     *
     * @type {ISERTemplate}
     * @memberof SERConfig
     */
    public get templateConfig(): ISerTemplate {
        return this.serTemplateConfig;
    }

    /**
     * set connection config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public set connectionConfig(config: ISerConnection) {
        this.serConnectionConfig = config;
    }

    /**
     * set distribution config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public set distributionConfig(config: any) {
        this.serDistributionConfig = config;
    }

    /**
     * set general config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public set generalConfig(config) {
        this.serGeneralConfig = config;
    }

    /**
     * set template configuration for sense execel reporting
     *
     * @memberof SERConfig
     */
    public set templateConfig(config: ISerTemplate) {
        this.serTemplateConfig = config;
    }
}
