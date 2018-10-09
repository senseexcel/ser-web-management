import { Component, OnInit, ViewContainerRef, ViewChild, TemplateRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DropDownOverlay } from '../model/drop-down-overlay';
import { DropDownService } from '../services/drop-down.service';

@Component({
    selector: 'app-drop-down',
    styleUrls: ['drop-down.component.scss'],
    templateUrl: 'drop-down.component.html'
})

export class DropDownComponent implements OnInit {

    /**
     * class which will passed as panelClass for overlay component
     *
     * @type {string}
     * @memberof DropDownComponent
     */
    @Input()
    public hostClass: string;

    /**
     * template which holds drop down content
     *
     * @type {TemplateRef<any>}
     * @memberof SelectPopoverComponent
     */
    @ViewChild('contentWrapper')
    public template: TemplateRef<any>;

    /**
     * drop down service to create drop down element
     *
     * @private
     * @type {DropDownService}
     * @memberof DropDownComponent
     */
    private dropDownService: DropDownService;

    /**
     * drop down overlay
     *
     * @private
     * @type {DropDownOverlay}
     * @memberof DropDownComponent
     */
    private dropDownOverlay: DropDownOverlay;

    /**
     *
     *
     * @private
     * @type {ViewContainerRef}
     * @memberof SelectPopoverComponent
     */
    private viewContainerRef: ViewContainerRef;

    /**
     *Creates an instance of DropDownComponent.
     * @param {DropDownService} dropDownService
     * @param {ViewContainerRef} viewContainer
     * @memberof DropDownComponent
     */
    constructor(
        dropDownService: DropDownService,
        viewContainer: ViewContainerRef
    ) {
        this.dropDownService = dropDownService;
        this.viewContainerRef = viewContainer;
    }

    /**
     * initialize component
     *
     * @memberof DropDownComponent
     */
    ngOnInit() {
        this.dropDownOverlay = this.dropDownService.create(this.template, this.viewContainerRef, { panelClass: this.hostClass });

        /** register click event on document and skip if overlay is not visible */
        fromEvent(document, 'click')
            .pipe(filter(_ => this.dropDownOverlay.isVisible))
            .subscribe(() => {
                this.dropDownOverlay.close();
            });
    }

    /**
     * handle toggle for drop down menu
     *
     * @memberof DropDownComponent
     */
    public toggleDropDown(event) {
        event.stopPropagation();
        if (!this.dropDownOverlay.isVisible) {
            this.dropDownOverlay.show();
            return;
        }
        this.dropDownOverlay.close();
    }
}
