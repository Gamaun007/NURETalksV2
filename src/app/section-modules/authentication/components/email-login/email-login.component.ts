import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TextFieldControl } from 'core/modules/form-controls';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailLoginComponent implements OnInit, OnDestroy {
  private subscriptionDetacher = new SubscriptionDetacher();
  private isProcessing: boolean;

  @Output()
  signInEmailSent = new EventEmitter<string>();

  isProcessing$ = new Subject<boolean>();
  emailConfirmationMessageSent: boolean;

  dynamicFormGroup = new DynamicFormGroup({
    email: new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('form.label'),
        placeholder: this.buildTranslationKey('form.placeholder'),
        validateOnDirty: true,
        required: false,
      },
      validators: [CustomValidators.emailNureValidator],
    }),
  });

  constructor(private activatedRoute: ActivatedRoute, private authenticationService: AuthService) {}

  ngOnDestroy(): void {
    this.subscriptionDetacher.detach();
  }

  async ngOnInit(): Promise<void> {
    if (this.activatedRoute.snapshot.queryParams.email) {
      this.dynamicFormGroup.items.email.setValue(this.activatedRoute.snapshot.queryParams.email);
    }

    this.isProcessing$
      .pipe(this.subscriptionDetacher.takeUntilDetach())
      .subscribe((value) => (this.isProcessing = value));
  }

  @HostListener('document:keydown.enter', ['event$'])
  async sendSignInLink(): Promise<void> {
    if (this.dynamicFormGroup.valid && !this.isProcessing) {
      this.isProcessing$.next(true);

      try {
        await this.authenticationService.sendSignInToEmail(this.dynamicFormGroup.items.email.value);
        this.emailConfirmationMessageSent = true;
      } catch (err) {
        this.dynamicFormGroup.items.email.setErrors({ emailNotFound: true });
      } finally {
        this.isProcessing$.next(false);
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.loginPage.${relativeKey}`;
  }
}
