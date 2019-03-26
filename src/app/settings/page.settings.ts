import { IAppSection } from '@api/app-section.interface';

export const AppPageSettings: IAppSection[] = [
    {
        id: 'manage_content',
        title: 'manage content',
        pages: [{
            id: 'apps',
            show: true,
            disabled: false,
            icon: 'apps',
            route: 'apps',
        },
        {
            id: 'tasks',
            show: true,
            disabled: false,
            icon: 'tasks',
            route: 'tasks',
        },
        {
            id: 'sharedcontent',
            show: true,
            disabled: false,
            icon: 'folder',
            route: 'sharedcontent',
        }]
    },
    {
        id: 'governance',
        title: 'governance',
        pages: [{
            id: 'monitoring_apps',
            show: true,
            disabled: false,
            icon: 'streams',
            route: 'monitoring'
        }]
    },
    {
        id: 'manage_resources',
        title: 'manage resources',
        pages: [{
            id: 'license',
            show: true,
            disabled: false,
            icon: 'license',
            route: 'license',
        }]
    },
    {
        id: 'configure_system',
        title: 'configure_system',
        pages: [{
            id: 'installation_wizard',
            show: true,
            disabled: true,
            icon: 'engines',
        }, {
            id: 'auto_update',
            show: true,
            disabled: true,
            icon: 'load',
        }]
    },
];
