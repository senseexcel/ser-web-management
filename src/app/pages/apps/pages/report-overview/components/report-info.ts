import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { OverflowControl, AsyncEvent, ResponsiveMenuComponent } from 'ngx-responsivemenu';
import { trigger, style, transition, animate } from '@angular/animations';
import { tap, switchMap, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WindowResize } from '@smc/modules/smc-common/provider/resize-service';
import { ISerReport } from '@smc/pages/apps/api/ser-config.interface';

@Component({
    selector: 'smc-report-info',
    templateUrl: 'report-info.html',
    styleUrls: ['./report-info.scss'],
    viewProviders: [OverflowControl],
    animations: [
        trigger('Slide', [
            transition(':enter', [
                style({right: '-100%'}),
                animate('200ms ease-in', style({right: 0}))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({right: '-100%'}))
            ])
        ])
    ]
})
export class ReportInfoComponent implements OnInit {

    public showSidebar: boolean;

    public animation$: Subject<boolean> = new Subject();

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @Input()
    public report: ISerReport;

    @Output()
    public clone: EventEmitter<ISerReport> = new EventEmitter();

    @Output()
    public edit: EventEmitter<ISerReport> = new EventEmitter();

    @Output()
    public delete: EventEmitter<ISerReport> = new EventEmitter();

    constructor(
        private overflowCtrl: OverflowControl,
        private windowResize: WindowResize
    ) { }

    ngOnInit() {
        this.windowResize.onChange().subscribe({
            next: () => this.responsiveMenu.update()
        });

         this.overflowCtrl.show.pipe(
            tap(() => this.showSidebar = true),
            switchMap(() => this.overflowCtrl.hide)
        ).subscribe({
            next: () => this.showSidebar = false
        });
    }

    /**
     *
     */
    public onBeforeRemoveMenu(event: AsyncEvent) {
        this.animation$.pipe(take(1))
            .subscribe(() => event.done());
    }

    public animationDone() {
        this.animation$.next(true);
    }

    public cloneReport() {
        this.clone.emit(this.report);
    }

    public editReport() {
        this.edit.emit(this.report);
    }

    public deleteReport() {
        this.delete.emit(this.report);
    }
}
