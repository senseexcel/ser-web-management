import { Injectable } from '@angular/core';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';

export enum CONFIGURATIONS {
    SER_ENGINE
}

@Injectable()
export class ConfigFactory {

    public buildSerEngineConfig(): ISerEngineConfig {

        const config: ISerEngineConfig = {
            host: window.location.host as string,
            virtualProxy: ''
        };
        return config;
    }
}
