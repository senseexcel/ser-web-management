import { Component, OnInit, AfterContentInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'smc-page',
    templateUrl: 'page.component.html',
    styleUrls: ['./page.component.scss']
})
export class SmcPageComponent implements AfterContentInit {

    @ViewChild('sectionLeft')
    private sectionLeft: ElementRef;

    @ViewChild('sectionRight')
    private sectionRight: ElementRef;

    @ViewChild('sectionHeader')
    private sectionHeader: ElementRef;

    @Input('disablePadding')
    public disablePadding = false;

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
