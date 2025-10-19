import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { JwtInterceptor } from './jwt-interceptor';
import { AuthenticationService } from '../services/authentication';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn', 'getToken']);

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});