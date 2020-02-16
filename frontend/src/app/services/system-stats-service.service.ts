import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SystemInfo } from '../model/system/SystemInfo';
import { Observable } from 'rxjs';
import { Space } from '../model/system/Space';
import { CPU } from '../model/system/CPU';
import { Memory } from '../model/system/Memory';
import { SystemTime } from '../model/system/SystemTime';
import { Container } from '../model/system/Container';

@Injectable({
  providedIn: 'root'
})
export class SystemStatsServiceService {

  constructor(private http: HttpClient) { }


  toGigabyte(bytes: number) {
    return Math.floor(bytes / 10737418.24) / 100;
  }

  round(number: number, decimals): number {
    let power = Math.pow(10, decimals);
    return Math.round(number * power) / power;
  }


  public getSystemInfo(): Observable<SystemInfo> {
    return this.http.get<SystemInfo>(`/api/system/`);
  }

  public getSystemTime(): Observable<SystemTime> {
    return this.http.get<SystemTime>(`/api/system/time`);
  }

  public getCpu(): Observable<CPU> {
    return this.http.get<CPU>(`/api/system/cpu`);
  }

  public getMemory(): Observable<Memory> {
    return this.http.get<Memory>(`/api/system/memory`);
  }

  public getSpace(): Observable<Space[]> {
    return this.http.get<Space[]>(`/api/system/space`);
  }

  public getContainers(): Observable<Container[]> {
    return this.http.get<Container[]>(`/api/system/containers`);
  }

}
