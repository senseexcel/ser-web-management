import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SerAppService } from './provider/ser-app.provider';
import { ISerEngineConfig } from './api/ser-engine-config.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { SerAuthenticationService } from '@core/modules/ser-engine/provider/ser-authentication.service';
import { XrfkeyInterceptor } from '@core/modules/ser-engine/interceptor/xrfkey.interceptor';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';

@NgModule({
    imports: [HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        SerAppService,
        SerTaskService,
        SerAuthenticationService,
        SerFilterService
    ],
})
export class SerEngineModule {

    public static forRoot(config: ISerEngineConfig): ModuleWithProviders {

        return {
            ngModule: SerEngineModule,
            providers: [
                {
                    provide: 'SerEngineConfig',
                    useValue: config
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: XrfkeyInterceptor,
                    multi: true
                }
            ]
        };
    }
}
