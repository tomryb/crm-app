import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthenticationService) { }

    canActivate (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) : any {
        const user = this.authService.getUser()
        if (user && user.isAuthenticated) {
          return  new Promise(function (resolve, _reject) {
                setTimeout(resolve, 350, true)
          })
        }
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
