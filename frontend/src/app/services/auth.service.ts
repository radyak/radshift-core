import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../model/Login';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../components/notification.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Authentication } from '../model/Authentication';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth$ = new BehaviorSubject<any>(this.readAuthentication());

  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private notification: NotificationService
  ) { }

  login(user: Login){
    return this.http.post<Authentication>('/api/auth/login', {
      username: user.username,
      password: user.password
    }).subscribe((auth: Authentication) => {
      this.setLocalState(auth.token)
      this.router.navigate(['/dashboard']);
    }, (err) => {
      this.notification.error('Wrong username or password', 'Login Error')
    });
  }

  logout() {
    this.clearLocalState();
    this.router.navigate(['/login']);
  }
  
  public getToken(): String {
    return localStorage.getItem('id_token');
  }

  public getAuthentication(): Observable<any> {
    return this.auth$;
  }

  private readAuthentication(): String {
    return JSON.parse(localStorage.getItem('authentication'));
  }


  private setLocalState(token: string) {
    let authentication: any = this.jwtHelper.decodeToken(token);

    localStorage.setItem('id_token', token);
    localStorage.setItem('authentication', JSON.stringify(authentication));

    this.auth$.next(authentication);
  }

  private clearLocalState() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('authentication');

    this.auth$.next(null);
  }

}
