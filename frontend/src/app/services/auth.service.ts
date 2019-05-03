import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../components/notification.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Authentication } from '../model/Authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn$ = new BehaviorSubject<boolean>(!!this.getToken());
  public userName$ = new BehaviorSubject<String>(localStorage.getItem('username'));

  constructor(
    private router: Router,
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  login(user: User){
    return this.http.post<Authentication>('/api/auth/login', {
      username: user.username,
      password: user.password
    }).subscribe((auth: Authentication) => {
      this.setLocalState(auth)
      this.router.navigate(['/dashboard']);
    }, (err) => {
      this.notification.error('Wrong username or password', 'Login Error')
    });
  }

  logout() {
    this.clearLocalState();
    this.router.navigate(['/login']);
  }
  
  public isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
  
  public getToken(): String {
    return localStorage.getItem('id_token');
  }
  
  public getUsername(): Observable<String> {
    return this.userName$.asObservable();
  }


  private setLocalState(auth: Authentication) {
    localStorage.setItem('id_token', auth.token);
    localStorage.setItem('username', auth.username);

    this.loggedIn$.next(true);
    this.userName$.next(auth.username);
  }

  private clearLocalState() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('username');

    this.loggedIn$.next(false);
    this.userName$.next(null);
  }

}
