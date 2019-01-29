import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { XrfkeyInterceptor } from './interceptor/xrfkey.interceptor';
import { FilterFactory, AppRepository, SharedContentRepository, TaskRepository } from './provider';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [],
    providers: [
        FilterFactory,
        AppRepository,
        SharedContentRepository,
        TaskRepository,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XrfkeyInterceptor,
            multi: true
        }
    ],
})
export class QrsModule { }
