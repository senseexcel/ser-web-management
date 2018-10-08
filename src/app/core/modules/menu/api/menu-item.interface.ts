export interface IMenuItem {
    disabled: boolean;
    group: string;
    icon: string;
    name: string;
    route: string;
}

export interface IMenuGroup {
    name: string;
    items: IMenuItem[];
}
