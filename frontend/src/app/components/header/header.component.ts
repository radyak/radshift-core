import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  title: string = 'RadShift';

  authentication: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthentication().subscribe(authentication => {
      this.authentication = authentication;
    })
  }

  logout(): void {
    this.authService.logout()
  }

}
