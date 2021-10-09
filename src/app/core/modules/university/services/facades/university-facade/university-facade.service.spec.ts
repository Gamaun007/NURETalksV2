import { TestBed } from '@angular/core/testing';

import { RoomsFacadeService } from './rooms-facade.service';

describe('RoomsFacadeService', () => {
  let service: RoomsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
