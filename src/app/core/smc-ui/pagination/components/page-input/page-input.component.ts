import { Component, OnInit, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { PaginationService } from '../../providers/pagination.service';

@Component({
    selector: 'smc-pagination--page-input',
    templateUrl: 'page-input.component.html'
})

export class PageInputComponent implements OnInit {

    @Input()
    public maxPages: number;

    private pageInput: FormControl;

    private paginationService: PaginationService;

    constructor(
        paginationService: PaginationService
    ) {
        this.pageInput = new FormControl(null);
        this.paginationService = paginationService;
    }

    ngOnInit() {
        this.pageInput.setValidators(this.validateMaxInputSize.bind(this));
    }

    public onKeyUp(event: KeyboardEvent) {

        if (event.which !== 13 || this.pageInput.hasError('invalidPageSize')) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        this.paginationService.showPage(
            parseInt(this.pageInput.value, 10));

        this.pageInput.reset();
    }

    private validateMaxInputSize(control: FormControl): ValidationErrors {
        return {
            invalidPageSize: !(control.value <= this.maxPages)
        };
    }
}
