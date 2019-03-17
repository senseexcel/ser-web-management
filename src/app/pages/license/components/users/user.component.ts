import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepickerInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Moment } from 'moment';
import { Subject, of } from 'rxjs';
import { MOMENT_DATE_FORMAT } from '../../api/ser-date-formats';
import { LicenseSource } from '../../model/license-source';
import { takeUntil } from 'rxjs/operators';
import { IUserLicense, IUser } from '@smc/modules/license/api';
import { toManyUsersAtSameDateError } from '@smc/modules/license/validators/validation.tokens';

interface ITableUser {
    edit: boolean;
    isNew: boolean;
    user: IUser;
}

@Component({
    selector: 'smc-license-user',
    styleUrls: ['user.component.scss'],
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnDestroy, OnInit {

    public currentEditUser: ITableUser;
    public ready = false;
    public mode = 'list';
    public selection: SelectionModel<ITableUser>;
    public tableHeaderFields = ['id', 'from', 'to'];
    public users: ITableUser[];
    public userSuggestions: any[];
    public licensedUserInfo: any;
    public licenseExists: boolean;

    private isDestroyed$: Subject<boolean>;
    private suggest$: Subject<any>;

    @Input()
    private licenseSource: LicenseSource;

    constructor(
    ) {
        this.isDestroyed$ = new Subject();
        this.selection = new SelectionModel(false);
        this.suggest$ = new Subject();

        this.licensedUserInfo = { total: 0, showing: 0 };
        this.userSuggestions = [];
    }

    /**
     * component get destroyed
     *
     * @memberof UserComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);

        /** null variables to ensure it is not set anymore */
        this.selection = null;
        this.suggest$ = null;
        this.isDestroyed$ = null;
        this.users = null;
        this.userSuggestions = null;
    }

    ngOnInit() {
        this.licenseSource.changed$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((license: IUserLicense) => {

                this.licensedUserInfo.total = license.users.length;
                this.licensedUserInfo.showing = license.users.length;

                this.users = license.users.map((user: IUser): ITableUser => {
                    return {
                        edit: false,
                        isNew: false,
                        user
                    };
                });
            });
    }

    /**
     * add new user
     *
     * @memberof UserComponent
     */
    public addUser() {

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        const newUser = {
            edit: true,
            isNew: true,
            user: {
                id: '',
                from: null,
                to: null,
                isActive: false
            }
        };

        this.currentEditUser = newUser;
        this.users = [...this.users, this.currentEditUser];
        this.mode = 'edit';
    }

    /**
     * delete user from table
     *
     * @memberof UserComponent
     */
    public deleteUser() {

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        /** the chosen one to delete */
        const theCosenOne = this.selection.selected[0].user;
        this.selection.clear();
    }

    /**
     * on click select row
     *
     * @param {ITableUser} user
     * @memberof UserComponent
     */
    public selectUser(user: ITableUser) {
        this.selection.select(user);
    }

    /**
     * on double click enable edit
     *
     * @param {ITableUser} user
     * @memberof UserComponent
     */
    public editUser(user: ITableUser) {

        this.mode = 'edit';

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        this.currentEditUser = user;
        this.currentEditUser.edit = true;
    }

    /**
     * ends user edit mode
     *
     * @memberof UserComponent
     */
    public finishEditUser() {
        const tableUser: ITableUser = this.currentEditUser;
        tableUser.edit = false;

        this.mode = 'view';

        if (tableUser.user.id.replace(/(^\s*|\s*$)/g, '') === '') {
            // remove last user from table
            this.users = this.users.slice(0, -1);
            return;
        }

        if (tableUser.isNew) {
            // we need to add user to model
            tableUser.isNew = false;
        } else {
            // add a new user to license
        }

        this.currentEditUser = null;
    }

    /**
     * date changed
     *
     * @param {MatDatepickerInputEvent<Moment>} event
     * @memberof UserComponent
     */
    public onDateChange(event: MatDatepickerInputEvent<Moment>, key: string) {
        this.currentEditUser.user[key] = event.value.format(MOMENT_DATE_FORMAT);
    }

    /**
     * user input changed
     *
     * @param {*} event
     * @memberof UserComponent
     */
    public onUserInputChange(value: string) {
        const insertVal = value.replace(/(^\s*|\s*$)/, '');
        this.currentEditUser.user.id = insertVal;
        this.suggest$.next(insertVal);
    }

    /**
     * if user is selected set to user model
     *
     * @param {MatAutocompleteSelectedEvent} selected
     * @memberof UserComponent
     */
    public onUserSelected(selected: MatAutocompleteSelectedEvent) {
        this.currentEditUser.user.id = selected.option.value;
    }
}
