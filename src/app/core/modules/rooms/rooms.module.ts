import { AuthCoreModule } from './../auth-core/auth-core.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment';
import { RoomsFacadeService } from './services';
import { StoreModule } from '@ngrx/store';
import * as storeFeature from './store';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { EffectsModule } from '@ngrx/effects';
import { RoomItemComponent } from './components/room-item/room-item.component';

@NgModule({
  imports: [
    CommonModule,
    AuthCoreModule,
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeFeature.RoomsEffects]),
  ],
  declarations: [
    RoomItemComponent
  ],
  exports: [
    RoomItemComponent
  ]
})
export class RoomsModule {
  static forRoot(): ModuleWithProviders<RoomsModule> {
    return {
      ngModule: RoomsModule,
      providers: [RoomsFacadeService],
    };
  }
}
