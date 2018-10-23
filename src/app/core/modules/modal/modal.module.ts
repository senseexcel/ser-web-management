import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalComponent } from './components/modal.component';
import { ModalService } from './services/modal.service';
import { OverlayDialogComponent } from './components/dialog/dialog.component';
import { OverlayMessageComponent } from './components/message/message.component';
import { DialogFooterComponent } from './components/dialog/dialog-footer.component';
import { MessageFooterComponent } from './components/message/message-footer.component';

@NgModule({
    imports: [CommonModule],
    entryComponents: [
        DialogFooterComponent,
        MessageFooterComponent,
        ModalComponent,
        OverlayDialogComponent,
        OverlayMessageComponent
    ],
    exports: [],
    declarations: [
        DialogFooterComponent,
        MessageFooterComponent,
        ModalComponent,
        OverlayDialogComponent,
        OverlayMessageComponent
    ],
    providers: [ModalService],
})
export class ModalModule { }
