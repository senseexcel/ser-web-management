import { NgModule } from '@angular/core';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { components } from './components';
import { services } from './services';

@NgModule({
    imports: [
        LicenseRoutingModule,
    ],
    declarations: [
        ...components,
        ...pages
    ],
    entryComponents: [
        ...pages
    ],
    exports: [],
    providers: [...services],
})
export class LicenseModule { }
