
import { TestBed, inject, async } from '@angular/core/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { AppSettingsModel } from 'src/app/model/app-settings.model';
import { PageSettings } from '../mock/page-settings.mock';
import { IAppPage } from '@api/app-page.interface';
import { SectionModel } from 'src/app/model/section.model';

describe('SMC: App', () => {

    describe('Services Settings', () => {

        describe('Load Model to Service', () => {

            let settingsService: SettingsService;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: SettingsService,
                            useFactory: () => {
                                const settingsModel: AppSettingsModel = new AppSettingsModel();
                                settingsModel.sections = PageSettings;
                                return new SettingsService(settingsModel);
                            }
                        }
                    ]
                });
            });

            beforeEach(inject([SettingsService], service => {
                settingsService = service;
            }));

            it('should be initialized', () => {
                expect(settingsService).toBeTruthy();
            });

            it('should return page count of 3', () => {
                const pages: IAppPage[] = settingsService.pages;
                expect(pages.length).toBe(3);
            });

            it('should have pages', () => {
                const pages: IAppPage[] = settingsService.pages;
                expect(pages[0].id).toEqual('page_1');
                expect(pages[2].id).toEqual('page_3');
            });
        });
    });
});
