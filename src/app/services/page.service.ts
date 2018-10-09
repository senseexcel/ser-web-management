import { Injectable } from '@angular/core';
import { IPage } from '@api/page.interface';
import PageConfig from '../config/page.config.json';

@Injectable()
export class PageService {

    /**
     * get page data by name
     *
     * @param name
     */
    public get pageData(): IPage[] {
        /** create clone so page data could not be modified */
        return JSON.parse(JSON.stringify(PageConfig));
    }
}
