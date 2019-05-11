import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getConfig(): Observable<Object> {
    return this.http.get<Object>(`/api/admin/config`)
  }

  saveConfig(config: Object): Observable<Object> {
    return this.http.post<Object>(`/api/admin/config`, config)
  }

}
