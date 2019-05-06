import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { routes } from '../../app-routing.module';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  auth: Observable<any>;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAuthentication().subscribe(auth => {
      this.auth = auth;
    });
  }

  canNavigate(path: string) {
    let route = routes.filter(route => {
      return route.path === path
    })[0];
    return route && route.data && route.data.requiredRole && this.authService.hasRole(route.data.requiredRole);
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  collapse() {
    this.isCollapsed = true;
  }

  logout() {
    return this.authService.logout()
  }

}
