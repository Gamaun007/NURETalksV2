import { MessagesHttpService } from '../../services/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { NEVER } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { MessagesActions, MessagesFirebaseActions } from '../actions';
import { FirebaseMessagesActionsToNgrx } from '../mappers';

@Injectable()
export class MessagesEffects {
  constructor(
    private actions$: Actions,
    private operationsTrackerService: OperationsTrackerService,
    private messagesHttpService: MessagesHttpService
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
          .getLatestMessagesListener(action.room_id, 1, action.listenForFurtherNewMessages)
          .pipe(
            map((resp) => {
              return MessagesActions.latestMessagesGot({ messages: resp });
            })
          );
      })
    )
  );

  loadBeforeSpecificRoomMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadRoomMessagesBeforeSpecific),
      mergeMap((action) => {
        return this.messagesHttpService
          .getPreviousMessages(action.room_id, action.specific_message_id, action.messages_amount)
          .pipe(
            tap((res) =>
              this.operationsTrackerService.trackSuccessWithData(
                TrackOperations.GET_MESSAGES_BEFORE_SPECIFIC,
                res,
                action.room_id
              )
            ),
            map((resp) => {
              return MessagesActions.latestMessagesGot({ messages: resp });
            }),
            catchError((err) => {
              this.operationsTrackerService.trackError(
                TrackOperations.GET_MESSAGES_BEFORE_SPECIFIC,
                err,
                action.room_id
              );
              return NEVER;
            })
          );
      })
    )
  );

  loadLatestMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadLatestRoomMessages),
      mergeMap((action) => {
        return this.messagesHttpService.getLatestMessagesListener(action.room_id, action.messages_amount, false).pipe(
          tap((messages) =>
            this.operationsTrackerService.trackSuccessWithData(
              TrackOperations.GET_LATEST_MESSAGES,
              messages,
              action.room_id
            )
          ),
          map((resp) => {
            return MessagesActions.latestMessagesGot({ messages: resp });
          }),
          catchError((err) => {
            this.operationsTrackerService.trackError(TrackOperations.GET_LATEST_MESSAGES, err, action.room_id);
            return NEVER;
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
            tap((res) => {
              this.operationsTrackerService.trackSuccessWithData(
                action.message_opertion_id,
                res,
                TrackOperations.CREATE_MESSAGE,
              );
            }),
            catchError((err) => {
              this.operationsTrackerService.trackError(action.message_opertion_id, err,  TrackOperations.CREATE_MESSAGE);
              return NEVER;
            })
          );
        })
      ),
    { dispatch: false }
  );
}
