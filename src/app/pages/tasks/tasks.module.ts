/** angulare modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/** core modules */
import { SmcCommonModule, QrsModule, MaterialModule, FormHelperModule, SmcUiModule, SerModule } from '@smc/modules';
/** task routing module */
import { TaskRoutingModule } from './tasks-routing.module';
/** task services */
import { TaskFactory } from './services/task.factory';
/** task components */
import { EditComponent, ListComponent, FormComponents, TaskComponent,  } from './components';

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
export class TasksModule { }
