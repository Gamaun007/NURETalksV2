import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from './../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getSpecificUser(email: string): Observable<User> {
    return this.getUserByQuery(email, (collection) => collection.where('email', '==', email));
  }

  private getUserByQuery(user_identifier: string, query: QueryFn<firebase.firestore.DocumentData>): Observable<User> {
    return this.afs
      .collection<User>('users', query)
      .valueChanges()
      .pipe(
        switchMap((users) => {
          if (!users?.length) {
            return throwError(new Error(NO_USERS_ERROR(user_identifier)));
          }

          if (users.length > 1) {
            return throwError(new Error(MORE_THAN_ONE_USER_ERROR(user_identifier)));
          }

          return of(users[0]);
        }),
        take(1)
      );
  }

  getSpecificUserById(id: string): Observable<User> {
    return this.getUserByQuery(id, (collection) => collection.where('uid', '==', id));
  }

  updateUser(id: string, userToUpdate: Partial<User>): Observable<User> {
    return from(this.getUsersCollectionReference().doc(id).update(userToUpdate)).pipe(
      switchMap(() => this.getSpecificUserById(id))
    );
  }

  createNewUser(email: string, user?: Partial<User>): Observable<User> {
    const { first_name, last_name } = getNameByNureEmail(email);
    const newUser: User = {
      email: email,
      first_name,
      last_name,
      // Setting student role by default
      role: RoleEnum.Student,
    };

    if (user) {
      Object.keys(user).forEach((propName) => {
        newUser[propName] = user[propName];
      });
    }

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
