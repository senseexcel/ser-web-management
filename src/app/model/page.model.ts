import { IAppPage } from '@api/app-page.interface';
import { IModel, IDataNode } from '@smc/modules/smc-common';

export class PageModel implements IAppPage, IModel<IAppPage> {

    private pageId: string;
    private pageShow: boolean;
    private pageTitle: string;
    private pageIcon: string;
    private pageVisible: boolean;
    private pageDisabled: boolean;
    private pageRoute: string;

    public set title(title: string) {
        this.pageTitle = title;
    }

    public set icon(icon: string) {
        this.pageIcon = icon;
    }

    public set visible(visible: boolean) {
        this.pageVisible = visible;
    }

    public set disabled(disabled: boolean) {
        this.pageDisabled = disabled;
    }

    public set route(route: string) {
        this.pageRoute = route;
    }

    public get title(): string {
        return this.pageTitle;
    }

    public get icon(): string {
        return this.pageIcon;
    }

    public get visible(): boolean {
        return this.pageVisible;
    }

    public get disabled(): boolean {
        return this.pageDisabled;
    }

    public get route(): string {
        return this.pageRoute;
    }

    public set id(id: string) {
        this.pageId = id;
    }

    public get id() {
        return this.pageId;
    }

    public set show(show: boolean) {
        this.pageShow = show;
    }

    public get show(): boolean {
        return this.pageShow;
    }

    public get raw(): IAppPage {
        return {
            disabled: this.pageDisabled,
            icon: this.pageIcon,
            id: this.pageId,
            route: this.pageRoute,
            show: this.pageShow,
        };
    }
}
