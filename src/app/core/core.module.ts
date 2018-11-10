import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MouseDblClickDirective } from '@core/directives/double-click.directive';
import { IBootstrap } from './api/bootstrap.interface';
import { BootstrapService } from './services/bootstrap.service';
import { AppData } from './model/app-data';
import { Nl2Br } from './pipes/nl2br.pipe';

@NgModule({
    imports: [],
    exports: [MouseDblClickDirective, Nl2Br],
    declarations: [MouseDblClickDirective, Nl2Br],
    providers: [ BootstrapService, {
        provide: 'AppData',
        useClass: AppData
    }, {
        provide: APP_INITIALIZER,
        useFactory: (bootstrapService: IBootstrap) => {
            return () => bootstrapService.bootstrap();
        },
        deps: [BootstrapService],
        multi: true
    }],
})
export class CoreModule {
}
