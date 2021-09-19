// import { inject, TestBed } from '@angular/core/testing';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { of } from 'rxjs';
// import { AuthService } from './auth.service';
// import firebase from 'firebase';
// import { map } from 'rxjs/operators';
// import { UserEventService, WindowHelperService } from 'core/services';
// import { UserClaims } from '../../models';
// import { UserEvents } from 'core/models/user-events/user-event-data.model';
// import { FirebaseWrapperService } from '../firebase-wrapper/firebase-wrapper.service';
// import { TenantFacadeService } from '../facades/tenant-facade/tenant-facade.service';

// describe('Service: AuthService', () => {
//   let authService: AuthService;
//   let angularFireAuthMock: AngularFireAuth;
//   let userClaims: UserClaims;
//   let fakeFirebaseUser: firebase.User;
//   let userEventServiceMock: UserEventService;
//   let windowHelperMock: WindowHelperService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: AngularFireAuth,
//           useValue: {
//             authState: of({}).pipe(map(() => fakeFirebaseUser)),
//           },
//         },
//         { provide: WindowHelperService, useValue: {} },
//         { provide: UserEventService, useValue: {} },
//         { provide: FirebaseWrapperService, useValue: {} },
//         { provide: TenantFacadeService, useValue: {} },
//       ],
//     });
//   });

//   beforeEach(() => {
//     authService = TestBed.inject(AuthService);
//     userClaims = {} as any;
//     angularFireAuthMock = TestBed.inject(AngularFireAuth);
//     angularFireAuthMock.signOut = jasmine.createSpy('signOut').and.callFake(() => Promise.resolve());
//     fakeFirebaseUser = {} as any;
//     fakeFirebaseUser.getIdTokenResult = jasmine.createSpy('getIdTokenResult').and.callFake(() =>
//       Promise.resolve({
//         claims: userClaims,
//       })
//     );
//     userEventServiceMock = TestBed.inject(UserEventService);
//     windowHelperMock = TestBed.inject(WindowHelperService);
//     userEventServiceMock.sendEvent = jasmine.createSpy('sendEvent');
//     windowHelperMock.redirectToOrigin = jasmine.createSpy('redirectToOrigin');
//   });

//   it('should ...', inject([AuthService], (service: AuthService) => {
//     expect(service).toBeTruthy();
//   }));

//   it('should return user from getIdTokenResult()', async () => {
//     // Arrange
//     // Act
//     const actualUserClaims = await authService.getUserAsync();

//     // Assert
//     expect(actualUserClaims).toBe(userClaims);
//   });

//   it('should call getIdTokenResult once for multiple calls of getUserAsync() and return the same user claims', async () => {
//     // Arrange
//     const results: { [key: string]: any }[] = [];
//     const tasks = [
//       authService.getUserAsync(),
//       authService.getUserAsync(),
//       authService.getUserAsync(),
//       authService.getUserAsync(),
//       authService.getUserAsync(),
//       authService.getUserAsync(),
//     ];

//     // Act
//     for (const task of tasks) {
//       results.push(await task);
//     }

//     // Assert
//     expect(fakeFirebaseUser.getIdTokenResult).toHaveBeenCalledTimes(1);
//     expect(results.length).toBe(tasks.length);
//     results.forEach((user) => expect(user).toBe(userClaims));
//   });

//   describe('signOutAsync', () => {
//     it('should call signOut()', async () => {
//       // Arrange
//       // Act
//       await authService.signOutAsync();

//       // Assert
//       expect(angularFireAuthMock.signOut).toHaveBeenCalled();
//     });

//     it('should call sendEvent with logout event', async () => {
//       // Arrange
//       // Act
//       await authService.signOutAsync();

//       // Assert
//       expect(userEventServiceMock.sendEvent).toHaveBeenCalledWith(UserEvents.LOGOUT);
//     });

//     it('should call redirectToOrigin', async () => {
//       // Arrange
//       // Act
//       await authService.signOutAsync();

//       // Assert
//       expect(windowHelperMock.redirectToOrigin).toHaveBeenCalled();
//     });
//   });
// });
