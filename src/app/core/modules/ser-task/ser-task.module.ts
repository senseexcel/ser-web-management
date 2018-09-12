import { NgModule } from '@angular/core';
import { TasksComponent } from './components/tasks/tasks.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';

@NgModule({
    imports: [SerEngineModule],
    exports: [TasksComponent],
    declarations: [TasksComponent],
    providers: [],
})
export class SerTaskModule { }
