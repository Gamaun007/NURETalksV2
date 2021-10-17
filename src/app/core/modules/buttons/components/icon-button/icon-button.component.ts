import { Component, HostBinding, Input } from '@angular/core';
import { ButtonType, ButtonSize } from '../../types';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input()
  svgIconPath: string;

  @HostBinding('attr.type')
  @Input()
  type: ButtonType = 'primary';

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @Input()
  size: ButtonSize = 'small';

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size}`;
  }

  @HostBinding('attr.role')
  private role = 'button';
}
