import { Component, OnInit, AfterContentInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'smc-ui--page',
    templateUrl: 'page.component.html',
    styleUrls: ['./page.component.scss']
})
export class SmcPageComponent implements AfterContentInit {

    @ViewChild('sectionLeft', { static: true })
    private sectionLeft: ElementRef;

    @ViewChild('sectionRight', { static: true })
    private sectionRight: ElementRef;

    @ViewChild('sectionHeader', { static: true })
    private sectionHeader: ElementRef;

    @Input()
    public disablePadding = false;

    @Input()
    public loading = false;

    public hide = {
        sectionLeft: false,
        sectionRight: false,
        sectionHeader: false
    };

    ngAfterContentInit() {
        const leftEl: HTMLElement = this.sectionLeft.nativeElement;
        this.hide.sectionLeft = leftEl.children.length === 0;

        const rightEl: HTMLElement = this.sectionRight.nativeElement;
        this.hide.sectionRight = rightEl.children.length === 0;

        const headerEl: HTMLElement = this.sectionHeader.nativeElement;
        this.hide.sectionHeader = headerEl.children.length === 0;
    }
}
