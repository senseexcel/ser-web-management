import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules} from '@angular/router';
import { AppRoutes } from './api/data/app-routes';

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, {
        anchorScrolling: 'enabled',
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
