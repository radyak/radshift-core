import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { Login } from '../model/Login';
import { Registration } from '../model/Registration';
import { Permission } from '../model/Permission';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getConfig(): Observable<Object> {
    return this.http.get<Object>(`/api/admin/config`);
  }

  saveConfig(config: Object): Observable<Object> {
    return this.http.put<Object>(`/api/admin/config`, config);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`/api/admin/users`);
  }

  createNewUser(registration: Registration): Observable<User> {
    return this.http.post<User>(`/api/admin/users`, registration);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`/api/admin/users/${user.username}`, user);
  }

  deleteUser(user: User): Observable<void> {
    return this.http.delete<void>(`/api/admin/users/${user.username}`);
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`/api/admin/permissions`);
  }

  savePermissions(permissions: Permission[]): Observable<Permission[]> {
    return this.http.post<Permission[]>(`/api/admin/permissions`, permissions);
  }

}
