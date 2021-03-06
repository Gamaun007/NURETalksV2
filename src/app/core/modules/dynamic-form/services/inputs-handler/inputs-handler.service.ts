import { ComponentFactory, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

export class InputsHandlerService {
  private changedInputs: string[] = [];

  constructor(private componentFactory: ComponentFactory<any>) {}

  /**
   * Synchronizes properties of object with provided component's instance inputs
   * @param objWithInputs Object with inputs that component inputs are synchronized with based on its properties
   * @param componentInstance Component instance
   */
  handle(objWithInputs: any, componentInstance: any): void {
    const simpleChanges: SimpleChanges = {};

    if (objWithInputs) {
      this.componentFactory.inputs.forEach((prop) => {
        const key = prop.propName;
        const isFirstChange = !this.changedInputs.includes(key);

        if (objWithInputs.hasOwnProperty(key) && componentInstance[key] !== objWithInputs[key]) {
          simpleChanges[key] = new SimpleChange(componentInstance[key], objWithInputs[key], isFirstChange);
          componentInstance[key] = objWithInputs[key];

          if (isFirstChange) {
            this.changedInputs.push(key);
          }
        }
      });
    }

    const componentWithOnChangeHook = componentInstance as OnChanges;

    if (typeof componentWithOnChangeHook.ngOnChanges === 'function' && Object.keys(simpleChanges).length) {
      componentWithOnChangeHook.ngOnChanges(simpleChanges);
    }
  }
}
