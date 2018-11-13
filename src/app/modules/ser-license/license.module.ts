import { NgModule } from '@angular/core';
import { LicenseRoutingModule } from './license-routing.module';
import { pages } from './pages';
import { components, InsertOverlayComponent, InsertOverlayFooterComponent } from './components';
import { services } from './services';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material';
import { ModalModule } from '@core/modules/modal/modal.module';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        HttpClientModule,
        HttpClientJsonpModule,
        LicenseRoutingModule,
        MatTableModule,
        ModalModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ...components,
        ...pages
    ],
    entryComponents: [
        ...pages,
        InsertOverlayComponent,
        InsertOverlayFooterComponent
    ],
    exports: [],
    providers: [...services],
})
export class LicenseModule { }
