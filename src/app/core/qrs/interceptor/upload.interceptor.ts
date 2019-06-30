import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class UploadInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const needle = new RegExp('^/qrs/contentLibrary/[^\/]+/uploadfile');
        if (req.url.match(needle) && req.body.has('file')) {
            const fileName = req.body.get('file').name;
            const request: HttpRequest<any> = req.clone({
                setParams: {
                    'externalpath': fileName,
                    'overwrite': 'true'
                },
                withCredentials: true
            });
            return next.handle(request);
        }
        return next.handle(req);
    }
}
