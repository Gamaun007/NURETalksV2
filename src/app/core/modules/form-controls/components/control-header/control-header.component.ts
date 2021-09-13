import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-control-header',
  templateUrl: './control-header.component.html',
  styleUrls: ['./control-header.component.scss'],
})
export class ControlHeaderComponent {
  @Input()
  label: string;

  @Input()
  infoTooltip: TemplateRef<any>;

  @Input()
  infoTooltipPlacement: string;

  @Input()
  infoTooltipClass: string;

  @Input()
  index: number;

  @Input()
  labelParamsObj: object;

  @HostBinding('attr.required')
  @Input()
  required: boolean;
}
