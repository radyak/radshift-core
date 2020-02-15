import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SystemInfo } from '../model/system/SystemInfo';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Space } from '../model/system/Space';
import { CPU } from '../model/system/CPU';
import { Memory } from '../model/system/Memory';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { SystemTime } from '../model/system/SystemTime';

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
    return this.http.get<Memory>(`/api/system/memory`).pipe(
      map(memory => {
        return {
          ...memory,
          totalGigabyte: this.toGigabyte(memory.total),
          freeGigabyte: this.toGigabyte(memory.free),
          usedGigabyte: this.toGigabyte(memory.used),
          usagePercent: this.round((memory.used / memory.total * 100), 2)
        };
      })
    );
  }

  public getSpace(): Observable<Space[]> {
    return this.http.get<Space[]>(`/api/system/space`);
  }

  public getContainers(): Observable<Container[]> {
    return this.http.get<Container[]>(`/api/system/containers`);
  }

}
