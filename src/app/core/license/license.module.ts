import { NgModule } from '@angular/core';
import { LicenseReader } from './services/license-reader';
import { LicenseWriter } from './services/license-writer';

@NgModule({
    providers: [
        LicenseReader,
        LicenseWriter
    ]
})
export class LicenseModule { }
