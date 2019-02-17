import { Component, ElementRef, Host, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PaginationService } from '../../providers/pagination.service';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'smc-pagination--infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit {

  @ViewChild('infiniteWrap')
  public contentWrapper: ElementRef;

  @Input()
  public autoLoadCount = -1;

  public showMore: boolean;

  private pagination: PaginationService;

  constructor(
    @Host() pagination: PaginationService
  ) {
    this.pagination = pagination;
  }

  ngOnInit(): void {

    this.showMore = false;

    // register window scroll event
    this.getWindowScrollStream()
      .subscribe((top) => {
        this.handleWindowScroll(top);
      });
  }

  public loadNextPage(): void {
    this.showMore = false;
    this.pagination.showNextPage();
  }

  /**
   * get observable for window scroll event every 100ms
   *
   * @private
   * @returns
   * @memberof InfiniteScrollComponent
   */
  private getWindowScrollStream() {

    return fromEvent(window, 'scroll')
      .pipe(
        debounceTime(150),
        map(() => {
          let loadNextPage = false;
          if ( ! this.pagination.isDisabled() ) {
            const data = this.contentWrapper.nativeElement.getBoundingClientRect();
            loadNextPage = Math.abs(data.top) + window.innerHeight >= data.height - 100;
          }
          return loadNextPage;
        })
      );
  }

  /**
   * handle window scroll event
   *
   * @private
   * @param {number} val
   * @memberof InfiniteScrollComponent
   */
  private handleWindowScroll( nextpage: boolean) {
    this.showMore = false;

    if ( nextpage ) {

      const loadNextPage: boolean =
        this.autoLoadCount === -1 || this.pagination.getCurrentPage() < this.autoLoadCount;

      if ( loadNextPage ) {
        this.pagination.showNextPage();
      }

      if ( ! this.pagination.isLastPage() && ! loadNextPage ) {
        this.showMore = true;
      }
    }
  }
}
