import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { timer, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  origin: string;
  blockedUntil: number;
  timerSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService) {

  }

  startTimeout(): void {
    if (!this.blockedUntil)  {
      return;
    }
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.blockedUntil <= new Date().getTime()) {
        this.blockedUntil = 0;
        this.form.enable();
        this.stopTimeout();
      }
    });
  }
  
  stopTimeout(): void {
    this.timerSubscription.unsubscribe();
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.origin = this.route.snapshot.queryParamMap.get('origin');

    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated && !this.origin) {
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
          this.notificationService.error(err.error.message);
          this.blockedUntil = err.error.blockedUntil ? new Date(err.error.blockedUntil).getTime() : 0;
          this.form.disable();
          this.startTimeout();
        });
    }
  }

  isBlocked(): boolean {
    return !!this.blockedUntil;
  }

  getBlockedMessage(): string {
    if (!this.isBlocked()) {
      return '';
    }
    let deltaInSeconds = Math.round((this.blockedUntil - new Date().getTime()) / 1000);
    console.log(deltaInSeconds);

    let deltaMinutes = Math.floor(deltaInSeconds / 60);
    let deltaSeconds = Math.floor(deltaInSeconds % 60);
    return `Login is blocked for ${deltaMinutes < 10 ? '0' : ''}${deltaMinutes}:${deltaSeconds < 10 ? '0' : ''}${deltaSeconds}`;
  }

}
