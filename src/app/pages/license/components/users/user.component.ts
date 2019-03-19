import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepickerInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Moment } from 'moment';
import { Subject, of } from 'rxjs';
import { LicenseSource } from '../../model/license-source';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import { IUserLicense, IUser, ILicense, LicenseType } from '@smc/modules/license/api';
import moment = require('moment');
import { UserRepository } from '../../services';

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

    private license: IUserLicense;

    constructor(
        private userRepository: UserRepository
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

        this.licenseSource.changed$.subscribe((license: ILicense) => {
            this.license = this.licenseSource.license as IUserLicense;

            if (license.licenseType !== LicenseType.NAMED) {
                return;
            }

            const licenseUsers = this.license.users;
            this.licensedUserInfo.total   = licenseUsers.length;
            this.licensedUserInfo.showing = licenseUsers.length;
            this.users = licenseUsers.map((user: IUser): ITableUser => {
                return {
                    edit: false,
                    isNew: false,
                    user
                };
            });
        });

        this.suggest$.pipe(
            debounceTime(300),
            switchMap((val) => val.length < 3 ? of([]) : this.userRepository.fetchQrsUsers(val)),
            takeUntil(this.isDestroyed$)
        ).subscribe((result) => {
            this.userSuggestions = result;
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
                from: moment(null),
                to: moment(null),
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
        this.license.removeUser(theCosenOne);
        this.users.splice(this.users.indexOf(this.selection.selected[0]), 1);
        this.users = [...this.users];

        this.licensedUserInfo.total   = this.users.length;
        this.licensedUserInfo.showing = this.users.length;
        this.selection.clear();

        this.licenseSource.revalidateSource();
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
            this.license.addUser(this.currentEditUser.user);
            tableUser.isNew = false;
        }

        this.licenseSource.revalidateSource();
        this.currentEditUser = null;
    }

    /**
     * date changed
     *
     * @param {MatDatepickerInputEvent<Moment>} event
     * @memberof UserComponent
     */
    public onDateChange(event: MatDatepickerInputEvent<Moment>, key: string) {
        this.currentEditUser.user[key] = event.value;
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
