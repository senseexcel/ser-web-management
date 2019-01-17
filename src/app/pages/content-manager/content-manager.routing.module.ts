import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentManagerRoutes } from './model/routes';

@NgModule({
    imports: [
        RouterModule.forChild(ContentManagerRoutes)
    ],
    exports: [RouterModule],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentManagerRoutingModule { }
