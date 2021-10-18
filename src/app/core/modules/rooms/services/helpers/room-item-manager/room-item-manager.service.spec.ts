import { TestBed } from '@angular/core/testing';

import { RoomItemManagerService } from './room-item-manager.service';

describe('RoomItemManagerService', () => {
  let service: RoomItemManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomItemManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
