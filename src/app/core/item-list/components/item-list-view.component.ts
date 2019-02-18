
// tslint:disable-next-line:max-line-length
import { Component, ApplicationRef, Injector, ComponentFactoryResolver, ViewChild, ElementRef, Input, AfterViewInit, Inject, Optional } from '@angular/core';
import { ButtonListComponent } from './view/button-view.component';
import { ITEM_LIST_CONTROLLER, ITEM_LIST_DATA, ITEM_LIST_VIEW } from '../provider/tokens';
import { ComponentPortal, DomPortalHost, PortalInjector } from '@angular/cdk/portal';
import { ItemList } from '../api/item-list.interface';

@Component({
    selector: 'smc-item-list--view',
    template: '<div #portalHost></div>'
})
export class ItemListViewComponent implements AfterViewInit {

    @Input()
    public items: ItemList.Item[] = [];

    @ViewChild('portalHost')
    private listViewPortal: ElementRef;

    constructor(
        @Inject(ITEM_LIST_VIEW) @Optional() private view,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) {
        if (!this.view) {
            this.view = ButtonListComponent;
        }
    }

    ngAfterViewInit() {
        window.setTimeout(() => this.createListViewPortal(), 0);
    }

    public doRemove() {
    }

    /**
     *
     *
     * @private
     * @memberof ItemListComponent
     */
    private createListViewPortal() {

        const tokens = new WeakMap();
        tokens.set(ITEM_LIST_DATA, this.items);
        tokens.set(ITEM_LIST_CONTROLLER, {
            remove: this.doRemove
        });

        const injector = new PortalInjector(this.injector, tokens);
        const portalHost = new DomPortalHost(
            this.listViewPortal.nativeElement,
            this.componentFactoryResolver,
            this.appRef,
            injector
        );

        const portal = new ComponentPortal(this.view);
        portalHost.attach(portal);
    }
}
