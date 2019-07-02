import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { QrsModule, SmcUiModule } from '@smc/modules';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from '@modules/file-upload/file-upload.module';
import { ContentListComponent } from './components/content-list';
import { SidebarComponent } from './components/sidebar';
import { TemplateOverlayComponent } from './components/template-overlay.component';
import { TemplateInputSelectDirective } from './directives/template-input.select';
import { TemplateInputOverlayService } from './provider/templateinput-overlay.service';
import { NGX_FILEUPLOAD_VALIDATOR } from '@r-hannuschka/ngx-fileupload';
import { XlsxTypeValidator } from './validators/xlsx-type.validator';

@NgModule({
    declarations: [
        ContentListComponent,
        SidebarComponent,
        TemplateOverlayComponent,
        TemplateInputSelectDirective
    ],
    entryComponents: [
        TemplateOverlayComponent
    ],
    exports: [
        TemplateInputSelectDirective,
        QrsModule
    ],
    imports: [
        CommonModule,
        OverlayModule,
        QrsModule,
        SmcUiModule,
        FileUploadModule
    ],
    providers: [
        TemplateInputOverlayService,
        {
            provide: NGX_FILEUPLOAD_VALIDATOR,
            useClass: XlsxTypeValidator,
            multi: true
        }
    ],
})
export class TemplateInputModule {}
