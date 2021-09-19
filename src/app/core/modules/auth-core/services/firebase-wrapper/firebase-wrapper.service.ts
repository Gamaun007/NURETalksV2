import { AppConfigService } from './../../../../services/config/app.config.service';
import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { userEmailQueryParam } from '../../constants';
import firebase from 'firebase/app';

@Injectable()
export class FirebaseWrapperService {
  constructor(private windowHelper: WindowHelperService, private appConfigService: AppConfigService) {}

  isSignInWithEmailLink(): boolean {
    const result = firebase.auth().isSignInWithEmailLink(this.windowHelper.getWindow().location.href);
    return result;
  }

  async signInWithEmailLinkAsync(email: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailLink(email, window.location.href);
  }

  async sendSignInLinkToEmail(email: string): Promise<void> {
    await firebase
      .auth()
      .sendSignInLinkToEmail(email, { url: this.appConfigService.config.signInRedirectUrl, handleCodeInApp: true });
  }

  async signInWithPopupAsync(providerId: string): Promise<firebase.auth.UserCredential> {
    return await firebase.auth().signInWithPopup(this.getProvider(providerId));
  }

  fetchSignInMethodsForEmailAsync(email: string): Promise<string[]> {
    return firebase.auth().fetchSignInMethodsForEmail(email);
  }

  private getProvider(providerId: string): firebase.auth.AuthProvider {
    switch (providerId) {
      case 'google.com':
        return new firebase.auth.GoogleAuthProvider();
      case 'microsoft.com':
        return new firebase.auth.OAuthProvider('microsoft.com');
      case 'github.com':
        return new firebase.auth.GithubAuthProvider();
      default: {
        if (providerId.includes('saml')) {
          return new firebase.auth.SAMLAuthProvider(providerId);
        }
      }
    }
  }
}
