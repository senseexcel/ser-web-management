import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessService } from '../../services';
import { IProcess } from '../../api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-process-overview',
    styleUrls: ['process-overview.component.scss'],
    templateUrl: 'process-overview.component.html',
})

export class ProcesseOverviewComponent implements OnDestroy, OnInit {

    public processesVisible: number;

    public processesTotal: number;

    private processService: ProcessService;

    private isDestroyed$: Subject<boolean>;

    constructor(
        processService: ProcessService
    ) {
        this.processService = processService;
        this.isDestroyed$   = new Subject();
    }

    /**
     *
     *
     * @memberof ProcesseOverviewComponent
     */
    ngOnInit() {
        this.processService.processList$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((processes: IProcess[]) => {
                this.processesVisible = processes.length;
                this.processesTotal   = processes.length;
            });
    }

    /**
     *
     *
     * @memberof ProcesseOverviewComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
    }
}
