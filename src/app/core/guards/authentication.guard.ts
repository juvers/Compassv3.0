import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserService } from '@state/user/user.service';
import { AuthenticationService } from '@services/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) {}
    private isAuthenticated(next: ActivatedRouteSnapshot) {
        return this.userService.isLoggedIn$.pipe(
            tap(isLoggedIn => {
                if (!isLoggedIn) {
                    console.log('Not authorized!');

                    this.authenticationService.denyAccess(next);
                    this.router.navigate(['/']);
                }
            })
        );
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isAuthenticated(next);
    }
    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isAuthenticated(next);
    }
}
