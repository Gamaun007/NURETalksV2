import { UserFacadeService } from './../../../../core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderManagerService, WindowHelperService } from 'core/services';
import { AuthService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-email-callback',
  templateUrl: './email-callback.component.html',
  styleUrls: ['./email-callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailCallbackComponent implements OnInit {
  isErrorScreenDisplayed: boolean;

  constructor(
    private authService: AuthService,
    private windowHelper: WindowHelperService,
    private cd: ChangeDetectorRef,
    private loaderManager: LoaderManagerService,
    private userFacade: UserFacadeService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.emailCallback.${relativeKey}`;
  }

  private async init(): Promise<void> {
    if (!(await this.trySignInWithEmailAsync())) {
      this.isErrorScreenDisplayed = true;
      this.loaderManager.hide();
      this.cd.detectChanges();
    }
  }

  private async trySignInWithEmailAsync(): Promise<boolean> {
    try {
      if (this.authService.isSignInWithEmailLink()) {
        var email = window.localStorage.getItem('emailForSignIn');
        const user = await this.authService.signInWithEmailLinkAsync(email);
        await this.userFacade.createUser(user.user.email);
        window.localStorage.removeItem('emailForSignIn');
        this.windowHelper.redirectToOrigin();
        return true;
      }
    } catch (err) {}

    return false;
  }
}
