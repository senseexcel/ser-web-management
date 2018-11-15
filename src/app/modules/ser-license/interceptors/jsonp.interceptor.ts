import { HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class JsonpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === 'JSONP') {
        let params: HttpParams = new HttpParams();
        req.params.keys().map((key) => {
            params = params.append(key, req.params.get(key));
        });

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'text');

        console.log(headers);

        const newReq = req.clone({
            headers: headers,
            params: params
        });
        return next.handle(newReq);
    }

    return next.handle(req);
  }
}
