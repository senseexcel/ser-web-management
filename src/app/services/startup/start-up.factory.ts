import { StartUpService } from './start-up.service';

export function startUpServiceFactory(startUpService: StartUpService): Function {
    return (): Promise<any> => {
        return startUpService.load();
    };
}
