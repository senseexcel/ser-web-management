import { StartUpService } from './start-up.service';

export function startUpServiceFactory(startUpService: StartUpService): Function {
    return () => {
        return startUpService.load();
    }
}
