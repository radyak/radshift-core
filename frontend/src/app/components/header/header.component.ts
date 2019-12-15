import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  title: string = 'RadShift';

  @Output()
  onLogoClicked: EventEmitter<void> = new EventEmitter();

  authentication: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthentication().subscribe(authentication => {
      this.authentication = authentication;
    })
  }

  isAuthenticated(): boolean {
    return !!this.authentication;
  }

  logoClicked(): void {
    this.onLogoClicked.emit();
  }

}
