import { TemplateSelectionNameComponent } from './name-selection/name-selection.component';
import { TemplateSelectionComponent } from './selection.component';
import { TemplateSelectionValueComponent } from './value-selection/value-selection.component';
import { TemplateSelectionsCreateComponent } from './create/create.component';
import { TemplateSelectionBookmarkComponent } from './bookmark-selection/bookmark-selection.component';
import { SingleItemComponent } from './list-views/single-item.component';
import { ScrollableListComponent } from './list-views/scrollable-list.component';
import { TemplateSelectionFieldComponent } from './field-selection/field-selection.component';

export const COMPONENTS = [
    TemplateSelectionBookmarkComponent,
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent,
    TemplateSelectionFieldComponent,
    TemplateSelectionNameComponent,
    TemplateSelectionValueComponent,
    SingleItemComponent,
    ScrollableListComponent,
];

export const EXPORT_COMPONENTS = [
    TemplateSelectionComponent,
    TemplateSelectionsCreateComponent
];

export const ENTRY_COMPONENTS = [
    SingleItemComponent,
    ScrollableListComponent,
];
