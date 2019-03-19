import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, merge } from 'rxjs';
import { FilterFactory, FilterOperator } from '@smc/modules/qrs';
import { IContentLibrary } from '../api/content-library.interface';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { ContentLibrary } from './content-library';
import { ILibrary } from '../api/library.interface';

@Injectable({ providedIn: 'root' })
export class ContentlibController {

    /**
     * cache for opened content librarys
     * @memberof ContentLib
     */
    private contentLibCache: Map<string, IContentLibrary>;

    public constructor(
        private filterFactory: FilterFactory,
        private httpClient: HttpClient
    ) {
        this.contentLibCache = new Map();
    }

    /**
     * open content lib if exists
     */
    public open(name: string): Observable<IContentLibrary> {

        if (this.contentLibCache.has(name)) {
            return of(this.contentLibCache.get(name));
        }

        return this.fetchContentLibMetadata(name).pipe(
            map((meta: ILibrary) => this.createContentLibrary(meta))
        );
    }

    public close(lib: IContentLibrary): void {
        /** @todo implement */
    }

    /**
     * create content library, automatically subscribe to upload and remove
     * events to update content library meta data
     */
    private createContentLibrary(data: ILibrary): IContentLibrary {
        const lib: IContentLibrary = new ContentLibrary(this.httpClient, data);

        merge(lib.fileUploaded$, lib.fileRemoved$)
            .pipe(
                /** @todo remove subscriptions if not needed anymore */
                switchMap(() => this.fetchContentLibMetadata(data.name)),
            )
            .subscribe((libMeta) => lib.update(libMeta));

        // write contentlib to cache
        this.contentLibCache.set(name, lib);
        return lib;
    }

    /**
     * fetch content lib meta data
     */
    private fetchContentLibMetadata(name) {

        const filter = this.filterFactory.createFilter('name', `'${name}'`, FilterOperator.EQUAL);
        const params = new HttpParams().set('filter', this.filterFactory.createFilterQueryString(filter));

        return this.httpClient.get<ILibrary[]>('/qrs/contentLibrary/full', { params })
            .pipe(map((libs) => {
                if (!libs.length) {
                    throw { messsage: 'contentlib not found' };
                }
                return libs[0];
            }));
    }
}
