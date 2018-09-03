import { ISERTemplate, ISERDistribution, ISERConnection } from '@qlik/api/ser-config.interface';

export class SERConfig {

    /**
     * sense excel reporting general config
     *
     * @private
     * @type {*}
     * @memberof SERConfig
     */
    private serGeneralConfig: any;

    /**
     * sense excel reporting template configuration
     *
     * @private
     * @type {ISERTemplate}
     * @memberof SERConfig
     */
    private serTemplateConfig: ISERTemplate;

    /**
     * sense excel reporting distribution configuration
     *
     * @private
     * @type {ISERDistribution}
     * @memberof SERConfig
     */
    private serDistributionConfig: ISERDistribution;

    /**
     * sense excel reporting connection configuration
     *
     * @private
     * @type {ISERConnection}
     * @memberof SERConfig
     */
    private serConnectionConfig: ISERConnection;

    /**
     * get connection config for sense excel reporting
     *
     * @type {ISERConnection}
     * @memberof SERConfig
     */
    public get connectionConfig(): ISERConnection {
        return this.serConnectionConfig;
    }

    /**
     * get distribution config for sense excel reporting
     *
     * @type {ISERDistribution}
     * @memberof SERConfig
     */
    public get distributionConfig(): ISERDistribution {
        return this.serDistributionConfig;
    }

    /**
     * get general config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public get generalConfig() {
        return this.serGeneralConfig;
    }

    /**
     * get template config for sense excel reporting
     *
     * @type {ISERTemplate}
     * @memberof SERConfig
     */
    public get templateConfig(): ISERTemplate {
        return this.serTemplateConfig;
    }

    /**
     * set connection config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public set connectionConfig(config: ISERConnection) {
        this.serConnectionConfig = config;
    }

    /**
     * set distribution config for sense excel reporting
     *
     * @memberof SERConfig
     */
    public set distributionConfig(config: ISERDistribution) {
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
    public set templateConfig(config: ISERTemplate) {
        this.serTemplateConfig = config;
    }
}
