import { NgModule } from '@angular/core';
import { MouseDblClickDirective } from './directives/double-click.directive';
import { ConvertEnumPipe } from './pipes/convert-enum.pipe';
import { HJSonPipe } from './pipes/hsjon.pipe';
import { Nl2Br } from './pipes/nl2br.pipe';
import { EnigmaService, StorageService, SmcCache } from './provider';

@NgModule({
    imports: [],
    exports: [
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br
    ],
    declarations: [
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br
    ],
    providers: [
        EnigmaService,
        StorageService,
        SmcCache
    ],
})
export class SmcCommonModule { }
