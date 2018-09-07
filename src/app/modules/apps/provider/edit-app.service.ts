import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';

@Injectable()
export class EditAppService {

    private app: BehaviorSubject<ISerApp>;

    constructor() {
        this.app = new BehaviorSubject<ISerApp>(null);
    }

    public editApp(app: ISerApp) {
        this.app.next(app);
    }

    public loadApp(): Observable<ISerApp> {
        return this.app;
    }
}
