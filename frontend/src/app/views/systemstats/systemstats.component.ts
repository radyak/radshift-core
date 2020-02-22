import { Component, OnInit } from '@angular/core';
import { SystemStatsServiceService } from 'src/app/services/system-stats-service.service';
import { Space } from 'src/app/model/system/Space';
import { SystemTime } from 'src/app/model/system/SystemTime';
import { CPU } from 'src/app/model/system/CPU';
import { Memory } from 'src/app/model/system/Memory';
import { Container } from 'src/app/model/system/Container';
import { NetworkInfo } from 'src/app/model/system/NetworkInfo';
import { BackupInfo } from 'src/app/model/system/BackupInfo';


@Component({
  selector: 'app-systemstats',
  templateUrl: './systemstats.component.html',
  styleUrls: ['./systemstats.component.scss']
})
export class SystemstatsComponent implements OnInit {

  networkInfo: NetworkInfo;
  space: Space[];
  cpu: CPU;
  memory: Memory;
  containers: Container[];
  backupInfo: BackupInfo;
  time: SystemTime;

  loadingNetworkInfo: boolean = false;
  loadingSpace: boolean = false;
  loadingCpu: boolean = false;
  loadingMemory: boolean = false;
  loadingContainers: boolean = false;
  loadingBackupInfo: boolean = false;


  showAllContainers: boolean = false;

  clientTime: Date = new Date();

  normalColor: string = 'rgb(8,224,73)';
  warnColor: string = 'rgb(224,14,88)';


  constructor(private systemStatsServiceService: SystemStatsServiceService) { }

  fetchCpu(): void {
    this.loadingCpu = true;
    this.systemStatsServiceService.getCpu().subscribe(cpu => {
      this.cpu = cpu;
      this.loadingCpu = false;
    });
  }

  fetchSystemTime(): void {
    this.systemStatsServiceService.getSystemTime().subscribe(time => {
      this.time = time;
    });
  }

  fetchMemory(): void {
    this.loadingMemory = true;
    this.systemStatsServiceService.getMemory().subscribe(memory => {
      this.memory = memory;
      this.loadingMemory = false;
    });
  }

  fetchSpace(): void {
    this.loadingSpace = true;
    this.systemStatsServiceService.getSpace().subscribe(space => {
      this.space = space;
      this.loadingSpace = false;
    });
  }

  fetchContainers(): void {
    this.loadingContainers = true;
    this.systemStatsServiceService.getContainers().subscribe(containers => {
      this.containers = containers;
      this.loadingContainers = false;
    });
  }

  fetchNetworkInfo(): void {
    this.loadingNetworkInfo = true;
    this.systemStatsServiceService.getNetworkInfo().subscribe(networkInfo => {
      this.networkInfo = networkInfo;
      this.loadingNetworkInfo = false;
    });
  }

  fetchBackupInfo(): void {
    this.loadingBackupInfo = true;
    this.systemStatsServiceService.getBackupInfo().subscribe(
      backupInfo => this.backupInfo = backupInfo,
      err => this.backupInfo = {
        status: 'NO BACKUP FOUND',
        date: '',
        log: ''
      });
      this.loadingBackupInfo = false;
  }

  ngOnInit() {
    this.fetchSystemTime();
    this.fetchCpu();
    this.fetchMemory();
    this.fetchSpace();
    this.fetchContainers();
    this.fetchNetworkInfo();
    this.fetchBackupInfo();

    this.clientTime = new Date();
  }


  getContainers(): Container[] {
    if (!this.containers) {
      return [];
    }
    return this.containers.filter(container => container.state !== 'exited' || this.showAllContainers);
  }

  isContainerRunning(container: Container): boolean {
    return container.state.toLocaleLowerCase() === 'running';
  }

}
