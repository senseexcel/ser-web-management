import { Component, Input, OnDestroy } from '@angular/core';
import { ContentLibraryService, IStaticContent } from '@smc/modules/qrs/provider/content-library.repository';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FilterFactory, FilterOperator } from '@smc/modules/qrs';
import { TemplateInputOverlayService } from '../provider/templateinput-overlay.service';

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

    public contents: ContentListItem[];

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
        private overlayService: TemplateInputOverlayService,
        private contentLibraryRepository: ContentLibraryService,
        private filterFactory: FilterFactory
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

    public selectFile(event: MouseEvent, item: ContentListItem) {
        this.overlayService.selectContent(item.path);
    }

    /**
     * load static content from libary
     */
    private loadStaticContent(id: string) {

        /** create filter we only want xlsx files */
        const filter = this.filterFactory.createFilter('logicalPath', `'.xlsx'`, FilterOperator.ENDS_WITH);

        this.contentLibraryRepository.fetchLibraryContent(id, 0, 20, filter)
            .pipe(
                takeUntil(this.destroyed$),
                map((contents) => contents.map((staticContent) => this.mapToListItem(staticContent)))
            )
            .subscribe((contents) => {
                // name.replace(^\/content\/(.*)$, 'content://$1')
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
