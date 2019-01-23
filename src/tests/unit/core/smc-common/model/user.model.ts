import { Validate, Validators } from '@smc/modules/smc-common/utils/validate-property.decorator';
import { BookModel } from './book.model';
import { IDataNode } from '@smc/modules/smc-common';
import { importData } from '@smc/modules/smc-common/utils/import-data.decorator';

export class UserModel {

    private userName: string;

    private userLastName: string;

    private userBook: BookModel;

    private userAge: number;

    public constructor() {
        this.userBook = new BookModel();
    }

    @Validate<string>([
        Validators.Required
    ])
    public set name(name: string) {
        this.userName = name;
    }

    @Validate<string>([
        Validators.Required,
        Validators.isString
    ])
    public set lastName(lastName: string) {
        this.userLastName = lastName;
    }

    public get name(): string {
        return this.userName;
    }

    public get lastName(): string {
        return this.userLastName;
    }

    @Validate<number>([
        Validators.Required,
        Validators.isNumber
    ])
    public set age(age: number) {
        this.userAge = age;
    }

    public get age(): number {
        return this.userAge;
    }

    public set book(book: BookModel) {
        this.userBook.raw = book;
    }

    public get book(): BookModel {
        return this.userBook;
    }

    @importData
    public set raw(data: IDataNode) {
    }
}
