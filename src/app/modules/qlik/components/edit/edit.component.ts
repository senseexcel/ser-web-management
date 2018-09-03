import { Component, OnInit, HostBinding } from '@angular/core';
import { ISERApp } from '@qlik/api/ser.response.interface';
import { SerAppProvider, SerConfigProvider, SelectionProvider } from '@qlik/provider';
import { ConnectionComponent, GeneralComponent, TemplateComponent} from './form';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [ SerConfigProvider ],
})
export class AppEditComponent implements OnInit {

    public apps: ISERApp[];

    public currentForm: string;

    public properties: any;

    public selectedProperty: any;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private selectionProvider: SelectionProvider;

    private serAppProvider: SerAppProvider;

    private serConfigProvider: SerConfigProvider;

    constructor(
        selectionProvider: SelectionProvider,
        serAppProvider: SerAppProvider,
        serConfigProvider: SerConfigProvider
    ) {
        this.selectionProvider = selectionProvider;
        this.serAppProvider    = serAppProvider;
        this.serConfigProvider = serConfigProvider;
    }

    ngOnInit() {

        this.properties = [
            { label: 'Connection'  , component: ConnectionComponent },
            { label: 'Distribution', component: ConnectionComponent },
            { label: 'General'     , component: GeneralComponent },
            { label: 'Template'    , component: TemplateComponent },
        ];

        this.currentForm = 'distribution';
        this.apps = this.selectionProvider.getSelection();

        console.log ( this.selectionProvider.hasSelection() );
        if ( this.selectionProvider.hasSelection() ) {

            this.serConfigProvider.loadConfiguration(
                this.serAppProvider.getSerData(this.apps[0].script));

            console.log ( this.serConfigProvider.getConfiguration() );
        }
    }

    public showForm(property) {
        this.selectedProperty = property;
    }
}
