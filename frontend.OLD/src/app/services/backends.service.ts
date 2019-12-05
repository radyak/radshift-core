import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Backend } from '../model/Backend';
import { Metrics } from '../model/Metrics';

@Injectable({
  providedIn: 'root'
})
export class BackendsService {

  constructor(private http: HttpClient) { }

  getBackends(): Observable<Backend[]> {
    return this.http.get<Backend[]>(`/api/backends`)
  }

  getAvailableBackends(): Observable<Backend[]> {
    return this.http.get<Backend[]>(`/api/store`)
  }

  getBackend(name: string): Observable<Backend> {
    return this.http.get<Backend>(`/api/backends/${name}`)
  }

  getBackendMetrics(name: string): Observable<Metrics> {
    return this.http.get<Metrics>(`/api/backends/${name}/metrics`)
  }

  stopBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`/api/backends/${name}/stop`, {})
  }

  startBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`/api/backends/${name}/start`, {})
  }

  installBackend(name: string): Observable<boolean> {
    return this.http.post<boolean>(`/api/backends/${name}`, {})
  }

  removeBackend(name: string): Observable<Backend> {
    return this.http.delete<Backend>(`/api/backends/${name}`, {})
  }

}