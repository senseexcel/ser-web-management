import { IAppSection } from '@api/app-section.interface';

export const PageSettings: IAppSection[] = [{
    id: 'section_1',
    title: 'section one',
    pages: [{
        id: 'page_1',
        disabled: false,
        icon: 'page_1_icon',
        route: 'page1',
        show: true
    }, {
        id: 'page_2',
        disabled: false,
        icon: 'page_2_icon',
        route: 'page2',
        show: true
    }]
}, {
    id: 'section_2',
    title: 'section two',
    pages: [{
        id: 'page_3',
        disabled: true,
        icon: 'page_2_icon',
        route: 'page2',
        show: true
    }]
}];
