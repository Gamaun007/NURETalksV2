import { UserFacadeService } from './../facades/user-facade/user-facade.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { Observable, NEVER } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';
import { FirebaseWrapperService } from '../firebase-wrapper/firebase-wrapper.service';
import firebase from 'firebase/app';
import { User } from 'core/models/domain';

@Injectable()
export class AuthService {
  private userCache: Observable<User>;

  constructor(
    private authService: AngularFireAuth,
    private windowHelper: WindowHelperService,
    private firebaseWrapper: FirebaseWrapperService,
    private userFacade: UserFacadeService
  ) {
    this.userCache = this.buildCache();
  }

  getCurrentUserAsync(): Promise<User> {
    return this.userCache.pipe(take(1)).toPromise();
  }

  getAuthIdentity(): Observable<firebase.User> {
    return this.authService.authState.pipe(take(1));
  }

  getCurrentUserObservable(): Observable<User> {
    return this.userCache;
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

  async signOutAsync(): Promise<any> {
    await this.authService.signOut();
    this.windowHelper.redirectToOrigin();
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    const user = await this.getCurrentUserAsync();

    return !!user;
  }

  private buildCache(): Observable<User> {
    return this.getAuthIdentity().pipe(
      switchMap((authentication) => {
        if (authentication) {
          return this.userFacade.getUser(authentication.email);
        } else {
          return NEVER;
        }
      }),
      shareReplay()
    );
  }
}
