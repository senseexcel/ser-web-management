import { Component, Input, Output, EventEmitter } from '@angular/core';

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

    @Output()
    public doClick: EventEmitter<void>;

    constructor(
    ) {
        this.close = new EventEmitter();
        this.doClick = new EventEmitter();
    }

    public handleEvent($event) {
        if (!this.disabled) {
            this.doClick.emit($event);
        }
    }

    public triggerClose($event: MouseEvent) {
        if (!this.disabled) {
            $event.stopPropagation();
            $event.preventDefault();
            this.close.emit();
        }
    }
}
