import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ButtonType, ButtonSize } from '../../types';

@Component({
  selector: 'app-button', // this has such selecto until we remove the old app-button
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// It defines all common behaviors/styles in the app so that we won't smear
// behaviors / styles in each component that requires the use of buttons.
export class ButtonComponent {
  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @Input()
  svgIconPath: string;

  @HostBinding('attr.type')
  @Input()
  type: ButtonType = 'primary';

  @Input()
  size: ButtonSize = 'medium';

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @HostBinding('attr.role')
  private role = 'button';

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size}`;
  }
}
