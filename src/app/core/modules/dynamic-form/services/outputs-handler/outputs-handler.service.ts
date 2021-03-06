import { ComponentFactory } from '@angular/core';
import { Subscription } from 'rxjs';

export class OutputsHandlerService {
  private outputsSubscriptions: Subscription[] = [];

  constructor(private componentFactory: ComponentFactory<any>) {}

  /**
   * Subscribes to outputs of components then listen to component events and calls functions provided in outputsObj
   * @param objWithInputs Object with callbacks that listens to component events
   * @param componentInstance Component instance
   */
  handle(outputsObj: { [key: string]: () => any }, componentInstance: any): any {
    this.unsubscribeFromOutputsSubscription();

    if (outputsObj) {
      this.componentFactory.outputs.forEach((prop) => {
        const key = prop.propName;

        if (outputsObj.hasOwnProperty(prop.propName) && outputsObj[key]) {
          this.outputsSubscriptions.push(componentInstance[key].subscribe(outputsObj[key]));
        }
      });
    } else {
      this.unsubscribeFromOutputsSubscription();
    }
  }

  private unsubscribeFromOutputsSubscription(): void {
    this.outputsSubscriptions.forEach((s) => s.unsubscribe());
  }
}
