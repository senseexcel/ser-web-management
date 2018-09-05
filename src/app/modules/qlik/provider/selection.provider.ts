import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ISerApp } from '@ser-app/api';

@Injectable()
export class SelectionProvider {

    private selectionModel: SelectionModel<ISerApp>;

    constructor() {
        this.selectionModel = new SelectionModel<ISerApp>();
    }

    public addSelection(selection: ISerApp) {
        if ( ! this.selectionModel.isSelected(selection) ) {
            this.selectionModel.select(selection);
        }
    }

    public removeSelection(selection: ISerApp) {

        if ( this.selectionModel.isSelected(selection) ) {
            this.selectionModel.deselect(selection);
        }
    }

    public getSelection(): ISerApp[] {
        return this.selectionModel.selected;
    }

    public isSelected(qapp: ISerApp): boolean {
        return this.selectionModel.isSelected(qapp);
    }

    public hasSelection(): boolean {
        return ! this.selectionModel.isEmpty();
    }
}
