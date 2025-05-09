import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../../services/auth.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoutes = [
      '/forgot-password',
      '/verify-otp',
      '/reset-password',
      '/password-reset',
      '/oauth2-redirect'
    ];

    // Allow all auth-related and OAuth2 redirect routes
    if (allowedRoutes.some(path => state.url.startsWith(path))) {
      return true;
    }

    // Check if user is authenticated (token exists and is valid)
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect unauthenticated users to /visit
    this.router.navigate(['/visit']);
    return false;
  }
}
