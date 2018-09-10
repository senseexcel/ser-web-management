import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './api/data/app-routes';



@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, {anchorScrolling: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
