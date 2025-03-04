import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authRouteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  // console.log('Route guard ',route.url[0].path);
  if(authService.getAuthentication())
  {
    return true;
  }
  else
  {
    router.navigate(['login'],
      { queryParams: { redirectUrl: route.url[0].path} }
      );
    return false;
  }
};
