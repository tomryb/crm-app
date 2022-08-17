import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthenticationService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'crm app';
  user: any = null;
  isMobile: boolean;
  mode = "side"
  uiContent = "content"
  progrssBarClass = "progress-bar";
  isloading = true;

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isloading = true;

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
        this.mode = "over"
        this.uiContent = "mobile-content"
      }
      else {
        this.isMobile = false;
        this.mode = "side"
        this.uiContent = "content"
      }
    });
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    })
      ;
  }

  ngOnChanges() {
    console.log(" ngOnChanges")
  }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isloading = false;
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['login']);
  }



  isAuth(isAuth?: any) {
    if (isAuth) {
      this.user = this.authService.getUser()
    }
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this. progrssBarClass = "progress-bar";
      this.isloading = true;
    }
    if (event instanceof NavigationEnd) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }
    if (event instanceof NavigationCancel) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }
    if (event instanceof NavigationError) {
      this. progrssBarClass = "progress-bar-hidden";
      this.isloading = false;
    }

  }


  ngOnDestroy() {
    this.breakpointObserver.ngOnDestroy()
    this.authService.logout()
  }

}
