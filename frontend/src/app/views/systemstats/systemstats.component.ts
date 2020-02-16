import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { SystemStatsServiceService } from 'src/app/services/system-stats-service.service';
import { Space } from 'src/app/model/system/Space';
import { SystemInfo } from 'src/app/model/system/SystemInfo';
import { SystemTime } from 'src/app/model/system/SystemTime';
import { CPU } from 'src/app/model/system/CPU';
import { Memory } from 'src/app/model/system/Memory';
import { Container } from 'src/app/model/system/Container';
import { NetworkInfo } from 'src/app/model/system/NetworkInfo';


@Component({
  selector: 'app-systemstats',
  templateUrl: './systemstats.component.html',
  styleUrls: ['./systemstats.component.scss']
})
export class SystemstatsComponent implements OnInit {

  systemInfo: SystemInfo;
  networkInfo: NetworkInfo;
  space: Space[];
  time: SystemTime;
  cpu: CPU;
  memory: Memory;
  containers: Container[];

  showAllContainers: boolean = false;

  chartColors: Color[] = [
    {
      backgroundColor: ['rgb(8,224,73)', 'rgb(4,112,36)'],
      borderColor: ['rgb(8,224,73)', 'rgb(4,112,36)'],
    }
  ];
  warnColors: Color[] = [
    {
      backgroundColor: ['rgb(224,14,88)', 'rgb(112,7,44)'],
      borderColor: ['rgb(224,14,88)', 'rgb(112,7,44)'],
    }
  ];


  constructor(private systemStatsServiceService: SystemStatsServiceService) { }


  ngOnInit() {
    this.systemStatsServiceService.getSystemInfo().subscribe(systemInfo => this.systemInfo = systemInfo);
    this.systemStatsServiceService.getSystemTime().subscribe(time => this.time = time);
    this.systemStatsServiceService.getCpu().subscribe(cpu => this.cpu = cpu);
    this.systemStatsServiceService.getMemory().subscribe(memory => this.memory = memory);
    this.systemStatsServiceService.getSpace().subscribe(space => this.space = space);
    this.systemStatsServiceService.getContainers().subscribe(containers => this.containers = containers);
    this.systemStatsServiceService.getNetworkInfo().subscribe(networkInfo => this.networkInfo = networkInfo);
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
