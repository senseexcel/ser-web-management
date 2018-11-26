import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JsonpInterceptor } from './interceptors/jsonp.interceptor';
import { NgModule } from '@angular/core';

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JsonpInterceptor, multi: true}
    ]
})
export class JsonpInterceptorModule {}
