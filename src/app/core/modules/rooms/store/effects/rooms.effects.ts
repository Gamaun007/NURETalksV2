import { CreateGroupRoomEntity } from './../../services/http/rooms/rooms.service';
import { UniversityFacadeService } from './../../../university/services/facades/university-facade/university-facade.service';
import { RoomsActions } from './../actions/rooms.actions';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { RoomsHttpService } from '../../services/http/rooms/rooms.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { NEVER } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { RoomsFirebaseActionTypes } from '../actions';
import { AuthState } from 'core/modules/auth-core/store/state';
import { FileStorageService, ROOM_IMAGE_PATH } from 'core/modules/firebase';
import { FirebaseRoomsActionsToNgrx } from '../mappers';
import { UniversityEntitiesName } from 'core/modules/university/models';

@Injectable()
export class RoomsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private operationsTrackerService: OperationsTrackerService,
    private roomsHttpService: RoomsHttpService,
    private fileStorageService: FileStorageService,
    private authService: AuthService,
    private universityFacade: UniversityFacadeService
  ) {}

  listenToRoomsChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsFirebaseActionTypes.QueryRoomsChanges),
      mergeMap((action) => {
        return this.roomsHttpService.getAllRoomsChangesListener().pipe(
          mergeMap((actions) => actions),
          map((action) => {
            const resolvedAction = FirebaseRoomsActionsToNgrx(action.type);
            return resolvedAction({ payload: { ...action.payload.doc.data(), id: action.payload.doc.id } });
          })
        );
      })
    )
  );

  loadRooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomsActions.loadRooms),
      mergeMap((action) => {
        return this.roomsHttpService.getAllRooms().pipe(
          map((resp) => {
            return RoomsActions.roomsLoaded({ payload: resp });
          })
        );
      })
    )
  );

  createRoom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RoomsActions.createRoom),
        mergeMap((action) => {
          return this.universityFacade.getGroupByUniversityStructure(action.universityStructure).pipe(
            switchMap((foundGroup) => {
              return this.fileStorageService
                .getFileFromStorage(ROOM_IMAGE_PATH, 'Group-pale-violet.png')
                .pipe(map((path) => ({ icon_Path: path, foundGroup })));
            }),
            map((accumulatedData) => {
              const createRoomEntity: CreateGroupRoomEntity = {
                faculty_id: action.universityStructure[UniversityEntitiesName.faculty],
                direction_id: action.universityStructure[UniversityEntitiesName.direction],
                speciality_id: action.universityStructure[UniversityEntitiesName.speciality],
                group_id: accumulatedData.foundGroup.id,
                photo_url: accumulatedData.icon_Path,
                name: accumulatedData.foundGroup.name,
              };

              return createRoomEntity;
            }),

            switchMap((createRoomEntity) => {
              return this.roomsHttpService.createRoom(createRoomEntity);
            }),
            tap(() => {
              this.operationsTrackerService.trackSuccess(
                TrackOperations.CREATE_GROUP_ROOM,
                action.universityStructure.group.toString()
              );
            }),
            catchError((e) => {
              this.operationsTrackerService.trackError(
                TrackOperations.CREATE_GROUP_ROOM,
                e,
                action.universityStructure.group.toString()
              );
              return NEVER;
            })
          );
        })
      ),
    { dispatch: false }
  );
}
