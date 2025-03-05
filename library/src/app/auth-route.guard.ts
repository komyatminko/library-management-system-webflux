import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

export const authRouteGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn().pipe(
    take(1), 
    tap(isLoggedIn => {
      console.log('isloggedIn', isLoggedIn)
      authService.setAuthentication(isLoggedIn);
    }),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Allow navigation
      } else {
        // Redirect to login page with query param for redirecting back after login
        router.navigate(['login'], { queryParams: { redirectUrl: state.url } });
        return false; // Block navigation to the protected route
      }
    })
  );

  //  authService.isLoggedIn().subscribe(isLoggedIn=>{
  //   authService.setAuthentication(isLoggedIn)
  //  })
  //  console.log('isLoggedIn', authService.getAuthentication())
  //  if(authService.getAuthentication())
  // {
  //   return true;
  // }
  // else
  // {
  //   router.navigate(['/login']);
  //   // authService.setAuthentication(false);
  //   return false;
  // }
 
};
