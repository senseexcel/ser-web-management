import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxFileuploadModule } from '@r-hannuschka/ngx-fileupload';
import { FileUploadComponent } from './components/file-upload.component';
import { FileUploadOverlay } from './services/file-upload.overlay';
import { SmcUiModule } from '@smc/modules';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        OverlayModule,
        NgxFileuploadModule,
        SmcUiModule
    ],
    entryComponents: [
        FileUploadComponent
    ],
    exports: [],
    declarations: [
        FileUploadComponent
    ],
    providers: [
        FileUploadOverlay,
    ],
})
export class FileUploadModule { }
