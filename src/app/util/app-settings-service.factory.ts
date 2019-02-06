import { AppPageSettings } from '../settings/page.settings';
import { SettingsService } from '../services/settings.service';
import { AppSettingsModel } from '../model/app-settings.model';

export function AppSettingsFactory() {
    const settingsModel = new AppSettingsModel();
    settingsModel.sections = AppPageSettings;
    return new SettingsService(settingsModel);
}
