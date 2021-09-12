import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateResolverService } from 'core/services';

const routes = [
  {
    path: '',
    canActivate: [TranslateResolverService],
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
