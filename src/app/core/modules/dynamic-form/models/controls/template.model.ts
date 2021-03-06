import { TemplateRef } from '@angular/core';

/**
 * Allow to insert some template into DynamicFormGroup
 */
export class TemplateModel<TContext = any> {
  private _name: string;

  public get name(): string {
    return this._name;
  }

  public templateRef: TemplateRef<any>;

  public displayed = true;

  constructor(public readonly context?: TContext, templateRef?: TemplateRef<any>) {
    this.context = context ? context : ({} as TContext);
    this.templateRef = templateRef;
  }
}
