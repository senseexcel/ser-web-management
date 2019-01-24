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
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 'Max';
                    expect(spy).toHaveBeenCalled();
                });

                it('should call onModelValidationChange and returns true', () => {
                    const userDataModel = new UserDataModel();
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 'Max';
                    expect(spy).toHaveBeenCalledWith(true);
                });

                it('should call onModelValidationChange on invalid result', () => {
                    const userDataModel = new UserDataModel();
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 10 as any;
                    expect(spy).toHaveBeenCalled();
                });

                it('should call onModelValidationChange and returns false', () => {
                    const userDataModel = new UserDataModel();
                    const spy = spyOn(UserDataModel.prototype, 'onModelValidationChange').and.callThrough();
                    userDataModel.name = 10 as any;
                    // but it has been called ...
                    expect(spy).toHaveBeenCalledWith(false);
                });
            });
        });
    });
});
