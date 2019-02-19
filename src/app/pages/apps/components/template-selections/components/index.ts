import { TemplateSelectionsNameComponent } from './name-selection/name-selection.component';
import { TemplateSelectionComponent } from './selection.component';
import { TemplateSelectionValueComponent } from './value-selection/value-selection.component';
import { TemplateSelectionValueListViewComponent } from './value-selection/value-list-view.component';
import { TemplateSelectionsCreateComponent } from './create/create.component';

export const COMPONENTS = [
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent,
    TemplateSelectionsNameComponent,
    TemplateSelectionValueComponent,
    TemplateSelectionValueListViewComponent,
];

export const EXPORT_COMPONENTS = [
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent
];

export const ENTRY_COMPONENTS = [
    TemplateSelectionValueListViewComponent
];
