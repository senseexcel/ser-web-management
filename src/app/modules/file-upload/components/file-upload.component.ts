import { Component, ViewChild, Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FileUpload, UploadModel, UploadState, NgxFileuploadDirective } from '@r-hannuschka/ngx-fileupload';
import { FILEUPLOAD_URL, FILEUPLOAD_OVERLAY_CTRL } from '../model/tokens';
import { OverlayCtrl } from '../services/overlay-control';
import { of, Subject } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

@Component({
    styleUrls: ['./file-upload.component.scss'],
    selector: 'smc-fileupload',
    templateUrl: 'file-upload.component.html',
    animations: [
        trigger('removeUpload', [
            state('visible', style({ opacity: 1 })),
            transition(':leave' , [
                animate('.5s ease-out', style({ opacity: 0 }))
            ])
        ])
    ],
})
export class FileUploadComponent {

    @ViewChild(NgxFileuploadDirective, {read: NgxFileuploadDirective, static: true})
    private ngxFileuploadRef: NgxFileuploadDirective;

    /**
     * all file uploades, which will be added to upload-item view
     */
    public uploads: FileUpload[] = [];

    /**
     * subjects sends true if an animation has been done
     */
    private animation$: Subject<boolean> = new Subject();

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
     * triggers on animation done, if time used is 0
     * then this is a skipped animation (in this case :enter)
     * to avoid this fromState have to be visible to void
     * that means component leave animation has been completed
     *
     * @see https://github.com/angular/angular/issues/23535
     */
    public animationEnd($event) {
        if ($event.totalTime !== 0) {
            this.animation$.next(true);
        }
    }

    /**
     * handle upload change event,
     * if upload has been completed or canceled remove it from list
     */
    public handleUploadChange( upload: UploadModel, fileUpload: FileUpload ) {
        if (upload.state === UploadState.CANCELED || upload.state === UploadState.UPLOADED) {
            this.removeUpload(fileUpload);
        }
    }

    private removeUpload(upload: FileUpload) {
        of(upload).pipe(
            delay(1000),
            switchMap(() => {
                const idx = this.uploads.indexOf(upload);
                this.uploads.splice(idx, 1);
                return this.animation$.pipe(take(1));
            })
        )
        .subscribe();
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
