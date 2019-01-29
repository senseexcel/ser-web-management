/** angulare modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/** core modules */
import { SmcCommonModule, QrsModule, MaterialModule, FormHelperModule, SmcUiModule } from '@smc/modules';
/** task routing module */
import { TaskRoutingModule } from './tasks-routing.module';
/** task services */
import { TaskFactory } from './services/task.factory';
import { TaskManagerService } from './services/task-manager.service';
/** task components */
import { EditComponent, ListComponent, FormComponents, TaskComponent,  } from './components';

@NgModule({
    imports: [
        CommonModule,
        FormHelperModule,
        MaterialModule,
        ReactiveFormsModule,
        QrsModule,
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
        TaskFactory,
        TaskManagerService
    ],
    entryComponents: [
        EditComponent
    ]
})
export class TasksModule { }
