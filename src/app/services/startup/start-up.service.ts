import { Injectable, Inject } from '@angular/core';
import { Observable, forkJoin, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigFactory } from '../config/config-factory';
import { CustomPropertyProvider } from '@core/modules/ser-engine/provider/custom-property.providert';
import { switchMap } from 'rxjs/operators';
import { ICustomProperty, CustomPropertyObjectType } from '@core/modules/ser-engine/api/custom-property.interface';

@Injectable()
export class StartUpService {

    private http: HttpClient;

    private configFactory: ConfigFactory;

    private propertyProvider: CustomPropertyProvider;

    constructor(
        http: HttpClient,
        configFactory: ConfigFactory,
        customPropertyProvider: CustomPropertyProvider
    ) {
        this.http = http;
        this.configFactory = configFactory;
        this.propertyProvider = customPropertyProvider;
    }

    /**
     * created requests or any async operations which should be done before
     * the app starts
     *
     * @returns {Promise<void>}
     * @memberof StartUpService
     */
    public load(): Promise<void> {
        const requests: Observable<any>[] = [];
        requests.push(this.initializeCustomProperties());

        return forkJoin(...requests)
            .toPromise();
    }

    /**
     * validate properties exists
     *
     * @private
     * @returns {Observable<any>}
     * @memberof StartUpService
     */
    private initializeCustomProperties(): Observable<any> {

        return this.propertyProvider
            .fetchCustomProperties()
            .pipe(
                switchMap((result: ICustomProperty[]) => {
                    if (result.length === 0) {
                        return this.propertyProvider.createCustomProperty('senseExcelReporting', [
                            CustomPropertyObjectType.App,
                            CustomPropertyObjectType.ReloadTask
                        ]);
                    }
                    return of(result);
                }),
            );
    }
}
