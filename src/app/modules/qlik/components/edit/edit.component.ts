import { Component, OnInit, HostBinding } from '@angular/core';
import { SelectionProvider } from '@qlik/provider/selection.provider';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
})
export class AppEditComponent implements OnInit {

    @HostBinding('class.flex-container')
    private hostClass = true;

    private selectionProvider: SelectionProvider;

    private form: FormGroup;

    private formBuilder: FormBuilder;

    private route: ActivatedRoute;

    private router: Router;

    constructor(
        route: ActivatedRoute,
        router: Router,
        formBuilder: FormBuilder,
        selectionProvider: SelectionProvider,
    ) {
        this.formBuilder = formBuilder;
        this.selectionProvider = selectionProvider;
        this.route = route;
        this.router = router;
    }

    ngOnInit() {
    }

    public navigateBack() {

        this.router.navigate(
            this.route.parent.snapshot.pathFromRoot.slice(-1));
    }
}
