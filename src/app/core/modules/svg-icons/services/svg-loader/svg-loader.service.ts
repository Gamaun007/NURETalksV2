import { Injectable } from '@angular/core';
import { SvgHttpLoader } from 'angular-svg-icon';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SvgLoaderService extends SvgHttpLoader {
  constructor(httpBackend: HttpBackend) {
    super(new HttpClient(httpBackend));
  }

  getSvg(url: string): Observable<string> {
    return super.getSvg(`/assets/icons/${url}.svg`);
  }
}
