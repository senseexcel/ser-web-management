import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOperator } from '@core/modules/ser-engine/api/filter.interface';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserRepository {

    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public fetchQrsUsers(name: string, limit = 20): Observable<any> {

        const body = {
            'entity': 'User',
            'columns': [
                {'name': 'userDirectory', 'columnType': 'Property', 'definition': 'userDirectory' },
                {'name': 'userId', 'columnType': 'Property', 'definition': 'userId'}
            ]
        };

        const filter: string[] = [
            'userId', FilterOperator.SUBSTRING_OF, `'${name}'`
        ];

        return this.http.post('/qrs/User/table', body, {
            params: {
                take: String(limit),
                orderAscending: String(true),
                sortColumn: 'userId',
                filter: filter.join(' ')
            }
        }).pipe(
            map((response: any) => {
                return response.rows.reduce((cur, next) => {
                    return cur.concat(next.join('\\'));
                }, []);
            })
        );
    }
}
