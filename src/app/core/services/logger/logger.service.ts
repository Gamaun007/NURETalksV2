import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoggerService {
  log(log: any): void {
    if (!environment.production) {
      console.log(log);
    }
  }

  error(err: Error): void {
    if (!environment.production) {
      console.error(err);
    }
  }
}
