export interface IMenuItem {
    disabled: boolean;
    icon?: string;
    name: string;
    route?: string;
    children?: IMenuItem[];
    show: boolean;
}
