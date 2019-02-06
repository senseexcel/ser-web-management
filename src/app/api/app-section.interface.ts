import { IAppPage } from './app-page.interface';

export interface IAppSection {

    id: string;

    title: string;

    pages: IAppPage[];
}
