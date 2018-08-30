import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QlikRoutes } from '@qlik/model/routes';

@NgModule({
    imports: [ RouterModule.forChild(QlikRoutes) ],
    exports: [ RouterModule ]
})
export class QlikRoutingModule {}
