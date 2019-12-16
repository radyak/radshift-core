import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  origin: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.origin = this.route.snapshot.queryParamMap.get('origin');
    
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if(isAuthenticated && !this.origin) {
        this.redirectToDefaultRoute();
      }
    });
  }

  removeOriginQueryParameter(): Promise<any> {
    return this.router.navigate([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        origin: null
      },
      queryParamsHandling: 'merge'
    });
  }

  redirectToUrl(url: string, authToken: string): void {
      this.removeOriginQueryParameter().then(() => {
        let urlObject: URL = new URL(url);
        urlObject.searchParams.set('token', authToken);
        window.location.href = `${urlObject}`
      });
  }

  redirectToDefaultRoute(): void {
    this.authService.hasRole('admin').subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigate(['/administration']);
      } else {
        this.router.navigate(['/settings']);
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value, this.origin)
        .subscribe((auth) => {
          this.form.controls.username.patchValue('');
          this.form.controls.password.patchValue('');

          if (this.origin) {
            this.redirectToUrl(this.origin, auth.token);
          } else {
            this.redirectToDefaultRoute();
          }

        }, (err) => {
          console.error('Error:', err);
          this.notificationService.error('Wrong username or password');
        });
    }
  }

}
