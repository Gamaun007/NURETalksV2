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

export function playerFactory(): LottiePlayer {
  return player;
}

@NgModule({
  declarations: [AppComponent, WildCardComponent, RootComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    LottieModule.forRoot({ player: playerFactory }),
    AppRoutingModule,
    CoreModule.forRoot(),
    SvgIconsModule.forRoot(),
    TranslateConfigModule,
    RouterModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    AuthenticationModule,
    AuthCoreModule.forRoot(),
    StoreModule.forRoot({}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
