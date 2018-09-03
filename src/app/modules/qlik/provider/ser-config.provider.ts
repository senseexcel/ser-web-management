import { Injectable } from '@angular/core';
import { SERConfig  } from '@qlik/model/ser-config.model';
import { ISERConfig } from '@qlik/api/ser-config.interface';

@Injectable()
export class SerConfigProvider {

    private serConfig: SERConfig;

    constructor() {
        this.serConfig = new SERConfig();
    }

    public getConfiguration(): ISERConfig {

        return {
            connections: this.serConfig.connectionConfig,
            distribute: this.serConfig.distributionConfig,
            general: this.serConfig.generalConfig,
            template: this.serConfig.templateConfig,
        };
    }

    public loadConfiguration(config: ISERConfig) {
        this.serConfig.connectionConfig   = config.connections;
        this.serConfig.distributionConfig = config.distribute;
        this.serConfig.generalConfig      = config.general;
        this.serConfig.templateConfig     = config.template;
    }
}
