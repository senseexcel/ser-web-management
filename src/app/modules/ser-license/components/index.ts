import { EditorComponent } from './editor/editor.component';
import { ErrorComponent } from './error/error.component';
import { InfoComponent } from './info/info.component';
import { UserComponent } from './users/user.component';

export * from './editor/editor.component';
export * from './error/error.component';
export * from './info/info.component';
export * from './users/user.component';

export const components = [
    EditorComponent,
    ErrorComponent,
    InfoComponent,
    UserComponent
];
