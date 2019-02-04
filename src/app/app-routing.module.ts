import { NgModule, FactoryProvider } from '@angular/core';
import { RouterModule, ROUTES, Routes} from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { QmcLocationStrategy } from 'src/app/util/qmc-location.strategy';

/**
 * @workarround
 * @see https://github.com/angular/angular/issues/22700
 */
export function AppsRoutingFactory(): Routes {
    return [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }];
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
        {
            provide: LocationStrategy,
            useClass: QmcLocationStrategy
        }
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
