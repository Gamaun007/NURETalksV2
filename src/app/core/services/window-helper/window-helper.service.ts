import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WindowHelperService {
  constructor(private router: Router) {}

  getWindow(): Window {
    return window;
  }

  openUrlInNewTab(url: string): Window {
    return window.open(url, '_blank');
  }

  openUrlInNewTabWithMultipleData(urlFragment: string, parameterName: string, data: string[]): Window {
    const urlPart = this.router.serializeUrl(
      this.router.createUrlTree([urlFragment], { queryParams: { [parameterName]: JSON.stringify(data) } })
    );
    return window.open(`${location.origin}${urlPart}`, '_blank');
  }

  openUrl(url: string): Window {
    return window.open(url, '_self');
  }

  redirectToOrigin(): void {
    this.openUrl(window.location.origin);
  }
}
