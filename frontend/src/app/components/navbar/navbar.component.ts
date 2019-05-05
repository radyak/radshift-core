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
  auth: Observable<any>;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAuthentication().subscribe(auth => {
      this.auth = auth;
    });
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
