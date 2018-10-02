import { Routes } from '@angular/router';
import { TaskComponent } from '../components/task/task.component';
import { ListComponent } from '../components/list/list.component';
import { EditComponent } from '../components/edit/edit.component';
import { NewComponent } from '../components/new/new.component';

export const TaskRoutes: Routes = [{
    path: 'tasks',
    component: TaskComponent,
    data: {
        breadcrumb: 'Tasks'
    },
    children: [{
        path: '',
        component: ListComponent
    }, {
        path: 'edit/:id',
        component: EditComponent,
        data: {
            breadcrumb: 'Edit Task'
        },
    }, {
        path: 'new',
        component: NewComponent,
        data: {
            breadcrumb: 'Create Task'
        },
    }, {
        path: 'new/:name',
        component: EditComponent,
        data: {
            breadcrumb: 'Create Task'
        },
    }]
}];
