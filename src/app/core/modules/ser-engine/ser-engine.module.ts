import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SerAppService } from './provider/ser-app.provider';
import { ISerEngineConfig } from './api/ser-engine-config.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { XrfkeyInterceptor } from '@core/modules/ser-engine/interceptor/xrfkey.interceptor';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { SerUserService } from '@core/modules/ser-engine/provider/ser-user.service';
import { CustomPropertyProvider } from './provider/custom-property.providert';

@NgModule({
    imports: [HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        CustomPropertyProvider,
        SerAppService,
        SerUserService,
        SerFilterService,
        SerTaskService
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
