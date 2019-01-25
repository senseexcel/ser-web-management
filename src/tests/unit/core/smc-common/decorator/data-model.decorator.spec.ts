import { UserDataModel } from '../model/user-data.model';

describe('SMC: Modules', () => {
    describe('SMC-Common', () => {
        describe('Decorators', () => {
            describe('DataModel Decorator', () => {

                it('should be invalid model', () => {
                    const userDataModel = new UserDataModel();
                    expect(userDataModel.isValid).toBeFalsy();
                });

                it('should call onModelValidationChange on valid result', () => {
                    const userDataModel = new UserDataModel();
                    userDataModel.name  = 10 as any;
                    expect(userDataModel.isValid).toBeFalsy();
                });

                it('should call onModelValidationChange and returns true', () => {
                    const userDataModel = new UserDataModel();
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 'Max';
                    expect(spy).toHaveBeenCalledWith(true);
                });

                it('should not call onModelValidationChange', () => {
                    const userDataModel = new UserDataModel();
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 10 as any;
                    expect(spy).toHaveBeenCalledTimes(0);
                });

                it('should call onModelValidationChange and returns false', () => {
                    const userDataModel = new UserDataModel();
                    userDataModel.name = 'Max';

                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 10 as any;
                    expect(spy).toHaveBeenCalledWith(false);
                });
            });
        });
    });
});
