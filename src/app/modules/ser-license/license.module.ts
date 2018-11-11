import { NgModule } from '@angular/core';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { components } from './components';
import { services } from './services';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        HttpClientJsonpModule,
        LicenseRoutingModule,
        ReactiveFormsModule,
        MatTableModule,
        CoreModule
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
