import { Component, ViewChild, Inject } from '@angular/core';
import { FileUpload, UploadModel, UploadState, NgxFileuploadDirective } from '@r-hannuschka/ngx-fileupload';
import { FILEUPLOAD_URL, FILEUPLOAD_OVERLAY_CTRL } from '../model/tokens';
import { OverlayCtrl } from '../services/overlay-control';

@Component({
    styleUrls: ['./file-upload.component.scss'],
    selector: 'smc-fileupload',
    templateUrl: 'file-upload.component.html'
})
export class FileUploadComponent {

    @ViewChild(NgxFileuploadDirective, {read: NgxFileuploadDirective, static: true})
    private ngxFileuploadRef: NgxFileuploadDirective;

    /**
     * all file uploades, which will be added to upload-item view
     */
    public uploads: FileUpload[] = [];

    public constructor(
        @Inject(FILEUPLOAD_URL) public uploadUrl: string,
        @Inject(FILEUPLOAD_OVERLAY_CTRL) private ctrl: OverlayCtrl,
    ) { }

    /**
     * new uploads added with drag and drop
     */
    public onUploadsAdd( uploads: FileUpload[] ) {
        this.uploads.push( ...uploads );
    }

    /**
     * handle upload change event,
     * if upload has been completed or canceled remove it from list
     */
    public handleUploadChange( upload: UploadModel, fileUpload: FileUpload ) {
        let completed = upload.state === UploadState.CANCELED;
        completed = completed || upload.state === UploadState.UPLOADED;

        if ( completed ) {
            const idx = this.uploads.indexOf(fileUpload);
            this.uploads.splice( idx, 1 );
        }
    }

    /**
     * upload all files
     */
    public uploadFiles() {
        this.ngxFileuploadRef.upload();
    }

    /**
     * close modal, this will cancel all active downloads
     */
    public close() {
        this.ngxFileuploadRef.cancel();
        this.ctrl.close();
    }
}
