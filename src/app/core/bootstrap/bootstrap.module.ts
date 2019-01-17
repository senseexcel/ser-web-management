import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IBootstrap } from './api/bootstrap.interface';
import { BootstrapService } from './provider/bootstrap.service';
import { HttpClientModule } from '@angular/common/http';
import { QrsModule } from '../qrs/qrs.module';
import { SerModule } from '../ser/ser.module';

@NgModule({
    imports: [QrsModule, HttpClientModule],
    exports: [],
    providers: [
        BootstrapService,
        {
            provide: APP_INITIALIZER,
            useFactory: (bootstrapService: IBootstrap) => {
                return () => bootstrapService.bootstrap();
            },
            deps: [BootstrapService],
            multi: true
        }
    ],
})
export class BootstrapModule {
}
