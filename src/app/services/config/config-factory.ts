import { Injectable } from '@angular/core';
import * as SerEngineConfig from '../../config/ser-engine.config.json';
import { ISerEngineConfig } from '@core/modules/ser-engine/api/ser-engine-config.interface';

export enum CONFIGURATIONS {
    SER_ENGINE
}

@Injectable()
export class ConfigFactory {

    public buildSerEngineConfig(): ISerEngineConfig {
        let config: ISerEngineConfig;
        /// #if mode=="development"
            config = SerEngineConfig.development;
        /// #else
            config = SerEngineConfig.qmc;
        /// #endif

        if ( config.host === '' ) {
            config.host = window.location.host;
        }
        return config;
    }
}
