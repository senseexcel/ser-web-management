import { Component, Input, OnDestroy } from '@angular/core';
import { ContentLibraryService, IStaticContent } from '@smc/modules/qrs/provider/content-library.repository';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'smc-templateinput-list',
    templateUrl: 'content-list.html'
})
export class ContentListComponent implements OnDestroy {

    public contents: IStaticContent[];

    private libraryId: string;

    private destroyed$: Subject<boolean>;

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
        private contentLibraryRepository: ContentLibraryService
    ) {
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

    /**
     * load static content from libary
     */
    private loadStaticContent(id: string) {
        /** @todo switch content if we allready load but selected a new library */
        this.contentLibraryRepository.fetchLibraryContent(id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((contents) => this.contents = contents);
    }
}
