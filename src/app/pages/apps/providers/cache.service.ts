import { Injectable } from '@angular/core';
import { IReportCache } from '../api/report-cache.interface';
import { AppsServiceModule } from '../apps-service.module';

@Injectable({providedIn: AppsServiceModule})
export class CacheService {

    private editCache: IReportCache;

    public set currentReportData(data: IReportCache) {
        this.editCache = data;
    }

    public get currentReportData(): IReportCache {
        return this.editCache;
    }
}
