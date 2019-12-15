import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, Route } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'RadShift';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  authentication: any;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private router: Router,
              private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.authService.getAuthentication().subscribe(authentication => {
      this.authentication = authentication;
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    this.authService.logout();
  }

  getRoutes(): Route[] {
    return this.router.config.filter(route => {
      return !!route.data
          && !!route.data.label
          && (!route.data.requiredRole || this.authService.hasRoleSync(route.data.requiredRole));
    });
  }

}
