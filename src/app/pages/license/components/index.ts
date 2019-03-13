import { OverviewComponent } from './overview/overview.component';
import { ErrorComponent } from './error/error.component';
import { InfoComponent } from './info/info.component';
import { InsertOverlayComponent } from './insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from './insert-overlay/insert-overlay-footer.component';
import { UserComponent } from './users/user.component';

export * from './overview/overview.component';
export * from './error/error.component';
export * from './info/info.component';
export * from './insert-overlay/insert-overlay.component';
export * from './insert-overlay/insert-overlay-footer.component';
export * from './users/user.component';

export * from './license.page';

export const components = [
    OverviewComponent,
    ErrorComponent,
    InfoComponent,
    InsertOverlayComponent,
    InsertOverlayFooterComponent,
    UserComponent
];
