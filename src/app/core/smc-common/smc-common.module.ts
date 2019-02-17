import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MouseDblClickDirective } from './directives/double-click.directive';
import { ConvertEnumPipe } from './pipes/convert-enum.pipe';
import { HJSonPipe } from './pipes/hsjon.pipe';
import { Nl2Br } from './pipes/nl2br.pipe';
import { MomentFormatPipe } from './pipes/moment-format.pipe';
import { EnigmaService, StorageService, SmcCache } from './provider';

@NgModule({
    imports: [
    ],
    exports: [
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br,
        MomentFormatPipe,
        TranslateModule
    ],
    declarations: [
        MouseDblClickDirective,
        ConvertEnumPipe,
        HJSonPipe,
        Nl2Br,
        MomentFormatPipe,
    ],
    providers: [
        EnigmaService,
        StorageService,
        SmcCache
    ],
})
export class SmcCommonModule { }
