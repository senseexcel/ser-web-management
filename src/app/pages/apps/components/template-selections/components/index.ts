import { TemplateSelectionNameComponent } from './name-selection/name-selection.component';
import { TemplateSelectionComponent } from './selection.component';
import { TemplateSelectionValueComponent } from './value-selection/value-selection.component';
import { TemplateSelectionValueListViewComponent } from './value-selection/value-list-view.component';
import { TemplateSelectionsCreateComponent } from './create/create.component';
import { TemplateSelectionNameViewComponent } from './name-selection/name-selection-item.component';

export const COMPONENTS = [
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent,
    TemplateSelectionNameComponent,
    TemplateSelectionNameViewComponent,
    TemplateSelectionValueComponent,
    TemplateSelectionValueListViewComponent,
];

export const EXPORT_COMPONENTS = [
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent
];

export const ENTRY_COMPONENTS = [
    TemplateSelectionNameViewComponent,
    TemplateSelectionValueListViewComponent,
];
