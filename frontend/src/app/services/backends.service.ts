import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Backend } from '../model/Backend';

@Injectable({
  providedIn: 'root'
})
export class BackendsService {

  constructor(private http: HttpClient) { }

  getBackends(): Observable<Backend[]> {
    return this.http.get<Backend[]>(`/api/backends`)
  }

  getBackend(name: string): Observable<Backend> {
    return this.http.get<Backend>(`/api/backends/${name}`)
  }

  stopBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`/api/backends/${name}/stop`, {})
  }

  startBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`/api/backends/${name}/start`, {})
  }

  removeBackend(name: string): Observable<Backend> {
    return this.http.delete<Backend>(`/api/backends/${name}`, {})
  }

}
