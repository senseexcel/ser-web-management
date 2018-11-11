import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-license-error',
    styleUrls: ['error.component.scss'],
    templateUrl: 'error.component.html'
})

export class ErrorComponent {

    @Input()
    public errors: string[];
}
