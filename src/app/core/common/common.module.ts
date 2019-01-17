import { NgModule } from '@angular/core';
import { SmcPageComponent } from './components/page/page.component';
import { MouseDblClickDirective } from './directives/double-click.directive';
import { ConvertEnumPipe } from './pipes/convert-enum.pipe';
import { HJSonPipe } from './pipes/hsjon.pipe';
import { Nl2Br } from './pipes/nl2br.pipe';
import { ListHeaderComponent } from './components/list/list-header.component';
import { CommonModule } from '@angular/common';
import { EnigmaService, StorageService } from './provider';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ListHeaderComponent,
        SmcPageComponent,
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br
    ],
    declarations: [
        ListHeaderComponent,
        SmcPageComponent,
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br
    ],
    providers: [
        EnigmaService,
        StorageService,
        Cache
    ],
})
export class SmcCommonModule { }
