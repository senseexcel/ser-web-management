import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { inject, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginationService } from '../../providers/pagination.service';
import { PageNavigationComponent } from './page-navigation.component';

describe('PageNavigationComponent', () => {

    let fixture: ComponentFixture<PageNavigationComponent>;
    let comp: PageNavigationComponent;

    beforeEach(async( () => {

        TestBed.configureTestingModule({
            declarations: [ PageNavigationComponent ],
            providers: [ PaginationService ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    }) );

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PageNavigationComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should enter the assertion', () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    it('it should display no pages',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 10 });
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(0);
        })
    );

    it('it should displayed 3 pages',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 30 });
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(3);

            const content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('123');
        })
    );

    it('it should display 5 nav-items with 1 2 3 ... 6',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 60});
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(5);

            let content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('123...6');

            // change start page to 2
            ps.showPage( 2 );
            fixture.detectChanges();

            content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('123...6');
        })
    );

    it('it should display 5 nav-items with 1 ... 4 5 6',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 60, currentPage: 6});
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(5);

            let content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('1...456');

            // change start page to 5
            ps.showPage( 5 );
            fixture.detectChanges();

            content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('1...456');
        })
    );

    it('it should display 6 nav-items with 1 2 3 4 ... 6 ',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 60, currentPage: 3});
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(6);

            const content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('1234...6');
        })
    );

    it('it should display 6 nav-items with 1 ... 3 4 5 6',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 60, currentPage: 4});
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(6);

            const content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('1...3456');
        })
    );

    it('it should display 7 nav-items with 1 ... 3 4 5 ... 10 ',
        inject([PaginationService], (ps) => {

            ps.configure({ itemTotalCount: 100, currentPage: 4});
            fixture.detectChanges();

            expect( fixture.debugElement.queryAll( By.css('button.nav-item') ).length )
                .toEqual(7);

            const content = fixture.debugElement.nativeElement.textContent.replace(/(\s|\r|\n)/g, '');
            expect( content ).toContain('1...345...10');
        })
    );
});
