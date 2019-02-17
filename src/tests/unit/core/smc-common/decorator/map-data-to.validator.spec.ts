import { MapDataToUser } from '../model/map-data.model';
import { BookModel } from '../model/book.model';

describe('SMC: Modules', () => {

    describe('SMC-Common', () => {

        describe('Decorators', () => {

            describe('mapData Decorator', () => {

                const userModel: MapDataToUser = new MapDataToUser();

                it('should map data into book model', () => {
                    const bookData: any[] = [{
                        title: 'Robinson Cruso'
                    }, {
                        title: 'Alfons Zitterback'
                    }];
                    // import books to user
                    userModel.books = bookData;
                    expect(userModel.books[0] instanceof BookModel).toBeTruthy();
                });

                it('should have 2 books', () => {
                    expect(userModel.books[0] instanceof BookModel).toBeTruthy();
                    expect(userModel.books[1] instanceof BookModel).toBeTruthy();
                    expect(userModel.books.length).toBe(2);
                });

                it('should set have book with title: Robinson Cruso', () => {
                    expect(userModel.books[0].title).toBe('Robinson Cruso');
                });
            });
        });
    });
});
