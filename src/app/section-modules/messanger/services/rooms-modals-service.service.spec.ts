import { TestBed } from '@angular/core/testing';

import { RoomsModalsServiceService } from './rooms-modals-service.service';

describe('RoomsModalsServiceService', () => {
  let service: RoomsModalsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomsModalsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
