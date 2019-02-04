import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'smc-ui--button',
    templateUrl: 'button.component.html'
})

export class SmcUiButtonComponent implements OnInit {

    @Input()
    public disabled: boolean;

    @Input()
    public label: string;

    constructor() { }

    ngOnInit() { }
}
