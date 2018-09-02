import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { IQlikApp } from '@qlik/api/app.interface';

@Injectable()
export class SelectionProvider {

    private selectionModel: SelectionModel<IQlikApp>;

    constructor() {
        this.selectionModel = new SelectionModel<IQlikApp>();
     }

    public addSelection(selection: IQlikApp) {
        if ( ! this.selectionModel.isSelected(selection) ) {
            this.selectionModel.select(selection);
        }
    }

    public removeSelection(selection: IQlikApp) {

        if ( this.selectionModel.isSelected(selection) ) {
            this.selectionModel.deselect(selection);
        }
    }

    public getSelection(): IQlikApp[] {
        return this.selectionModel.selected;
    }

    public isSelected(qapp: IQlikApp): boolean {
        return this.selectionModel.isSelected(qapp);
    }

    public hasSelection(): boolean {
        return this.selectionModel.isEmpty();
    }
}
