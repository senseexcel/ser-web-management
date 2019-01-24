import { UserModel } from '../model/user.model';
import { BookModel } from '../model/book.model';

describe('SMC: Modules', () => {
    describe('SMC-Common', () => {

        describe('Decorators', () => {

            describe('LoadData Decorator', () => {
                it('should load data into bookmodel', () => {
                    const modelData = {
                        title: 'Robinson Cruso'
                    };

                    const bookModel = new BookModel();
                    bookModel.raw = modelData;

                    expect(bookModel.raw).toBe(modelData);
                    expect(bookModel.title).toBe('Robinson Cruso');
                });

                it('should load bookdata to user, and import it to book', () => {
                    const userModel = new UserModel();
                    userModel.raw = {
                        book: {
                            title: 'Alfons Zitterbacke'
                        }
                    };

                    expect(userModel.book.title).toBe('Alfons Zitterbacke');
                });
            });

            describe('Combined: LoadData/Validate', () => {

                it('should load user data with book into models', () => {
                    const userModel = new UserModel();
                    userModel.raw = {
                        name: 'Ralf',
                        lastName: 'Hannuschka',
                        age: 40,
                        book: {
                            title: 'Alfons Zitterbacke'
                        }
                    };

                    expect(userModel.book.title).toBe('Alfons Zitterbacke');
                    expect(userModel.name).toBe('Ralf');
                    expect(userModel.lastName).toBe('Hannuschka');
                    expect(userModel.age).toBe(40);
                });
            });
        });
    });
});
