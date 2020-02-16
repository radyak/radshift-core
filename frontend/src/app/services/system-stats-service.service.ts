import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Space } from '../model/system/Space';
import { CPU } from '../model/system/CPU';
import { Memory } from '../model/system/Memory';
import { SystemTime } from '../model/system/SystemTime';
import { Container } from '../model/system/Container';
import { NetworkInfo } from '../model/system/NetworkInfo';
import { BackupInfo } from '../model/system/BackupInfo';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemStatsServiceService {

  constructor(private http: HttpClient) { }


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
    return this.http.get<Space[]>(`/api/system/space`).pipe(
      map(spaces => spaces.filter(space => space.mount !== '/etc/resolv.conf'))
    );
  }

  public getContainers(): Observable<Container[]> {
    return this.http.get<Container[]>(`/api/system/containers`);
  }

  public getNetworkInfo(): Observable<NetworkInfo> {
    return this.http.get<NetworkInfo>(`/api/system/network`);
  }

  public getBackupInfo(): Observable<BackupInfo> {
    return this.http.get<BackupInfo>(`/api/system/backup`);
  }

}
