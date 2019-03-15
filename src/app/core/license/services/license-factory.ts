import { UserLicense } from '../model';

abstract class LicenseFactory {

    public static createUserLicense(): UserLicense {
    }

    public static createTokenLicense(): TokenLicense {
    }
}