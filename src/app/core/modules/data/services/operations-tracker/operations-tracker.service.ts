import { Injectable } from '@angular/core';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';

@Injectable()
export class OperationsTrackerService {
  constructor(private messageHub: MessageBusService) {}

  trackError(operationId: any, error: Error, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), error);
  }

  trackSuccess(operationId: any, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), null);
  }

  trackSuccessWithData(operationId: any, data: any, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), data);
  }

  getOperationStatus(operationId: any, partition = ''): Observable<Error | any> {
    return this.messageHub
      .getObservable(this.buildKey(operationId, partition))
      .pipe(shareReplay(), take(1)) as Observable<Error | null>;
  }

  getOperationData<TData>(operationId: any, partition = ''): Observable<TData> {
    return this.messageHub.getObservable(this.buildKey(operationId, partition)).pipe(
      tap((data) => {
        if (data instanceof Error) {
          throw data;
        }
      }),
      shareReplay(),
      take(1)
    ) as Observable<TData>;
  }

  getOperationDataFeed<TData>(operationId: any): Observable<TData> {
    return this.messageHub.getFeedByKeyPrefix<TData>(this.buildKey(operationId)).pipe(
      tap((data) => {
        if (data instanceof Error) {
          throw data;
        }
      }),
      map((d) => d.payload)
    ) as Observable<TData>;
  }

  private buildKey(operationId: any, partition?: string): string {
    if (partition) {
      return `${partition}-${operationId}`;
    }

    return operationId;
  }
}
