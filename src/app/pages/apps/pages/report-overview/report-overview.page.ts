import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerModule, SmcUiModule, SmcCommonModule } from '@smc/modules';
import { ResponsiveMenuModule } from 'ngx-responsivemenu';
import { ReportListComponent } from './components/report-overview';
import { ReportInfoComponent } from './components/report-info';

export const ReportOverviewRoutes = [{
    path: '',
    component: ReportListComponent,
    data: {
        breadcrumb: 'Report Overview'
    }
}];

@NgModule({
    declarations: [
        ReportListComponent,
        ReportInfoComponent
    ],
    entryComponents: [
        ReportListComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        ResponsiveMenuModule,
        SerModule,
        SmcCommonModule,
        SmcUiModule
    ],
    providers: [SerModule],
})
export class ReportOverview { }
