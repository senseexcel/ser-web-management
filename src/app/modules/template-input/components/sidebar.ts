import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { IContentLibrary, ContentLibraryService } from '@smc/modules/qrs/provider/content-library.repository';
import { FileUploadOverlay } from '@modules/file-upload/services/file-upload.overlay';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'smc-templateinput-sidebar',
    templateUrl: 'sidebar.html',
    styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {

    @Output()
    public open: EventEmitter<string>;

    @Output()
    public changed: EventEmitter<void>;

    public libraries: IContentLibrary[];

    public selection: SelectionModel<IContentLibrary>;

    constructor (
        private contentLibraryRepository: ContentLibraryService,
        private uploadOverlay: FileUploadOverlay
    ) {
        this.open = new EventEmitter();
        this.changed = new EventEmitter();
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

    public uploadFile() {
        const selection: IContentLibrary = this.selection.selected[0];
        if (selection) {
            const url = `/qrs/contentLibrary/${selection.name}/uploadfile`;
            const ctrl = this.uploadOverlay.open(url);

            ctrl.uploaded()
                .pipe(debounceTime(350))
                .subscribe({ next: () => this.changed.emit() });
        }
    }
}
