import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class XrfkeyInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const xrfkey: string = this.buildXrfKey();

        const request: HttpRequest<any> = req.clone({
            setHeaders: {
                'X-Qlik-xrfkey': xrfkey,
            },
            setParams: {
                'xrfkey': xrfkey
            },
            withCredentials: true
        });

        return next.handle(request);
    }

    /**
     * generate 16 chars long xrfkey
     *
     * @readonly
     * @private
     * @type {string}
     * @memberof SerRequestInterceptor
     */
    private buildXrfKey(): string {

        const chars = [97, 122,  // a-z
                       65,  90,  // A-Z
                       48,  57]; // 0-9

        let key = '';

        for (let i = 0, ln = 16; i < ln; i++) {

            /** get starting index for chars 0, 2 or 4*/
            const startIndex = Math.floor(Math.random() * 3) * 2;
            /** slice range from startIndex + 2 Elements and get char code range */
            const range = chars.slice(startIndex, startIndex + 2);
            /** get delta from ascii code range */
            const delta = range[1] - range[0];
            /** create dezimal charCode */
            const charCode = Math.round(Math.random() * delta) + range[0];

            /** generate char code and append to current key */
            key += String.fromCharCode(charCode);
        }

        return key;
    }
}
