import { NgModule, Compiler, FactoryProvider, NgModuleFactory } from '@angular/core';
import { EditGuard } from './guards/edit.guard';
import { RouterModule, ROUTES, Routes } from '@angular/router';
import { AppRoutes } from './model/routes';

/**
 * @workarround
 * @see https://github.com/angular/angular/issues/22700
 */
export function AppsRoutingFactory(): Routes {
    return AppRoutes;
}

const AppsModuleRoutesFactory: FactoryProvider = <any> {
    provide: ROUTES,
    multi: true,
    useFactory: AppsRoutingFactory,
    useValue: [],
};
delete (<any>AppsModuleRoutesFactory).useValue;
/** work arround end */

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [EditGuard, AppsModuleRoutesFactory]
})

export class AppsRoutingModule {}
