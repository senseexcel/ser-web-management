import { LocationStrategy, APP_BASE_HREF, Location, LocationChangeListener, PlatformLocation } from '@angular/common';
import { Inject, Optional } from '@angular/core';

export class QmcLocationStrategy extends LocationStrategy {

    private baseHref;

    private platformLocation: PlatformLocation;

    constructor(
        platformLocation: PlatformLocation,
        @Optional() @Inject(APP_BASE_HREF) baseHref?: string
    ) {
        super();
        this.platformLocation = platformLocation;
        if (baseHref === null) {
            this.baseHref = this.platformLocation.getBaseHrefFromDOM();
        }
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QmcLocationStrategy
     */
    path(): string {
        const path = this.platformLocation.hash;
        if ( !path ) {
            return '';
        }
        return path.substr(1);
    }

    /**
     *
     *
     * @param {string} internal
     * @returns {string}
     * @memberof QmcLocationStrategy
     */
    prepareExternalUrl(internal: string): string {
        const base = `${this.baseHref}index.html`;
        const path = this.platformLocation.hash;

        if (internal.substr(1).length) {
            return [base, internal].join('#');
        }
        return base;
    }

    /**
     *
     *
     * @param {*} state
     * @param {string} title
     * @param {string} path
     * @param {string} queryParams
     * @memberof QmcLocationStrategy
     */
    pushState(state: any, title: string, path: string, queryParams: string): void {
        let url: string | null = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length === 0) {
            url = this.platformLocation.pathname;
        }
        this.platformLocation.pushState(state, title, url);
    }

    /**
     *
     *
     * @param {*} state
     * @param {string} title
     * @param {string} path
     * @param {string} queryParams
     * @memberof QmcLocationStrategy
     */
    replaceState(state: any, title: string, path: string, queryParams: string): void {
        let url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length === 0) {
          url = this.platformLocation.pathname;
        }
        this.platformLocation.replaceState(state, title, url);
    }

    /**
     *
     *
     * @memberof QmcLocationStrategy
     */
    forward(): void {
        this.platformLocation.forward();
    }

    /**
     *
     *
     * @memberof QmcLocationStrategy
     */
    back(): void {
        this.platformLocation.back();
    }

    /**
     *
     *
     * @param {LocationChangeListener} fn
     * @memberof QmcLocationStrategy
     */
    onPopState(fn: LocationChangeListener): void {
        this.platformLocation.onPopState(fn);
        this.platformLocation.onHashChange(fn);
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QmcLocationStrategy
     */
    getBaseHref(): string {
        return this.baseHref;
    }
}
