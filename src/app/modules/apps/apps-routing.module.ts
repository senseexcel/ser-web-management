import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@apps/model/routes';

@NgModule({
    imports: [ RouterModule.forChild(AppRoutes) ],
    exports: [ RouterModule ]
})
export class AppsRoutingModule {}
