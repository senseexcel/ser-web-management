import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ISERApp } from '@qlik/api/ser.response.interface';

@Injectable()
export class SelectionProvider {

    private selectionModel: SelectionModel<ISERApp>;

    constructor() {
        this.selectionModel = new SelectionModel<ISERApp>();
     }

    public addSelection(selection: ISERApp) {
        if ( ! this.selectionModel.isSelected(selection) ) {
            this.selectionModel.select(selection);
        }
    }

    public removeSelection(selection: ISERApp) {

        if ( this.selectionModel.isSelected(selection) ) {
            this.selectionModel.deselect(selection);
        }
    }

    public getSelection(): ISERApp[] {
        return this.selectionModel.selected;
    }

    public isSelected(qapp: ISERApp): boolean {
        return this.selectionModel.isSelected(qapp);
    }

    public hasSelection(): boolean {
        return ! this.selectionModel.isEmpty();
    }
}
