import { NgModule } from '@angular/core';

import { ListHeaderComponent } from './components/list-header.component';
import { ListHeaderService } from './services/list-header.service';
import { CommonModule } from '@angular/common';

/**
 * @todo create complete list module
 */
@NgModule({
    imports: [CommonModule],
    exports: [ListHeaderComponent],
    declarations: [ListHeaderComponent],
    providers: [ListHeaderService],
})
export class ListHeaderModule {}
