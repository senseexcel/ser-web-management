export interface IMenuItem {
    disabled: boolean;
    icon?: string;
    name: string;
    route?: string;
    uri?: string;
    children?: IMenuItem[];
    show: boolean;
}
