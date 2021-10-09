import { NO_FACULTIES_IN_SYSTEM } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { Room, User, Faculty } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';

@Injectable({
  providedIn: 'root',
})
export class UniversityHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getFaculties(): Observable<Faculty[]> {
    return this.getFacultiesCollectionReference()
      .valueChanges()
      .pipe(
        switchMap((faculties) => {
          if (!faculties?.length) {
            return throwError(new Error(NO_FACULTIES_IN_SYSTEM));
          }

          return of(faculties);
        }),
        take(1)
      );
  }

  private getFacultiesCollectionReference(): AngularFirestoreCollection<Faculty> {
    return this.afs.collection<Faculty>('faculties');
  }
}
