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
  time: SystemTime;
  cpu: CPU;
  memory: Memory;
  containers: Container[];
  backupInfo: BackupInfo;

  showAllContainers: boolean = false;


  normalColor: string = 'rgb(8,224,73)';
  warnColor: string = 'rgb(224,14,88)';


  constructor(private systemStatsServiceService: SystemStatsServiceService) { }


  ngOnInit() {
    this.systemStatsServiceService.getSystemTime().subscribe(time => this.time = time);
    this.systemStatsServiceService.getCpu().subscribe(cpu => this.cpu = cpu);
    this.systemStatsServiceService.getMemory().subscribe(memory => this.memory = memory);
    this.systemStatsServiceService.getSpace().subscribe(space => this.space = space);
    this.systemStatsServiceService.getContainers().subscribe(containers => this.containers = containers);
    this.systemStatsServiceService.getNetworkInfo().subscribe(networkInfo => this.networkInfo = networkInfo);
    this.systemStatsServiceService.getBackupInfo().subscribe(
      backupInfo => this.backupInfo = backupInfo,
      err => this.backupInfo = {
        status: 'NO BACKUP FOUND',
        date: '',
        log: ''
      });
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

  getSystemTime(): Date {
    return new Date(this.time.current);
  }

}
