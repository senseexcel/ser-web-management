import { OverviewComponent } from './overview/overview.component';
import { InfoComponent } from './info/info.component';
import { InsertOverlayComponent } from './insert-overlay/insert-overlay.component';
import { InsertOverlayFooterComponent } from './insert-overlay/insert-overlay-footer.component';
import { UserComponent } from './users/user.component';
import { LicensePageComponent } from './license.page';
import { LicenseErrorPageComponent } from './license-error.page';

export * from './overview/overview.component';
export * from './insert-overlay/insert-overlay.component';
export * from './insert-overlay/insert-overlay-footer.component';
export * from './users/user.component';
export * from './license.page';
export * from './license-error.page';

export const components = [
    OverviewComponent,
    InfoComponent,
    InsertOverlayComponent,
    InsertOverlayFooterComponent,
    UserComponent,
    LicenseErrorPageComponent,
    LicensePageComponent,
];

export const entry_components = [
    InsertOverlayComponent,
    InsertOverlayFooterComponent,
    LicenseErrorPageComponent,
    LicensePageComponent,
];
