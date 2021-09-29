import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from './../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getSpecificUser(email: string): Observable<User> {
    return this.afs
      .collection<User>('users', (collection) => collection.where('email', '==', email))
      .valueChanges()
      .pipe(
        switchMap((users) => {
          if (!users?.length) {
            return throwError(new Error(NO_USERS_ERROR(email)));
          }

          if (users.length > 1) {
            return throwError(new Error(MORE_THAN_ONE_USER_ERROR(email)));
          }

          return of(users[0]);
        }),
        take(1)
      );
  }

  createNewUser(email: string): Observable<User> {
    const { firstName, lastName } = getNameByNureEmail(email);
    const newUser: User = {
      email: email,
      firstName,
      lastName,
      // Setting student role by default
      role: RoleEnum.Student,
    };

    return this.authService.getAuthIdentity().pipe(
      switchMap((fUser) => {
        newUser.uid = fUser.uid;
        return from(this.getUsersCollectionReference().doc(fUser.uid).set(newUser)).pipe(
          switchMap(() => {
            return this.getUsersCollectionReference()
              .doc(fUser.uid)
              .get()
              .pipe(map((snap) => snap.data()));
          })
        );
      })
    );
  }

  private getUsersCollectionReference(): AngularFirestoreCollection<User> {
    return this.afs.collection<User>('users');
  }
}
