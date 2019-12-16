import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../model/Login';
import { HttpClient } from '@angular/common/http';
// import { NotificationService } from '../components/notification.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Authentication } from '../model/Authentication';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, take } from 'rxjs/operators';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth$ = new BehaviorSubject<any>(this.readAuthentication());

  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  login(login: Login, redirectUrl: string = null){
    return this.http.post<Authentication>('/api/auth/login', {
      username: login.username,
      password: login.password
    }).subscribe((auth: Authentication) => {
      if (redirectUrl) {
        let url: URL = new URL(redirectUrl)
        url.searchParams.set('token', auth.token)
        window.location.href = `${url}`
      } else {
        this.setLocalState(auth.token);

        this.hasRole('admin').subscribe(isAdmin => {
          if (isAdmin) {
            this.router.navigate(['/administration']);
          } else {
            this.router.navigate(['/settings']);
          }
        })
      }
    }, (err) => {
      console.error('Error:', err);
      this.notificationService.error('Wrong username or password');

    });
  }

  logout(): void {
    this.http.get<any>('/api/auth/logout', {
      withCredentials: true
    }).subscribe(() => {
      this.clearLocalState();
      this.router.navigate(['/login']);
      return;
    });
  }
  
  public getToken(): String {
    return localStorage.getItem('id_token');
  }

  public getAuthentication(): Observable<any> {
    return this.auth$.asObservable();
  }

  public isAuthenticated(): Observable<boolean> {
    return this.getAuthentication().pipe(
      take(1),
      map((auth: any) => {
        return !!auth;
      })
    );
  }

  public updateUserPassword(oldPassword: string, newPassword: string) {
    return this.http.put<void>(`/api/auth/password`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    });  
  }

  public hasRole(role: string): Observable<boolean> {
    return this.getAuthentication().pipe(
      take(1),
      map((auth: any) => {
        if (!role) {
          return true;
        }
        return auth && auth.scope.split(' ').indexOf(role) !== -1;
      })
    );
  }

  public hasRoleSync(role: string): boolean {
    if (!role) {
      return true;
    }
    let auth = this.readAuthentication();
    return auth && auth.scope.split(' ').indexOf(role) !== -1;
  }

  private readAuthentication(): any {
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
