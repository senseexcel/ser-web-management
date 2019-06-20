import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { ContentListComponent } from './components/content-list';
import { SidebarComponent } from './components/sidebar';
import { TemplateOverlayComponent } from './components/template-overlay.component';
import { TemplateInputSelectDirective } from './directives/template-input.select';
import { TemplateInputOverlayService } from './provider/templateinput-overlay.service';

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
        TemplateInputSelectDirective
    ],
    imports: [
        OverlayModule
    ],
    providers: [
        TemplateInputOverlayService
    ],
})
export class TemplateInputModule {
}
