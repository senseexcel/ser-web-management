import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@apps/model/routes';
import { EditGuard } from "./guards/edit.guard";

@NgModule({
    imports: [RouterModule.forChild(AppRoutes)],
    exports: [RouterModule],
    providers: [EditGuard]
})

export class AppsRoutingModule {}
