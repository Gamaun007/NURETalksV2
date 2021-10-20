import { UniversityFacadeService } from './../../../university/services/facades/university-facade/university-facade.service';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { MessagesHttpService } from '../../services/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { NEVER } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { MessagesActions, MessagesFirebaseActions, MessagesFirebaseActionTypes } from '../actions';
import { AuthState } from 'core/modules/auth-core/store/state';
import { FileStorageService, ROOM_IMAGE_PATH } from 'core/modules/firebase';
import { UniversityEntitiesName } from 'core/modules/university/models';
import { FirebaseMessagesActionsToNgrx } from '../mappers';

@Injectable()
export class MessagesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private operationsTrackerService: OperationsTrackerService,
    private messagesHttpService: MessagesHttpService,
    private fileStorageService: FileStorageService,
    private authService: AuthService,
    private universityFacade: UniversityFacadeService
  ) {}

  listenToMessagesChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesFirebaseActions.queryMessagesChanges),
      mergeMap((action) => {
        return this.messagesHttpService.getRoomMessagesChangesListener(action.room_id).pipe(
          mergeMap((actions) => actions),
          map((action) => {
            const resolvedAction = FirebaseMessagesActionsToNgrx(action.type);
            return resolvedAction({ payload: { ...action.payload.doc.data(), id: action.payload.doc.id } });
          })
        );
      })
    )
  );

  getLatestMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.getLatestMessage),
      mergeMap((action) => {
        return this.messagesHttpService
          .getLatestMessageListener(action.room_id, action.listenForFurtherNewMessages)
          .pipe(
            map((resp) => {
              return MessagesActions.latestMessageGot({ message: resp });
            })
          );
      })
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      mergeMap((action) => {
        return this.messagesHttpService.getAllRoomMessages(action.room_id).pipe(
          map((resp) => {
            return MessagesActions.messagesLoaded({ room_id: action.room_id, payload: resp });
          })
        );
      })
    )
  );

  createMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.sendMessage),
        mergeMap((action) => {
          return this.messagesHttpService.createRoomMessage(action.room_id, action.message_text).pipe(
            tap((_) => {
              this.operationsTrackerService.trackSuccess(TrackOperations.CREATE_MESSAGE, action.message_opertion_id);
            }),
            catchError((err) => {
              this.operationsTrackerService.trackError(TrackOperations.CREATE_MESSAGE, err, action.message_opertion_id);
              return NEVER;
            })
          );
        })
      ),
    { dispatch: false }
  );
}
