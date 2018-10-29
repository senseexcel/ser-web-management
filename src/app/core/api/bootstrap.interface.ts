import { Observable } from 'rxjs';

export interface IBootstrap {
    bootstrap(): Promise<any>;
}
