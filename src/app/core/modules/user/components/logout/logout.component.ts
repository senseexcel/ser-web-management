import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../services/user-api.service';

@Component({
    selector: 'app-user-logout',
    templateUrl: 'logout.component.html'
})

export class LogoutComponent implements OnInit {

    constructor(
        private userService: UserApiService
    ) {
    }

    ngOnInit() {
        this.userService.logout();
    }
}
