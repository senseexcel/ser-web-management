/** angulare modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
/** core modules */
import { XrfkeyInterceptor } from '@smc/modules/qrs/interceptor/xrfkey.interceptor';
import { MaterialModule } from '@smc/modules/material.module';
import { FormHelperModule } from '@smc/modules/form-helper';
/** task routing module */
import { TaskRoutingModule } from './ser-task-routing.module';
/** task services */
import { TaskFactory } from './services/task.factory';
import { TaskManagerService } from './services/task-manager.service';
/** task components */
import { EditComponent, ListComponent, FormComponents, TaskComponent,  } from './components';
import { SmcCommonModule } from '@smc/modules';
// import { ListHeaderModule } from '@core/modules/list-header/list-header.module';

@NgModule({
    imports: [
        CommonModule,
        FormHelperModule,
        MaterialModule,
        SmcCommonModule,
        TaskRoutingModule,
        ReactiveFormsModule
    ],
    exports: [TaskComponent],
    declarations: [
        ...FormComponents,
        EditComponent,
        ListComponent,
        TaskComponent
    ],
    providers: [
        TaskManagerService,
        TaskFactory,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XrfkeyInterceptor,
            multi: true
        }
    ],
    entryComponents: [
        EditComponent
    ]
})
export class SerTaskModule { }
