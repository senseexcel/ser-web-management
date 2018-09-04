import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-qapp-form-controls',
    templateUrl: 'controls.component.html'
})

export class FormControlsComponent {

    constructor() { }

    @Output()
    public apply: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public cancel: EventEmitter<boolean> = new EventEmitter();

    public onApply() {
        this.apply.emit(true);
    }

    public onCancel() {
        this.cancel.emit(true);
    }
}
