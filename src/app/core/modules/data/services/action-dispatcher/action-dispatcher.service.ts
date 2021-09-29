import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { OperationsTrackerService } from '../operations-tracker/operations-tracker.service';

@Injectable()
export class ActionDispatcherService {
  constructor(private store: Store<any>, private operationsTrackerService: OperationsTrackerService) {}

  /**
   * Helper method that dispatches provided action and waits
   * until this action completly done using operation tracker service
   */
  async dispatchActionAsync(action: Action, operationId: string, operationPartition?: string): Promise<any> {
    const waitForOperationFinished: Promise<Error | any> = this.operationsTrackerService
      .getOperationStatus(operationId, operationPartition)
      .toPromise();

    const response = this.operationsTrackerService.getOperationData(operationId, operationPartition).toPromise();

    this.store.dispatch(action);

    await waitForOperationFinished;

    return response;
  }
}
