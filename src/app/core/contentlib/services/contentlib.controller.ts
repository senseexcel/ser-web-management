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
            map((meta: ILibrary) => {
                this.contentLibCache.set(name, this.createContentLibrary(meta));
                return this.contentLibCache.get(name);
            })
        );
    }

    /**
     * create content library, automatically subscribe to upload and remove
     * events to update content library meta data
     */
    private createContentLibrary(data: ILibrary): IContentLibrary {
        const lib: IContentLibrary = new ContentLibrary(this.httpClient, data);
        merge(lib.fileUploaded$, lib.fileRemoved$)
            .pipe(
                takeUntil(lib.deleted$),
                switchMap(() => this.fetchContentLibMetadata(data.name)),
            )
            .subscribe((libMeta) => lib.update(libMeta));

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
