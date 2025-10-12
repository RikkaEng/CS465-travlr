import { TestBed } from '@angular/core/testing';
import { TripDataService } from './trip-data.service';  // Updated

describe('TripDataService', () => {  // Updated
  let service: TripDataService;  // Updated
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripDataService);  // Updated
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});