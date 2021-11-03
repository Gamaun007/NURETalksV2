import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionDispatcherService, OperationsTrackerService } from './services';
// import {
//   AuditCommentEffects,
//   AuditEffects,
//   ControlCalculationEffects,
//   ControlEffects,
//   CustomerEffects,
//   DashboardEffects,
//   EvidenceEffects,
//   FrameworkEffects,
//   reducers,
//   RequirementEffects,
//   ServicesEffects,
//   RequirementCalculationEffects,
//   EvidenceCalculationEffects,
//   FrameworkCalculationEffects,
//   PoliciesEffects,
//   PolicyCalculationEffects
// } from './store';

@NgModule({
  imports: [
    CommonModule,
    // StoreModule.forRoot({}),
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    EffectsModule.forRoot([
      // ControlEffects,
      // AuditCommentEffects,
      // AuditEffects,
      // EvidenceEffects,
      // ServicesEffects,
      // FrameworkEffects,
      // RequirementEffects,
      // DashboardEffects,
      // AuditEffects,
      // CustomerEffects,
      // ControlCalculationEffects,
      // RequirementCalculationEffects,
      // EvidenceCalculationEffects,
      // FrameworkCalculationEffects,
      // PolicyCalculationEffects,
      // PoliciesEffects
    ]),
  ],
  declarations: [],
})
export class DataModule {
  static forRoot(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: [OperationsTrackerService, ActionDispatcherService],
    };
  }
}
