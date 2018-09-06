import { NgModule } from '@angular/core';
import { SerAppProvider } from './provider/ser-app.provider';
import { ReportProvider } from './provider/report.provider';

@NgModule({
    imports: [],
    exports: [],
    providers: [
        ReportProvider,
        SerAppProvider,
    ],
})
export class SerAppModule {
}
