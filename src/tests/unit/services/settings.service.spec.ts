
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

interface IAuto {
    doors: number;
}

describe('SMC: App', () => {

    describe('Services Settings', () => {

        describe('Load Model to Service', () => {

            let settingsService: HttpClient;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        HttpClient
                    ]
                });
            });

            beforeEach(inject([HttpClient], service => {
                settingsService = service;
            }));

            it('should do something', () => {
                settingsService.get<IAuto>('./auto.json')
                    .subscribe((a: IAuto) => {
                        console.log(a);
                    });
            });
        });
    });
});
