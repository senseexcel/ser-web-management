import { Component, OnInit } from '@angular/core';
import { SelectionProvider } from '@qlik/provider/selection.provider';

@Component({
    selector: 'app-qlik',
    templateUrl: 'qlik.component.html',
    providers: [ SelectionProvider ]
})

export class QlikAppComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
