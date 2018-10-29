import { NgModule, FactoryProvider } from '@angular/core';
import { RouterModule, ROUTES, Routes} from '@angular/router';
import { AppRoutes } from './model/app-routes';
import { LocationStrategy } from '@angular/common';
import { QmcLocationStrategy } from '@core/router/qmc-location.strategy';

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
    imports: [RouterModule.forRoot([])],
    providers: [
        AppsModuleRoutesFactory,
        { provide: LocationStrategy, useClass: QmcLocationStrategy }
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
