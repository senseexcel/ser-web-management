import { NgModule } from '@angular/core';
import { LicenseReader } from './services/license-reader';
import { LicenseFactory } from './services/license-factory';

@NgModule({
    providers: [
        LicenseReader,
        LicenseFactory
    ]
})
export class LicenseModule { }
