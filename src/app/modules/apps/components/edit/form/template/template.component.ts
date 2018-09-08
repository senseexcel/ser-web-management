import { Component, OnInit, Input } from '@angular/core';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';

@Component({
    selector: 'app-edit-form-template',
    templateUrl: 'template.component.html'
})

export class TemplateComponent implements OnInit {

    @Input()
    public app: ISerApp;

    constructor() { }

    ngOnInit() { }
}
