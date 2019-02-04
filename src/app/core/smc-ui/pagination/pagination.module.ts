import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import {
    InfiniteScrollComponent,
    PageInputComponent,
    PageNavigationComponent,
    PaginationComponent
} from './components';

@NgModule({
    exports: [
        InfiniteScrollComponent,
        PaginationComponent,
        PageNavigationComponent
    ],
    imports: [BrowserModule, ReactiveFormsModule],
    declarations: [
        InfiniteScrollComponent,
        PageInputComponent,
        PageNavigationComponent,
        PaginationComponent
    ]
})
export class PaginationModule {}
