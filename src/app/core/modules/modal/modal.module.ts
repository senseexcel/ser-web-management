import { NgModule } from '@angular/core';
import { ModalComponent } from './components/modal.component';
import { ModalService } from './services/modal.service';

@NgModule({
    imports: [],
    entryComponents: [ModalComponent],
    exports: [],
    declarations: [ModalComponent],
    providers: [ModalService],
})
export class ModalModule { }
