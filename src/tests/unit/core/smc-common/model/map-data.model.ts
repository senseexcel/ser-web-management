import { BookModel } from './book.model';
import { mapDataTo, Validate, Validators } from '@smc/modules/smc-common/utils';

export class MapDataToUser {

    private userBooks: BookModel[];

    @Validate([Validators.isArray])
    @mapDataTo(BookModel)
    public set books(books: BookModel[]) {
        this.userBooks = books;
    }

    public get books(): BookModel[] {
        return this.userBooks;
    }
}
