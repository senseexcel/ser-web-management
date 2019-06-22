import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IContentLibrary, ContentLibraryService } from '@smc/modules/qrs/provider/content-library.repository';

@Component({
    selector: 'smc-templateinput-sidebar',
    templateUrl: 'sidebar.html',
    styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {

    @Output()
    public open: EventEmitter<string>;

    public libraries: IContentLibrary[];

    constructor (
        private contentLibraryRepository: ContentLibraryService
    ) {
        this.open = new EventEmitter();
    }

    ngOnInit() {
        this.contentLibraryRepository.fetchLibrarys()
            .subscribe((libs) => {
                this.libraries = libs;
            });
    }

    public openLibrary($event, libraryId) {
        this.open.emit(libraryId);
    }
}
