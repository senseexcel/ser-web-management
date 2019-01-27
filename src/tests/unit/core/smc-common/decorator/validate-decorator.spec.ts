import { UserModel } from '../model/user.model';

describe('SMC: Modules', () => {

    describe('SMC-Common', () => {

        describe('Decorators', () => {

            describe('Validator Decorator', () => {

                /**
                 *  user validation
                 */
                it('should validate username', () => {
                    const user = new UserModel();
                    user.name = 'Max';

                    // should be false since name is not set
                    expect(user.name).toBe('Max');
                });

                /**
                 *  user validation
                 */
                it('should validate lastname', () => {
                    const user = new UserModel();
                    user.lastName = 'Hannuschka';

                    // should be false since name is not set
                    expect(user.lastName).toBe('Hannuschka');
                });
                it('should be valid', () => {
                    const user = new UserModel();
                    user.raw = {
                        name: 'Ralf',
                        lastName: 'Hannuschka'
                    };

                    expect(user.name).toBe('Ralf');
                    expect(user.lastName).toBe('Hannuschka');
                });
            });
        });
    });
});
