import { MessagesModule } from './../../core/modules/messages/messages.module';
import { SearchModule } from './../../core/modules/data-manipulation/search/search.module';
import { RenderingModule } from './../../core/modules/rendering/rendering.module';
import { RoomsModule } from 'core/modules/rooms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
// import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { ButtonsModule } from 'core/modules/buttons';
import { MessangerComponent } from './components/messanger-section/messanger/messanger.component';
import { RoomsSectionLayoutComponent } from './components/rooms-section/rooms-section-layout/rooms-section-layout.component';
import { RoomsRendererComponent } from './components/rooms-section/rooms-renderer/rooms-renderer.component';
import { MessageItemComponent } from './components/messanger-section/message-item/message-item.component';
import { MessagesRendererComponent } from './components/messanger-section/messages-renderer/messages-renderer.component';
import { FeedComponent } from './components/messanger-section/feed/feed.component';

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

    RoomsModule,

    MessagesModule,
    SearchModule,
    RenderingModule,
  ],
  providers: [DatePipe],
  declarations: [
    MessangerComponent,
    RoomsSectionLayoutComponent,
    RoomsRendererComponent,
    MessageItemComponent,
    MessagesRendererComponent,
    FeedComponent,
  ],
  exports: [],
})
export class MessangerModule {}
