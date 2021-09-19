import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserClaims } from '../../models';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { Observable } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';
import { FirebaseWrapperService } from '../firebase-wrapper/firebase-wrapper.service';
import firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private userCache: Observable<UserClaims>;

  constructor(
    private authService: AngularFireAuth,
    private windowHelper: WindowHelperService,
    private firebaseWrapper: FirebaseWrapperService
  ) {
    this.userCache = this.buildCache();
  }

  getUserAsync(): Promise<UserClaims> {
    return this.userCache.pipe(take(1)).toPromise();
  }

  getAccessTokenAsync(): Promise<string> {
    return this.authService.idToken.pipe(take(1)).toPromise();
  }

  async signInWithEmailLinkAsync(email: string): Promise<firebase.auth.UserCredential> {
    return await this.firebaseWrapper.signInWithEmailLinkAsync(email);
  }

  isSignInWithEmailLink(): boolean {
    return this.firebaseWrapper.isSignInWithEmailLink();
  }

  async sendSignInToEmail(email: string): Promise<void> {
    this.firebaseWrapper.sendSignInLinkToEmail(email);
    window.localStorage.setItem('emailForSignIn', email);
  }

  signInWithPopupAsync(providerId: string): Promise<firebase.auth.UserCredential> {
    return this.firebaseWrapper.signInWithPopupAsync(providerId);
  }

  async signOutAsync(): Promise<any> {
    await this.authService.signOut();
    this.windowHelper.redirectToOrigin();
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    const user = await this.getUserAsync();

    return !!user;
  }

  async linkWithCredentialAsync(email: string, credentials: firebase.auth.AuthCredential): Promise<void> {
    const methods = await this.firebaseWrapper.fetchSignInMethodsForEmailAsync(email);
    const method = methods[0];
    const result = await this.firebaseWrapper.signInWithPopupAsync(method);
    await result.user.linkWithCredential(credentials);
  }

  private buildCache(): Observable<UserClaims> {
    return this.authService.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) {
          const token = await authState.getIdTokenResult();
          return token.claims as UserClaims;
        }
      }),
      shareReplay()
    );
  }
}
