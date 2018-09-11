import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-edit-controls',
    templateUrl: 'controls.component.html',
    styleUrls: ['controls.component.scss']
})

export class FormControlsComponent {

    constructor() { }

    @Output()
    public apply: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public cancel: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public preview: EventEmitter<boolean> = new EventEmitter();

    public onApply() {
        this.apply.emit(true);
    }

    public onCancel() {
        this.cancel.emit(true);
    }

    public onPreview() {
        this.preview.emit(true);
    }
}
