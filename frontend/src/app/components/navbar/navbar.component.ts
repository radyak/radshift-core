import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  username: Observable<String>;
  isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.userName$;
    this.isLoggedIn = this.authService.loggedIn$;
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
