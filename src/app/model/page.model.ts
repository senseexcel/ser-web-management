import { InjectionToken } from '@angular/core';

const PageData = [
    {
        name: 'manage content',
        children: [{
            name: 'Reporting Apps',
            show: true,
            description: 'Overview of all your available apps to edit delete, publish or duplicate apps. \
            Adjustment of apps to be reused, modified and shared with others.',
            disabled: false,
            icon: 'apps',
            route: 'apps'
        },
        {
            name: 'Reporting Tasks',
            show: true,
            description: 'Manage the status of your tasks. Edit, Reload, Synchronize and Create new tasks and \
            modify the properties of reporting tasks. Reporting Tasks are used to reload the data in an app or \
            to import users from a user directory.',
            disabled: false,
            icon: 'tasks',
            route: 'tasks'
        },
        {
            name: 'Content Manager',
            show: true,
            description: 'Content Manager',
            disabled: false,
            icon: 'folder',
            route: 'content-manager'
        }]
    },
    {
        name: 'manage resources',
        children: [{
            name: 'License Management',
            show: true,
            description: 'The License Enable File (LEF) defines the terms and usage of your license. \
            Access types can be allocated to users. On the Licence usage summary page, you can see the distribution of all access types',
            disabled: false,
            icon: 'license',
            route: 'license'

        }]
    },
    {
        name: 'Governance',
        children: [{
            name: 'Monitoring Report Apps',
            show: true,
            description: 'Monitoring Report Apps',
            disabled: true,
            icon: 'streams'
        }]
    },
    {
        name: 'configure system',
        children: [{
            name: 'Installation Wizzard',
            show: true,
            description: 'Install Wizzard helps to install an app.',
            disabled: true,
            icon: 'engines'
        }, {
            name: 'Auto Update',
            show: true,
            description: 'Auto Update',
            disabled: true,
            icon: 'load'
        }]
    }
];

export const PAGE_SETTINGS = new InjectionToken('Pages', {
    factory: () => PageData
});
