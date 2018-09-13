import { NgModule } from '@angular/core';
import { TasksComponent } from './components/tasks/tasks.component';
import { SerEngineModule } from '@core/modules/ser-engine/ser-engine.module';
import { MaterialModule } from '@core/modules/material.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, SerEngineModule, MaterialModule],
    exports: [TasksComponent],
    declarations: [TasksComponent],
    providers: [],
})
export class SerTaskModule { }
