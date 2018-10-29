import { Injectable } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router, ActivatedRouteSnapshot, UrlSegment, Params } from '@angular/router';
import { filter, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IBreadCrumb } from '@breadcrumb/api/breadcrumb.interface';

@Injectable()
export class BreadcrumbService {

    private router: Router;

    private routerEvents$: Subject<boolean>;

    private route: ActivatedRoute;

    private isListenRouterEvents: boolean;

    private subs: number;

    private breadcrumb$: BehaviorSubject<IBreadCrumb[]>;

    constructor(
        router: Router,
        route: ActivatedRoute
    ) {
        this.router = router;
        this.route  = route;
        this.subs   = 0;

        this.breadcrumb$ = new BehaviorSubject<IBreadCrumb[]>([]);
        this.routerEvents$ = new Subject<boolean>();
    }

    /**
     * get new breadcrumbs after route has been changed
     *
     * @readonly
     * @type {Observable<Array<IBreadCrumb>>}
     * @memberof BreadcrumbService
     */
    public get breadcrumbs(): Observable<Array<IBreadCrumb>> {

        const observable: Observable<Array<IBreadCrumb>> = Observable.create( (observer) => {

            if ( ! this.isListenRouterEvents ) {
                this.registerRouterEvents();
                this.isListenRouterEvents = true;
            }

            const sub = this.breadcrumb$.subscribe(observer);
            this.subs++;

            return () => {
                sub.unsubscribe();
                this.subs--;

                if ( this.subs <= 0 ) {
                    this.routerEvents$.next(false);
                    this.isListenRouterEvents = false;
                }
            };
        });
        return observable;
    }

    /**
     * register to router events
     *
     * @private
     * @memberof BreadcrumbService
     */
    private registerRouterEvents() {

        this.router.events
            .pipe(
                takeUntil(this.routerEvents$),
                filter( (event: Event) => {
                    return event instanceof NavigationEnd;
                }),
                distinctUntilChanged(),
                map( ( event: Event ) => {
                    return this.createBreadcrumbs(this.route.root, '', 'Home');
                })
            )
            .subscribe( (breadcrumbs: Array<IBreadCrumb>) => {
                this.breadcrumb$.next(breadcrumbs);
            });
    }

    /**
     * create breadcrumbs for path
     *
     * @private
     * @param {ActivatedRoute} route
     * @param {string} [url='']
     * @param {string} [name='']
     * @returns {Array<IBreadCrumb>}
     * @memberof BreadcrumbService
     */
    private createBreadcrumbs(route: ActivatedRoute, url = '', name = ''): Array<IBreadCrumb> {

        const breadCrumbs: Array<IBreadCrumb> = [];
        const routeConfig = route.routeConfig || {};
        let nextUrl: string = url;

        if ( routeConfig.data && routeConfig.data.hasOwnProperty('breadcrumb') ) {
            const label = routeConfig.data['breadcrumb'];

            route.url
                .pipe(
                    map( (data: UrlSegment[]) => {
                        return data.reduce( (current: string, next: UrlSegment) => {
                            if ( current.length === 0 ) {
                                return next.path;
                            }
                            return `${current}/${next.path}`;
                        }, '');
                    })
                )
                .subscribe( (urlSegmentPath) => {
                    nextUrl = `${url}/${urlSegmentPath}`;
                });

            breadCrumbs.push({path: nextUrl, label, data: routeConfig.data || {}});
        }

        if (route.firstChild) {
            breadCrumbs.push( ...this.createBreadcrumbs(route.firstChild, nextUrl));
        }

        return breadCrumbs;
    }
}
