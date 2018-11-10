import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { License } from '../../services';
import { LicenseModel } from '../../model/license.model';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-license-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.scss']
})

export class EditorComponent implements OnInit {

    public content: string;
    public input: FormControl;
    public isReady = false;

    private license: License;
    private formBuilder: FormBuilder;

    constructor(
        license: License,
        formBuilder: FormBuilder
    ) {
        this.formBuilder = formBuilder;
        this.license = license;
    }

    ngOnInit() {
        this.license.license$.subscribe((license: LicenseModel) => {
            this.createTextArea(license.raw);
            this.isReady = true;
        });
    }

    private createTextArea(license: string) {
        this.input = this.formBuilder.control(license);
    }
}
