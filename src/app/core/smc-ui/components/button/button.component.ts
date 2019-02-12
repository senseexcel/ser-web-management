import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'smc-ui--button',
    templateUrl: 'button.component.html',
    styleUrls: ['./button.component.scss']
})

export class SmcUiButtonComponent {

    @Input()
    public disabled: boolean;

    @Input()
    public label: string;

    @Input()
    public closeAble: boolean;

    @Output()
    public close: EventEmitter<void>;

    constructor() {
        this.close = new EventEmitter();
    }

    public triggerClose($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();
        this.close.emit();
    }
}
