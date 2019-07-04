import { Component, EventEmitter, Output } from '@angular/core';
import { SelectionModel } from '@smc/modules/ser';

@Component({
    selector: 'smc-template-selections--create',
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.scss']
})

export class TemplateSelectionsCreateComponent {

    @Output()
    created: EventEmitter<SelectionModel>;

    constructor() {
        this.created = new EventEmitter();
    }

    public create() {
        this.created.emit(new SelectionModel());
    }
}
