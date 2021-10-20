import { MessagesFacadeService } from './services/facades/messages-facade/messages-facade.service';
import { AuthCoreModule } from './../auth-core/auth-core.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment';
import { StoreModule } from '@ngrx/store';
import * as storeFeature from './store';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    AuthCoreModule,
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeFeature.MessagesEffects]),
  ],
})
export class MessagesModule {
  static forRoot(): ModuleWithProviders<MessagesModule> {
    return {
      ngModule: MessagesModule,
      providers: [MessagesFacadeService],
    };
  }
}
