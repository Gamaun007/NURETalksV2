import { environment } from './../environments/environment.local';
import { DataManipulationModule } from './core/modules/data-manipulation/data-manipulation.module';
import { DataModule } from './core/modules/data/data.module';
import { SvgIconsModule } from './core/modules/svg-icons/svg-icons.module';
import { AuthCoreModule } from './core/modules/auth-core/auth-core.module';
import { AuthenticationModule } from './section-modules/authentication/authentication.module';
import { TranslateConfigModule } from './core/modules/translate-config/translate-config.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { RootComponent, WildCardComponent } from 'src/app/components';
import { LottieModule } from 'ngx-lottie';
import player, { LottiePlayer } from 'lottie-web';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
export function playerFactory(): LottiePlayer {
  return player;
}

@NgModule({
  declarations: [AppComponent, WildCardComponent, RootComponent],
  imports: [
    BrowserModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    LottieModule.forRoot({ player: playerFactory }),
    AppRoutingModule,
    CoreModule.forRoot(),
    SvgIconsModule.forRoot(),
    RouterModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    AuthenticationModule,

    AuthCoreModule.forRoot(),
    DataManipulationModule.forRoot(),
    DataManipulationModule,
    DataModule.forRoot(),
    TranslateConfigModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
