import { SearchModule } from './../../core/modules/data-manipulation/search/search.module';
import { RenderingModule } from './../../core/modules/rendering/rendering.module';
import { RoomsModule } from 'core/modules/rooms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
// import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { ButtonsModule } from 'core/modules/buttons';
import { MessangerComponent } from './components/messanger/messanger.component';
import { RoomsSectionLayoutComponent } from './components/rooms-section/rooms-section-layout/rooms-section-layout.component';
import { RoomsRendererComponent } from './components/rooms-section/rooms-renderer/rooms-renderer.component';

const routes: Route[] = [
  {
    path: '',
    component: MessangerComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    ButtonsModule,
    TranslateModule,
    AngularSvgIconModule,
    DynamicFormModule,
    RoomsModule.forRoot(),
    RoomsModule,
    SearchModule,
    RenderingModule,
  ],
  providers: [],
  declarations: [MessangerComponent, RoomsSectionLayoutComponent, RoomsRendererComponent],
  exports: [],
})
export class MessangerModule {}
