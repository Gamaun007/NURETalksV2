import { SvgLoaderService } from './svg-loader.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SvgLoaderService', () => {
  let service: SvgLoaderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SvgLoaderService],
    });
    service = TestBed.inject(SvgLoaderService);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeDefined();
  });
});
