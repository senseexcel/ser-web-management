export interface IMenuItem {
    label: string;
    disabled: boolean;
    icon?: string;
    route?: string;
    uri?: string;
    children?: IMenuItem[];
    show: boolean;
}
