import { UniversityHttpService } from './services/http/university/university.service';
import { DynamicFormModule } from './../dynamic-form/dynamic-form.module';
import { ButtonsModule } from './../buttons/buttons.module';
import { AuthCoreModule } from './../auth-core/auth-core.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment';
import { AuthGuardService, RoleService, AuthService, RoomsFacadeService } from './services';
import { FirebaseWrapperService } from './services';
import { StoreModule } from '@ngrx/store';
import * as storeFeature from './store';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { EffectsModule } from '@ngrx/effects';
import { SelectUniversityGroupComponent } from './components/select-university-group/select-university-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [
    CommonModule,
    AuthCoreModule,
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeFeature.UniversityEffects]),
    ButtonsModule,
    TranslateModule,
    AngularSvgIconModule,
    DynamicFormModule,
  ],
  declarations: [SelectUniversityGroupComponent],
})
export class UniversityModule {
  static forRoot(): ModuleWithProviders<UniversityModule> {
    return {
      ngModule: UniversityModule,
      providers: [UniversityHttpService],
    };
  }
}
