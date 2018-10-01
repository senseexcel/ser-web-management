import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TaskRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(TaskRoutes)
    ],
    exports: [RouterModule],
    providers: [],
})
export class TaskRoutingModule { }
