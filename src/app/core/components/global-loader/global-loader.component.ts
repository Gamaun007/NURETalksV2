import { Component, OnInit } from '@angular/core';
import { LoaderManagerService } from 'core/services';
import { Observable, of } from 'rxjs';
import { catchError, filter, startWith, switchMap, take, timeout } from 'rxjs/operators';

export const LOADING_TIMEOUT = 10000;

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss'],
})
export class GlobalLoaderComponent implements OnInit {
  isLoaderDisplayed$: Observable<boolean>;
  isLongLoading$: Observable<boolean>;

  constructor(private loaderManager: LoaderManagerService) {}

  ngOnInit(): void {
    this.isLoaderDisplayed$ = this.loaderManager.loaderStream$;

    this.isLongLoading$ = this.loaderManager.loaderStream$.pipe(
      switchMap((isLoading) => {
        if (isLoading) {
          return this.loaderManager.loaderStream$.pipe(
            filter((isStillLoading) => !isStillLoading),
            timeout(LOADING_TIMEOUT),
            catchError(() => {
              return of(true);
            }),
            take(1),
            startWith(false)
          );
        }
        return of(false);
      })
    );
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.globalLoader.${relativeKey}`;
  }
}
