import { AuthenticationModule } from './section-modules/authentication/authentication.module';
import { TranslateConfigModule } from './core/modules/translate-config/translate-config.module';
import { HttpBackend } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'core/factories';
import { CoreModule } from 'core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CoreModule.forRoot(),
    TranslateConfigModule,
    RouterModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    AuthenticationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
