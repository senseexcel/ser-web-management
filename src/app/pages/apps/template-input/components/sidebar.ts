import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
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

    public selection: SelectionModel<IContentLibrary>;

    constructor (
        private contentLibraryRepository: ContentLibraryService
    ) {
        this.open = new EventEmitter();
        this.selection = new SelectionModel();
    }

    ngOnInit() {
        this.contentLibraryRepository.fetchLibrarys()
            .subscribe((libs) => {
                this.libraries = libs;
            });
    }

    public openLibrary($event, library: IContentLibrary) {
        this.selection.select(library);
        this.open.emit(library.id);
    }
}
