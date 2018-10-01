import { ConfigFactory, CONFIGURATIONS } from './config-factory';

export function configServiceFactory(configFactory: ConfigFactory, type: CONFIGURATIONS) {

    return configFactory.buildSerEngineConfig();
}
