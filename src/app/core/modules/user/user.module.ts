import { NgModule } from '@angular/core';
import { LogoutComponent } from './components/logout/logout.component';
import { UserApiService } from './services/user-api.service';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    imports: [UserRoutingModule],
    exports: [],
    declarations: [LogoutComponent],
    providers: [UserApiService],
})
export class UserModule { }
