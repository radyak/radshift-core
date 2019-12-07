import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { Registration } from '../model/Registration';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`/api/admin/users`);
  }

  createNewUser(registration: Registration): Observable<User> {
    return this.http.post<User>(`/api/admin/users`, registration);
  }

  updateUserPermissions(username: string, permissions: string[]): Observable<User> {
    return this.http.put<User>(`/api/admin/users/${username}/permissions`, permissions);
  }

  updateUserPassword(user: User, password: string): Observable<User> {
    return this.http.put<User>(`/api/admin/users/${user.username}/password`, {
      password: password
    });
  }

  deleteUser(user: User): Observable<void> {
    return this.http.delete<void>(`/api/admin/users/${user.username}`);
  }

}
