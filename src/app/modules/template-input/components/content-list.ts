import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ContentLibraryService, IStaticContent } from '@smc/modules/qrs/provider/content-library.repository';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FilterFactory, FilterOperator } from '@smc/modules/qrs';

interface ContentListItem {
    label: string;
    path: string;
}

@Component({
    selector: 'smc-templateinput-list',
    templateUrl: 'content-list.html',
    styleUrls: ['./content-list.scss']
})
export class ContentListComponent implements OnDestroy {

    public isLoading = false;

    public contents: ContentListItem[];

    private libraryId: string;

    private destroyed$: Subject<boolean>;

    @Output()
    public select: EventEmitter<any>;

    /**
     * sets current libary id and load new data
     */
    @Input()
    public set library(id:  string) {
        if (id && id !== this.libraryId) {
            this.loadStaticContent(id);
        }
        this.libraryId = id;
    }

    constructor (
        private contentLibraryRepository: ContentLibraryService,
        private filterFactory: FilterFactory
    ) {
        this.select = new EventEmitter();
        this.destroyed$ = new Subject();
    }

    /**
     * destroy component
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.destroyed$ = null;
    }

    public selectFile(event: MouseEvent, item: ContentListItem) {
        this.select.emit(item.path);
    }

    public reload(id: string) {
        this.loadStaticContent(id);
    }

    /**
     * load static content from libary
     */
    private loadStaticContent(id: string) {

        /** create filter we only want xlsx files */
        const filter = this.filterFactory.createFilter('logicalPath', `'.xlsx'`, FilterOperator.ENDS_WITH);
        this.isLoading = true;
        this.contentLibraryRepository.fetchLibraryContent(id, 0, 20, filter)
            .pipe(
                takeUntil(this.destroyed$),
                map((contents) => contents.map((staticContent) => this.mapToListItem(staticContent)))
            )
            .subscribe((contents) => {
                this.isLoading = false;
                this.contents = contents;
            });
    }

    private mapToListItem( staticContent: IStaticContent ): ContentListItem {
        return {
            label: staticContent.logicalPath.match(/([^\/]*?)$/)[1],
            path: staticContent.logicalPath.replace( /^\/content\/(.*)$/, 'content://$1' )
        };
    }
}
