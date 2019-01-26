import { BookModel } from './book.model';
import { IDataNode, IModel } from '@smc/modules/smc-common';
import { Validate, Validators } from '@smc/modules/smc-common/utils/model/validate-property.decorator';
import { importData } from '@smc/modules/smc-common/utils/model/import-data.decorator';

export class UserModel implements IModel {

    private userName: string;

    private userLastName: string;

    private userBook: BookModel;

    private userAge: number;

    public isValid: boolean;

    public constructor() {
        this.userBook = new BookModel();
        this.isValid = false;
    }

    @Validate<string>([
        Validators.Required,
        Validators.isString,
        Validators.NotEmpty,
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

    public set book(book: IDataNode) {
        this.userBook.raw = book;
    }

    public get book(): IDataNode {
        return this.userBook;
    }

    @importData
    public set raw(data: IDataNode) {
    }

    public onModelValidationChange(isValid: boolean) {
        this.isValid = isValid;
    }
}
