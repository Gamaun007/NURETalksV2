/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserFacadeService } from './user-facade.service';

describe('Service: UserFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacadeService, provideMockStore()],
    });
  });

  it('should ...', inject([UserFacadeService], (service: UserFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
