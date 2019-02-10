/** angulare modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SmcCommonModule, QrsModule, MaterialModule, FormHelperModule, SmcUiModule, SerModule } from '@smc/modules';
import { TaskRoutingModule } from './tasks-routing.module';
import { TaskFactory } from './services/task.factory';
import { EditComponent, ListComponent, FormComponents, TaskComponent,  } from './components';

import i18n_en from './i18n/en.json';

@NgModule({
    imports: [
        CommonModule,
        FormHelperModule,
        MaterialModule,
        ReactiveFormsModule,
        QrsModule,
        SerModule,
        TaskRoutingModule,
        SmcCommonModule,
        SmcUiModule
    ],
    exports: [
        TaskComponent
    ],
    declarations: [
        ...FormComponents,
        EditComponent,
        ListComponent,
        TaskComponent
    ],
    providers: [
        TaskFactory
    ],
    entryComponents: [
        EditComponent
    ]
})
export class TasksModule {

    public constructor(translation: TranslateService) {
        translation.setTranslation('en', i18n_en, true);
    }
}
