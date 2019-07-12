import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterFactory, AppRepository, SharedContentRepository, TaskRepository } from './provider';
import { CommonModule } from '@angular/common';
import { ContentLibraryService } from './provider/content-library.repository';
import { XrfkeyInterceptor } from './interceptor/xrfkey.interceptor';
import { UploadInterceptor } from './interceptor/upload.interceptor';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [],
    providers: [
        ContentLibraryService,
        FilterFactory,
        AppRepository,
        SharedContentRepository,
        TaskRepository,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XrfkeyInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UploadInterceptor,
            multi: true
        }
    ]
})
export class QrsModule { }
