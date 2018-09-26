import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-task-new',
    templateUrl: 'new.component.html'
})

export class NewComponent implements OnInit {
    name = new FormControl('');
    constructor() { }

    ngOnInit() { }
    onApply() {
        console.log(this.name.value)
    }
}
