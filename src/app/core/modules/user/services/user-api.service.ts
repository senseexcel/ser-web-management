import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserApiService {

    public constructor(
        private httpClient: HttpClient
    ) {}

    public logout(): void {

        this.httpClient.delete('/qps/user')
            .subscribe(() => {
                const host = window.location.host;
                window.location.assign(`${host}/qps/logout?targetUri=${host}/qmc`);
            });
    }
}
