import { AppConfigService } from 'core/services/config/app.config.service';
import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import firebase from 'firebase/app';

@Injectable()
export class FirebaseWrapperService {
  constructor(private windowHelper: WindowHelperService, private appConfigService: AppConfigService) {}

  isSignInWithEmailLink(): boolean {
    return firebase.auth().isSignInWithEmailLink(this.windowHelper.getWindow().location.href);
  }

  async signInWithEmailLinkAsync(email: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailLink(email, window.location.href);
  }

  async sendSignInLinkToEmail(email: string): Promise<void> {
    await firebase
      .auth()
      .sendSignInLinkToEmail(email, { url: this.appConfigService.config.signInRedirectUrl, handleCodeInApp: true });
  }
}
