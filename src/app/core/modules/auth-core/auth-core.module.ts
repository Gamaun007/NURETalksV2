import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment';
import { AuthGuardService, RoleService, AuthService, UserFacadeService } from './services';
import { FirebaseWrapperService } from './services';
import { StoreModule } from '@ngrx/store';
import * as storeFeature from './store';
import { EffectsModule } from '@ngrx/effects';
import { PluginOauthHandlerService, PluginRedirectionGuardService } from './services';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.config.firebase),
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    // EffectsModule.forFeature([storeFeature.UserEffects])
  ],
  declarations: [],
})
export class AuthCoreModule {
  static forRoot(): ModuleWithProviders<AuthCoreRootModule> {
    return {
      ngModule: AuthCoreModule,
      providers: [
        AuthService,
        RoleService,
        AuthGuardService,
        FirebaseWrapperService,
        UserFacadeService,
        PluginOauthHandlerService,
        PluginRedirectionGuardService,
      ],
    };
  }
}

@NgModule({
  imports: [CommonModule, AuthCoreModule, AngularFireModule.initializeApp(environment.config.firebase)],
})
class AuthCoreRootModule {}
