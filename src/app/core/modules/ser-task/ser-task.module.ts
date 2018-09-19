/** angulare modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
/** core modules */
import { XrfkeyInterceptor } from '@core/modules/ser-engine/interceptor/xrfkey.interceptor';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';
import { MaterialModule } from '@core/modules/material.module';
import { FormHelperModule } from '@core/modules/form-helper';
/** task routing module */
import { TaskRoutingModule } from './ser-task-routing.module';
/** task services */
import { TaskFactoryService } from './services/task-factory.service';
/** task components */
import { EditComponent, NewComponent, ListComponent, FormComponents, TaskComponent } from './components';

@NgModule({
    imports: [
        CommonModule,
        FormHelperModule,
        MaterialModule,
        SerEngineModule,
        TaskRoutingModule,
        ReactiveFormsModule
    ],
    exports: [TaskComponent],
    declarations: [
        ...FormComponents,
        EditComponent,
        NewComponent,
        ListComponent,
        TaskComponent
    ],
    providers: [
        TaskFactoryService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XrfkeyInterceptor,
            multi: true
        }
    ],
})
export class SerTaskModule { }
