import { HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * interceptor to fix strange behavior angular itself add 2 times callback query param
 * rewrite request params so callback=['JSONP_CALLBACK', 'JSONP_CALLBACK'] to callback=['JSONP_CALLBACK']
 * which results in a single query param callback=<GENERATED_CALLBACK_FN>
 *
 * @export
 * @class JsonpInterceptor
 */
@Injectable()
export class JsonpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // only fetch jsonp requests
    if (req.method === 'JSONP') {
        let params: HttpParams = new HttpParams();
        req.params.keys().map((key) => {
            params = params.append(key, req.params.get(key));
        });

        const newReq = req.clone({
            params: params
        });
        return next.handle(newReq);
    }

    // otherwise pass through
    return next.handle(req);
  }
}
