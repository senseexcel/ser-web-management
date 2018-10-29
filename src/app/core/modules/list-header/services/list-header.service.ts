import { Injectable } from '@angular/core';
import { IListData } from '@core/modules/list-header/api/list-data.interface';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class ListHeaderService {

    public updated: BehaviorSubject<IListData>;

    constructor() {
        this.updated = new BehaviorSubject(null);
    }

    public updateData(data: IListData) {
        this.updated.next(data);
    }
}
